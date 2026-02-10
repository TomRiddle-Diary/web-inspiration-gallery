import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { nanoid } from 'nanoid';
import { put } from '@vercel/blob';

/**
 * Categorize colors into base, primary, accent, and other
 */
function categorizeColors(colors) {
  const categories = {
    base: [],
    primary: [],
    accent: [],
    other: []
  };
  
  if (colors.length === 0) return categories;
  
  const colorData = colors.map(hex => {
    const rgb = hexToRgb(hex);
    return {
      hex,
      ...rgb,
      saturation: getSaturation(rgb),
      lightness: getLightness(rgb),
      brightness: getBrightness(rgb)
    };
  });
  
  colorData.forEach((color, index) => {
    if (color.saturation < 0.2 || color.lightness > 0.9 || color.lightness < 0.15) {
      categories.base.push(color.hex);
    }
    else if (categories.primary.length < 2 && color.saturation > 0.4 && color.lightness > 0.3 && color.lightness < 0.7) {
      categories.primary.push(color.hex);
    }
    else if (categories.accent.length < 2 && color.saturation > 0.5 && color.brightness > 0.6) {
      categories.accent.push(color.hex);
    }
    else {
      categories.other.push(color.hex);
    }
  });
  
  return categories;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

function getSaturation(rgb) {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  return max === 0 ? 0 : delta / max;
}

function getLightness(rgb) {
  return (Math.max(rgb.r, rgb.g, rgb.b) + Math.min(rgb.r, rgb.g, rgb.b)) / 2;
}

function getBrightness(rgb) {
  return (rgb.r + rgb.g + rgb.b) / 3;
}

/**
 * Scrape a website and extract design information (Vercel-compatible)
 * @param {string} url - The URL to scrape
 * @param {string[]} categories - The categories of the website
 * @returns {Promise<Object>} Scraped website data
 */
export async function scrapeWebsite(url, categories = ['Other']) {
  let browser;
  
  try {
    console.log('Launching browser...');
    
    // Use chrome-aws-lambda for Vercel deployment
    const executablePath = process.env.VERCEL 
      ? await chromium.executablePath()
      : process.env.PUPPETEER_EXECUTABLE_PATH || 
        '/usr/bin/chromium-browser' ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    
    browser = await puppeteerCore.launch({
      args: process.env.VERCEL ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless || true,
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });
    
    console.log('Waiting for loading animations to complete...');
    
    // Wait for common loading indicators to disappear
    try {
      await page.waitForFunction(() => {
        const loadingSelectors = [
          '.loading',
          '.loader',
          '.spinner',
          '.preloader',
          '[class*="loading"]',
          '[class*="spinner"]',
          '[id*="loading"]',
          '[id*="spinner"]'
        ];
        
        for (const selector of loadingSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && 
                style.visibility !== 'hidden' && 
                style.opacity !== '0' &&
                el.offsetParent !== null) {
              return false;
            }
          }
        }
        
        const body = document.body;
        const html = document.documentElement;
        
        if (body.classList.contains('loaded') || 
            body.classList.contains('page-loaded') ||
            html.classList.contains('loaded')) {
          return true;
        }
        
        return true;
      }, { timeout: 10000 });
      
      console.log('Loading indicators cleared');
    } catch (e) {
      console.log('No loading indicators found or timeout - proceeding');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get page title
    const title = await page.title();
    
    // Extract colors
    console.log('Extracting colors...');
    const colors = await page.evaluate(() => {
      const colorSet = new Set();
      const elements = document.querySelectorAll('*');
      
      const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        if (!result || result.length < 3) return null;
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        if (result.length > 3 && parseFloat(result[3]) < 0.1) return null;
        if (r > 250 && g > 250 && b > 250) return null;
        
        return '#' + [r, g, b]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
      };
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        const bgColor = styles.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          const hex = rgbToHex(bgColor);
          if (hex) colorSet.add(hex);
        }
        
        const textColor = styles.color;
        if (textColor) {
          const hex = rgbToHex(textColor);
          if (hex) colorSet.add(hex);
        }
        
        const borderColor = styles.borderColor;
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
          const hex = rgbToHex(borderColor);
          if (hex) colorSet.add(hex);
        }
      });
      
      return Array.from(colorSet);
    });
    
    // Extract fonts
    console.log('Extracting fonts...');
    const fontData = await page.evaluate(() => {
      const fontSet = new Set();
      const fontUsageCount = {};
      const elements = document.querySelectorAll('*');
      
      const bodyFont = window.getComputedStyle(document.body).fontFamily;
      let mainFont = 'Unknown';
      
      if (bodyFont) {
        const firstFont = bodyFont.split(',')[0].trim().replace(/['"]/g, '');
        if (firstFont && !firstFont.includes('system') && firstFont !== 'serif' && firstFont !== 'sans-serif') {
          mainFont = firstFont;
        }
      }
      
      elements.forEach(el => {
        const fontFamily = window.getComputedStyle(el).fontFamily;
        if (fontFamily) {
          fontFamily.split(',').forEach(font => {
            const cleaned = font.trim().replace(/['"]/g, '');
            if (cleaned && !cleaned.includes('system') && cleaned !== 'serif' && cleaned !== 'sans-serif') {
              fontSet.add(cleaned);
              fontUsageCount[cleaned] = (fontUsageCount[cleaned] || 0) + 1;
            }
          });
        }
      });
      
      if (mainFont === 'Unknown' && Object.keys(fontUsageCount).length > 0) {
        mainFont = Object.entries(fontUsageCount)
          .sort((a, b) => b[1] - a[1])[0][0];
      }
      
      return {
        mainFont,
        allFonts: Array.from(fontSet).slice(0, 10)
      };
    });
    
    // Take screenshot
    console.log('Taking screenshot...');
    
    try {
      let previousHeight = await page.evaluate(() => document.body.scrollHeight);
      let stableCount = 0;
      
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentHeight = await page.evaluate(() => document.body.scrollHeight);
        
        if (currentHeight === previousHeight) {
          stableCount++;
          if (stableCount >= 2) {
            console.log('Page is stable');
            break;
          }
        } else {
          stableCount = 0;
        }
        
        previousHeight = currentHeight;
      }
    } catch (e) {
      console.log('Page stability check skipped');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const screenshotBuffer = await page.screenshot({ 
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    // Upload to Vercel Blob
    console.log('Uploading screenshot to Vercel Blob...');
    const screenshotId = nanoid(10);
    const blob = await put(`screenshots/${screenshotId}.png`, screenshotBuffer, {
      access: 'public',
      contentType: 'image/png',
    });
    
    console.log('Screenshot uploaded:', blob.url);
    
    // Categorize colors
    const categorizedColors = categorizeColors(colors.slice(0, 12));
    
    // Prepare result
    const result = {
      id: nanoid(),
      url,
      title: title || 'Untitled',
      heroImage: blob.url,
      colors: colors.slice(0, 12),
      colorCategories: categorizedColors,
      mainFont: fontData.mainFont,
      fonts: fontData.allFonts.slice(0, 8),
      categories: categories && categories.length > 0 ? categories : ['Other'],
      category: categories && categories.length > 0 ? categories[0] : 'Other',
      savedAt: new Date().toISOString(),
      screenshotId
    };
    
    console.log(`✅ Successfully scraped: ${title}`);
    console.log(`   Colors found: ${colors.length}`);
    console.log(`   Main font: ${fontData.mainFont}`);
    console.log(`   Fonts found: ${fontData.allFonts.length}`);
    
    return result;
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Scraping error:', error.message);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

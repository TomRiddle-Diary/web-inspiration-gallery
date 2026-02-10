import puppeteer from 'puppeteer';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

/**
 * Scrape a website and extract design information
 * @param {string} url - The URL to scrape
 * @returns {Promise<Object>} Scraped website data
 */
export async function scrapeWebsite(url) {
  let browser;
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Get page title
    const title = await page.title();
    
    // Extract colors from all elements
    console.log('Extracting colors...');
    const colors = await page.evaluate(() => {
      const colorSet = new Set();
      const elements = document.querySelectorAll('*');
      
      // Helper to convert rgb to hex
      const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        if (!result || result.length < 3) return null;
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        // Skip transparent and very light colors (likely white backgrounds)
        if (result.length > 3 && parseFloat(result[3]) < 0.1) return null;
        if (r > 250 && g > 250 && b > 250) return null;
        
        return '#' + [r, g, b]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
      };
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        // Get background color
        const bgColor = styles.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          const hex = rgbToHex(bgColor);
          if (hex) colorSet.add(hex);
        }
        
        // Get text color
        const textColor = styles.color;
        if (textColor) {
          const hex = rgbToHex(textColor);
          if (hex) colorSet.add(hex);
        }
        
        // Get border color
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
    const fonts = await page.evaluate(() => {
      const fontSet = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const fontFamily = window.getComputedStyle(el).fontFamily;
        if (fontFamily) {
          // Split font families and clean them
          fontFamily.split(',').forEach(font => {
            const cleaned = font.trim().replace(/['"]/g, '');
            if (cleaned && !cleaned.includes('system') && cleaned !== 'serif' && cleaned !== 'sans-serif') {
              fontSet.add(cleaned);
            }
          });
        }
      });
      
      return Array.from(fontSet).slice(0, 10); // Limit to 10 fonts
    });
    
    // Take screenshot
    console.log('Taking screenshot...');
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    
    const screenshotId = nanoid(10);
    const screenshotPath = path.join(screenshotDir, `${screenshotId}.png`);
    
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false,
      type: 'png'
    });
    
    await browser.close();
    
    // Prepare result
    const result = {
      id: nanoid(),
      url,
      title: title || 'Untitled',
      heroImage: `/screenshots/${screenshotId}.png`,
      colors: colors.slice(0, 12), // Limit to 12 colors
      fonts: fonts.slice(0, 8), // Limit to 8 fonts
      savedAt: new Date().toISOString(),
      screenshotId
    };
    
    console.log(`✅ Successfully scraped: ${title}`);
    console.log(`   Colors found: ${colors.length}`);
    console.log(`   Fonts found: ${fonts.length}`);
    
    return result;
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Scraping error:', error.message);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

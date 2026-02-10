# Quick Start Guide

## 🚀 Your Design Inspiration App is Ready!

Both servers are running:
- ✅ **Frontend**: http://localhost:5173
- ✅ **Backend**: http://localhost:3001

## 📝 How to Use

### 1. Save a Website
1. Open http://localhost:5173 in your browser
2. Enter any website URL (e.g., `https://stripe.com`, `https://tailwindcss.com`)
3. Click "Save Website"
4. Wait 10-30 seconds while the app:
   - Takes a screenshot
   - Extracts all colors
   - Detects all fonts
   - Saves to database

### 2. View Your Gallery
- Saved websites appear as cards in the grid
- Each card shows:
  - Screenshot preview
  - First 5 colors
  - Number of fonts detected
  
### 3. See Details
- Click any card to see full details:
  - Large screenshot
  - Complete color palette with hex codes
  - All fonts used with preview samples
  - Copy any color with one click

## 🎯 Recommended Sites to Try

Great examples with beautiful designs:
- `https://stripe.com` - Clean, modern fintech
- `https://tailwindcss.com` - Developer-focused UI
- `https://linear.app` - Minimal productivity tool
- `https://vercel.com` - Tech company landing
- `https://apple.com` - Classic brand design
- `https://spotify.com` - Music streaming UI

## 🔧 Implemented Functions

### Backend Functions (server/)
1. **Web Scraping Service** (`scraper.js`)
   - `scrapeWebsite(url)` - Main scraping function
   - Launches Puppeteer headless browser
   - Extracts colors by parsing computed CSS styles
   - Detects fonts from font-family properties
   - Captures full-page screenshot
   - Returns structured data object

2. **API Endpoints** (`server.js`)
   - `POST /api/websites` - Save new website
   - `GET /api/websites` - Get all saved sites
   - `GET /api/websites/:id` - Get specific site
   - `DELETE /api/websites/:id` - Delete a site
   - `GET /api/health` - Server health check

3. **Database Operations** (`database.js`)
   - `saveWebsite()` - Persist to JSON file
   - `getAllWebsites()` - Load all saved sites
   - `getWebsiteById()` - Find specific site
   - `deleteWebsite()` - Remove site and screenshot

### Frontend Functions (src/)
1. **API Client** (`src/api/index.ts`)
   - All HTTP requests to backend
   - Error handling
   - Type-safe responses

2. **Gallery Page** (`src/pages/Gallery.tsx`)
   - Load saved websites on mount
   - Handle URL submission
   - Display loading states
   - Show error messages

3. **Detail Page** (`src/pages/DetailView.tsx`)
   - Fetch single website data
   - Display full breakdown
   - Copy color codes to clipboard
   - Navigate back to gallery

## 💾 Data Storage

- **Database**: `server/database.json` (auto-created)
- **Screenshots**: `server/screenshots/` (auto-created)
- All data persists between server restarts

## 🛠️ Troubleshooting

### Server won't start
```bash
# Stop all Node processes
Get-Process node | Stop-Process -Force

# Restart backend
cd server
node server.js
```

### Frontend can't connect to backend
- Make sure backend is running on port 3001
- Check: http://localhost:3001/api/health
- Should return: `{"status":"ok"}`

### Scraping takes too long
- Some websites are slower to load
- Timeout is 30 seconds
- Complex sites with heavy JavaScript take longer

## 🎨 Next Steps

Want to enhance the app? Consider adding:
- Categories/tags for organization
- Search and filter functionality
- Export collections as PDF
- Share collections with others
- Browser extension for quick saves
- User authentication
- Cloud database (MongoDB/PostgreSQL)
- Image optimization and CDN

---

**Enjoy building your design inspiration library!** 🎉

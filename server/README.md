# Design Inspiration App - Server

Backend API server for the Design Inspiration App with web scraping capabilities.

## Features

- **Express REST API** for managing saved websites
- **Puppeteer Web Scraping** to extract:
  - Screenshots of websites
  - Color palettes (hex codes)
  - Font families used
  - Page metadata
- **File-based Database** (JSON) for data persistence
- **CORS enabled** for frontend communication

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Websites
- `GET /api/websites` - Get all saved websites
- `GET /api/websites/:id` - Get single website by ID
- `POST /api/websites` - Save new website (requires `url` in body)
- `DELETE /api/websites/:id` - Delete website by ID

## Installation & Setup

1. Navigate to server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the server:
\`\`\`bash
npm start
\`\`\`

Or for development with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

Server will run on **http://localhost:3001**

## How It Works

1. **User submits URL** via frontend
2. **Server receives request** at POST /api/websites
3. **Puppeteer launches** headless browser
4. **Scraper extracts** colors, fonts, and takes screenshot
5. **Data is saved** to database.json
6. **Screenshot stored** in screenshots/ folder
7. **Response sent** back to frontend with all data

## Data Structure

Saved websites include:
\`\`\`json
{
  "id": "unique-id",
  "url": "https://example.com",
  "title": "Page Title",
  "heroImage": "/screenshots/screenshot-id.png",
  "colors": ["#4F46E5", "#10B981", ...],
  "fonts": ["Inter", "Roboto", ...],
  "savedAt": "2026-02-10T12:00:00.000Z",
  "screenshotId": "screenshot-id"
}
\`\`\`

## Dependencies

- **express** - Web server framework
- **cors** - Enable CORS for frontend
- **puppeteer** - Headless browser for web scraping
- **nanoid** - Generate unique IDs

## Notes

- Screenshots are stored locally in `screenshots/` directory
- Database is a simple JSON file (`database.json`)
- Scraping timeout is set to 30 seconds
- Colors and fonts are automatically limited to prevent overcrowding

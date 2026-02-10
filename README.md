# Design Inspiration App

A modern web application for designers to manage and organize design inspiration in one place.

## Features

- **URL Saving**: Save websites to your collection by entering their URL
- **Design Extraction**: Automatically identifies and displays colors (hex codes) and fonts used on saved websites
- **Organization**: Categorize and view saved inspirations in a beautiful grid layout
- **Detailed View**: Click on any saved item to see a detailed breakdown with metadata, fonts, and color palette

## Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **React Router** for seamless navigation
- **Lucide React** for beautiful icons

### Backend (Coming Soon)
- **Node.js + Express** for RESTful API
- **Puppeteer** for web scraping and design extraction
- **MongoDB/PostgreSQL** for data persistence
- **Image processing** for hero image capture

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. Install frontend dependencies:
\`\`\`bash
npm install
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd server
npm install
cd ..
\`\`\`

### Running the Application

You need to run both the frontend and backend servers:

**Terminal 1 - Backend Server:**
\`\`\`bash
cd server
npm start
\`\`\`
Server runs on: `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
\`\`\`bash
npm run dev
\`\`\`
Frontend runs on: `http://localhost:5173`

Open your browser and visit: **http://localhost:5173**

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # URL input header
│   ├── InspirationCard.tsx  # Individual card component
│   └── InspirationGrid.tsx  # Gallery grid layout
├── pages/              # Page components
│   ├── Gallery.tsx     # Main gallery view
│   └── DetailView.tsx  # Detailed website view
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
\`\`\`

## Current Status

✅ **Phase 1 - UI Complete**
- Modern, clean interface
- Responsive grid layout
- URL input with form validation
- Interactive cards with hover effects
- Detailed view with color palette and fonts
- Navigation between views

✅ **Phase 2 - Backend Integration Complete**
- Express API server with REST endpoints
- Puppeteer web scraping service
- Automatic color extraction from CSS
- Font detection and listing
- Screenshot capture and storage
- File-based database (JSON)
- Real-time website saving and loading

## How It Works

1. **Enter a URL** in the input field at the top
2. **Click "Save Website"** - The backend will:
   - Launch a headless browser
   - Navigate to the URL
   - Extract all colors from the page
   - Detect fonts used
   - Capture a screenshot
   - Save everything to the database
3. **View in Gallery** - Your saved website appears as a card
4. **Click for Details** - See the full breakdown with colors and fonts

## Future Enhancements

- User authentication and personal collections
- Categories and tags for better organization
- Search and filter functionality
- Export collections as PDF or JSON
- Browser extension for quick saves
- Collaborative collections and sharing

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License

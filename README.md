# 🎵 Melodia - Music Streaming Platform

A modern music streaming application similar to Spotify and YouTube Music. Built with Next.js 14, TypeScript, and Prisma.

![Melodia](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based login/register
- 🎵 **Music Search** - Search songs, artists, albums
- ❤️ **Playlists & Liked Songs** - Create and manage playlists
- 🎧 **Music Player** - Full-featured player with queue
- 📱 **Responsive Design** - Works on mobile and desktop
- 🌙 **Dark Mode** - Beautiful dark theme
- 👨‍💼 **Admin Dashboard** - Manage songs, albums, artists

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** CSS Modules, Custom CSS Variables
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/simon141404-gif/Melodioa-Music-Store.git
cd Melodioa-Music-Store

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database with sample data
npx prisma db seed
# OR manually run: npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login

- **Email:** simon141.404@gmail.com
- **Password:** ghost_404

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Sample data
│   └── dev.db           # SQLite database
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── home/        # Home page
│   │   ├── library/     # User library
│   │   ├── search/      # Search page
│   │   └── ...
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── lib/             # Utilities & helpers
│   └── styles/          # CSS files
├── public/              # Static assets
└── package.json
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build command: `npm run build`
Output directory: `.next`

## 📄 License

Copyright © 2026 Shawon Haque. All Rights Reserved.

MIT License - feel free to use this project for learning or commercial purposes.

---

<div align="center">

**Made with ❤️ by Shawon Haque**

</div>

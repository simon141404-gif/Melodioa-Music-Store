# Melodia - Music Streaming Platform Specification

## Project Overview

**Project Name:** Melodia
**Type:** Full-stack Music Streaming Web Application
**Core Functionality:** A Spotify-inspired music streaming platform with user authentication, music playback, playlists, recommendations, and admin management.
**Target Users:** Music enthusiasts, content creators, and administrators

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules with CSS Variables
- **State Management:** React Context + useReducer
- **Audio:** HTML5 Audio API
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** SQLite (for demo, easily switchable to PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Local filesystem (production: cloud storage)

---

## UI/UX Specification

### Color Palette (Dark Mode - Primary)
```css
--bg-primary: #0a0a0f;
--bg-secondary: #12121a;
--bg-tertiary: #1a1a25;
--bg-elevated: #222230;
--accent-primary: #7c3aed;
--accent-secondary: #a855f7;
--accent-gradient: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
--text-primary: #f8fafc;
--text-secondary: #94a3b8;
--text-muted: #64748b;
--border-color: #2e2e3a;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--player-bg: rgba(18, 18, 26, 0.95);
```

### Color Palette (Light Mode)
```css
--bg-primary: #fafafa;
--bg-secondary: #ffffff;
--bg-tertiary: #f5f5f5;
--bg-elevated: #ffffff;
--accent-primary: #7c3aed;
--accent-secondary: #a855f7;
--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;
--border-color: #e2e8f0;
```

### Typography
- **Primary Font:** 'DM Sans', sans-serif
- **Display Font:** 'Clash Display', sans-serif (headings)
- **Monospace:** 'JetBrains Mono', monospace (timestamps)

### Font Sizes
```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 2rem;
--text-4xl: 2.5rem;
--text-5xl: 3.5rem;
```

### Spacing System
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1440px

---

## Page Structure

### 1. Landing Page (`/`)
- Hero section with animated gradient background
- Feature highlights with icons
- Call-to-action buttons (Get Started, Sign In)
- Testimonials section
- Pricing/premium section

### 2. Authentication Pages (`/auth/*`)
- `/auth/login` - Login form
- `/auth/register` - Registration form
- `/auth/forgot-password` - Password reset

### 3. Home Page (`/home` - Authenticated)
- Personalized greeting
- Recently played
- Made for you (recommendations)
- Featured playlists
- New releases
- Top charts

### 4. Search Page (`/search`)
- Search bar with voice input option
- Filters: All, Songs, Artists, Albums, Playlists
- Search results with categories
- Recent searches

### 5. Library Page (`/library`)
- Tabs: Playlists, Liked Songs, Albums, Artists, Downloads
- Create playlist button
- Sort/filter options

### 6. Album Page (`/album/[id]`)
- Album cover (large)
- Album title, artist, year, genre
- Play/shuffle buttons
- Tracklist with duration
- Like/save button
- Related albums

### 7. Artist Page (`/artist/[id]`)
- Artist image
- Artist name, bio
- Popular tracks
- Albums
- Similar artists
- Follow button

### 8. Playlist Page (`/playlist/[id]`)
- Playlist cover
- Playlist title, description, owner
- Play/shuffle buttons
- Tracklist
- Like/share buttons
- Edit playlist (owner only)

### 9. Player Page (`/player`)
- Full-screen player view
- Album art (large)
- Track info
- Progress bar with timestamps
- Playback controls
- Volume control
- Queue management
- Lyrics display
- Device picker

### 10. Premium Page (`/premium`)
- Premium features comparison
- Plans: Free, Premium ($9.99/mo), Family ($14.99/mo)
- Payment integration placeholder

### 11. Downloads Page (`/downloads`)
- Downloaded songs list
- Storage management
- Download quality settings

### 12. Settings Page (`/settings`)
- Account settings
- Playback settings
- Privacy settings
- Notification preferences
- Theme toggle (dark/light)

### 13. Admin Dashboard (`/admin`)
- **Statistics Overview**
  - Total users, songs, albums, artists
  - Monthly streams, revenue
  - Growth charts

- **Song Management**
  - Add/Edit/Delete songs
  - Upload audio files
  - Metadata editing

- **Artist Management**
  - Add/Edit artists
  - Bio and image management

- **Album Management**
  - Add/Edit albums
  - Track ordering

- **User Management**
  - View users
  - Role management (user, artist, admin)
  - Ban/Unban users

---

## Components Specification

### 1. Navigation
- Sidebar (desktop): Logo, Home, Search, Library, Playlists
- Bottom nav (mobile): Home, Search, Library, Profile
- User avatar with dropdown

### 2. Music Player (Fixed Bottom)
- Mini player: Album art, track info, play/pause, next
- Expandable to full player
- Progress bar with scrubbing
- Volume slider
- Queue button
- Lyrics button
- Shuffle/Repeat buttons
- Premium badge (if applicable)

### 3. Song Card
- Album art
- Song title
- Artist name
- Duration
- Hover: Play button, like button, more options

### 4. Album/Artist Card
- Cover image
- Title
- Subtitle (artist name for albums)
- Hover animation

### 5. Playlist Card
- Collage of 4 album arts OR custom image
- Playlist name
- Song count
- Owner

### 6. Search Result Item
- Icon based on type (song/album/artist/playlist)
- Title and subtitle
- Action buttons

### 7. Lyrics Display
- Synchronized with current time
- Auto-scroll
- Manual seek by clicking line

### 8. Queue Panel
- Current track
- Upcoming tracks
- Drag to reorder
- Clear all button

### 9. Notification Bell
- Unread count badge
- Dropdown with notification list

---

## Functionality Specification

### Authentication
- Email/Password registration and login
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Session persistence
- Protected routes

### Music Playback
- Play/Pause/Stop
- Next/Previous track
- Seek (progress bar)
- Volume control
- Shuffle mode
- Repeat modes (off, one, all)
- Queue management
- Audio gapless playback

### Search
- Full-text search
- Filter by type
- Debounced input
- Search history

### Playlists
- Create/Edit/Delete playlists
- Add/Remove songs
- Reorder tracks
- Public/Private visibility

### Liked Songs
- Like/Unlike songs
- View all liked songs
- Liked songs playlist

### Recommendations
- Based on listening history
- Similar artists
- Trending songs
- Genre-based

### Offline Playback
- Download songs for offline
- Download queue
- Storage management
- Offline indicator

### Premium Subscriptions
- Free tier (ads, limited features)
- Premium tier (no ads, offline, high quality)
- Family plan
- Subscription management

### Admin Features
- CRUD for songs, albums, artists
- User management
- Statistics dashboard

### Dark/Light Mode
- System preference detection
- Manual toggle
- Persistent preference

### Notifications
- New releases from followed artists
- Playlist shares
- Recommendations

---

## Database Schema

### Users
- id, email, password_hash, name, avatar_url, role, premium_status, created_at

### Artists
- id, user_id, name, bio, image_url, verified

### Albums
- id, artist_id, title, cover_url, release_year, genre

### Songs
- id, album_id, title, audio_url, duration, track_number, lyrics

### Playlists
- id, user_id, title, description, cover_url, is_public

### PlaylistSongs
- playlist_id, song_id, position

### Likes
- user_id, song_id

### Follows
- user_id, artist_id

### Downloads
- user_id, song_id, downloaded_at

### Streams
- user_id, song_id, played_at

### Notifications
- id, user_id, type, message, read, created_at

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Artists
- GET /api/artists
- GET /api/artists/:id
- POST /api/artists (admin)
- PUT /api/artists/:id (admin)
- DELETE /api/artists/:id (admin)

### Albums
- GET /api/albums
- GET /api/albums/:id
- POST /api/albums (admin)
- PUT /api/albums/:id (admin)
- DELETE /api/albums/:id (admin)

### Songs
- GET /api/songs
- GET /api/songs/:id
- POST /api/songs (admin)
- PUT /api/songs/:id (admin)
- DELETE /api/songs/:id (admin)

### Playlists
- GET /api/playlists
- GET /api/playlists/:id
- POST /api/playlists
- PUT /api/playlists/:id
- DELETE /api/playlists/:id
- POST /api/playlists/:id/songs

### Search
- GET /api/search?q=query

### Recommendations
- GET /api/recommendations

### Likes
- POST /api/songs/:id/like
- DELETE /api/songs/:id/like
- GET /api/likes

### Downloads
- POST /api/songs/:id/download
- DELETE /api/songs/:id/download
- GET /api/downloads

### Streams
- POST /api/streams

### Admin
- GET /api/admin/stats
- GET /api/admin/users
- PUT /api/admin/users/:id

---

## Animations & Interactions

### Page Transitions
- Fade in on route change
- Staggered list animations

### Hover Effects
- Cards: Scale 1.02, shadow increase
- Buttons: Background shift, scale
- Links: Underline animation

### Player
- Progress bar: Smooth scrubbing
- Album art: Subtle rotation animation (playing)
- Controls: Scale on press

### Loading States
- Skeleton screens
- Spinner for actions
- Progress indicators

### Micro-interactions
- Like: Heart fill animation
- Add to playlist: Checkmark
- Download: Progress ring

---

## Acceptance Criteria

1. ✅ User can register and login
2. ✅ User can search for songs, artists, albums
3. ✅ User can play music with full controls
4. ✅ User can create and manage playlists
5. ✅ User can like songs
6. ✅ User can view synchronized lyrics
7. ✅ User can toggle dark/light mode
8. ✅ User can access admin dashboard
9. ✅ Responsive on all screen sizes
10. ✅ Smooth animations throughout

---

## Demo Data

The application will include demo data:
- 5 sample artists
- 10 sample albums
- 50 sample songs
- 5 sample playlists
- Sample user accounts (free and premium)

import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';

export const viewport: Viewport = {
  themeColor: '#1DB954',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Melodia - Music Streaming',
    template: '%s | Melodia',
  },
  description: 'Stream unlimited music with Melodia. Discover new songs, create playlists, and enjoy offline playback. Premium subscription available.',
  keywords: ['music streaming', 'online music', 'music player', 'playlist', 'podcasts', 'free music', 'premium music'],
  authors: [{ name: 'Shawon Haque' }],
  creator: 'Shawon Haque',
  publisher: 'Melodia',
  metadataBase: new URL('https://melodioa-music-store.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://melodioa-music-store.vercel.app',
    siteName: 'Melodia',
    title: 'Melodia - Music Streaming',
    description: 'Stream unlimited music with Melodia. Discover new songs, create playlists, and enjoy offline playback.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Melodia - Music Streaming Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melodia - Music Streaming',
    description: 'Stream unlimited music with Melodia',
    images: ['/og-image.png'],
    creator: '@melodia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              {children}
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

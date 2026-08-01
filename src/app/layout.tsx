import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Melodia - Music Streaming',
  description: 'Stream unlimited music with Melodia',
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

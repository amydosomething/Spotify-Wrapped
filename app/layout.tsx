import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Analytics - AI-Powered Music Insights',
  description: 'Discover your music taste with AI-powered analytics and personalized insights from your Spotify data.',
  keywords: 'spotify, music analytics, ai insights, music taste, personalized recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#191414] via-[#1e1e1e] to-[#121212]">
          {children}
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
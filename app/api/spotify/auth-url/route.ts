import { NextRequest, NextResponse } from 'next/server';

// Helper function to get environment variables with proper error handling
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
};

export async function GET() {
  try {
    const clientId = getEnvVar('SPOTIFY_CLIENT_ID');
    const redirectUri = getEnvVar('SPOTIFY_REDIRECT_URI');
    
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: generateRandomString(16),
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate Spotify auth URL. Please check your configuration.' },
      { status: 500 }
    );
  }
}

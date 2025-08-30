import { TimeRange } from '@/types/spotify';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// Helper function to get environment variables with proper error handling
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export class SpotifyAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API Error:', response.status, errorText);
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser() {
    return this.makeRequest('/me');
  }

  async getTopTracks(timeRange: TimeRange = 'medium_term', limit: number = 20) {
    return this.makeRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  async getTopArtists(timeRange: TimeRange = 'medium_term', limit: number = 20) {
    return this.makeRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  async getRecentlyPlayed(limit: number = 50) {
    return this.makeRequest(`/me/player/recently-played?limit=${limit}`);
  }

  async getUserPlaylists(limit: number = 20) {
    return this.makeRequest(`/me/playlists?limit=${limit}`);
  }
}

export const exchangeCodeForTokens = async (code: string) => {
  try {
    const clientId = getEnvVar('SPOTIFY_CLIENT_ID');
    const clientSecret = getEnvVar('SPOTIFY_CLIENT_SECRET');
    const redirectUri = getEnvVar('SPOTIFY_REDIRECT_URI');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange error:', response.status, errorText);
      throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in exchangeCodeForTokens:', error);
    throw error;
  }
};

export const timeRangeLabels = {
  short_term: '4 Weeks',
  medium_term: '6 Months',
  long_term: '1 Year',
};
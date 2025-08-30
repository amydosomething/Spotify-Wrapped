export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
  product: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface RecentlyPlayedTrack {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: { spotify: string };
    uri: string;
  } | null;
}

export interface RecentlyPlayedResponse {
  items: RecentlyPlayedTrack[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface AIInsight {
  category: string;
  insight: string;
  confidence: number;
  timeframe: string;
}

export interface AIRecommendation {
  type: 'artist' | 'genre' | 'playlist';
  name: string;
  reason: string;
  confidence: number;
}
'use client';

import { useState } from 'react';
import { Play, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TopTracksResponse, SpotifyTrack } from '@/types/spotify';

interface TopTracksProps {
  data: TopTracksResponse;
  loading: boolean;
}

export function TopTracks({ data, loading }: TopTracksProps) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="spotify-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <Card className="spotify-card">
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No track data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#1DB954]" />
            Your Top Tracks ({data.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.items.map((track: SpotifyTrack, index: number) => (
            <div
              key={track.id}
              className="group relative p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-[1.02]"
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-sm font-mono text-gray-500 w-8 text-center block">
                    #{index + 1}
                  </span>
                  {hoveredTrack === track.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-4 w-4 text-[#1DB954]" />
                    </div>
                  )}
                </div>
                
                <img
                  src={track.album.images[2]?.url || track.album.images[0]?.url}
                  alt={track.album.name}
                  className="h-16 w-16 rounded-lg shadow-lg"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-[#1DB954] transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-gray-400 truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {track.album.name} • {track.album.release_date.split('-')[0]}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(track.duration_ms)}</span>
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {track.popularity}% popular
                    </Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(track.external_urls.spotify, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
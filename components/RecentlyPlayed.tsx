'use client';

import { useState } from 'react';
import { Clock, Play, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentlyPlayedResponse, RecentlyPlayedTrack } from '@/types/spotify';

interface RecentlyPlayedProps {
  data: RecentlyPlayedResponse;
  loading: boolean;
}

export function RecentlyPlayed({ data, loading }: RecentlyPlayedProps) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const formatPlayedAt = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="spotify-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
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
          <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No recently played tracks found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#1DB954]" />
            Recently Played ({data.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
          {data.items.map((item: RecentlyPlayedTrack, index: number) => (
            <div
              key={`${item.track.id}-${item.played_at}`}
              className="group relative p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300"
              onMouseEnter={() => setHoveredTrack(item.track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
                    alt={item.track.album.name}
                    className="h-12 w-12 rounded-lg shadow-md"
                  />
                  {hoveredTrack === item.track.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <Play className="h-4 w-4 text-[#1DB954]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-[#1DB954] transition-colors">
                    {item.track.name}
                  </h3>
                  <p className="text-gray-400 truncate text-sm">
                    {item.track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.track.album.name}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatPlayedAt(item.played_at)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(item.track.external_urls.spotify, '_blank')}
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
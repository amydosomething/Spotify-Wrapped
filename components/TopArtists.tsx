'use client';

import { useState } from 'react';
import { Users, ExternalLink, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { TopArtistsResponse, SpotifyArtist } from '@/types/spotify';

interface TopArtistsProps {
  data: TopArtistsResponse;
  loading: boolean;
}

export function TopArtists({ data, loading }: TopArtistsProps) {
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="spotify-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
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
          <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No artist data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-[#1DB954]" />
            Your Top Artists ({data.items.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.map((artist: SpotifyArtist, index: number) => (
          <Card
            key={artist.id}
            className="spotify-card group cursor-pointer"
            onMouseEnter={() => setHoveredArtist(artist.id)}
            onMouseLeave={() => setHoveredArtist(null)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-[#1DB954] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Avatar className="h-16 w-16 border-2 border-gray-600 group-hover:border-[#1DB954] transition-colors">
                      <AvatarImage
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {artist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">
                      {artist.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Users className="h-3 w-3" />
                      <span>{formatFollowers(artist.followers.total)} followers</span>
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {artist.popularity}% popularity
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className={`transition-all duration-300 ${
                      hoveredArtist === artist.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Genres</p>
                  <div className="flex flex-wrap gap-1">
                    {artist.genres.slice(0, 3).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="text-xs bg-gray-700/50 text-gray-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954] transition-colors"
                      >
                        {genre}
                      </Badge>
                    ))}
                    {artist.genres.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{artist.genres.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
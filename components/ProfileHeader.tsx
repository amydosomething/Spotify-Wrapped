'use client';

import { Users, Crown, MapPin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpotifyUser } from '@/types/spotify';

interface ProfileHeaderProps {
  user: SpotifyUser | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  if (!user) return null;

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="spotify-card border-gray-700/50 animate-slide-up">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-[#1DB954] ring-4 ring-[#1DB954]/20">
              <AvatarImage
                src={user.images?.[0]?.url}
                alt={user.display_name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-[#1DB954] text-white">
                {user.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {user.product === 'premium' && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 p-1 rounded-full">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.display_name}
              </h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{formatFollowers(user.followers?.total || 0)} followers</span>
                </div>
                {user.country && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.country}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge 
                variant="secondary" 
                className="bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/30 hover:bg-[#1DB954]/30"
              >
                {user.product === 'premium' ? 'Premium User' : 'Free User'}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Music Enthusiast
              </Badge>
            </div>

            <p className="text-gray-300 max-w-md">
              Welcome to your personalized music analytics dashboard. Explore your listening patterns, 
              discover trends, and get AI-powered insights about your music taste.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
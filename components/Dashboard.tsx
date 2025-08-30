'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/components/ProfileHeader';
import { TimePeriodSelector } from '@/components/TimePeriodSelector';
import { TopTracks } from '@/components/TopTracks';
import { TopArtists } from '@/components/TopArtists';
import { TopGenres } from '@/components/TopGenres';
import { RecentlyPlayed } from '@/components/RecentlyPlayed';
import { AIInsights } from '@/components/AIInsights';
import { SpotifyAPI } from '@/lib/spotify';
import { SpotifyUser, TimeRange } from '@/types/spotify';

interface DashboardProps {
  accessToken: string;
  user: SpotifyUser | null;
}

export function Dashboard({ accessToken, user }: DashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [spotifyData, setSpotifyData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      if (!accessToken) return;

      setLoading(true);
      try {
        const spotify = new SpotifyAPI(accessToken);
        
        const [topTracks, topArtists, recentlyPlayed] = await Promise.all([
          spotify.getTopTracks(timeRange, 50),
          spotify.getTopArtists(timeRange, 50),
          spotify.getRecentlyPlayed(50),
        ]);

        setSpotifyData({
          topTracks,
          topArtists,
          recentlyPlayed,
          timeRange,
        });
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, [accessToken, timeRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <ProfileHeader user={user} />
        
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Music Analytics</h2>
          <TimePeriodSelector value={timeRange} onChange={setTimeRange} />
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="grid grid-cols-5 lg:w-fit bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="tracks" className="data-[state=active]:bg-[#1DB954]">
              Top Tracks
            </TabsTrigger>
            <TabsTrigger value="artists" className="data-[state=active]:bg-[#1DB954]">
              Top Artists
            </TabsTrigger>
            <TabsTrigger value="genres" className="data-[state=active]:bg-[#1DB954]">
              Genres
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-[#1DB954]">
              Recent
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-[#1DB954]">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-6">
            <TopTracks data={spotifyData.topTracks} loading={loading} />
          </TabsContent>

          <TabsContent value="artists" className="space-y-6">
            <TopArtists data={spotifyData.topArtists} loading={loading} />
          </TabsContent>

          <TabsContent value="genres" className="space-y-6">
            <TopGenres data={spotifyData.topArtists} loading={loading} />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentlyPlayed data={spotifyData.recentlyPlayed} loading={loading} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsights musicData={spotifyData} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
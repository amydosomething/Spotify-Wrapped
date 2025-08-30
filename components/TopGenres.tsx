'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart as PieChartIcon, Hash } from 'lucide-react';
import { TopArtistsResponse } from '@/types/spotify';

interface TopGenresProps {
  data: TopArtistsResponse;
  loading: boolean;
}

export function TopGenres({ data, loading }: TopGenresProps) {
  if (loading) {
    return (
      <Card className="spotify-card">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.items?.length) {
    return (
      <Card className="spotify-card">
        <CardContent className="p-8 text-center">
          <Hash className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No genre data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract and count genres
  const genreCounts = data.items
    .flatMap(artist => artist.genres)
    .reduce((acc: Record<string, number>, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  const genreData = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([genre, count], index) => ({
      genre: genre.charAt(0).toUpperCase() + genre.slice(1),
      count,
      percentage: Math.round((count / data.items.length) * 100),
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    }));

  const COLORS = [
    '#1DB954', '#1ed760', '#ff6b6b', '#4ecdc4', '#45b7d1',
    '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f',
    '#bb8fce', '#85c1e9', '#f8c471', '#82e0aa', '#f1948a'
  ];

  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Hash className="h-5 w-5 mr-2 text-[#1DB954]" />
            Genre Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="space-y-6">
            <TabsList className="bg-gray-800/50">
              <TabsTrigger value="chart" className="data-[state=active]:bg-[#1DB954]">
                <BarChart3 className="h-4 w-4 mr-2" />
                Bar Chart
              </TabsTrigger>
              <TabsTrigger value="pie" className="data-[state=active]:bg-[#1DB954]">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Distribution
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-[#1DB954]">
                <Hash className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="genre" 
                      stroke="#9CA3AF"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#1DB954" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="pie" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreData.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ genre, percentage }) => `${genre} (${percentage}%)`}
                    >
                      {genreData.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {genreData.map((genre, index) => (
                  <div
                    key={genre.genre}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="font-medium text-white">{genre.genre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {genre.count} artists
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {genre.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
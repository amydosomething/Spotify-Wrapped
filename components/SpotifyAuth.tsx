'use client';

import { useState } from 'react';
import { Music, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SpotifyAuthProps {
  onAuthSuccess: (token: string, user: any) => void;
}

export function SpotifyAuth({ onAuthSuccess }: SpotifyAuthProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = async () => {
    console.log('Spotify login button clicked');
    setIsLoading(true);
    
    try {
      console.log('Fetching Spotify auth URL...');
      // Fetch the auth URL from our server-side API
      const response = await fetch('/api/spotify/auth-url');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to get Spotify auth URL');
      }
      
      const data = await response.json();
      console.log('Auth URL received:', data.authUrl);
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error getting Spotify auth URL:', error);
      setIsLoading(false);
      alert('Failed to connect to Spotify. Please check your configuration.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="bg-[#1DB954] p-3 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Spotify Analytics</h1>
          </div>
          
          <h2 className="text-xl text-gray-300 font-medium">
            Discover Your Music Journey
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Unlock AI-powered insights about your music taste, discover patterns in your listening habits, and get personalized recommendations.
          </p>
        </div>

        <Card className="spotify-card border-gray-700/50">
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 text-[#1DB954] mx-auto" />
                <h3 className="font-semibold text-white">Track Trends</h3>
                <p className="text-sm text-gray-400">Analyze your top tracks across different time periods</p>
              </div>
              <div className="space-y-2">
                <Sparkles className="h-8 w-8 text-[#1DB954] mx-auto" />
                <h3 className="font-semibold text-white">AI Insights</h3>
                <p className="text-sm text-gray-400">Get personalized music recommendations and analysis</p>
              </div>
            </div>

            <Button
              onClick={handleSpotifyLogin}
              disabled={isLoading}
              className="w-full spotify-button text-lg py-6"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Connect with Spotify</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                We'll only access your listening data and profile information. 
                No posting or playlist modifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
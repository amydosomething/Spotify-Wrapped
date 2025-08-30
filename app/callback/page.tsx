'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForTokens } from '@/lib/spotify';
import { SpotifyAPI } from '@/lib/spotify';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Spotify auth error:', error);
        setError(`Authorization failed: ${error}`);
        setTimeout(() => router.push('/?error=access_denied'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received from Spotify');
        setTimeout(() => router.push('/?error=no_code'), 3000);
        return;
      }

      try {
        console.log('Exchanging code for tokens...');
        const tokenData = await exchangeCodeForTokens(code);
        console.log('Token exchange successful');
        
        const spotify = new SpotifyAPI(tokenData.access_token);
        console.log('Fetching user data...');
        const user = await spotify.getCurrentUser();
        console.log('User data fetched successfully');
        
        // Store tokens and user data
        localStorage.setItem('spotify_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        }
        localStorage.setItem('spotify_user', JSON.stringify(user));
        
        router.push('/');
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        setError(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setTimeout(() => router.push('/?error=token_exchange_failed'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
          <p className="text-gray-300 max-w-md">{error}</p>
          <p className="text-sm text-gray-500">Redirecting back to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DB954] mx-auto"></div>
        <p className="text-lg text-gray-300">Connecting to Spotify...</p>
        <p className="text-sm text-gray-500">Please wait while we set up your connection</p>
      </div>
    </div>
  );
}
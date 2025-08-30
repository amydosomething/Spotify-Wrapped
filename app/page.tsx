'use client';

import { useState, useEffect } from 'react';
import { SpotifyAuth } from '@/components/SpotifyAuth';
import { Dashboard } from '@/components/Dashboard';
import { Navigation } from '@/components/Navigation';
import { SpotifyUser } from '@/types/spotify';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check for error parameters in URL
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      
      if (error) {
        console.error('Authentication error:', error);
        // Clear any existing auth data
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_user');
        setLoading(false);
        return;
      }

      // Try to get token from localStorage first
      let token = localStorage.getItem('spotify_access_token');
      let userData = localStorage.getItem('spotify_user');

      // If not in localStorage, try to get from cookies
      if (!token) {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        token = cookies.spotify_access_token;
        userData = cookies.spotify_user;
      }

      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (token: string, userData: SpotifyUser) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_user');
    
    // Clear cookies
    document.cookie = 'spotify_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'spotify_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'spotify_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated && accessToken ? (
        <>
          <Navigation user={user} onLogout={handleLogout} />
          <Dashboard accessToken={accessToken} user={user} />
        </>
      ) : (
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
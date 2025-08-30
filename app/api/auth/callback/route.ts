import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/spotify';
import { SpotifyAPI } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  console.log('🔗 Callback route accessed');
  console.log('URL:', request.url);
  
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('Code received:', code ? 'Yes' : 'No');
  console.log('Error received:', error || 'None');

  if (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(new URL('/?error=access_denied', request.url));
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    console.log('Exchanging code for tokens...');
    const tokenData = await exchangeCodeForTokens(code);
    console.log('Token exchange successful');
    
    const spotify = new SpotifyAPI(tokenData.access_token);
    console.log('Fetching user data...');
    const user = await spotify.getCurrentUser();
    console.log('User data fetched successfully');
    
    // Create a response that sets cookies and redirects
    const response = NextResponse.redirect(new URL('http://127.0.0.1:3000/'));
    
    // Set cookies with the token data (more secure than localStorage for server-side)
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600, // 1 hour default
    });
    
    if (tokenData.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true, // Keep refresh token server-side only
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
    
    response.cookies.set('spotify_user', JSON.stringify(user), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });
    
    console.log('✅ Redirecting to home page with cookies set');
    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
  }
}

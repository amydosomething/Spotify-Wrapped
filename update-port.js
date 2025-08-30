#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating Spotify redirect URI to use 127.0.0.1:3000...\n');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your Spotify credentials first.\n');
  process.exit(1);
}

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the redirect URI to use 127.0.0.1:3000
  const oldRedirectUri = /SPOTIFY_REDIRECT_URI=.*/;
  const newRedirectUri = 'SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback';
  
  if (oldRedirectUri.test(envContent)) {
    envContent = envContent.replace(oldRedirectUri, newRedirectUri);
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated SPOTIFY_REDIRECT_URI to use 127.0.0.1:3000');
  } else {
    console.log('⚠️  SPOTIFY_REDIRECT_URI not found in .env.local');
    console.log('Please add this line to your .env.local file:');
    console.log('SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback');
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Update your Spotify app settings at https://developer.spotify.com/dashboard');
  console.log('2. Add this redirect URI: http://127.0.0.1:3000/api/auth/callback');
  console.log('3. Restart your development server');
  console.log('4. Try connecting to Spotify again');
  
} catch (error) {
  console.error('❌ Failed to update .env.local file:', error.message);
  process.exit(1);
}

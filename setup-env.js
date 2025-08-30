#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎵 Spotify Integration Setup\n');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file already exists!');
  console.log('Please check SPOTIFY_SETUP.md for configuration instructions.\n');
  process.exit(0);
}

const envContent = `# Spotify API Configuration
# Get these from https://developer.spotify.com/dashboard

# Your Spotify App Client ID
SPOTIFY_CLIENT_ID=your_spotify_client_id_here

# Your Spotify App Client Secret
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Redirect URI (must match what you set in your Spotify app settings)
# For local development, use: http://localhost:3000/callback
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# Optional: Ollama API for AI insights
OLLAMA_API_URL=http://localhost:11434
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('\n📝 Next steps:');
  console.log('1. Go to https://developer.spotify.com/dashboard');
  console.log('2. Create a new app or use an existing one');
  console.log('3. Copy your Client ID and Client Secret');
  console.log('4. Update the .env.local file with your actual values');
  console.log('5. Add http://localhost:3000/callback to your app\'s Redirect URIs');
  console.log('6. Restart your development server');
  console.log('\n📖 For detailed instructions, see SPOTIFY_SETUP.md');
} catch (error) {
  console.error('❌ Failed to create .env.local file:', error.message);
  process.exit(1);
}

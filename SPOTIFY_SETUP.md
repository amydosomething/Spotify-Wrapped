# Spotify Integration Setup Guide

## Prerequisites

1. A Spotify account
2. A Spotify Developer account (free at https://developer.spotify.com)
3. Ollama installed locally (for AI insights)

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the app details:
   - **App name**: Your app name (e.g., "My Music Analytics")
   - **App description**: Brief description
   - **Website**: Your website URL (can be placeholder for now)
   - **Redirect URI**: `http://127.0.0.1:3000/api/auth/callback` (for development)
4. Accept the terms and create the app

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback

# Ollama Configuration (for local AI insights)
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama:latest

# NextAuth Configuration (if you're using NextAuth)
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### How to get these values:

1. **SPOTIFY_CLIENT_ID**: Found in your Spotify app dashboard
2. **SPOTIFY_CLIENT_SECRET**: Click "Show Client Secret" in your Spotify app dashboard
3. **SPOTIFY_REDIRECT_URI**: Must match exactly what you set in your Spotify app settings

## Step 3: Configure Redirect URI in Spotify Dashboard

1. Go to your Spotify app dashboard
2. Click "Edit Settings"
3. Add `http://127.0.0.1:3000/api/auth/callback` to the Redirect URIs
4. Save the changes

## Step 4: Set Up Ollama (for AI Insights)

1. **Install Ollama**: Follow instructions at https://ollama.ai
2. **Pull the model**: Run `ollama pull llama:latest`
3. **Start Ollama**: Run `ollama serve` (or it should start automatically)
4. **Verify installation**: Run `ollama list` to see available models

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `http://127.0.0.1:3000`
3. Click "Connect with Spotify"
4. You should be redirected to Spotify's authorization page
5. After authorizing, you'll be redirected back to your app
6. Test AI insights by clicking "Generate Insights" in the AI Insights tab

## Troubleshooting

### Common Issues:

1. **"Missing environment variable" error**
   - Make sure your `.env.local` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **"Token exchange failed: 400" error**
   - Check that your `SPOTIFY_REDIRECT_URI` matches exactly in both your `.env.local` and Spotify app settings
   - Ensure your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct

3. **"Spotify API error: 401" error**
   - This usually means the access token is expired or invalid
   - Try logging out and logging back in

4. **Not redirected to Spotify authorization page**
   - Check that your `SPOTIFY_CLIENT_ID` is correct
   - Ensure your redirect URI is properly configured in Spotify dashboard

5. **"Ollama service is not available" error**
   - Make sure Ollama is running: `ollama serve`
   - Check if the model is available: `ollama list`
   - Verify Ollama is accessible at http://127.0.0.1:11434

6. **AI insights not generating**
   - Check browser console for detailed error messages
   - Ensure Ollama is running and the model is loaded
   - Try restarting Ollama: `ollama stop && ollama serve`

### For Production:

When deploying to production, update your redirect URI to your actual domain:
```env
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

And add this URI to your Spotify app settings as well.

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your `SPOTIFY_CLIENT_SECRET` secure
- The `.env.local` file is already in `.gitignore` by default
- Ollama runs locally, so no data is sent to external services for AI insights

# 🎶 Spotify Wrapped with AI Insights

An interactive web app that connects your Spotify account with **AI-powered insights** using **Ollama Llama3**.  
It helps you explore your music taste evolution, listening patterns, and get smart recommendations based on your real Spotify data.

---

## 🎵 Key Features

### 🔗 Spotify Integration
- Secure **OAuth2 authentication**
- User profile display (with follower count)
- **Top tracks, artists, and genres** for:
  - Last 4 weeks  
  - Last 6 months  
  - Last 1 year
- **Recently played songs** with timestamps

### 🤖 AI-Powered Insights (via Ollama Llama3)
- **Taste Evolution:** See how your music preferences change over time  
- **Pattern Recognition:** Identify your listening habits  
- **Smart Recommendations:** Get music suggestions tailored to your taste  
- **Genre Insights:** Track your genre preferences and trends  

The app fetches your Spotify data and sends it to Ollama for analysis, providing **personalized insights** into your music journey.

---

## ⚙️ Setup Instructions

### 1) Clone the Repository
```bash
git clone https://github.com/amydosomething/Spotify-Wrapped.git
cd Spotify-Wrapped
```

### 2) Install Dependencies
```bash
npm install
```

### 3) Spotify Developer Credentials
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add this Redirect URI in the settings: `http://127.0.0.1:3000/api/auth/callback`
4. Copy the **Client ID** and **Client Secret** into your `.env.local`

### 4) Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback

# Ollama Configuration
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3:latest

# NextAuth Configuration
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

👉 **To generate your NextAuth secret**, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5) Install and Setup Ollama
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the Llama3 model:
```bash
ollama pull llama3
```
3. Start the Ollama service:
```bash
ollama serve
```

### 6) Run the App
Start the development server:
```bash
npm run dev
```

The app will be available at `http://127.0.0.1:3000`

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Authentication:** NextAuth.js with Spotify OAuth2
- **API Integration:** Spotify Web API
- **AI Processing:** Ollama Llama3

---

## 📱 Usage

1. **Connect Your Spotify Account:** Click "Login with Spotify" to authenticate
2. **Explore Your Data:** View your top tracks, artists, and listening history
3. **Get AI Insights:** Let Llama3 analyze your music patterns and provide personalized insights
4. **Discover New Music:** Receive AI-powered recommendations based on your taste

---

## 🔒 Privacy & Security

- All Spotify data is processed locally and sent only to your local Ollama instance
- No personal data is stored on external servers
- OAuth2 ensures secure authentication with Spotify
- Your music data remains private and under your control

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


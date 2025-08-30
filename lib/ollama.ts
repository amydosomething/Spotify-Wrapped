export class OllamaAPI {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama:latest';
  }

  async generateInsights(musicData: any): Promise<string> {
    try {
      const prompt = this.buildMusicAnalysisPrompt(musicData);
      
      console.log('Generating insights with Ollama...');
      console.log('Model:', this.model);
      console.log('Base URL:', this.baseUrl);
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.8, // Increased for more creative responses
            max_tokens: 1200, // Increased for more detailed insights
            top_p: 0.9,
            repeat_penalty: 1.1,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API error:', response.status, errorText);
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Ollama response received successfully');
      return data.response;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Cannot connect to Ollama. Please make sure Ollama is running locally on http://127.0.0.1:11434');
      }
      throw new Error('Failed to generate AI insights');
    }
  }

  private buildMusicAnalysisPrompt(musicData: any): string {
    const { topTracks, topArtists, recentlyPlayed, timeRange } = musicData;
    
    const tracksList = topTracks?.items
      ?.slice(0, 10)
      .map((track: any, index: number) => 
        `${index + 1}. "${track.name}" by ${track.artists.map((a: any) => a.name).join(', ')}`
      )
      .join('\n') || '';

    const artistsList = topArtists?.items
      ?.slice(0, 10)
      .map((artist: any, index: number) => 
        `${index + 1}. ${artist.name} (${artist.genres.slice(0, 2).join(', ')})`
      )
      .join('\n') || '';

    const genres = topArtists?.items
      ?.flatMap((artist: any) => artist.genres)
      .filter((genre: string, index: number, array: string[]) => array.indexOf(genre) === index)
      .slice(0, 10)
      .join(', ') || '';

    const timeRangeText = timeRange === 'short_term' ? 'past 4 weeks' : 
                         timeRange === 'medium_term' ? 'past 6 months' : 'past year';

    // Enhanced prompt with more engaging and creative instructions
    return `You are VIBES - an AI music psychologist and trend analyst with the personality of a cool music journalist who really "gets" people through their playlists. You're about to dive deep into someone's musical soul using their Spotify data from the ${timeRangeText}.

🎵 MUSICAL DNA TO ANALYZE:

TOP TRACKS:
${tracksList}

TOP ARTISTS:
${artistsList}

DOMINANT GENRES:
${genres}

Your mission: Create a captivating, personalized music analysis that reads like a combination of a psychological profile and a music magazine feature. Make it feel like you're their personal music therapist who's been studying their listening habits.

📝 STRUCTURE YOUR ANALYSIS:

🎭 **MUSICAL PERSONALITY REVEAL**
Start with a bold statement about what their music taste says about them as a person. Are they a "melancholic dreamer," "energetic optimist," "genre-bending rebel," or something else? Create a unique musical archetype.

🌊 **THE VIBES CHECK**
Analyze the emotional journey their music takes them on. Do they gravitate toward introspective late-night sessions? High-energy motivation anthems? Nostalgic comfort zones? Paint a picture of their emotional soundtrack.

📈 **PATTERN DETECTIVE FINDINGS**
Uncover hidden patterns: Are they stuck in a comfort zone or constantly exploring? Do they have "era obsessions"? Are they a mainstream maverick or underground explorer? Make observations that feel like you're revealing secrets about themselves.

🔮 **MUSICAL FUTURE PREDICTIONS**
Based on their current trajectory, where is their taste heading? What phases might they enter next? Be bold with predictions.

💎 **DISCOVERY GOLDMINE** 
Recommend 4-5 specific artists, albums, or genres they should explore next. Don't just list them - explain WHY each recommendation will click with their vibe. Make it feel like you're sharing insider secrets.

🎪 **THE WILD CARD**
End with one surprising observation, fun fact, or bold statement about their musical identity that they probably never realized about themselves.

TONE GUIDELINES:
- Write like you're their music-savvy best friend who really "gets" them
- Use contemporary music language and references
- Be specific, not generic - avoid boring phrases like "diverse taste"
- Include emotional insights, not just surface-level observations
- Make them feel seen and understood through their music
- Keep it under 600 words but pack it with personality
- 🎨 USE EMOJIS LIBERALLY: Sprinkle relevant emojis throughout to make it visually engaging and fun
- Mix music emojis (🎵🎶🎸🎤🎧🎹🥁), emotion emojis (😍🔥💫⚡🌙), and vibe emojis (✨🌊🎭🚀💎)

EMOJI USAGE EXAMPLES:
- Start sections with relevant emojis: "🎭 Your musical alter ego is..."
- Use emojis to emphasize points: "You're clearly a 🌙 night owl listener..."
- Add emojis to recommendations: "Try 🎸 Arctic Monkeys for that indie edge..."
- End with impact: "You're basically a 🎵 musical shapeshifter! ✨"

Remember: This person trusted you with their musical soul - give them insights that make them go "Whoa, how did you know that about me?" Make it visually pop with emojis! 🚀`;
  }

  async checkHealth(): Promise<boolean> {
    try {
      console.log('Checking Ollama health at:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Ollama is healthy, available models:', data.models?.map((m: any) => m.name) || 'none');
        return true;
      } else {
        console.error('Ollama health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Ollama health check error:', error);
      return false;
    }
  }
}

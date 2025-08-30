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
            temperature: 0.7,
            max_tokens: 1000,
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

    return `You are a music analyst and AI assistant. Analyze this Spotify user's music taste based on their listening data from the ${timeRangeText}:

TOP TRACKS:
${tracksList}

TOP ARTISTS:
${artistsList}

TOP GENRES:
${genres}

Please provide a comprehensive analysis including:
1. Music taste profile and personality insights
2. Genre evolution and trends
3. Mood and energy patterns
4. Listening habits analysis
5. 3-5 personalized music recommendations (artists or genres they might enjoy)

Keep the response engaging, insightful, and under 500 words. Format it in a way that's easy to read with clear sections. Be conversational and friendly in your tone.`;
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
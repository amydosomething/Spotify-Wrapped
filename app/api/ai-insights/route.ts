import { NextRequest, NextResponse } from 'next/server';
import { OllamaAPI } from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    const musicData = await request.json();
    
    if (!musicData) {
      return NextResponse.json(
        { error: 'Music data is required' },
        { status: 400 }
      );
    }

    const ollama = new OllamaAPI();
    
    // Check if Ollama is available
    const isHealthy = await ollama.checkHealth();
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'Ollama service is not available. Please make sure Ollama is running locally.' },
        { status: 503 }
      );
    }

    const insights = await ollama.generateInsights(musicData);
    
    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}
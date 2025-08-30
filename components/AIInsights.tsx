'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Brain, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AIInsightsProps {
  musicData: any;
  loading: boolean;
}

export function AIInsights({ musicData, loading }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateInsights = async () => {
    if (!musicData.topTracks || !musicData.topArtists) {
      setError('Not enough music data available. Please wait for data to load.');
      return;
    }

    setInsightsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error generating insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  const formatInsights = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Handle section headers (lines with colons or numbered sections)
      if (line.match(/^\d+\./) || line.includes(':') && line.length < 50) {
        return (
          <h3 key={index} className="font-semibold text-[#1DB954] mt-4 mb-2">
            {line.trim()}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-gray-300 mb-2 leading-relaxed">
          {line.trim()}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <Card className="spotify-card">
        <CardContent className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2 text-[#1DB954]" />
              AI-Powered Music Insights
            </CardTitle>
            <Button
              onClick={generateInsights}
              disabled={insightsLoading || loading}
              className="spotify-button"
              size="sm"
            >
              {insightsLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {insightsLoading ? 'Analyzing...' : 'Generate Insights'}
            </Button>
          </div>
          {lastGenerated && (
            <p className="text-xs text-gray-400">
              Last generated: {lastGenerated.toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!error && !insights && !insightsLoading && (
            <Alert className="border-[#1DB954]/50 bg-[#1DB954]/10">
              <Sparkles className="h-4 w-4" />
              <AlertDescription className="text-[#1DB954]">
                Click "Generate Insights" to get AI-powered analysis of your music taste and personalized recommendations.
              </AlertDescription>
            </Alert>
          )}

          {insightsLoading && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#1DB954]">
                <Brain className="h-5 w-5 animate-pulse" />
                <span>AI is analyzing your music taste...</span>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                ))}
              </div>
            </div>
          )}

          {insights && !insightsLoading && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-[#1DB954]" />
                <Badge variant="secondary" className="bg-[#1DB954]/20 text-[#1DB954]">
                  Analysis Complete
                </Badge>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                  {formatInsights(insights)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
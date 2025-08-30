'use client';

import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeRange } from '@/types/spotify';
import { timeRangeLabels } from '@/lib/spotify';

interface TimePeriodSelectorProps {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
}

export function TimePeriodSelector({ value, onChange }: TimePeriodSelectorProps) {
  const periods = [
    { key: 'short_term' as TimeRange, icon: Clock, color: 'text-blue-400' },
    { key: 'medium_term' as TimeRange, icon: Calendar, color: 'text-purple-400' },
    { key: 'long_term' as TimeRange, icon: TrendingUp, color: 'text-orange-400' },
  ];

  return (
    <div className="flex space-x-2 bg-gray-800/50 p-1 rounded-xl border border-gray-700">
      {periods.map(({ key, icon: Icon, color }) => (
        <Button
          key={key}
          variant={value === key ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(key)}
          className={`relative transition-all duration-300 ${
            value === key 
              ? 'bg-[#1DB954] text-white shadow-lg shadow-[#1DB954]/25' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Icon className={`h-4 w-4 mr-2 ${value === key ? 'text-white' : color}`} />
          {timeRangeLabels[key]}
        </Button>
      ))}
    </div>
  );
}
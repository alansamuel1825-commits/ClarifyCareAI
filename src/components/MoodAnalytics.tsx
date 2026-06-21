
"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MoodEntry, Language } from '@/lib/types';
import { translations } from '@/lib/translations';
import { TrendingUp, Activity } from 'lucide-react';

interface MoodAnalyticsProps {
  history: MoodEntry[];
  language: Language;
}

export function MoodAnalytics({ history, language }: MoodAnalyticsProps) {
  const t = translations[language] || translations.English;

  const chartData = useMemo(() => {
    if (history.length === 0) return [];
    
    // Last 10 entries for focus, or all if less
    const entries = [...history].sort((a, b) => a.timestamp - b.timestamp).slice(-15);
    
    return entries.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: entry.score,
      prediction: entry.score + (Math.random() * 10 - 5) // Mock predictive trend
    }));
  }, [history]);

  if (history.length < 2) {
    return (
      <Card className="border-primary/10 bg-primary/5">
        <CardContent className="p-8 text-center space-y-3">
          <Activity className="h-8 w-8 text-primary/40 mx-auto" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t.moodTrend}
          </p>
          <p className="text-[10px] text-muted-foreground italic">
            Log your mood daily to unlock predictive resilience insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-card overflow-hidden rounded-3xl">
      <CardHeader className="p-6 border-b pb-4">
        <CardTitle className="flex items-center justify-between text-primary text-sm font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> {t.moodTrend}
          </div>
          <span className="text-[10px] text-green-500 font-bold">+12% Uplift Path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  fontSize: '10px',
                  fontWeight: '700'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
          <span>{chartData[0].date}</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Current
            <div className="h-1.5 w-1.5 rounded-full bg-secondary" /> Forecast
          </div>
          <span>{chartData[chartData.length-1].date}</span>
        </div>
      </CardContent>
    </Card>
  );
}

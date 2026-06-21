
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Wind, Moon, Sun, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language } from '@/lib/types';
import { translations } from '@/lib/translations';

export function SelfCareHub({ language }: { language: Language }) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const t = translations[language] || translations.English;

  const startBreathing = () => {
    setIsBreathing(true);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter % 12 <= 4) setPhase('In');
      else if (counter % 12 <= 8) setPhase('Hold');
      else setPhase('Out');
      if (counter > 60) {
        clearInterval(interval);
        setIsBreathing(false);
      }
    }, 1000);
  };

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-secondary/10 to-primary/10 overflow-hidden rounded-3xl">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-3 text-secondary text-lg font-black uppercase tracking-widest">
          <Heart className="h-6 w-6" /> humanity core
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isBreathing ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in duration-500">
            <div className={cn(
               "h-32 w-32 rounded-full bg-secondary/30 flex items-center justify-center transition-all duration-[4000ms]",
               phase === 'In' && "scale-150 bg-secondary/50",
               phase === 'Hold' && "scale-150 bg-secondary/60 rotate-180",
               phase === 'Out' && "scale-100 bg-secondary/30"
            )}>
               <Wind className="h-12 w-12 text-secondary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-secondary uppercase tracking-widest">{phase}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">Focused Respiration</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl bg-white/50 border-secondary/20 hover:bg-secondary/10" onClick={startBreathing}>
                <Wind className="h-6 w-6 text-secondary" />
                <span className="text-[10px] font-black uppercase">Guided Breath</span>
             </Button>
             <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl bg-white/50 border-secondary/20 hover:bg-secondary/10">
                <Brain className="h-6 w-6 text-secondary" />
                <span className="text-[10px] font-black uppercase">Mindfulness</span>
             </Button>
             <Card className="p-4 rounded-2xl bg-white/30 border-none flex flex-col items-center gap-2">
                <Sun className="h-5 w-5 text-orange-400" />
                <span className="text-[9px] font-black uppercase text-muted-foreground">Morning Hub</span>
             </Card>
             <Card className="p-4 rounded-2xl bg-white/30 border-none flex flex-col items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-400" />
                <span className="text-[9px] font-black uppercase text-muted-foreground">Evening Hub</span>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

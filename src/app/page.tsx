
"use client";

import React, { useState, useEffect } from 'react';
import { DocumentProcessor } from '@/components/DocumentProcessor';
import { AnalysisResults } from '@/components/AnalysisResults';
import { HistoryDashboard } from '@/components/HistoryDashboard';
import { AccessibilityControl } from '@/components/AccessibilityControl';
import { CrisisBanner } from '@/components/CrisisBanner';
import { SelfCareHub } from '@/components/SelfCareHub';
import { AnalysisRecord, AccessibilitySettings, UserProgress } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { translations } from '@/lib/translations';
import { 
  ChevronLeft, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  AlertTriangle,
  Brain,
  Globe,
  Zap,
  Target,
  Trophy,
  Flame,
  LayoutDashboard,
  Users,
  Dna,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<AnalysisRecord | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    streak: 3,
    lastActive: Date.now(),
    badges: ['Early Adopter', 'Resilience Starter'],
    moodScore: 72,
    resilienceScore: 65,
    onboardingComplete: false
  });
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    voiceSynthesis: false,
    darkMode: false,
    language: 'English',
  });

  const t = translations[accessibility.language] || translations.English;

  useEffect(() => {
    const saved = localStorage.getItem('aurora_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    const savedAccess = localStorage.getItem('aurora_access');
    if (savedAccess) {
      try {
        setAccessibility(JSON.parse(savedAccess));
      } catch (e) {}
    }

    const savedProgress = localStorage.getItem('aurora_progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aurora_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('aurora_access', JSON.stringify(accessibility));
    localStorage.setItem('aurora_progress', JSON.stringify(progress));
    if (accessibility.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [accessibility, progress]);

  const handleAnalysisComplete = (newRecord: AnalysisRecord) => {
    setRecords([newRecord, ...records]);
    setCurrentRecord(newRecord);
    setProgress(prev => ({
      ...prev,
      resilienceScore: Math.min(100, prev.resilienceScore + 2),
      onboardingComplete: true
    }));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    if (currentRecord?.id === id) setCurrentRecord(null);
  };

  const handleUpdateRecord = (updated: AnalysisRecord) => {
    setRecords(records.map(r => r.id === updated.id ? updated : r));
    setCurrentRecord(updated);
  };

  const updateAccess = (key: string, value: any) => {
    setAccessibility({ ...accessibility, [key]: value });
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 bg-background pb-20",
      accessibility.highContrast && "high-contrast",
      accessibility.largeText && "large-text",
      accessibility.darkMode && "dark"
    )}>
      {/* Emergency Layer */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        <Button 
          variant="destructive" 
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl shadow-red-500/50 animate-bounce pointer-events-auto border-4 border-white dark:border-zinc-900"
          onClick={() => window.open('tel:988', '_self')}
        >
          <AlertTriangle className="h-8 w-8" />
        </Button>
        <div className="bg-destructive text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl pointer-events-auto uppercase tracking-tighter">
          {t.emergencySos}
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentRecord(null)}
          >
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-6 transition-transform">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-black text-primary leading-none tracking-tight">ClarifyCare AI</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[8px] font-black py-0 px-2 h-4 border-primary/20 text-primary uppercase">Production Active</Badge>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Core Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end gap-0.5 mr-6">
                <div className="flex items-center gap-2 text-primary font-black text-xs">
                   <Zap className="h-3.5 w-3.5" />
                   AI Confidence: 94%
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                   <CheckCircle2 className="h-3 w-3 text-green-500" />
                   3 Trusted Sources Verified
                </div>
             </div>
            <AccessibilityControl 
              settings={accessibility} 
              onUpdate={updateAccess} 
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {currentRecord?.crisisDetected && (
          <div className="mb-12 animate-in slide-in-from-top-4 duration-500">
            <CrisisBanner record={currentRecord} />
          </div>
        )}

        {currentRecord ? (
          <div className="space-y-8 max-w-7xl mx-auto">
            <Button 
              variant="ghost" 
              className="group -ml-4 text-muted-foreground hover:text-primary font-bold"
              onClick={() => setCurrentRecord(null)}
            >
              <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Intelligence Hub
            </Button>
            
            <AnalysisResults 
              record={currentRecord} 
              onUpdateRecord={handleUpdateRecord}
              accessibility={accessibility}
            />
          </div>
        ) : (
          <div className="space-y-16 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-4xl mx-auto py-12">
              <h1 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tight leading-[0.9]">
                {t.heroTitle.split('. ')[0]} <br/>
                <span className="text-secondary italic">{t.heroTitle.split('. ')[1] || ''}</span>
              </h1>
              <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-3xl mx-auto font-medium">
                {t.heroSubtitle}
              </p>
            </section>

            {/* Input Hub */}
            <DocumentProcessor 
              onAnalysisComplete={handleAnalysisComplete} 
              currentLanguage={accessibility.language}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <HistoryDashboard 
                  records={records} 
                  onSelect={setCurrentRecord} 
                  onDelete={handleDeleteRecord} 
                  language={accessibility.language}
                />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <SelfCareHub language={accessibility.language} />
                
                <Card className="p-6 border-primary/10 bg-primary/5 shadow-xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Target className="h-4 w-4" /> {t.resilienceHub}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground">{t.potentialUnlocked}</span>
                      <span className="text-xl font-black text-primary">{progress.resilienceScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${progress.resilienceScore}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                      "Knowledge is the precursor to action. Action is the path to flourishing."
                    </p>
                  </div>
                </Card>

                <Card className="p-6 border-secondary/10 bg-secondary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-5 w-5 text-secondary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary">{t.safetyShieldTitle}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.safetyShieldDesc}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-4 mt-24 border-t py-12 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-start gap-1">
            <p className="font-black text-primary tracking-tight uppercase">ClarifyCare AI</p>
            <p>© 2025 ClarifyCare Systems. Empowering Global Flourishing.</p>
          </div>
          <div className="flex items-center gap-8 font-bold text-[10px] uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Ethics Core</a>
            <a href="#" className="hover:text-primary transition-colors">Source Data</a>
            <a href="#" className="hover:text-primary transition-colors">Emergency Hub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { DocumentProcessor } from '@/components/DocumentProcessor';
import { AnalysisResults } from '@/components/AnalysisResults';
import { HistoryDashboard } from '@/components/HistoryDashboard';
import { AccessibilityControl } from '@/components/AccessibilityControl';
import { CrisisBanner } from '@/components/CrisisBanner';
import { AnalysisRecord, AccessibilitySettings } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  AlertTriangle,
  Brain,
  Globe,
  Zap,
  BookOpen,
  LineChart,
  Target,
  Heart
} from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<AnalysisRecord | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    voiceSynthesis: false,
    darkMode: false,
    language: 'English',
  });

  useEffect(() => {
    const saved = localStorage.getItem('aethia_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    const savedAccess = localStorage.getItem('aethia_access');
    if (savedAccess) {
      try {
        setAccessibility(JSON.parse(savedAccess));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aethia_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('aethia_access', JSON.stringify(accessibility));
    if (accessibility.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [accessibility]);

  const handleAnalysisComplete = (newRecord: AnalysisRecord) => {
    setRecords([newRecord, ...records]);
    setCurrentRecord(newRecord);
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
      {/* Planetary SOS Layer */}
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
          Immediate Emergency SOS
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentRecord(null)}
          >
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-6 transition-transform">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-black text-primary leading-none tracking-tight">Project Aurora</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black mt-1">Aethia Systems Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AccessibilityControl 
              settings={accessibility} 
              onUpdate={updateAccess} 
            />
            <div className="hidden md:flex h-10 w-px bg-border mx-2" />
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="border-secondary text-secondary font-black text-[10px]">
                SAATHI ACTIVE
              </Badge>
              <span className="text-xs font-bold text-muted-foreground">Neural Trust: Verified</span>
            </div>
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
              Return to Intelligence Hub
            </Button>
            
            <AnalysisResults 
              record={currentRecord} 
              onUpdateRecord={handleUpdateRecord}
              accessibility={accessibility}
            />
          </div>
        ) : (
          <div className="space-y-16 max-w-7xl mx-auto">
            {/* Hero Section - The "Everything" Navigator */}
            <section className="text-center space-y-6 max-w-4xl mx-auto py-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 shadow-sm">
                <Activity className="h-3 w-3" />
                Planetary Immune Protocol
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tight leading-[0.9]">
                Unlock Human Potential. <br/>
                <span className="text-secondary italic">Accelerate Understanding.</span>
              </h1>
              <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-3xl mx-auto font-medium">
                Aurora is a lifelong intelligence layer designed to move humanity from uncertainty to action. 
                Our multi-agent system provides world-class guidance for education, health, and global support.
              </p>
              
              {/* Agent Hub Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {[
                  { icon: BookOpen, label: "Education Agent", color: "text-blue-500" },
                  { icon: Zap, label: "Planning Agent", color: "text-amber-500" },
                  { icon: Globe, label: "Resource Agent", color: "text-green-500" },
                  { icon: ShieldAlert, label: "Safety Agent", color: "text-red-500" }
                ].map((agent, i) => (
                  <Card key={i} className="p-4 rounded-2xl border bg-card/50 flex flex-col items-center gap-2 hover:shadow-lg transition-all group">
                    <agent.icon className={cn("h-6 w-6 group-hover:scale-110 transition-transform", agent.color)} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{agent.label}</span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Input Component */}
            <DocumentProcessor 
              onAnalysisComplete={handleAnalysisComplete} 
              currentLanguage={accessibility.language}
            />

            {/* Hub Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <HistoryDashboard 
                  records={records} 
                  onSelect={setCurrentRecord} 
                  onDelete={handleDeleteRecord} 
                />
              </div>
              <div className="space-y-6">
                <Card className="p-6 border-primary/10 bg-primary/5 shadow-xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Planetary Metrics
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground">Opportunities Created</span>
                      <span className="text-xl font-black text-primary">1.2M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground">Problems Solved</span>
                      <span className="text-xl font-black text-primary">850K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground">Well-being Uplift</span>
                      <span className="text-xl font-black text-primary">+22%</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-secondary/10 bg-secondary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-5 w-5 text-secondary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary">Neural Shield</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our safety protocols are deterministic. High-risk signals are processed with zero-latency human escalation paths. Aethia is watching over your resilience journey.
                  </p>
                </Card>

                <Card className="p-6 border-destructive/10 bg-destructive/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="h-5 w-5 text-destructive" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-destructive">Humanity Core</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The purpose of Aurora is to help humanity become more capable, informed, and resilient. We prioritize your flourishing over profit.
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
            <p className="font-black text-primary tracking-tight">PROJECT AURORA</p>
            <p>© 2025 Aethia Systems. Empowering Global Resilience.</p>
          </div>
          <div className="flex items-center gap-8 font-bold text-[10px] uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Ethics Protocol</a>
            <a href="#" className="hover:text-primary transition-colors">Source Transparency</a>
            <a href="#" className="hover:text-primary transition-colors">Universal Access</a>
            <a href="#" className="hover:text-primary transition-colors">Crisis Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

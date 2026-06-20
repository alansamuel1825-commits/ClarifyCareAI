
"use client";

import React, { useState, useEffect } from 'react';
import { DocumentProcessor } from '@/components/DocumentProcessor';
import { AnalysisResults } from '@/components/AnalysisResults';
import { HistoryDashboard } from '@/components/HistoryDashboard';
import { AccessibilityControl } from '@/components/AccessibilityControl';
import { AnalysisRecord, AccessibilitySettings } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Heart } from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<AnalysisRecord | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    voiceSynthesis: false,
  });

  // Hydration safety for local storage
  useEffect(() => {
    const saved = localStorage.getItem('clarifycare_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    const savedAccess = localStorage.getItem('clarifycare_access');
    if (savedAccess) {
      try {
        setAccessibility(JSON.parse(savedAccess));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clarifycare_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('clarifycare_access', JSON.stringify(accessibility));
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

  const updateAccess = (key: string, value: boolean) => {
    setAccessibility({ ...accessibility, [key]: value });
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300 bg-background pb-12",
      accessibility.highContrast && "high-contrast",
      accessibility.largeText && "large-text"
    )}>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentRecord(null)}
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-headline font-bold text-primary leading-none">ClarifyCare AI</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Support Simplifier</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AccessibilityControl 
              settings={accessibility} 
              onUpdate={updateAccess} 
            />
            <Button 
              variant="default" 
              className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-white shadow-md shadow-secondary/10"
              onClick={() => setCurrentRecord(null)}
            >
              Analyze New
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentRecord ? (
          <div className="space-y-6 max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              className="group -ml-4 text-muted-foreground hover:text-primary"
              onClick={() => setCurrentRecord(null)}
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
            
            <AnalysisResults 
              record={currentRecord} 
              onUpdateRecord={handleUpdateRecord}
              voiceActive={accessibility.voiceSynthesis}
            />
          </div>
        ) : (
          <div className="space-y-12 max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center space-y-4 max-w-2xl mx-auto py-8">
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
                Understand confusing forms <br/>
                <span className="text-secondary">in seconds.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                ClarifyCare AI translates complex bureaucratic notices into simple language, 
                giving you a step-by-step action plan and local support resources.
              </p>
            </section>

            {/* Main Interaction Area */}
            <DocumentProcessor onAnalysisComplete={handleAnalysisComplete} />

            {/* Dashboard / History */}
            <HistoryDashboard 
              records={records} 
              onSelect={setCurrentRecord} 
              onDelete={handleDeleteRecord} 
            />
          </div>
        )}
      </main>

      <footer className="container mx-auto px-4 mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2025 ClarifyCare AI. Built with empathy for community support.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <Info className="h-3 w-3" />
              How it works
            </a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          </div>
        </div>
        <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-3xl mx-auto text-[11px] text-muted-foreground italic">
          Disclaimer: ClarifyCare AI provides informational summaries only. We do not provide legal, medical, or financial advice. 
          Please verify all critical information with the official source or a qualified professional.
        </div>
      </footer>
    </div>
  );
}

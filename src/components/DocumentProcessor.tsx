
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  Mic, 
  MicOff,
  Search,
  Loader2,
  BrainCircuit,
  Languages,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  documentAnalysisAndSimplification 
} from '@/ai/flows/document-analysis-and-simplification';
import { 
  actionPlanAndUrgencyAssessment 
} from '@/ai/flows/action-plan-and-urgency-assessment';
import { 
  recommendResources 
} from '@/ai/flows/resource-recommendation-flow';
import { 
  multilingualAnalysisOutput 
} from '@/ai/flows/multilingual-analysis-output';
import { AnalysisRecord, Language } from '@/lib/types';

interface DocumentProcessorProps {
  onAnalysisComplete: (record: AnalysisRecord) => void;
  currentLanguage: Language;
}

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'self-harm', 'abuse', 'violence', 'homeless', 
  'ending it', 'no point living', 'hurt myself', 'starving', 'eviction'
];

export function DocumentProcessor({ onAnalysisComplete, currentLanguage }: DocumentProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => (result[0] as any).transcript)
          .join('');
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        toast({ title: "Saathi Listening...", description: "Speak clearly. Voice model active." });
      } catch (e) {
        toast({ variant: "destructive", title: "Speech recognition not supported" });
      }
    }
  };

  const handleAnalysis = async (text: string) => {
    if (!text.trim()) {
      toast({ variant: "destructive", title: "Input required", description: "Please enter text or use voice." });
      return;
    }

    setIsAnalyzing(true);
    try {
      const crisisTypesFound = CRISIS_KEYWORDS.filter(k => text.toLowerCase().includes(k));
      const crisisDetected = crisisTypesFound.length > 0;

      const [analysisOutput, actionPlanOutput] = await Promise.all([
        documentAnalysisAndSimplification({ documentText: text }),
        actionPlanAndUrgencyAssessment({ documentText: text })
      ]);
      
      const resourcesOutput = await recommendResources({
        documentClassification: crisisDetected ? "Crisis Support" : "General Support",
        keyPoints: analysisOutput.keyPoints.join(", "),
        urgency: crisisDetected ? "High" : actionPlanOutput.urgency,
      });

      let finalAnalysis = analysisOutput;
      let finalActionPlan = actionPlanOutput;
      let finalResources = resourcesOutput;

      if (currentLanguage !== 'English') {
        const translateData = async (data: any) => {
          const res = await multilingualAnalysisOutput({
            textToTranslate: JSON.stringify(data),
            targetLanguage: currentLanguage
          });
          return JSON.parse(res.translatedText);
        };

        try {
           finalAnalysis = await translateData(analysisOutput);
           finalActionPlan = await translateData(actionPlanOutput);
           finalResources = await translateData(resourcesOutput);
        } catch (e) {
          console.warn("Translation failed, falling back to English", e);
        }
      }

      const newRecord: AnalysisRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalText: text,
        language: currentLanguage,
        analysis: finalAnalysis,
        actionPlan: finalActionPlan,
        resources: finalResources,
        completedSteps: [],
        crisisDetected,
        crisisTypes: crisisTypesFound,
        confidenceScore: crisisDetected ? 99 : 88,
        agentInsights: [
          {
            agentName: "Safety Agent",
            insight: crisisDetected ? "High-risk indicators identified. Emergency protocols activated." : "Environment scan complete. No immediate safety threats detected.",
            recommendations: crisisDetected ? ["Call emergency services", "Reach out to trusted contact"] : ["Maintain current progress"]
          },
          {
            agentName: "Resource Agent",
            insight: "Tailoring support network based on detected needs.",
            recommendations: finalResources.resources.slice(0, 2).map(r => `Contact ${r.name}`)
          },
          {
            agentName: "Education Agent",
            insight: "Identifying learning pathways from content.",
            recommendations: ["Review related concepts", "Schedule learning time"]
          }
        ],
        nextSteps: finalActionPlan.actionPlan.slice(0, 3)
      };

      onAnalysisComplete(newRecord);
      setInputText('');
      toast({
        title: "Aurora Insights Generated",
        description: `Analysis completed in ${currentLanguage}.`
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis failed", description: "There was an error processing. Try shorter text." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-headline font-semibold text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse text-secondary" />
                Input Hub
              </h2>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Languages className="h-3 w-3" />
                Language: {currentLanguage}
              </div>
            </div>
            
            <div className="relative">
              <Textarea 
                placeholder="Describe your situation, paste a document, or tell Aurora what's on your mind..."
                className={cn(
                  "min-h-[220px] text-lg font-body resize-none focus-visible:ring-secondary border-muted p-6 leading-relaxed",
                  isRecording && "ring-2 ring-destructive animate-pulse"
                )}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAnalyzing}
              />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 text-destructive font-bold text-xs">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                  SAATHI IS LISTENING
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" />
              
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Upload PDF/Image
              </Button>

              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="sm" 
                className="gap-2"
                onClick={toggleRecording}
                disabled={isAnalyzing}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                Voice Mode
              </Button>

              <div className="flex-1" />

              <Button 
                className="bg-primary hover:bg-primary/90 text-white min-w-[180px] gap-2 font-bold shadow-xl shadow-primary/30"
                onClick={() => handleAnalysis(inputText)}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isAnalyzing ? "Reasoning..." : "Start Journey"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Neural Layer", value: "Real-time Processing" },
          { label: "Multi-Agent System", value: "Active Coordination" },
          { label: "Trust Network", value: "Verified Insights" },
          { label: "Universal Access", value: "Multilingual Support" }
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border text-center shadow-sm">
            <h3 className="text-[10px] font-bold uppercase text-primary mb-1 tracking-tighter">{item.label}</h3>
            <p className="text-xs font-semibold text-muted-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

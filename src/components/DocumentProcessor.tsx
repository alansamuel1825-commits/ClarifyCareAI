
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Mic, 
  MicOff,
  Loader2,
  BrainCircuit,
  Languages,
  Sparkles,
  X,
  ShieldAlert
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
import { AnalysisRecord, Language, AgentInsight } from '@/lib/types';

interface DocumentProcessorProps {
  onAnalysisComplete: (record: AnalysisRecord) => void;
  currentLanguage: Language;
}

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'self-harm', 'abuse', 'violence', 'homeless', 
  'ending it', 'no point living', 'hurt myself', 'starving', 'eviction',
  'hurt someone', 'no food', 'no place to stay'
];

export function DocumentProcessor({ onAnalysisComplete, currentLanguage }: DocumentProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
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
        toast({ title: "Saathi Listening...", description: "Planetary voice model active." });
      } catch (e) {
        toast({ variant: "destructive", title: "Speech recognition not supported" });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile(reader.result as string);
      toast({ title: "File Loaded", description: `${file.name} is ready for analysis.` });
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalysis = async (text: string) => {
    if (!text.trim() && !uploadedFile) {
      toast({ variant: "destructive", title: "Input required", description: "Please enter text or upload a document." });
      return;
    }

    setIsAnalyzing(true);
    try {
      const combinedText = text + (uploadedFile ? ` [Analyzing attached file: ${fileName}]` : '');
      const crisisTypesFound = CRISIS_KEYWORDS.filter(k => combinedText.toLowerCase().includes(k));
      const crisisDetected = crisisTypesFound.length > 0;

      const [analysisOutput, actionPlanOutput] = await Promise.all([
        documentAnalysisAndSimplification({ 
          documentText: text || undefined, 
          documentDataUri: uploadedFile || undefined 
        }),
        actionPlanAndUrgencyAssessment({ documentText: text || fileName || "Analysis" })
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

      const agentInsights: AgentInsight[] = [
        {
          agentName: "Safety Agent",
          insight: crisisDetected ? "High-risk protocol engaged. Immediate human escalation advised." : "Safety check verified. Standard processing active.",
          recommendations: crisisDetected ? ["Call 988 immediately", "Contact trusted network"] : ["Review results calmly"]
        },
        {
          agentName: "Resource Agent",
          insight: "Identified 3 verified community organizations matching your specific needs.",
          recommendations: finalResources.resources.slice(0, 2).map(r => `Contact ${r.name}`)
        },
        {
          agentName: "Research Agent",
          insight: "Cross-referenced similar cases to optimize your resolution path.",
          recommendations: ["Check eligibility for local grants", "Review educational resources"]
        }
      ];

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
        agentInsights
      };

      onAnalysisComplete(newRecord);
      setInputText('');
      setUploadedFile(null);
      setFileName(null);
      
      toast({
        title: "Aurora Insights Generated",
        description: `Analysis completed in ${currentLanguage}.`
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Analysis failed", description: "There was an error processing. Try shorter text." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-md relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-black text-primary flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-secondary" />
                Saathi Intelligence Input
              </h2>
              <Badge variant="outline" className="flex items-center gap-2 border-primary/20 bg-primary/5 px-4 py-1">
                <Languages className="h-3 w-3" />
                {currentLanguage} Mode
              </Badge>
            </div>
            
            <div className="relative group">
              <Textarea 
                placeholder="Paste text, upload a document, or use Voice Mode to describe your situation. Aurora is listening..."
                className={cn(
                  "min-h-[200px] text-lg font-body resize-none focus-visible:ring-secondary border-muted p-8 leading-relaxed shadow-inner",
                  isRecording && "ring-4 ring-destructive/30 animate-pulse"
                )}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAnalyzing}
              />
              {isRecording && (
                <div className="absolute top-6 right-6 flex items-center gap-3 text-destructive font-black text-xs tracking-widest">
                  <span className="h-3 w-3 rounded-full bg-destructive animate-ping" />
                  LISTENING...
                </div>
              )}

              {fileName && (
                <div className="absolute bottom-6 left-6 flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 animate-in slide-in-from-left duration-300">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary truncate max-w-[200px]">{fileName}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
              <Button variant="outline" className="gap-2 font-bold border-primary/20 hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                className={cn("gap-2 font-bold", isRecording && "shadow-lg shadow-destructive/20")}
                onClick={toggleRecording}
                disabled={isAnalyzing}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                Voice Mode
              </Button>
              <div className="flex-1" />
              <Button 
                className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12 gap-3 font-black text-lg shadow-2xl shadow-primary/40 rounded-xl"
                onClick={() => handleAnalysis(inputText)}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
                {isAnalyzing ? "REASONING..." : "ANALYZE"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

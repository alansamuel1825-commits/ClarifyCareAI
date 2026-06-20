
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  Camera, 
  Mic, 
  MicOff,
  Search,
  Loader2,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  documentAnalysisAndSimplification 
} from '@/ai/flows/document-analysis-and-simplification';
import { 
  actionPlanAndUrgencyAssessment 
} from '@/ai/flows/action-plan-and-urgency-assessment';
import { 
  recommendResources 
} from '@/ai/flows/resource-recommendation-flow';
import { AnalysisRecord } from '@/lib/types';

interface DocumentProcessorProps {
  onAnalysisComplete: (record: AnalysisRecord) => void;
}

export function DocumentProcessor({ onAnalysisComplete }: DocumentProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAnalysis = async (text: string) => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter or upload document text to proceed."
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Step 1: Basic Analysis
      const analysisOutput = await documentAnalysisAndSimplification({ documentText: text });
      
      // Step 2: Action Plan & Urgency
      const actionPlanOutput = await actionPlanAndUrgencyAssessment({ documentText: text });
      
      // Step 3: Resources
      const resourcesOutput = await recommendResources({
        documentClassification: "Mixed Support Document",
        keyPoints: analysisOutput.keyPoints.join(", "),
        urgency: actionPlanOutput.urgency,
      });

      const newRecord: AnalysisRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalText: text,
        analysis: analysisOutput,
        actionPlan: actionPlanOutput,
        resources: resourcesOutput,
        completedSteps: []
      };

      onAnalysisComplete(newRecord);
      setInputText('');
      toast({
        title: "Analysis complete",
        description: "We've simplified your document and created an action plan."
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Something went wrong while processing your document. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      // In a real production app, we would use OCR or PDF parsing.
      // For this demo, we'll simulate reading text from the file name and type.
      const reader = new FileReader();
      reader.onload = (event) => {
        // Mocking content for demo purposes since we don't have a backend OCR server here
        const mockContent = `Document: ${file.name}\nSize: ${Math.round(file.size / 1024)}KB\nType: ${file.type}\n\n[Simulated extraction of document content...]`;
        setInputText(mockContent);
        toast({ title: "File uploaded", description: "Analyzing content from " + file.name });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Unsupported file",
        description: "Please upload a PDF or an image."
      });
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsRecording(true);
        // Use standard Web Speech API (simplified for demo)
        toast({ title: "Voice input active", description: "Start speaking now..." });
        setTimeout(() => {
            setIsRecording(false);
            setInputText(prev => prev + " (Simulated voice input text about a school notice request)");
        }, 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Not supported",
          description: "Voice recognition is not supported in your browser."
        });
      }
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-headline font-semibold text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyze New Document
              </h2>
            </div>
            
            <Textarea 
              placeholder="Paste text here, or use the tools below to upload/scan..."
              className="min-h-[200px] text-base font-body resize-none focus-visible:ring-secondary border-muted"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAnalyzing}
            />

            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf,image/*" 
                onChange={handleFileUpload}
              />
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()} // Simulating camera scan
                disabled={isAnalyzing}
              >
                <Camera className="h-4 w-4" />
                Scan
              </Button>

              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="sm" 
                className="gap-2"
                onClick={toggleRecording}
                disabled={isAnalyzing}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? "Stop" : "Voice"}
              </Button>

              <div className="flex-1" />

              <Button 
                className="bg-primary hover:bg-primary/90 text-white min-w-[140px] gap-2 font-headline"
                onClick={() => handleAnalysis(inputText)}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Clarify Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          { title: "Smart Scanning", desc: "PDF, Images, Camera" },
          { title: "Plain Language", desc: "No more jargon" },
          { title: "Action Plans", desc: "Step-by-step guidance" }
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-lg bg-white/50 border border-muted">
            <h3 className="font-headline font-semibold text-primary text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

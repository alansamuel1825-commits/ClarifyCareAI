
"use client";

import React, { useState } from 'react';
import { AnalysisRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertCircle, 
  Calendar, 
  ListChecks, 
  LifeBuoy, 
  Volume2,
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  record: AnalysisRecord;
  onUpdateRecord: (record: AnalysisRecord) => void;
  voiceActive?: boolean;
}

export function AnalysisResults({ record, onUpdateRecord, voiceActive }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'actions' | 'resources'>('summary');

  const urgencyColors = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    High: "bg-red-100 text-red-800 border-red-200"
  };

  const handleToggleStep = (step: string) => {
    const isCompleted = record.completedSteps.includes(step);
    const updatedSteps = isCompleted 
      ? record.completedSteps.filter(s => s !== step)
      : [...record.completedSteps, step];
    
    onUpdateRecord({ ...record, completedSteps: updatedSteps });
  };

  const speakText = (text: string) => {
    if (!voiceActive) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            Analysis Report
            <Badge variant="outline" className={cn("ml-2", urgencyColors[record.actionPlan.urgency])}>
              {record.actionPlan.urgency} Urgency
            </Badge>
          </h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            Processed on {new Date(record.timestamp).toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          {voiceActive && (
            <Button variant="outline" size="sm" onClick={() => speakText(record.analysis.plainLanguageSummary)}>
              <Volume2 className="h-4 w-4 mr-2" />
              Listen
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & Urgency */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Plain Talk Summary
              </CardTitle>
              <CardDescription>We've simplified the complex language for you</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed font-body text-foreground/90">
                {record.analysis.plainLanguageSummary}
              </p>
              
              <div className="mt-8 space-y-3">
                <h4 className="font-headline font-bold text-sm text-muted-foreground uppercase tracking-wider">Key Points</h4>
                <ul className="space-y-3">
                  {record.analysis.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 group">
                      <div className="mt-1 h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <ArrowRight className="h-3 w-3 text-secondary" />
                      </div>
                      <span className="text-base text-foreground/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-amber-50/50 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Urgency & Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                <p className="font-body text-amber-900 font-medium">{record.actionPlan.urgencyExplanation}</p>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">What if I do nothing?</h4>
                <p className="text-foreground/80 italic">{record.actionPlan.consequencesOfInaction}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions & Resources */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-secondary" />
                Your Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {record.actionPlan.actionPlan.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors">
                    <Checkbox 
                      id={`action-${i}`} 
                      checked={record.completedSteps.includes(action)}
                      onCheckedChange={() => handleToggleStep(action)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor={`action-${i}`}
                      className={cn(
                        "text-sm font-body cursor-pointer select-none",
                        record.completedSteps.includes(action) && "line-through text-muted-foreground"
                      )}
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>

              {record.actionPlan.deadlines.length > 0 && (
                <div className="mt-8 pt-6 border-t border-muted">
                  <h4 className="font-headline font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Deadlines
                  </h4>
                  <div className="space-y-3">
                    {record.actionPlan.deadlines.map((deadline, i) => (
                      <div key={i} className="flex flex-col p-3 rounded-lg border border-red-100 bg-red-50/30">
                        <span className="text-xs font-bold text-red-600 uppercase mb-1">{deadline.date}</span>
                        <span className="text-sm font-medium">{deadline.task}</span>
                        <Badge variant="outline" className="mt-2 w-fit text-[10px] py-0">{deadline.importance}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                Support Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {record.resources.resources.map((res, i) => (
                <div key={i} className="p-3 rounded-lg border border-muted hover:border-secondary transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-headline font-bold text-primary text-sm">{res.name}</h5>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{res.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] py-0">{res.type}</Badge>
                    <span className="text-[10px] font-medium text-secondary truncate">{res.contactInfo}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confidence & Source Info Footer */}
      <div className="bg-white/50 border border-muted p-4 rounded-xl flex items-center gap-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 text-secondary" />
        <p>
          <strong>ClarifyCare AI Confidence: High.</strong> Our system analyzed your document using secure AI. We recommend verifying critical dates with the official provider listed in the source document.
        </p>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from 'react';
import { AnalysisRecord, AccessibilitySettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Calendar, 
  ListChecks, 
  LifeBuoy, 
  Volume2,
  VolumeX,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Sparkles,
  Bot,
  BrainCircuit,
  Zap,
  Globe,
  Share2,
  Printer,
  CalendarCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  record: AnalysisRecord;
  onUpdateRecord: (record: AnalysisRecord) => void;
  accessibility: AccessibilitySettings;
}

export function AnalysisResults({ record, onUpdateRecord, accessibility }: AnalysisResultsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const { toast } = useToast();

  const progressValue = record.actionPlan.actionPlan.length > 0 
    ? Math.round((record.completedSteps.length / record.actionPlan.actionPlan.length) * 100)
    : 0;

  const handleToggleStep = (step: string) => {
    const isCompleted = record.completedSteps.includes(step);
    const updatedSteps = isCompleted 
      ? record.completedSteps.filter(s => s !== step)
      : [...record.completedSteps, step];
    
    onUpdateRecord({ ...record, completedSteps: updatedSteps });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${record.analysis.plainLanguageSummary}. Recommendations: ${record.actionPlan.actionPlan.join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const langMap: Record<string, string> = {
        'English': 'en-US', 'Tamil': 'ta-IN', 'Hindi': 'hi-IN', 'Spanish': 'es-ES', 'French': 'fr-FR'
      };
      utterance.lang = langMap[record.language] || 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSyncToCalendar = () => {
    toast({
      title: "Syncing Actions...",
      description: "Saathi is integrating these deadlines into your planetary calendar.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-primary/5 p-8 rounded-3xl border border-primary/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Aurora Navigator</h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={record.actionPlan.urgency === 'High' ? 'destructive' : 'secondary'} className="font-black uppercase text-[10px]">
                {record.actionPlan.urgency} Urgency
              </Badge>
              <Badge variant="outline" className="border-secondary text-secondary font-black text-[10px]">
                {record.confidenceScore}% CONFIDENCE
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={isSpeaking ? "destructive" : "secondary"} className="gap-2 font-black shadow-lg" onClick={toggleSpeech}>
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? "STOP" : "LISTEN"}
          </Button>
          <Button variant="outline" className="font-bold" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            EXPORT
          </Button>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-inner rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10"><Zap className="h-6 w-6 text-primary" /></div>
              <h3 className="text-xl font-headline font-black text-primary">Progress Hub</h3>
            </div>
            <span className="text-4xl font-black text-primary">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-4 bg-primary/10 rounded-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
            <CardHeader className="border-b bg-card p-6">
              <CardTitle className="flex items-center gap-3 text-primary text-lg font-black uppercase tracking-widest">
                <FileText className="h-5 w-5" /> Plain Talk Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-2xl leading-relaxed text-foreground/90 font-medium">{record.analysis.plainLanguageSummary}</p>
              
              {record.agentInsights && record.agentInsights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t">
                  {record.agentInsights.map((agent, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{agent.agentName}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{agent.insight}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Key Insights
                  </h4>
                  <ul className="space-y-3">
                    {record.analysis.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                        <span className="text-muted-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Risk & Impact
                  </h4>
                  <p className="text-sm italic text-amber-900 dark:text-amber-200 font-medium">{record.actionPlan.consequencesOfInaction}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-none overflow-hidden rounded-3xl">
            <CardHeader className="bg-secondary/10 border-b p-6">
              <CardTitle className="flex items-center gap-3 text-secondary text-lg font-black uppercase tracking-widest">
                <LifeBuoy className="h-6 w-6" /> Support Network
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.resources.resources.map((res, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-secondary hover:shadow-lg transition-all flex flex-col">
                    <Badge variant="outline" className="text-[8px] tracking-widest font-black uppercase w-fit mb-3">{res.type}</Badge>
                    <h5 className="font-black text-lg text-primary mb-2">{res.name}</h5>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{res.description}</p>
                    <Button variant="link" className="p-0 h-auto text-xs font-black text-secondary mt-auto" onClick={() => window.open(`tel:${res.contactInfo}`, '_self')}>
                      <Phone className="h-4 w-4 mr-2" /> {res.contactInfo}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-2xl border-none sticky top-24 overflow-hidden rounded-3xl">
            <CardHeader className="bg-primary p-6 text-white">
              <CardTitle className="flex items-center justify-between text-lg font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <ListChecks className="h-6 w-6" /> Action Protocol
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleSyncToCalendar}>
                  <CalendarCheck className="h-5 w-5" />
                </Button>
              </CardTitle>
              <CardDescription className="text-primary-foreground/70 text-[9px] font-black uppercase mt-1">Specialized Planning Agent active</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8 bg-card">
              <div className="space-y-3">
                {record.actionPlan.actionPlan.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border transition-all",
                    record.completedSteps.includes(step) ? "bg-muted/50 border-muted opacity-60" : "bg-card border-border shadow-sm"
                  )}>
                    <Checkbox id={`step-${i}`} checked={record.completedSteps.includes(step)} onCheckedChange={() => handleToggleStep(step)} className="mt-1 h-5 w-5 border-primary" />
                    <label htmlFor={`step-${i}`} className={cn("text-sm font-bold leading-tight cursor-pointer", record.completedSteps.includes(step) && "line-through text-muted-foreground")}>
                      {step}
                    </label>
                  </div>
                ))}
              </div>

              {record.actionPlan.deadlines.length > 0 && (
                <div className="pt-6 border-t space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Timelines
                  </h4>
                  {record.actionPlan.deadlines.map((d, i) => (
                    <div key={i} className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                      <div className="font-black text-destructive text-xs mb-1">{d.date}</div>
                      <div className="text-xs font-bold text-foreground">{d.task}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-6 border-t text-center space-y-4">
                {!showFollowUp ? (
                  <Button variant="outline" className="w-full h-12 font-black rounded-xl border-primary/20 text-primary" onClick={() => setShowFollowUp(true)}>
                    OPEN FOLLOW-UP HUB
                  </Button>
                ) : (
                  <div className="space-y-4 p-6 rounded-2xl bg-primary/5 border border-primary/20 animate-in slide-in-from-right duration-500">
                    <p className="text-sm font-black text-primary uppercase">Resolution Check-In</p>
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">"Are you navigating the actions effectively? Aurora is ready to refine your path."</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" className="h-10 font-black text-[10px] uppercase rounded-lg">I've completed Phase 1</Button>
                      <Button variant="ghost" size="sm" className="font-bold text-[9px] text-muted-foreground uppercase" onClick={() => setShowFollowUp(false)}>Minimize</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

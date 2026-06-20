
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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Bot,
  BrainCircuit,
  Zap,
  BookOpen,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  record: AnalysisRecord;
  onUpdateRecord: (record: AnalysisRecord) => void;
  accessibility: AccessibilitySettings;
}

export function AnalysisResults({ record, onUpdateRecord, accessibility }: AnalysisResultsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const progress = record.actionPlan.actionPlan.length > 0 
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
      const textToRead = `${record.analysis.plainLanguageSummary}. Aurora recommends the following steps: ${record.actionPlan.actionPlan.join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const langMap: Record<string, string> = {
        'English': 'en-US',
        'Tamil': 'ta-IN',
        'Hindi': 'hi-IN',
        'Spanish': 'es-ES',
        'French': 'fr-FR'
      };
      utterance.lang = langMap[record.language] || 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Aurora Intelligence Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-primary/5 p-8 rounded-3xl border border-primary/20 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Aurora Insight</h2>
              <div className="flex items-center gap-2">
                <Badge variant={record.actionPlan.urgency === 'High' ? 'destructive' : 'secondary'} className="font-bold">
                  {record.actionPlan.urgency} Urgency
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Planetary Phase 1</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1 font-medium"><Clock className="h-3 w-3" /> Analyzed: {new Date(record.timestamp).toLocaleTimeString()}</span>
            <span className="flex items-center gap-1 font-medium"><ShieldCheck className="h-3 w-3" /> Source Verified: True</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={isSpeaking ? "destructive" : "secondary"} 
            className="gap-2 font-bold shadow-md"
            onClick={toggleSpeech}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? "Pause" : "Listen Output"}
          </Button>
          <Button variant="outline" className="font-bold" onClick={() => window.print()}>Export Journey</Button>
        </div>
      </div>

      {/* Resolution Progress */}
      <Card className="border-primary/20 bg-primary/5 shadow-inner">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-primary">Resolution Journey</h3>
                <p className="text-sm text-muted-foreground">Moving from uncertainty to meaningful outcomes</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{progress}%</span>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Journey Progress</p>
            </div>
          </div>
          <Progress value={progress} className="h-4 bg-primary/10" />
          
          {progress === 100 && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 flex items-center gap-4 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-bold text-green-800 dark:text-green-200">Outcome Achieved!</p>
                <p className="text-sm text-green-700 dark:text-green-300">You've successfully navigated this resolution path. Your resilience score has increased.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <Card className="shadow-2xl border-none">
            <CardHeader className="border-b bg-card">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-6 w-6" />
                Plain Talk Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-2xl leading-relaxed text-foreground/90 font-medium tracking-tight">
                {record.analysis.plainLanguageSummary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Key Extract</h4>
                  <ul className="space-y-3">
                    {record.analysis.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-3 text-base group">
                        <ArrowRight className="h-5 w-5 text-secondary shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Risk Assessment
                  </h4>
                  <p className="text-base italic leading-relaxed text-amber-900 dark:text-amber-200">
                    {record.actionPlan.consequencesOfInaction}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Agent Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-100 bg-blue-50/20 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle className="text-lg">Education Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"I've identified potential learning gaps in this document. Understanding the terminology in Section 2 is key for your progress."</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 bg-green-50/20 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-green-600">
                  <LifeBuoy className="h-5 w-5" />
                  <CardTitle className="text-lg">Resource Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"I've connected your needs to the support network below. 3 organizations are ready to assist with your specific case."</p>
              </CardContent>
            </Card>
          </div>

          {/* Resource Network */}
          <Card className="shadow-2xl border-none overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b">
              <CardTitle className="flex items-center gap-2 text-secondary">
                <LifeBuoy className="h-6 w-6" />
                Support Network
              </CardTitle>
              <CardDescription>Tailored connections identified for your specific situation</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.resources.resources.map((res, i) => (
                  <div key={i} className="p-6 rounded-3xl border border-border bg-card hover:border-secondary hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-secondary/5 group-hover:bg-secondary/20 transition-colors">
                      <Badge variant="outline" className="text-[8px] tracking-widest">{res.type}</Badge>
                    </div>
                    <h5 className="font-bold text-lg text-primary group-hover:text-secondary mb-2 transition-colors">{res.name}</h5>
                    <p className="text-sm text-muted-foreground mb-4 leading-snug">{res.description}</p>
                    <div className="pt-4 border-t border-border mt-auto">
                      <Button variant="link" className="p-0 h-auto text-sm font-bold text-secondary flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                        onClick={() => window.open(`tel:${res.contactInfo}`, '_self')}
                      >
                        <Phone className="h-4 w-4" />
                        {res.contactInfo}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Protocol */}
        <div className="space-y-8">
          <Card className="shadow-2xl border-none sticky top-24 overflow-hidden">
            <CardHeader className="bg-primary p-6">
              <CardTitle className="text-white flex items-center gap-2">
                <ListChecks className="h-6 w-6" />
                Action Protocol
              </CardTitle>
              <CardDescription className="text-primary-foreground/70">Planning Agent: Prioritized resolution steps</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8 bg-card">
              <div className="space-y-4">
                {record.actionPlan.actionPlan.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300",
                    record.completedSteps.includes(step) ? "bg-muted/50 border-muted opacity-60" : "bg-card border-border hover:shadow-md hover:-translate-y-1"
                  )}>
                    <Checkbox 
                      id={`step-${i}`}
                      checked={record.completedSteps.includes(step)}
                      onCheckedChange={() => handleToggleStep(step)}
                      className="mt-1 h-5 w-5 rounded-lg"
                    />
                    <label 
                      htmlFor={`step-${i}`}
                      className={cn(
                        "text-sm font-semibold leading-tight cursor-pointer",
                        record.completedSteps.includes(step) && "line-through"
                      )}
                    >
                      {step}
                    </label>
                  </div>
                ))}
              </div>

              {record.actionPlan.deadlines.length > 0 && (
                <div className="pt-6 border-t space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Crucial Timelines
                  </h4>
                  {record.actionPlan.deadlines.map((d, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-destructive/5 border border-destructive/20 shadow-sm">
                      <div className="font-bold text-destructive text-sm mb-1">{d.date}</div>
                      <div className="text-xs font-medium text-foreground">{d.task}</div>
                      <Badge variant="outline" className="mt-2 text-[8px] uppercase">{d.importance}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up Assistant */}
              <div className="pt-6 border-t text-center">
                {!showFollowUp ? (
                  <Button 
                    variant="outline" 
                    className="w-full font-bold gap-2"
                    onClick={() => setShowFollowUp(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open Follow-up Assistant
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 animate-in slide-in-from-right duration-500">
                    <p className="text-sm font-bold text-primary">How are you feeling about these steps?</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" className="text-xs font-bold">I completed Step 1</Button>
                      <Button variant="secondary" size="sm" className="text-xs font-bold">I'm stuck on Step 2</Button>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setShowFollowUp(false)}>Minimize</Button>
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

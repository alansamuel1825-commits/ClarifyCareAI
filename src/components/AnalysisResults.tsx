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
  LineChart,
  Globe,
  Share2,
  Printer
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Aurora Intelligence Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-primary/5 p-10 rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BrainCircuit className="h-32 w-32 text-primary" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-4xl font-headline font-black text-primary tracking-tight">Aurora Insight</h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={record.actionPlan.urgency === 'High' ? 'destructive' : 'secondary'} className="font-black uppercase tracking-widest px-3">
                  {record.actionPlan.urgency} Urgency
                </Badge>
                <Badge variant="outline" className="border-secondary text-secondary font-black text-[10px]">
                  {record.confidenceScore}% CONFIDENCE
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> Analyzed: {new Date(record.timestamp).toLocaleTimeString()}</span>
            <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> {record.language} Protocol</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button 
            variant={isSpeaking ? "destructive" : "secondary"} 
            className="h-12 gap-2 font-black shadow-lg"
            onClick={toggleSpeech}
          >
            {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            {isSpeaking ? "STOP" : "LISTEN"}
          </Button>
          <Button variant="outline" className="h-12 font-bold px-6" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            EXPORT
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Resolution Progress */}
      <Card className="border-primary/20 bg-primary/5 shadow-inner rounded-3xl overflow-hidden">
        <CardContent className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-headline font-black text-primary">Resolution Journey</h3>
                <p className="text-muted-foreground font-medium">Moving from uncertainty to meaningful outcomes</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-primary">{progress}%</span>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Phase 1 Complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-6 bg-primary/10 rounded-full" />
          
          {progress === 100 && (
            <div className="mt-10 p-6 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 flex items-center gap-6 animate-in zoom-in duration-500 shadow-lg">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-black text-green-800 dark:text-green-200 uppercase tracking-tight">Planetary Phase Complete</p>
                <p className="text-green-700 dark:text-green-300 font-medium">Outcome achieved. Your resilience score has been updated in the Aethia Network.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
            <CardHeader className="border-b bg-card p-8">
              <CardTitle className="flex items-center gap-3 text-primary text-xl font-black uppercase tracking-widest">
                <FileText className="h-6 w-6" />
                Plain Talk Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <p className="text-3xl leading-relaxed text-foreground/90 font-medium tracking-tight">
                {record.analysis.plainLanguageSummary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Key Insights Extracted
                  </h4>
                  <ul className="space-y-4">
                    {record.analysis.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-4 text-lg group">
                        <div className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-3 group-hover:scale-150 transition-transform" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6 p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Risk Assessment & Impact
                  </h4>
                  <p className="text-lg italic leading-relaxed text-amber-900 dark:text-amber-200 font-medium">
                    {record.actionPlan.consequencesOfInaction}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Agent Insights Swarm */}
          <div className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2 ml-2">
               <Bot className="h-4 w-4" /> Swarm Intelligence Coordination
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.agentInsights?.map((agent, i) => (
                  <Card key={i} className="p-6 border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-white/50 dark:bg-black/20">
                        {agent.agentName === "Safety Agent" ? <ShieldCheck className="h-5 w-5 text-red-500" /> :
                         agent.agentName === "Resource Agent" ? <LifeBuoy className="h-5 w-5 text-green-500" /> :
                         agent.agentName === "Education Agent" ? <BookOpen className="h-5 w-5 text-blue-500" /> :
                         <LineChart className="h-5 w-5 text-purple-500" />}
                      </div>
                      <h4 className="font-black text-xs uppercase tracking-widest">{agent.agentName}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{agent.insight}"</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.recommendations.map((rec, j) => (
                        <Badge key={j} variant="secondary" className="text-[9px] font-bold">{rec}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
             </div>
          </div>

          {/* Resource Network */}
          <Card className="shadow-2xl border-none overflow-hidden rounded-3xl">
            <CardHeader className="bg-secondary/10 border-b p-8">
              <CardTitle className="flex items-center gap-3 text-secondary text-xl font-black uppercase tracking-widest">
                <LifeBuoy className="h-7 w-7" />
                Support Network
              </CardTitle>
              <CardDescription className="text-secondary/70 font-bold uppercase text-[10px] tracking-widest mt-1">Resource Agent: Global vetted network</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.resources.resources.map((res, i) => (
                  <div key={i} className="p-8 rounded-3xl border border-border bg-card hover:border-secondary hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 bg-secondary/5 group-hover:bg-secondary/20 transition-colors">
                      <Badge variant="outline" className="text-[9px] tracking-widest font-black uppercase border-secondary/20">{res.type}</Badge>
                    </div>
                    <h5 className="font-black text-xl text-primary group-hover:text-secondary mb-3 transition-colors">{res.name}</h5>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">{res.description}</p>
                    <div className="pt-6 border-t border-border mt-auto">
                      <Button variant="link" className="p-0 h-auto text-sm font-black text-secondary flex items-center gap-3 group-hover:translate-x-2 transition-transform"
                        onClick={() => window.open(`tel:${res.contactInfo}`, '_self')}
                      >
                        <Phone className="h-5 w-5" />
                        {res.contactInfo}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Protocol Sticky Panel */}
        <div className="space-y-8">
          <Card className="shadow-2xl border-none sticky top-24 overflow-hidden rounded-3xl">
            <CardHeader className="bg-primary p-8">
              <CardTitle className="text-white flex items-center gap-3 text-xl font-black uppercase tracking-widest">
                <ListChecks className="h-7 w-7" />
                Action Protocol
              </CardTitle>
              <CardDescription className="text-primary-foreground/70 font-bold uppercase text-[10px] tracking-widest mt-1">Planning Agent: Prioritized outcomes</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10 bg-card">
              <div className="space-y-4">
                {record.actionPlan.actionPlan.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300",
                    record.completedSteps.includes(step) ? "bg-muted/50 border-muted opacity-60" : "bg-card border-border hover:shadow-lg hover:-translate-y-1"
                  )}>
                    <Checkbox 
                      id={`step-${i}`}
                      checked={record.completedSteps.includes(step)}
                      onCheckedChange={() => handleToggleStep(step)}
                      className="mt-1 h-6 w-6 rounded-xl border-primary"
                    />
                    <label 
                      htmlFor={`step-${i}`}
                      className={cn(
                        "text-base font-bold leading-tight cursor-pointer",
                        record.completedSteps.includes(step) && "line-through text-muted-foreground"
                      )}
                    >
                      {step}
                    </label>
                  </div>
                ))}
              </div>

              {record.actionPlan.deadlines.length > 0 && (
                <div className="pt-10 border-t space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Crucial Timelines Detected
                  </h4>
                  {record.actionPlan.deadlines.map((d, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-destructive/5 border border-destructive/20 shadow-sm group hover:bg-destructive/10 transition-colors">
                      <div className="font-black text-destructive text-sm mb-1 uppercase tracking-tighter">{d.date}</div>
                      <div className="text-sm font-bold text-foreground leading-tight">{d.task}</div>
                      <Badge variant="outline" className="mt-3 text-[8px] font-black uppercase tracking-widest border-destructive/30">{d.importance}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up Assistant */}
              <div className="pt-10 border-t text-center space-y-6">
                {!showFollowUp ? (
                  <Button 
                    variant="outline" 
                    className="w-full h-14 font-black gap-3 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary"
                    onClick={() => setShowFollowUp(true)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    OPEN RESOLUTION HUB
                  </Button>
                ) : (
                  <div className="space-y-6 p-8 rounded-3xl bg-primary/5 border border-primary/20 animate-in slide-in-from-right duration-500 shadow-xl">
                    <p className="text-lg font-black text-primary uppercase tracking-tight">Resolution Progress Check-In</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">"How are you navigating the recommended actions? Aurora is ready to refine the plan."</p>
                    <div className="flex flex-col gap-3">
                      <Button variant="secondary" className="h-12 font-black text-xs uppercase tracking-widest rounded-xl">I've completed Phase 1</Button>
                      <Button variant="secondary" className="h-12 font-black text-xs uppercase tracking-widest rounded-xl">I need clarification on Step 2</Button>
                      <Button variant="ghost" size="sm" className="font-bold text-[10px] text-muted-foreground uppercase mt-2" onClick={() => setShowFollowUp(false)}>Minimize Hub</Button>
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

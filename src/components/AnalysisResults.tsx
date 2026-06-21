"use client";

import React, { useState } from 'react';
import { AnalysisRecord, AccessibilitySettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  CalendarCheck,
  Send,
  Loader2,
  ArrowRightCircle,
  Clock3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/lib/translations';
import { askInteractiveAssistant } from '@/ai/flows/interactive-support-chat';

interface AnalysisResultsProps {
  record: AnalysisRecord;
  onUpdateRecord: (record: AnalysisRecord) => void;
  accessibility: AccessibilitySettings;
  historyContext?: string;
}

export function AnalysisResults({ record, onUpdateRecord, accessibility, historyContext }: AnalysisResultsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const { toast } = useToast();
  
  const t = translations[accessibility.language] || translations.English;

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

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || isAsking) return;

    const query = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    setIsAsking(true);

    try {
      const response = await askInteractiveAssistant({
        analysisContext: JSON.stringify(record),
        historyContext: historyContext,
        userQuery: query,
        targetLanguage: accessibility.language
      });
      setChatHistory(prev => [...prev, { role: 'ai', content: response.response }]);
    } catch (err) {
      toast({ variant: "destructive", title: "Assistant Error", description: "Could not reach interactive core." });
    } finally {
      setIsAsking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${record.analysis.plainLanguageSummary}. ${t.actionProtocol}: ${record.actionPlan.actionPlan.join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const langMap: Record<string, string> = {
        'English': 'en-US', 'Tamil': 'ta-IN', 'Hindi': 'hi-IN', 'Spanish': 'es-ES', 'French': 'fr-FR'
      };
      utterance.lang = langMap[accessibility.language] || 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-primary/5 p-8 rounded-3xl border border-primary/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">ClarifyCare AI</h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={record.actionPlan.urgency === 'High' ? 'destructive' : 'secondary'} className="font-black uppercase text-[10px]">
                {record.actionPlan.urgency} {t.urgency}
              </Badge>
              <Badge variant="outline" className="border-secondary text-secondary font-black text-[10px]">
                {record.confidenceScore}% {t.confScore}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={isSpeaking ? "destructive" : "secondary"} className="gap-2 font-black shadow-lg h-12 rounded-xl" onClick={toggleSpeech}>
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? t.stop : t.listenMode}
          </Button>
          <Button variant="outline" className="h-12 font-bold rounded-xl border-primary/20" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            {t.exportHub}
          </Button>
        </div>
      </div>

      {/* Progress & Milestone Hub */}
      <Card className="border-primary/20 bg-primary/5 shadow-inner rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10"><Zap className="h-6 w-6 text-primary" /></div>
              <div>
                <h3 className="text-xl font-headline font-black text-primary">{t.resolutionProgress}</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Planetary Milestone Tracker</p>
              </div>
            </div>
            <span className="text-4xl font-black text-primary">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-4 bg-primary/10 rounded-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Section */}
          <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b bg-card p-8">
              <CardTitle className="flex items-center gap-3 text-primary text-lg font-black uppercase tracking-widest">
                <FileText className="h-5 w-5" /> {t.plainTalkSummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-2xl leading-relaxed text-foreground/90 font-medium">{record.analysis.plainLanguageSummary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> {t.coreInsights}
                  </h4>
                  <ul className="space-y-3">
                    {record.analysis.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <ArrowRightCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {t.consequencesRisk}
                  </h4>
                  <p className="text-sm italic text-amber-900 dark:text-amber-200 font-medium leading-relaxed">{record.actionPlan.consequencesOfInaction}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <Card className="shadow-2xl border-none overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary/5 border-b p-8">
              <CardTitle className="flex items-center gap-3 text-primary text-lg font-black uppercase tracking-widest">
                <Clock3 className="h-6 w-6" /> {t.timeline}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {record.actionPlan.deadlines.length > 0 ? (
                <div className="space-y-4">
                  {record.actionPlan.deadlines.map((d, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-3xl border border-border bg-card group hover:border-primary transition-all">
                      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 shrink-0 min-w-[80px]">
                        <span className="text-[10px] font-black uppercase text-primary mb-1">Date</span>
                        <span className="text-sm font-black text-primary">{d.date}</span>
                      </div>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-destructive text-destructive">{d.importance}</Badge>
                        <h5 className="font-bold text-foreground text-sm leading-tight">{d.task}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground italic font-medium">
                  No explicit deadlines detected. We recommend starting resolution protocols immediately.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources Section */}
          <Card className="shadow-2xl border-none overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-secondary/10 border-b p-8">
              <CardTitle className="flex items-center gap-3 text-secondary text-lg font-black uppercase tracking-widest">
                <LifeBuoy className="h-6 w-6" /> {t.supportNetwork}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.resources.resources.map((res, i) => (
                  <div key={i} className="p-6 rounded-3xl border border-border bg-card hover:border-secondary hover:shadow-lg transition-all flex flex-col group">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[8px] tracking-widest font-black uppercase border-secondary text-secondary">{res.type}</Badge>
                    </div>
                    <h5 className="font-black text-xl text-primary mb-2 group-hover:text-secondary transition-colors">{res.name}</h5>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{res.description}</p>
                    <div className="mt-auto space-y-4">
                      <div className="p-3 rounded-xl bg-muted/30 text-[10px] font-medium text-muted-foreground italic border-l-2 border-secondary">
                        "{res.relevanceExplanation}"
                      </div>
                      <Button variant="outline" className="w-full font-black text-secondary border-secondary/20 hover:bg-secondary/5 h-10 rounded-xl" onClick={() => window.open(res.contactInfo.includes('http') ? res.contactInfo : `tel:${res.contactInfo}`, '_blank')}>
                        <Phone className="h-4 w-4 mr-2" /> Connect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Action Protocol Section */}
          <Card className="shadow-2xl border-none sticky top-24 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="flex items-center justify-between text-lg font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <ListChecks className="h-6 w-6" /> {t.actionProtocol}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 bg-card">
              <div className="space-y-3">
                {record.actionPlan.actionPlan.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all",
                    record.completedSteps.includes(step) ? "bg-muted/50 border-muted opacity-60" : "bg-card border-border shadow-sm hover:border-primary/50"
                  )}>
                    <Checkbox id={`step-${i}`} checked={record.completedSteps.includes(step)} onCheckedChange={() => handleToggleStep(step)} className="mt-1 h-6 w-6 border-primary rounded-lg" />
                    <label htmlFor={`step-${i}`} className={cn("text-sm font-bold leading-tight cursor-pointer", record.completedSteps.includes(step) && "line-through text-muted-foreground")}>
                      {step}
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t text-center space-y-4">
                {!showFollowUp ? (
                  <Button variant="outline" className="w-full h-14 font-black rounded-2xl border-primary/20 text-primary shadow-sm hover:shadow-md transition-all" onClick={() => setShowFollowUp(true)}>
                    {t.followUpBtn}
                  </Button>
                ) : (
                  <div className="space-y-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/20 animate-in zoom-in duration-500 text-left">
                    <div className="flex items-center gap-2 mb-2">
                       <Bot className="h-5 w-5 text-primary" />
                       <p className="text-sm font-black text-primary uppercase">{t.checkInTitle}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed mb-4">
                      "{t.checkInDesc}"
                    </p>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-4 scrollbar-thin">
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={cn(
                          "p-3 rounded-2xl text-xs font-medium",
                          msg.role === 'user' ? "bg-primary text-white ml-6" : "bg-muted text-foreground mr-6"
                        )}>
                          {msg.content}
                        </div>
                      ))}
                      {isAsking && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary animate-pulse uppercase">
                          <Loader2 className="h-3 w-3 animate-spin" /> {t.reasoning}
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Input 
                        placeholder={t.chatPlaceholder}
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        disabled={isAsking}
                        className="rounded-xl text-xs h-10 border-primary/20"
                      />
                      <Button type="submit" size="icon" disabled={isAsking} className="h-10 w-10 shrink-0 rounded-xl">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    
                    <Button variant="ghost" size="sm" className="w-full font-bold text-[9px] text-muted-foreground uppercase mt-2" onClick={() => setShowFollowUp(false)}>Minimize</Button>
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


"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, PhoneCall, HeartHandshake, ShieldCheck } from "lucide-react";
import { AnalysisRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function CrisisBanner({ record }: { record: AnalysisRecord }) {
  if (!record.crisisDetected) return null;

  return (
    <Alert variant="destructive" className="border-2 shadow-2xl bg-destructive/10 animate-pulse border-destructive rounded-3xl p-8">
      <AlertTriangle className="h-8 w-8" />
      <div className="ml-4 flex-1">
        <AlertTitle className="text-2xl font-black mb-3 uppercase tracking-tight">High Distress Protocols Active</AlertTitle>
        <AlertDescription className="space-y-6">
          <p className="text-lg font-medium leading-relaxed">
            Saathi Neural Shield has identified markers of {record.crisisTypes.join(", ")}. 
            <strong> You are protected.</strong> Immediate support is available to bridge the gap to safety.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <Button variant="destructive" className="h-14 px-8 font-black gap-3 rounded-2xl shadow-xl shadow-red-500/30" onClick={() => window.open('tel:988', '_self')}>
              <PhoneCall className="h-5 w-5" />
              Call 988 (USA)
            </Button>
            <Button variant="outline" className="h-14 px-8 bg-white dark:bg-zinc-900 font-black gap-3 rounded-2xl border-2" onClick={() => window.open('https://www.aasra.info/', '_blank')}>
              <HeartHandshake className="h-5 w-5" />
              Aasra Helpline (India)
            </Button>
          </div>

          <div className="mt-8 p-4 bg-white/20 rounded-2xl text-xs italic flex items-center gap-3 font-medium">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Planetary Responsibility: This detection is automated via Saathi ML. We prioritize human safety and zero-latency escalation. Your data remains protected within the Aethia encrypted layer.</span>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
}

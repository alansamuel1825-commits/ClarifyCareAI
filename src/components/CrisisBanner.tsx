
"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, PhoneCall, HeartHandshake, ShieldCheck } from "lucide-react";
import { AnalysisRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function CrisisBanner({ record }: { record: AnalysisRecord }) {
  if (!record.crisisDetected) return null;

  return (
    <Alert variant="destructive" className="border-2 shadow-2xl bg-destructive/10 animate-pulse border-destructive">
      <AlertTriangle className="h-6 w-6" />
      <div className="ml-2 flex-1">
        <AlertTitle className="text-xl font-bold mb-2">High Distress Detected</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-base">
            Our AI has identified indicators of {record.crisisTypes.join(", ")} in your input. 
            <strong> You are not alone.</strong> Support is available right now.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Button 
              variant="destructive" 
              className="font-bold gap-2"
              onClick={() => window.open('tel:988', '_self')}
            >
              <PhoneCall className="h-4 w-4" />
              Call 988 (USA)
            </Button>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-zinc-900 font-bold gap-2"
              onClick={() => window.open('https://www.aasra.info/', '_blank')}
            >
              <HeartHandshake className="h-4 w-4" />
              Aasra Helpline (India)
            </Button>
          </div>

          <div className="mt-4 p-3 bg-white/20 rounded-md text-sm italic flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Responsible AI: This detection is automated. We prioritize your safety and will never share your private data with non-emergency third parties.</span>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
}

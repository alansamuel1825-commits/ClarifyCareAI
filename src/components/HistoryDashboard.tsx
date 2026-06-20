
"use client";

import React from 'react';
import { AnalysisRecord } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Trash2, 
  ExternalLink,
  Clock,
  AlertTriangle,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HistoryDashboardProps {
  records: AnalysisRecord[];
  onSelect: (record: AnalysisRecord) => void;
  onDelete: (id: string) => void;
}

export function HistoryDashboard({ records, onSelect, onDelete }: HistoryDashboardProps) {
  if (records.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="relative w-48 h-32 mb-6 opacity-60 grayscale">
            <Image 
              src="https://picsum.photos/seed/saathi-empty/400/300" 
              alt="Empty history" 
              fill 
              className="object-contain"
              data-ai-hint="empty list"
            />
          </div>
          <h3 className="text-xl font-headline font-semibold text-primary mb-2">Safe haven empty</h3>
          <p className="text-muted-foreground max-w-sm">
            Your journey toward resolution starts here. Paste or speak your concerns above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-semibold text-primary flex items-center gap-2">
          <History className="h-5 w-5" />
          Journey History
        </h2>
        <Badge variant="outline">{records.length} Documents</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => {
          const progress = record.actionPlan.actionPlan.length > 0 
            ? Math.round((record.completedSteps.length / record.actionPlan.actionPlan.length) * 100)
            : 0;

          return (
            <Card key={record.id} className="group hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md bg-card">
              <CardContent className="p-5" onClick={() => onSelect(record)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-foreground line-clamp-1 flex items-center gap-2">
                      {record.crisisDetected && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      {record.analysis.keyPoints[0] || "Journey Analysis"}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(record.timestamp).toLocaleDateString()}
                      <span className="flex items-center gap-1"><Globe className="h-2 w-2" /> {record.language}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 italic border-l-2 pl-2 border-primary/20">
                    "{record.analysis.plainLanguageSummary}"
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Resolution Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={record.crisisDetected ? 'destructive' : 'secondary'} className="text-[9px] px-1.5 h-4">
                      {record.crisisDetected ? 'CRISIS' : record.actionPlan.urgency}
                    </Badge>
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 group-hover:underline">
                      Resume Support <ExternalLink className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

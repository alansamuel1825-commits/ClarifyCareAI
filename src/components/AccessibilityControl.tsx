
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Type, 
  Volume2, 
  VolumeX,
  Settings2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AccessibilityControlProps {
  settings: {
    highContrast: boolean;
    largeText: boolean;
    voiceSynthesis: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
}

export function AccessibilityControl({ settings, onUpdate }: AccessibilityControlProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Accessibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <DropdownMenuLabel>Personalize Your View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast
              </Label>
              <p className="text-[10px] text-muted-foreground">Easier to read text</p>
            </div>
            <Switch 
              checked={settings.highContrast} 
              onCheckedChange={(val) => onUpdate('highContrast', val)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Large Text
              </Label>
              <p className="text-[10px] text-muted-foreground">Bigger fonts</p>
            </div>
            <Switch 
              checked={settings.largeText} 
              onCheckedChange={(val) => onUpdate('largeText', val)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="flex items-center gap-2">
                {settings.voiceSynthesis ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Voice Support
              </Label>
              <p className="text-[10px] text-muted-foreground">Read text aloud</p>
            </div>
            <Switch 
              checked={settings.voiceSynthesis} 
              onCheckedChange={(val) => onUpdate('voiceSynthesis', val)} 
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

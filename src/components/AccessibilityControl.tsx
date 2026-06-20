
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Type, 
  Volume2, 
  VolumeX,
  Settings2,
  Moon,
  Sun,
  Globe
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Language } from '@/lib/types';

interface AccessibilityControlProps {
  settings: {
    highContrast: boolean;
    largeText: boolean;
    voiceSynthesis: boolean;
    darkMode: boolean;
    language: Language;
  };
  onUpdate: (key: string, value: any) => void;
}

export function AccessibilityControl({ settings, onUpdate }: AccessibilityControlProps) {
  const languages: Language[] = ['English', 'Tamil', 'Hindi', 'Spanish', 'French'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <DropdownMenuLabel>Accessibility & Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 pt-2">
          {/* Language Selector */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{settings.language}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup 
                value={settings.language} 
                onValueChange={(val) => onUpdate('language', val)}
              >
                {languages.map((lang) => (
                  <DropdownMenuRadioItem key={lang} value={lang}>
                    {lang}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Dark Mode
            </Label>
            <Switch 
              checked={settings.darkMode} 
              onCheckedChange={(val) => onUpdate('darkMode', val)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              High Contrast
            </Label>
            <Switch 
              checked={settings.highContrast} 
              onCheckedChange={(val) => onUpdate('highContrast', val)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Large Text
            </Label>
            <Switch 
              checked={settings.largeText} 
              onCheckedChange={(val) => onUpdate('largeText', val)} 
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  Users,
  User,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIRecommendation {
  is_correct_team: boolean;
  recommended_team: string;
  recommended_team_id: string;
  recommended_technician: string;
  recommended_technician_id: string;
  confidence: 'High' | 'Medium' | 'Low';
  popup_output: {
    title: string;
    summary: {
      current_team: string;
      current_technician: string;
      recommended_team: string;
      recommended_technician: string;
      confidence: string;
    };
    explanation: string[];
    workload_snapshot: string[];
    actions: {
      primary: string;
      secondary: string;
      note: string;
    };
  };
}

interface AIDispatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: AIRecommendation | null;
  isLoading: boolean;
  error: string | null;
  onApply: (teamId: string, technicianId: string) => void;
  onManualSelect: () => void;
}

const confidenceColors = {
  High: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  Low: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export function AIDispatchDialog({
  open,
  onOpenChange,
  recommendation,
  isLoading,
  error,
  onApply,
  onManualSelect,
}: AIDispatchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <span>AI Assignment Recommendation</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing request details...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-sm text-destructive text-center">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}

        {recommendation && !isLoading && !error && (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4">
              {/* Summary Section */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                  <Badge
                    variant="outline"
                    className={cn('font-medium', confidenceColors[recommendation.confidence])}
                  >
                    {recommendation.confidence}
                  </Badge>
                </div>

                {/* Current vs Recommended */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <div className="p-2 rounded-lg border border-border bg-background">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium truncate">
                          {recommendation.popup_output.summary.current_team || 'Not assigned'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {recommendation.popup_output.summary.current_technician || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground" />

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Recommended</p>
                    <div className={cn(
                      'p-2 rounded-lg border bg-background',
                      recommendation.is_correct_team
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-primary/50 bg-primary/5'
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium truncate">
                          {recommendation.recommended_team}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground truncate">
                          {recommendation.recommended_technician}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {recommendation.is_correct_team && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">
                      Current team assignment is optimal
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Explanation */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Analysis
                </h4>
                <ul className="space-y-1">
                  {recommendation.popup_output.explanation.map((reason, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Workload Snapshot */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Workload Snapshot
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {recommendation.popup_output.workload_snapshot.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  {recommendation.popup_output.actions.note}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onManualSelect}
                  >
                    {recommendation.popup_output.actions.secondary}
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => onApply(
                      recommendation.recommended_team_id,
                      recommendation.recommended_technician_id
                    )}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {recommendation.popup_output.actions.primary}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

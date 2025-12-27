import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AITeamRecommendationProps {
  equipmentName: string;
  equipmentCategory: string;
  subject: string;
  description: string;
  assignedTeam: string | null;
  onApplyRecommendation?: (teamName: string) => void;
}

interface AIAnalysis {
  is_correct_team: boolean;
  recommended_team: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
}

const confidenceColors = {
  High: 'text-success bg-success/10 border-success/20',
  Medium: 'text-warning bg-warning/10 border-warning/20',
  Low: 'text-muted-foreground bg-muted border-border',
};

export const AITeamRecommendation = ({
  equipmentName,
  equipmentCategory,
  subject,
  description,
  assignedTeam,
  onApplyRecommendation,
}: AITeamRecommendationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRequest = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-request', {
        body: {
          equipment_name: equipmentName,
          equipment_category: equipmentCategory,
          subject,
          description,
          assigned_team: assignedTeam,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyRecommendation = () => {
    if (analysis && onApplyRecommendation) {
      onApplyRecommendation(analysis.recommended_team);
      toast.success(`Team changed to ${analysis.recommended_team}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Trigger Button */}
      {!analysis && !isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={analyzeRequest}
          className="gap-2 w-full justify-center hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Analyze with AI
        </Button>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing request...</span>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
        >
          {error}
        </motion.div>
      )}

      {/* Analysis Result */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'p-4 rounded-xl border-2 space-y-3',
              analysis.is_correct_team
                ? 'bg-success/5 border-success/30'
                : 'bg-warning/5 border-warning/30'
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {analysis.is_correct_team ? (
                  <div className="p-1.5 rounded-full bg-success/20">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-full bg-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">
                    {analysis.is_correct_team ? 'Team assignment is correct' : 'Different team recommended'}
                  </p>
                  <p className="text-xs text-muted-foreground">AI Dispatcher Analysis</p>
                </div>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border',
                  confidenceColors[analysis.confidence]
                )}
              >
                {analysis.confidence}
              </span>
            </div>

            {/* Recommendation */}
            {!analysis.is_correct_team && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{assignedTeam || 'Unassigned'}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-warning">{analysis.recommended_team}</span>
              </div>
            )}

            {/* Reason */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.reason}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              {!analysis.is_correct_team && onApplyRecommendation && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleApplyRecommendation}
                  className="gap-2"
                >
                  Apply Recommendation
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAnalysis(null)}
                className="text-muted-foreground"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

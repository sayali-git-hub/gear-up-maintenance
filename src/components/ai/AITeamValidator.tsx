import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MaintenanceRequest, getEquipmentById, getTeamById, maintenanceTeams } from '@/lib/data';
import { Bot, CheckCircle, AlertTriangle, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';

interface AIValidationResult {
  is_correct_team: boolean;
  recommended_team: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
}

interface AITeamValidatorProps {
  request: MaintenanceRequest;
}

export const AITeamValidator = ({ request }: AITeamValidatorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [result, setResult] = useState<AIValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { updateEquipment, teams } = useData();

  const equipment = getEquipmentById(request.equipmentId);
  const team = equipment ? getTeamById(equipment.maintenanceTeamId) : null;

  const analyzeRequest = async () => {
    if (!equipment || !team) {
      toast.error('Missing equipment or team information');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-request', {
        body: {
          equipment_name: equipment.name,
          equipment_category: equipment.department,
          subject: request.subject,
          description: request.description,
          assigned_team: team.name,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as AIValidationResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze request';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassignTeam = () => {
    if (!result || !equipment) return;
    
    // Find the recommended team by name
    const newTeam = teams.find(t => t.name === result.recommended_team);
    
    if (!newTeam) {
      toast.error(`Team "${result.recommended_team}" not found`);
      return;
    }

    setIsReassigning(true);
    
    // Update the equipment's maintenance team
    updateEquipment(equipment.id, { 
      maintenanceTeamId: newTeam.id,
      defaultTechnicianId: newTeam.technicians[0]?.id || ''
    });
    
    toast.success(`Team reassigned to ${result.recommended_team}`);
    setResult(null);
    setIsReassigning(false);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'text-emerald-600 bg-emerald-500/10';
      case 'Medium':
        return 'text-amber-600 bg-amber-500/10';
      case 'Low':
        return 'text-red-600 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          AI Team Validator
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={analyzeRequest}
          disabled={isLoading || !equipment || !team}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Validate
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-4 rounded-lg border',
              result.is_correct_team 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-amber-500/5 border-amber-500/20'
            )}
          >
            <div className="flex items-start gap-3">
              {result.is_correct_team ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'font-medium',
                    result.is_correct_team ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                  )}>
                    {result.is_correct_team 
                      ? 'Correct Team Assignment' 
                      : 'Team Reassignment Suggested'
                    }
                  </p>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    getConfidenceColor(result.confidence)
                  )}>
                    {result.confidence} Confidence
                  </span>
                </div>
                
                {!result.is_correct_team && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Recommended: </span>
                    <span className="font-medium">{result.recommended_team}</span>
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground">
                  {result.reason}
                </p>

                {!result.is_correct_team && (
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={handleReassignTeam}
                      disabled={isReassigning}
                      className="gap-2"
                    >
                      {isReassigning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Reassigning...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Reassign to {result.recommended_team}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border bg-destructive/5 border-destructive/20"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {!result && !error && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center py-2"
          >
            Click "Validate" to check if the team assignment is optimal
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

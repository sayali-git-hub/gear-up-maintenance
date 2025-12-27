import { useState, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { MaintenanceRequest, getEquipmentById, getTeamById, getTechnicianById } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export function useAIDispatch() {
  const { requests, teams, equipment } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const getActiveTaskCount = useCallback((technicianId: string) => {
    return requests.filter(
      r => r.assignedTechnicianId === technicianId && 
      (r.status === 'new' || r.status === 'in_progress')
    ).length;
  }, [requests]);

  const fetchRecommendation = useCallback(async (request: MaintenanceRequest) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const equipmentItem = equipment.find(e => e.id === request.equipmentId);
      const currentTeam = equipmentItem ? teams.find(t => t.id === equipmentItem.maintenanceTeamId) : null;
      const currentTechnician = request.assignedTechnicianId 
        ? getTechnicianById(request.assignedTechnicianId)
        : null;

      // Build technician workload data
      const techniciansWorkload = teams.flatMap(team =>
        team.technicians.map(tech => ({
          id: tech.id,
          name: tech.name,
          teamId: team.id,
          teamName: team.name,
          activeTasks: getActiveTaskCount(tech.id),
        }))
      );

      const teamsData = teams.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
      }));

      const { data, error: funcError } = await supabase.functions.invoke('ai-dispatch', {
        body: {
          equipmentName: equipmentItem?.name || 'Unknown Equipment',
          equipmentCategory: equipmentItem?.department || 'General',
          subject: request.subject,
          description: request.description,
          assignedTeam: currentTeam?.name || '',
          assignedTechnician: currentTechnician?.name || '',
          techniciansWorkload,
          teams: teamsData,
        },
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to get AI recommendation');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendation(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('AI Dispatch Error', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [equipment, teams, getActiveTaskCount]);

  const clearRecommendation = useCallback(() => {
    setRecommendation(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    recommendation,
    fetchRecommendation,
    clearRecommendation,
  };
}

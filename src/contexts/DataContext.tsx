import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  MaintenanceRequest,
  Equipment,
  MaintenanceTeam,
  maintenanceRequests as initialRequests,
  equipment as initialEquipment,
  maintenanceTeams as initialTeams,
  MaintenanceStatus,
} from '@/lib/data';

interface DataContextType {
  requests: MaintenanceRequest[];
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  updateRequestStatus: (requestId: string, newStatus: MaintenanceStatus) => void;
  updateRequest: (requestId: string, updates: Partial<MaintenanceRequest>) => void;
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => void;
  updateEquipmentStatus: (equipmentId: string, status: Equipment['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [teams] = useState<MaintenanceTeam[]>(initialTeams);

  const updateRequestStatus = (requestId: string, newStatus: MaintenanceStatus) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const updated = { ...req, status: newStatus };
          
          // If moved to scrap, mark equipment as scrapped
          if (newStatus === 'scrap') {
            updateEquipmentStatus(req.equipmentId, 'scrapped');
          }
          
          return updated;
        }
        return req;
      })
    );
  };

  const updateRequest = (requestId: string, updates: Partial<MaintenanceRequest>) => {
    setRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, ...updates } : req))
    );
  };

  const addRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateEquipmentStatus = (equipmentId: string, status: Equipment['status']) => {
    setEquipment(prev =>
      prev.map(eq => (eq.id === equipmentId ? { ...eq, status } : eq))
    );
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        equipment,
        teams,
        updateRequestStatus,
        updateRequest,
        addRequest,
        updateEquipmentStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

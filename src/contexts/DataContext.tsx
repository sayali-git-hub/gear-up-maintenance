import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  MaintenanceRequest,
  Equipment,
  MaintenanceTeam,
  Technician,
  maintenanceRequests as initialRequests,
  equipment as initialEquipment,
  maintenanceTeams as initialTeams,
  MaintenanceStatus,
} from '@/lib/data';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  teamId: string;
  phone: string;
}

interface DataContextType {
  requests: MaintenanceRequest[];
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  userProfile: UserProfile;
  updateRequestStatus: (requestId: string, newStatus: MaintenanceStatus) => void;
  updateRequest: (requestId: string, updates: Partial<MaintenanceRequest>) => void;
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => void;
  updateEquipmentStatus: (equipmentId: string, status: Equipment['status']) => void;
  updateEquipment: (equipmentId: string, updates: Partial<Equipment>) => void;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  addTeam: (team: Omit<MaintenanceTeam, 'id'> & { technicians: Omit<Technician, 'teamId'>[] }) => void;
  addTechnicianToTeam: (teamId: string, technician: { name: string; email?: string }) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialUserProfile: UserProfile = {
  name: 'Admin User',
  email: 'admin@gearguard.io',
  role: 'admin',
  teamId: '',
  phone: '+1 234 567 8900',
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [teams, setTeams] = useState<MaintenanceTeam[]>(initialTeams);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

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

  const updateEquipment = (equipmentId: string, updates: Partial<Equipment>) => {
    setEquipment(prev =>
      prev.map(eq => (eq.id === equipmentId ? { ...eq, ...updates } : eq))
    );
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipmentEntry: Equipment = {
      ...newEquipment,
      id: `eq-${Date.now()}`,
    };
    setEquipment(prev => [...prev, equipmentEntry]);
  };

  const addTeam = (newTeam: Omit<MaintenanceTeam, 'id'> & { technicians: Omit<Technician, 'teamId'>[] }) => {
    const teamId = `team-${Date.now()}`;
    const teamEntry: MaintenanceTeam = {
      id: teamId,
      name: newTeam.name,
      description: newTeam.description,
      color: newTeam.color,
      technicians: newTeam.technicians.map((tech, index) => ({
        ...tech,
        id: `tech-${Date.now()}-${index}`,
        teamId: teamId,
      })),
    };
    setTeams(prev => [...prev, teamEntry]);
  };

  const addTechnicianToTeam = (teamId: string, technician: { name: string; email?: string }) => {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const newTechnician: Technician = {
            id: `tech-${Date.now()}`,
            name: technician.name,
            email: technician.email || '',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(technician.name)}`,
            teamId: teamId,
          };
          return {
            ...team,
            technicians: [...team.technicians, newTechnician],
          };
        }
        return team;
      })
    );
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        equipment,
        teams,
        userProfile,
        updateRequestStatus,
        updateRequest,
        addRequest,
        updateEquipmentStatus,
        updateEquipment,
        addEquipment,
        addTeam,
        addTechnicianToTeam,
        updateUserProfile,
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

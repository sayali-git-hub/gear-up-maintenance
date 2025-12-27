// Types
export type MaintenanceStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type MaintenanceType = 'corrective' | 'preventive';

export interface Technician {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teamId: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string;
  color: string;
  technicians: Technician[];
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  owner: string;
  location: string;
  purchaseDate: string;
  warrantyExpiry: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
  status: 'active' | 'maintenance' | 'scrapped';
  image: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  equipmentId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: string;
  duration: number; // in hours
  teamId: string | null;
  assignedTechnicianId: string | null;
  timeSpent: number; // in hours
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

// Dummy Data
export const maintenanceTeams: MaintenanceTeam[] = [
  {
    id: 'team-1',
    name: 'Mechanics',
    description: 'Heavy machinery and mechanical systems',
    color: '#3B82F6',
    technicians: [
      { id: 'tech-1', name: 'John Carter', email: 'john@gearguard.io', avatar: '', teamId: 'team-1' },
      { id: 'tech-2', name: 'Sarah Miller', email: 'sarah@gearguard.io', avatar: '', teamId: 'team-1' },
    ],
  },
  {
    id: 'team-2',
    name: 'Electricians',
    description: 'Electrical systems and wiring',
    color: '#F59E0B',
    technicians: [
      { id: 'tech-3', name: 'Mike Chen', email: 'mike@gearguard.io', avatar: '', teamId: 'team-2' },
      { id: 'tech-4', name: 'Emma Wilson', email: 'emma@gearguard.io', avatar: '', teamId: 'team-2' },
    ],
  },
  {
    id: 'team-3',
    name: 'IT Support',
    description: 'Computing and network equipment',
    color: '#10B981',
    technicians: [
      { id: 'tech-5', name: 'Alex Johnson', email: 'alex@gearguard.io', avatar: '', teamId: 'team-3' },
      { id: 'tech-6', name: 'Lisa Park', email: 'lisa@gearguard.io', avatar: '', teamId: 'team-3' },
    ],
  },
  {
    id: 'team-4',
    name: 'HVAC Specialists',
    description: 'Heating, ventilation, and air conditioning',
    color: '#8B5CF6',
    technicians: [
      { id: 'tech-7', name: 'David Brown', email: 'david@gearguard.io', avatar: '', teamId: 'team-4' },
    ],
  },
  {
    id: 'team-5',
    name: 'Housekeeping & Sanitation',
    description: 'Cleaning equipment and waste management systems',
    color: '#EC4899',
    technicians: [
      { id: 'tech-8', name: 'Maria Garcia', email: 'maria@gearguard.io', avatar: '', teamId: 'team-5' },
      { id: 'tech-9', name: 'James Thompson', email: 'james@gearguard.io', avatar: '', teamId: 'team-5' },
    ],
  },
  {
    id: 'team-6',
    name: 'Security Systems',
    description: 'CCTV, access control, and alarm systems',
    color: '#06B6D4',
    technicians: [
      { id: 'tech-10', name: 'Kevin Lee', email: 'kevin@gearguard.io', avatar: '', teamId: 'team-6' },
      { id: 'tech-11', name: 'Rachel Adams', email: 'rachel@gearguard.io', avatar: '', teamId: 'team-6' },
    ],
  },
];

export const equipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'CNC Milling Machine',
    serialNumber: 'CNC-2024-001',
    department: 'Manufacturing',
    owner: 'Production Team',
    location: 'Building A - Floor 2',
    purchaseDate: '2023-03-15',
    warrantyExpiry: '2026-03-15',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'tech-1',
    status: 'active',
    image: '',
  },
  {
    id: 'eq-2',
    name: 'Industrial Robot Arm',
    serialNumber: 'ROB-2024-042',
    department: 'Assembly',
    owner: 'Automation Team',
    location: 'Building A - Floor 1',
    purchaseDate: '2023-06-20',
    warrantyExpiry: '2025-06-20',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'tech-3',
    status: 'active',
    image: '',
  },
  {
    id: 'eq-3',
    name: 'Server Rack Unit #12',
    serialNumber: 'SRV-2022-012',
    department: 'IT',
    owner: 'Infrastructure Team',
    location: 'Data Center - Row 3',
    purchaseDate: '2022-01-10',
    warrantyExpiry: '2025-01-10',
    maintenanceTeamId: 'team-3',
    defaultTechnicianId: 'tech-5',
    status: 'maintenance',
    image: '',
  },
  {
    id: 'eq-4',
    name: 'Central HVAC Unit',
    serialNumber: 'HVAC-2021-001',
    department: 'Facilities',
    owner: 'Building Management',
    location: 'Rooftop - Building B',
    purchaseDate: '2021-08-05',
    warrantyExpiry: '2024-08-05',
    maintenanceTeamId: 'team-4',
    defaultTechnicianId: 'tech-7',
    status: 'active',
    image: '',
  },
  {
    id: 'eq-5',
    name: 'Hydraulic Press #3',
    serialNumber: 'HYD-2020-003',
    department: 'Manufacturing',
    owner: 'Production Team',
    location: 'Building C - Ground Floor',
    purchaseDate: '2020-11-12',
    warrantyExpiry: '2023-11-12',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'tech-2',
    status: 'active',
    image: '',
  },
  {
    id: 'eq-6',
    name: 'Laser Cutter XL',
    serialNumber: 'LAS-2024-007',
    department: 'Manufacturing',
    owner: 'Fabrication Team',
    location: 'Building A - Floor 3',
    purchaseDate: '2024-02-01',
    warrantyExpiry: '2027-02-01',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'tech-4',
    status: 'active',
    image: '',
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Spindle alignment check',
    description: 'Regular spindle alignment verification and adjustment if needed',
    equipmentId: 'eq-1',
    type: 'preventive',
    status: 'new',
    scheduledDate: '2025-01-05',
    duration: 4,
    teamId: 'team-1',
    assignedTechnicianId: null,
    timeSpent: 0,
    priority: 'medium',
    createdAt: '2024-12-20',
  },
  {
    id: 'req-2',
    subject: 'Motor overheating issue',
    description: 'Robot arm motor showing temperature warnings during operation',
    equipmentId: 'eq-2',
    type: 'corrective',
    status: 'in_progress',
    scheduledDate: '2024-12-28',
    duration: 6,
    teamId: 'team-2',
    assignedTechnicianId: 'tech-3',
    timeSpent: 2,
    priority: 'high',
    createdAt: '2024-12-25',
  },
  {
    id: 'req-3',
    subject: 'Server cooling fan replacement',
    description: 'Multiple cooling fans showing degraded performance',
    equipmentId: 'eq-3',
    type: 'corrective',
    status: 'in_progress',
    scheduledDate: '2024-12-27',
    duration: 2,
    teamId: 'team-3',
    assignedTechnicianId: 'tech-5',
    timeSpent: 1,
    priority: 'critical',
    createdAt: '2024-12-26',
  },
  {
    id: 'req-4',
    subject: 'Quarterly filter replacement',
    description: 'Replace all air filters as part of quarterly maintenance',
    equipmentId: 'eq-4',
    type: 'preventive',
    status: 'repaired',
    scheduledDate: '2024-12-15',
    duration: 3,
    teamId: 'team-4',
    assignedTechnicianId: 'tech-7',
    timeSpent: 2.5,
    priority: 'low',
    createdAt: '2024-12-01',
  },
  {
    id: 'req-5',
    subject: 'Hydraulic fluid leak',
    description: 'Minor leak detected in main hydraulic line',
    equipmentId: 'eq-5',
    type: 'corrective',
    status: 'new',
    scheduledDate: '2024-12-30',
    duration: 5,
    teamId: 'team-1',
    assignedTechnicianId: 'tech-2',
    timeSpent: 0,
    priority: 'high',
    createdAt: '2024-12-27',
  },
  {
    id: 'req-6',
    subject: 'Laser calibration',
    description: 'Annual laser calibration and power output verification',
    equipmentId: 'eq-6',
    type: 'preventive',
    status: 'new',
    scheduledDate: '2025-01-10',
    duration: 4,
    teamId: 'team-2',
    assignedTechnicianId: null,
    timeSpent: 0,
    priority: 'medium',
    createdAt: '2024-12-20',
  },
  {
    id: 'req-7',
    subject: 'Belt tensioner adjustment',
    description: 'CNC belt showing signs of slack, needs tensioning',
    equipmentId: 'eq-1',
    type: 'corrective',
    status: 'repaired',
    scheduledDate: '2024-12-22',
    duration: 2,
    teamId: 'team-1',
    assignedTechnicianId: 'tech-1',
    timeSpent: 1.5,
    priority: 'medium',
    createdAt: '2024-12-21',
  },
  {
    id: 'req-8',
    subject: 'Wiring inspection',
    description: 'Complete wiring inspection after power surge',
    equipmentId: 'eq-2',
    type: 'corrective',
    status: 'scrap',
    scheduledDate: '2024-12-10',
    duration: 8,
    teamId: 'team-2',
    assignedTechnicianId: 'tech-4',
    timeSpent: 8,
    priority: 'critical',
    createdAt: '2024-12-08',
  },
];

// Helper functions
export const getTeamById = (id: string) => maintenanceTeams.find(t => t.id === id);
export const getEquipmentById = (id: string) => equipment.find(e => e.id === id);
export const getTechnicianById = (id: string) => {
  for (const team of maintenanceTeams) {
    const tech = team.technicians.find(t => t.id === id);
    if (tech) return tech;
  }
  return null;
};
export const getRequestsByEquipment = (equipmentId: string) => 
  maintenanceRequests.filter(r => r.equipmentId === equipmentId);
export const getOpenRequestsCount = (equipmentId: string) => 
  maintenanceRequests.filter(r => r.equipmentId === equipmentId && r.status !== 'repaired' && r.status !== 'scrap').length;

import { MainLayout } from '@/components/layout/MainLayout';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Settings2, Search, Plus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AddEquipmentDialog } from '@/components/dialogs/AddEquipmentDialog';
import { EquipmentFilterDialog, EquipmentFilters } from '@/components/dialogs/EquipmentFilterDialog';
import { Badge } from '@/components/ui/badge';

const EquipmentPage = () => {
  const { equipment } = useData();
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState<EquipmentFilters>({
    department: '',
    teamId: '',
    location: '',
    ownerType: '',
    status: '',
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleClearFilters = () => {
    setFilters({
      department: '',
      teamId: '',
      location: '',
      ownerType: '',
      status: '',
    });
  };

  const filteredEquipment = equipment.filter((eq) => {
    // Text search
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.department.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Apply filters
    if (filters.department && eq.department !== filters.department) return false;
    if (filters.teamId && eq.maintenanceTeamId !== filters.teamId) return false;
    if (filters.location && eq.location !== filters.location) return false;
    if (filters.status && eq.status !== filters.status) return false;
    if (filters.ownerType) {
      const isTeamOwned = eq.owner.toLowerCase().includes('team');
      if (filters.ownerType === 'team' && !isTeamOwned) return false;
      if (filters.ownerType === 'department' && isTeamOwned) return false;
    }

    return true;
  });

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Equipments Registry</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track all your equipments
              </p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search equipments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowFilterDialog(true)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((eq, index) => (
            <EquipmentCard 
              key={eq.id} 
              equipment={eq} 
              delay={index * 0.05}
            />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No equipments found</p>
          </motion.div>
        )}
      </div>

      <AddEquipmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <EquipmentFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </MainLayout>
  );
};

export default EquipmentPage;

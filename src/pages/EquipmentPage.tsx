import { MainLayout } from '@/components/layout/MainLayout';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Settings2, Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const EquipmentPage = () => {
  const { equipment } = useData();
  const [search, setSearch] = useState('');

  const filteredEquipment = equipment.filter(
    (eq) =>
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.department.toLowerCase().includes(search.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold tracking-tight">Equipment Registry</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track all your equipment
              </p>
            </div>
          </div>
          <Button className="gap-2">
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
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
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
            <p className="text-muted-foreground">No equipment found</p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default EquipmentPage;

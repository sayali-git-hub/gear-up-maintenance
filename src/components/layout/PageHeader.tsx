import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ViewModeToggle, ViewMode } from '@/components/ui/ViewModeToggle';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Filter
  showFilter?: boolean;
  activeFiltersCount?: number;
  onFilterClick?: () => void;
  onClearFilters?: () => void;
  // View toggle
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  // Add button
  addButtonLabel?: string;
  onAddClick?: () => void;
  // Custom actions
  customActions?: ReactNode;
}

export const PageHeader = ({
  icon: Icon,
  title,
  description,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showFilter = false,
  activeFiltersCount = 0,
  onFilterClick,
  onClearFilters,
  showViewToggle = false,
  viewMode = 'grid',
  onViewModeChange,
  addButtonLabel,
  onAddClick,
  customActions,
}: PageHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Top row: Title and Add button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {addButtonLabel && onAddClick && (
          <Button className="gap-2" onClick={onAddClick}>
            <Plus className="w-4 h-4" />
            {addButtonLabel}
          </Button>
        )}
      </motion.div>

      {/* Controls row: Search, Filter, View toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      >
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          {showFilter && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={onFilterClick}
              >
                <Filter className="w-4 h-4" />
                Filter
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && onClearFilters && (
                <Button variant="ghost" size="icon" onClick={onClearFilters}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          {customActions}
        </div>
        {showViewToggle && viewMode && onViewModeChange && (
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        )}
      </motion.div>
    </div>
  );
};

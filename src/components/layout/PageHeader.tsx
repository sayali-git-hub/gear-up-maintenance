import { ReactNode } from 'react';
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
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilter?: boolean;
  activeFiltersCount?: number;
  onFilterClick?: () => void;
  onClearFilters?: () => void;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  addButtonLabel?: string;
  onAddClick?: () => void;
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
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {addButtonLabel && onAddClick && (
          <Button size="sm" className="gap-1.5" onClick={onAddClick}>
            <Plus className="w-4 h-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          {onSearchChange && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          )}
          {showFilter && (
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9"
                onClick={onFilterClick}
              >
                <Filter className="w-3.5 h-3.5" />
                Filter
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && onClearFilters && (
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onClearFilters}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
          {customActions}
        </div>
        {showViewToggle && viewMode && onViewModeChange && (
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        )}
      </div>
    </div>
  );
};

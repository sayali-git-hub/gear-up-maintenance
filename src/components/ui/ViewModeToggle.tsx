import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center border border-border rounded-lg p-1 bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3 rounded-md',
          viewMode === 'grid' && 'bg-background shadow-sm'
        )}
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3 rounded-md',
          viewMode === 'list' && 'bg-background shadow-sm'
        )}
        onClick={() => onViewModeChange('list')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};

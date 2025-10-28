import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import type { LegalDomain } from '../../types/caseGenerator';
import { CATEGORIES } from '../../constants/caseGeneratorData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryGridProps {
  selectedDomain: LegalDomain;
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryGrid = ({ selectedDomain, selectedCategories, onChange }: CategoryGridProps) => {
  // Filter categories by selected domain
  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => cat.domain === selectedDomain);
  }, [selectedDomain]);

  const handleToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const selectAll = () => {
    onChange(filteredCategories.map(cat => cat.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Selectează categoriile (opțional)</h2>
        <p className="text-muted-foreground">
          Alege una sau mai multe categorii juridice pentru caz, sau lasă gol pentru selecție aleatorie
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-center">
        <Button
          onClick={selectAll}
          variant="outline"
          size="sm"
          disabled={selectedCategories.length === filteredCategories.length}
        >
          Selectează tot
        </Button>
        <Button
          onClick={clearAll}
          variant="outline"
          size="sm"
          disabled={selectedCategories.length === 0}
        >
          Deselectează tot
        </Button>
        <span className="text-sm text-muted-foreground">
          {selectedCategories.length} / {filteredCategories.length} selectate
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCategories.map(category => (
          <label
            key={category.id}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedCategories.includes(category.id)
                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                : 'bg-card border-border hover:border-muted-foreground/50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleToggle(category.id)}
              className="sr-only"
            />
            <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
              selectedCategories.includes(category.id)
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/30'
            }`}>
              {selectedCategories.includes(category.id) && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium">{category.name}</div>
          </label>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground text-center">Categorii selectate:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedCategories.map(catId => {
              const category = filteredCategories.find(c => c.id === catId);
              return category ? (
                <Badge key={catId} variant="secondary" className="gap-1">
                  {category.name}
                  <button
                    onClick={() => handleToggle(catId)}
                    aria-label="Șterge"
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import { useMemo } from 'react';
import type { LegalDomain } from '../../types/caseGenerator';
import { CATEGORIES } from '../../constants/caseGeneratorData';

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
    <div className="category-selector">
      <div className="step-header">
        <h2>Selectează categoriile (opțional)</h2>
        <p className="step-description">
          Alege una sau mai multe categorii juridice pentru caz, sau lasă gol pentru selecție aleatorie
        </p>
      </div>

      <div className="bulk-actions">
        <button
          onClick={selectAll}
          className="btn-bulk"
          disabled={selectedCategories.length === filteredCategories.length}
        >
          Selectează tot
        </button>
        <button
          onClick={clearAll}
          className="btn-bulk"
          disabled={selectedCategories.length === 0}
        >
          Deselectează tot
        </button>
        <span className="selection-count">
          {selectedCategories.length} / {filteredCategories.length} selectate
        </span>
      </div>

      <div className="category-grid">
        {filteredCategories.map(category => (
          <label
            key={category.id}
            className={`category-checkbox ${selectedCategories.includes(category.id) ? 'checked' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleToggle(category.id)}
            />
            <div className="checkbox-content">
              <div className="checkbox-indicator">
                {selectedCategories.includes(category.id) && <span className="check-mark">✓</span>}
              </div>
              <div className="category-name">{category.name}</div>
            </div>
          </label>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <div className="selection-summary">
          <span className="summary-label">Categorii selectate:</span>
          <div className="summary-tags">
            {selectedCategories.map(catId => {
              const category = filteredCategories.find(c => c.id === catId);
              return category ? (
                <span key={catId} className="summary-tag">
                  {category.name}
                  <button
                    className="tag-remove"
                    onClick={() => handleToggle(catId)}
                    aria-label="Șterge"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

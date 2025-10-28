import { useState } from 'react';
import { AlertCircle, Plus, X, Check } from 'lucide-react';
import type { LegalDomain, ArticleReference } from '../../types/caseGenerator';
import { formatArticleReference } from '../../constants/caseGeneratorData';
import { getAllCivilSubcategories } from '../../constants/civilLawCategories';
import { getAllPenalSubcategories } from '../../constants/penalLawCategories';
import { getAllConstitutionalSubcategories } from '../../constants/constitutionalLawCategories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArticleSelectorProps {
  selectedDomain: LegalDomain;
  selectedArticles: ArticleReference[];
  subcategory: string;
  onChange: (articles: ArticleReference[]) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

export const ArticleSelector = ({ selectedDomain, selectedArticles, subcategory, onChange, onSubcategoryChange }: ArticleSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Introdu numărul articolului');
      return;
    }

    // Check if article already exists
    if (selectedArticles.some(art => art.number === trimmed)) {
      setError('Acest articol a fost deja adăugat');
      return;
    }

    const newArticle: ArticleReference = {
      number: trimmed,
      reference: formatArticleReference(trimmed, selectedDomain),
      domain: selectedDomain
    };

    onChange([...selectedArticles, newArticle]);
    setInputValue('');
    setError(null);
  };

  const handleRemove = (articleNumber: string) => {
    onChange(selectedArticles.filter(art => art.number !== articleNumber));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // Get code name for display
  const getCodeName = () => {
    switch (selectedDomain) {
      case 'civil':
        return 'Codul Civil';
      case 'penal':
        return 'Codul Penal';
      case 'constitutional':
        return 'Constituția';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Adaugă articole relevante (opțional)</h2>
        <p className="text-muted-foreground">
          Introdu articolele din {getCodeName()} care vor fi folosite în caz, sau lasă gol pentru selecție aleatorie
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ex: 1, 15, 223 alin. 2, 45-49"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
          <p className="font-semibold">Exemple valide:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Un articol simplu: <code className="bg-background px-1.5 py-0.5 rounded">1</code>, <code className="bg-background px-1.5 py-0.5 rounded">223</code></li>
            <li>Cu alineat: <code className="bg-background px-1.5 py-0.5 rounded">15 alin. 2</code>, <code className="bg-background px-1.5 py-0.5 rounded">45 al. 3</code></li>
            <li>Interval: <code className="bg-background px-1.5 py-0.5 rounded">45-49</code></li>
            <li>Cu literă: <code className="bg-background px-1.5 py-0.5 rounded">223 lit. a</code></li>
          </ul>
        </div>
      </div>

      {selectedArticles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Articole adăugate ({selectedArticles.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedArticles.map((article) => (
              <Badge key={article.number} variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                {article.reference}
                <button
                  onClick={() => handleRemove(article.number)}
                  aria-label="Șterge"
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedArticles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground space-y-1">
          <p className="font-medium">Niciun articol adăugat încă</p>
          <p className="text-sm">Introdu primul articol pentru a continua</p>
        </div>
      )}

      {/* Subcategory Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Subcategorie (opțional)</h3>
        {selectedDomain === 'civil' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Selectează subcategoria pentru drept civil (conform structurii cursului)
            </p>
            <Select value={subcategory} onValueChange={onSubcategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează subcategoria..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {getAllCivilSubcategories().map((subcatOption) => (
                  <SelectItem key={subcatOption} value={subcatOption}>
                    {subcatOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subcategory && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcategory}
              </p>
            )}
          </>
        ) : selectedDomain === 'penal' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Selectează subcategoria pentru drept penal (conform Codului Penal)
            </p>
            <Select value={subcategory} onValueChange={onSubcategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează subcategoria..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {getAllPenalSubcategories().map((subcatOption) => (
                  <SelectItem key={subcatOption} value={subcatOption}>
                    {subcatOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subcategory && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcategory}
              </p>
            )}
          </>
        ) : selectedDomain === 'constitutional' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Selectează subcategoria pentru drept constituțional (conform structurii cursului)
            </p>
            <Select value={subcategory} onValueChange={onSubcategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează subcategoria..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {getAllConstitutionalSubcategories().map((subcatOption) => (
                  <SelectItem key={subcatOption} value={subcatOption}>
                    {subcatOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subcategory && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcategory}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Adaugă o subcategorie pentru organizare mai detaliată (opțional)
            </p>
            <Input
              type="text"
              placeholder="Ex: Separația puterilor, etc."
              value={subcategory}
              onChange={(e) => onSubcategoryChange(e.target.value)}
              maxLength={100}
            />
            {subcategory && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcategory}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Check, ClipboardList, Bot, Loader2 } from 'lucide-react';
import type { DifficultyLevel, LegalDomain } from '../../types/caseGenerator';
import { DIFFICULTY_OPTIONS, WEEK_OPTIONS } from '../../constants/caseGeneratorData';
import { getAllCivilSubcategories } from '../../constants/civilLawCategories';
import { getAllConstitutionalSubcategories } from '../../constants/constitutionalLawCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface ConfigurationPanelProps {
  selectedDomain: LegalDomain | null;
  difficultyLevel: DifficultyLevel;
  weekNumber: number;
  subcategory: string;
  onChange: (difficultyLevel: DifficultyLevel, weekNumber: number, subcategory: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ConfigurationPanel = ({
  selectedDomain,
  difficultyLevel,
  weekNumber,
  subcategory,
  onChange,
  onGenerate,
  isGenerating
}: ConfigurationPanelProps) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(difficultyLevel);
  const [week, setWeek] = useState(weekNumber);
  const [subcat, setSubcat] = useState(subcategory);

  // Update parent when values change
  useEffect(() => {
    onChange(difficulty, week, subcat);
  }, [difficulty, week, subcat, onChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Configurează parametrii cazului (opțional)</h2>
        <p className="text-muted-foreground">
          Toate câmpurile sunt opționale - lasă valorile implicite pentru un caz aleatoriu
        </p>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Nivel de dificultate (opțional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFFICULTY_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`cursor-pointer border rounded-lg p-4 transition-all hover:shadow-md ${
                difficulty === option.value
                  ? 'bg-primary/5 border-primary ring-1 ring-primary'
                  : 'bg-card border-border hover:border-muted-foreground/50'
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="sr-only"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{option.label}</span>
                  {difficulty === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Week Number */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Săptămâna de curs (opțional)</h3>
          <p className="text-sm text-muted-foreground">
            Selectează săptămâna pentru organizarea cazurilor în curriculum, sau lasă valoarea implicită
          </p>
        </div>
        <Select value={week.toString()} onValueChange={(value) => setWeek(Number(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEK_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Subcategorie (opțional)</h3>
        {selectedDomain === 'civil' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Selectează subcategoria pentru drept civil (conform structurii cursului)
            </p>
            <Select value={subcat} onValueChange={setSubcat}>
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
            {subcat && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcat}
              </p>
            )}
          </>
        ) : selectedDomain === 'constitutional' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Selectează subcategoria pentru drept constituțional (conform structurii cursului)
            </p>
            <Select value={subcat} onValueChange={setSubcat}>
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
            {subcat && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcat}
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
              placeholder="Ex: Infracțiuni contra patrimoniului, Separația puterilor, etc."
              value={subcat}
              onChange={(e) => setSubcat(e.target.value)}
              maxLength={100}
            />
            {subcat && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Subcategorie: {subcat}
              </p>
            )}
          </>
        )}
      </div>

      {/* Summary Box */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Rezumat configurație:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-background rounded">
              <span className="text-muted-foreground">Dificultate:</span>
              <span className="font-medium">
                {DIFFICULTY_OPTIONS.find(o => o.value === difficulty)?.label}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background rounded">
              <span className="text-muted-foreground">Săptămâna:</span>
              <span className="font-medium">{week}</span>
            </div>
            {subcat && (
              <div className="flex justify-between items-center p-2 bg-background rounded sm:col-span-2">
                <span className="text-muted-foreground">Subcategorie:</span>
                <span className="font-medium">{subcat}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="space-y-4">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className="w-full gap-2 text-lg h-14"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Se generează cazul...</span>
            </>
          ) : (
            <>
              <Bot className="h-5 w-5" />
              <span>Generează cazul cu AI</span>
            </>
          )}
        </Button>

        {isGenerating && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="font-medium">Claude AI generează cazul complet...</p>
              <p className="text-sm text-muted-foreground">Acest proces poate dura 10-30 de secunde</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

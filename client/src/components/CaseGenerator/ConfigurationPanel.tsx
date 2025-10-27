import { useState, useEffect } from 'react';
import type { DifficultyLevel } from '../../types/caseGenerator';
import { DIFFICULTY_OPTIONS, WEEK_OPTIONS } from '../../constants/caseGeneratorData';

interface ConfigurationPanelProps {
  difficultyLevel: DifficultyLevel;
  weekNumber: number;
  subcategory: string;
  onChange: (difficultyLevel: DifficultyLevel, weekNumber: number, subcategory: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ConfigurationPanel = ({
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
    <div className="configuration-panel">
      <div className="step-header">
        <h2>Configurează parametrii cazului</h2>
        <p className="step-description">
          Alege nivelul de dificultate, săptămâna și subcategoria (opțional)
        </p>
      </div>

      {/* Difficulty Level */}
      <div className="config-section">
        <h3 className="config-section-title">Nivel de dificultate *</h3>
        <div className="difficulty-options">
          {DIFFICULTY_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`difficulty-card ${difficulty === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              />
              <div className="difficulty-content">
                <div className="difficulty-header">
                  <span className="difficulty-label">{option.label}</span>
                  {difficulty === option.value && (
                    <span className="difficulty-check">✓</span>
                  )}
                </div>
                <p className="difficulty-description">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Week Number */}
      <div className="config-section">
        <h3 className="config-section-title">Săptămâna de curs *</h3>
        <p className="config-hint">
          Selectează săptămâna pentru organizarea cazurilor în curriculum
        </p>
        <select
          className="week-select"
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
        >
          {WEEK_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div className="config-section">
        <h3 className="config-section-title">Subcategorie (opțional)</h3>
        <p className="config-hint">
          Adaugă o subcategorie pentru organizare mai detaliată (ex: "Capacitate de exercițiu", "Nulitate absolută")
        </p>
        <input
          type="text"
          className="subcategory-input"
          placeholder="Ex: Capacitate de exercițiu, Nulitate absolută, etc."
          value={subcat}
          onChange={(e) => setSubcat(e.target.value)}
          maxLength={100}
        />
        {subcat && (
          <div className="field-hint success">
            ✓ Subcategorie: {subcat}
          </div>
        )}
      </div>

      {/* Summary Box */}
      <div className="config-summary">
        <h4>📋 Rezumat configurație:</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Dificultate:</span>
            <span className="summary-value">
              {DIFFICULTY_OPTIONS.find(o => o.value === difficulty)?.label}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Săptămâna:</span>
            <span className="summary-value">{week}</span>
          </div>
          {subcat && (
            <div className="summary-item">
              <span className="summary-label">Subcategorie:</span>
              <span className="summary-value">{subcat}</span>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="generate-section">
        <button
          className="btn-generate"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              <span>Se generează cazul...</span>
            </>
          ) : (
            <>
              <span>🤖 Generează cazul cu AI</span>
            </>
          )}
        </button>

        {isGenerating && (
          <div className="generation-info">
            <p>Claude AI generează cazul complet...</p>
            <p className="generation-hint">Acest proces poate dura 10-30 de secunde</p>
          </div>
        )}
      </div>
    </div>
  );
};

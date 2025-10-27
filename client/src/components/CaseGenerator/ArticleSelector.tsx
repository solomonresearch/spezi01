import { useState } from 'react';
import type { LegalDomain, ArticleReference } from '../../types/caseGenerator';
import { formatArticleReference } from '../../constants/caseGeneratorData';

interface ArticleSelectorProps {
  selectedDomain: LegalDomain;
  selectedArticles: ArticleReference[];
  onChange: (articles: ArticleReference[]) => void;
}

export const ArticleSelector = ({ selectedDomain, selectedArticles, onChange }: ArticleSelectorProps) => {
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
    <div className="article-selector">
      <div className="step-header">
        <h2>Adaugă articole relevante</h2>
        <p className="step-description">
          Introdu articolele din {getCodeName()} care vor fi folosite în caz (minim 1)
        </p>
      </div>

      <div className="article-input-section">
        <div className="input-group">
          <input
            type="text"
            className="article-input"
            placeholder={`Ex: 1, 15, 223 alin. 2, 45-49`}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleAdd}
            className="btn-add-article"
          >
            Adaugă articol
          </button>
        </div>

        {error && (
          <div className="input-error">⚠️ {error}</div>
        )}

        <div className="input-hints">
          <p><strong>Exemple valide:</strong></p>
          <ul>
            <li>Un articol simplu: <code>1</code>, <code>223</code></li>
            <li>Cu alineat: <code>15 alin. 2</code>, <code>45 al. 3</code></li>
            <li>Interval: <code>45-49</code></li>
            <li>Cu literă: <code>223 lit. a</code></li>
          </ul>
        </div>
      </div>

      {selectedArticles.length > 0 && (
        <div className="articles-display">
          <div className="articles-header">
            <h3>Articole adăugate ({selectedArticles.length})</h3>
          </div>

          <div className="article-chips">
            {selectedArticles.map((article) => (
              <div key={article.number} className="article-chip">
                <span className="chip-text">{article.reference}</span>
                <button
                  className="chip-remove"
                  onClick={() => handleRemove(article.number)}
                  aria-label="Șterge"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedArticles.length === 0 && (
        <div className="empty-state">
          <p>Niciun articol adăugat încă</p>
          <p className="empty-hint">Introdu primul articol pentru a continua</p>
        </div>
      )}
    </div>
  );
};

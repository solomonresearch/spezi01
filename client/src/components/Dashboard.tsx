import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCases, useCase } from '../hooks/useCases';
import { Case } from '../types/case';

const lawCategories = [
  {
    id: 'civil',
    code: 'CIV',
    name: 'Drept Civil',
    subcategories: [
      'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
      'Persoana fizică (Capacitatea de exercițiu)',
      'Persoana juridică (Noțiune, Capacitate)',
      'Persoana juridică (Funcționarea persoanei juridice)',
      'Persoana fizică (Elemente de identificare. Starea civilă)',
      'Persoana fizică (Ocrotirea incapabilului)',
      'Exercitarea drepturilor subiective civile. Abuzul de drept',
      'Apărarea drepturilor nepatrimoniale',
      'Aplicarea legii civile în timp și spațiu I',
      'Aplicarea legii civile în timp și spațiu II'
    ]
  },
  { id: 'constitutional', code: 'CON', name: 'Drept Constitutional', subcategories: [] },
  { id: 'roman', code: 'ROM', name: 'Drept Roman', subcategories: [] }
];

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('civil');
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>('Persoana fizică (Capacitatea de exercițiu)');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCodeType, setSelectedCodeType] = useState<'civil' | 'constitution' | 'criminal'>('civil');
  const [civilCodeText, setCivilCodeText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load cases from Supabase
  const { cases, loading: casesLoading } = useCases();
  const { caseData, articles, steps, hints, loading: caseLoading } = useCase(selectedCaseId);

  const codeTypes = [
    { id: 'civil', name: 'Codul Civil', icon: '⚖️' },
    { id: 'constitution', name: 'Constituția României', icon: '🏛️' },
    { id: 'criminal', name: 'Codul Penal', icon: '👮' }
  ];

  // Load civil code on initial mount
  useEffect(() => {
    loadCivilCode();
  }, []);

  // Clear text when switching away from civil code
  useEffect(() => {
    if (selectedCodeType !== 'civil') {
      setCivilCodeText('');
    }
  }, [selectedCodeType]);

  const loadCivilCode = async () => {
    if (selectedCodeType !== 'civil') return;

    setLoading(true);
    try {
      // Fetch the text file from public folder and display as-is
      const response = await fetch('/codcivil.txt');
      if (!response.ok) {
        throw new Error('Failed to load civil code');
      }

      const content = await response.text();
      setCivilCodeText(content);
    } catch (error) {
      console.error('Error loading civil code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategory(expandedSubcategory === subcategory ? null : subcategory);
  };

  const handleCaseClick = (caseItem: Case) => {
    setSelectedCaseId(caseItem.id);
    setShowHints(false); // Reset hints when switching cases
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getDifficultyBadge = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'ușor') return '🟢';
    if (normalizedLevel === 'mediu') return '🟡';
    if (normalizedLevel === 'dificil') return '🔴';
    return '';
  };

  const handleCodeTypeClick = (codeType: 'civil' | 'constitution' | 'criminal') => {
    if (codeType === 'civil' && selectedCodeType === 'civil') {
      // Reload civil code if already selected
      loadCivilCode();
    } else {
      setSelectedCodeType(codeType);
    }
  };

  // Generate Case ID: CIV-25-ART-3 (Category-Year-Code-Difficulty)
  // No leading zeros - year is shown as single digit if < 10
  const generateCaseId = (categoryCode: string, year: number, codeType: string, difficulty: number) => {
    const yearShort = parseInt(year.toString().slice(-2));
    return `${categoryCode}-${yearShort}-${codeType}-${difficulty}`;
  };

  const currentCaseId = generateCaseId('CIV', 2025, 'ART', 3);

  return (
    <div className="app-container">
      {/* Compact Header */}
      <header className="app-header">
        <h1 className="app-title">Spezi</h1>
        <div className="user-menu">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
        </div>
      </header>

      <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-title">Law Categories</h3>
              <button className="btn-toggle-sidebar" onClick={toggleSidebar} title="Hide sidebar">
                ◀
              </button>
            </div>
          {lawCategories.map((category) => (
            <div key={category.id} className="category-section">
              <button
                className={`category-btn ${expandedCategory === category.id ? 'active' : ''}`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
                {category.subcategories.length > 0 && (
                  <span className="expand-icon">
                    {expandedCategory === category.id ? '▼' : '▶'}
                  </span>
                )}
              </button>
              {expandedCategory === category.id && category.subcategories.length > 0 && (
                <ul className="subcategory-list">
                  {category.subcategories.map((sub, idx) => (
                    <li key={idx} className="subcategory-wrapper">
                      <button
                        className={`subcategory-item ${expandedSubcategory === sub ? 'active' : ''}`}
                        onClick={() => toggleSubcategory(sub)}
                      >
                        {sub}
                        {sub === 'Persoana fizică (Capacitatea de exercițiu)' && cases.length > 0 && (
                          <span className="expand-icon-small">
                            {expandedSubcategory === sub ? '▼' : '▶'}
                          </span>
                        )}
                      </button>
                      {/* Show cases under "Capacitatea de exercițiu" */}
                      {expandedSubcategory === sub && sub === 'Persoana fizică (Capacitatea de exercițiu)' && (
                        <ul className="case-list">
                          {casesLoading ? (
                            <li className="case-item-loading">Se încarcă cazurile...</li>
                          ) : cases.length === 0 ? (
                            <li className="case-item-empty">Nu există cazuri</li>
                          ) : (
                            cases.map((caseItem) => (
                              <li key={caseItem.id}>
                                <button
                                  className={`case-item-btn ${selectedCaseId === caseItem.id ? 'active' : ''}`}
                                  onClick={() => handleCaseClick(caseItem)}
                                >
                                  <span className="case-difficulty">{getDifficultyBadge(caseItem.level)}</span>
                                  <span className="case-title-short">{caseItem.title}</span>
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          </aside>
        )}

        {/* Collapsed sidebar toggle button */}
        {sidebarCollapsed && (
          <button className="btn-show-sidebar" onClick={toggleSidebar} title="Show sidebar">
            ▶
          </button>
        )}

        {/* Main Content */}
        <main className="main-content">
          {caseLoading ? (
            <div className="case-display">
              <p className="loading-message">Se încarcă cazul...</p>
            </div>
          ) : !caseData ? (
            <div className="case-display">
              <div className="no-case-selected">
                <h2>📚 Selectează un caz</h2>
                <p>Alege un caz din bara laterală pentru a începe studiul.</p>
              </div>
            </div>
          ) : (
            <div className="case-display">
              <div className="case-header">
                <div className="case-title-section">
                  <h2 className="case-title">{caseData.title}</h2>
                  <span className={`case-level-badge ${caseData.level.toLowerCase()}`}>
                    {getDifficultyBadge(caseData.level)} {caseData.level}
                  </span>
                </div>
                <span className="case-week">Săptămâna {caseData.week_number}</span>
              </div>

              <div className="case-section">
                <h3>🎯 Problema juridică</h3>
                <p className="legal-problem">{caseData.legal_problem}</p>
              </div>

              {articles.length > 0 && (
                <div className="case-section">
                  <h3>📖 Articole relevante</h3>
                  <div className="article-tags">
                    {articles.map((article) => (
                      <span key={article.id} className="article-tag">
                        {article.article_reference}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="case-section">
                <h3>📝 Speta (Cazul)</h3>
                <p className="case-description">{caseData.case_description}</p>
              </div>

              <div className="case-section">
                <h3>❓ Întrebare</h3>
                <p className="case-question">{caseData.question}</p>
              </div>

              {steps.length > 0 && (
                <div className="case-section">
                  <h3>🔍 Pași de analiză așteptați</h3>
                  <ol className="analysis-steps">
                    {steps.map((step) => (
                      <li key={step.id} className="analysis-step">
                        {step.step_description}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {hints.length > 0 && (
                <div className="case-section">
                  <button
                    className="btn-toggle-hints"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? 'Ascunde Indicii' : 'Arată Indicii'} 💡
                  </button>
                  {showHints && (
                    <div className="hints-content">
                      <h4>Indicii:</h4>
                      <ul className="hints-list">
                        {hints.map((hint) => (
                          <li key={hint.id} className="hint-item">
                            {hint.hint_text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar - Code + Chat */}
        <aside className="right-sidebar">
          {/* Legal Code Display */}
          <div className="code-display-container">
            {/* Code Type Selector */}
            <div className="code-header">
              <div className="code-type-selector-full">
                {codeTypes.map((code) => (
                  <button
                    key={code.id}
                    className={`code-type-btn-full ${selectedCodeType === code.id ? 'active' : ''}`}
                    onClick={() => handleCodeTypeClick(code.id as any)}
                  >
                    <span className="code-icon">{code.icon}</span>
                    <span className="code-name">{code.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Content */}
            <div className="code-content">
              {loading ? (
                <p className="code-placeholder">Se încarcă Codul Civil...</p>
              ) : selectedCodeType === 'civil' && !civilCodeText ? (
                <p className="code-placeholder">Nu există text</p>
              ) : selectedCodeType !== 'civil' ? (
                <div className="coming-soon">
                  <p className="coming-soon-icon">{codeTypes.find(c => c.id === selectedCodeType)?.icon}</p>
                  <p className="coming-soon-text">În curând</p>
                  <p className="coming-soon-subtitle">Acest cod nu este disponibil încă</p>
                </div>
              ) : (
                <pre className="code-text">{civilCodeText}</pre>
              )}
            </div>
          </div>

          {/* AI Chat */}
          <div className="chat-container">
            <h3 className="chat-title">AI Assistant</h3>
            <div className="chat-messages">
              <div className="message bot-message">
                <p>Bună! Sunt aici să te ajut cu studiul dreptului civil. Pune-mi orice întrebare despre cazul curent.</p>
              </div>
              <div className="message user-message">
                <p>Lorem ipsum dolor sit amet?</p>
              </div>
              <div className="message bot-message">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Capacitatea de folosință reprezintă...</p>
              </div>
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Scrie întrebarea ta aici..."
                className="chat-text-input"
              />
              <button className="btn-send">Trimite</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

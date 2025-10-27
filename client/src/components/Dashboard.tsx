import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCasesBySubcategory, useCase } from '../hooks/useCases';
import { useChat } from '../hooks/useChat';
import { useAssessment } from '../hooks/useAssessment';
import { Logo } from './Logo';
import { CIVIL_LAW_CATEGORIES } from '../constants/civilLawCategories';
import { CONSTITUTIONAL_LAW_CATEGORIES } from '../constants/constitutionalLawCategories';
import type { Case } from '../types/case';
import type { ChatContext } from '../types/chat';

interface CivilCategory {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
}

interface LawDomain {
  id: string;
  code: string;
  name: string;
  categories: CivilCategory[];
}

const lawCategories: LawDomain[] = [
  {
    id: 'civil',
    code: 'CIV',
    name: 'Drept Civil',
    categories: CIVIL_LAW_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      subcategories: cat.subcategories.map(subcat => `${cat.name} (${subcat})`)
    })).concat([{
      id: 'altele',
      name: 'Altele',
      description: 'Cazuri fără categorie specifică',
      subcategories: ['Altele']
    }])
  },
  {
    id: 'constitutional',
    code: 'CON',
    name: 'Drept Constitutional',
    categories: CONSTITUTIONAL_LAW_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      subcategories: cat.subcategories.map(subcat => `${cat.name} (${subcat})`)
    })).concat([{
      id: 'altele_constitutional',
      name: 'Altele',
      description: 'Cazuri fără categorie specifică',
      subcategories: ['Altele']
    }])
  },
  { id: 'roman', code: 'ROM', name: 'Drept Roman', categories: [] }
];

export const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('civil');
  const [expandedCivilCategory, setExpandedCivilCategory] = useState<string | null>('persoane_fizice');
  const [expandedConstitutionalCategory, setExpandedConstitutionalCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>('Persoane fizice (Capacitatea de exercițiu)');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCodeType, setSelectedCodeType] = useState<'civil' | 'constitution' | 'criminal'>('civil');
  const [civilCodeText, setCivilCodeText] = useState<string>('');
  const [constitutionText, setConstitutionText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Resizable code container state
  const [codeContainerHeight, setCodeContainerHeight] = useState<number>(() => {
    const saved = localStorage.getItem('codeContainerHeight');
    return saved ? parseInt(saved, 10) : 400;
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef<number>(0);
  const resizeStartHeight = useRef<number>(0);

  // Assessment module state
  const [assessmentExpanded, setAssessmentExpanded] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 3 | 5>(3);
  const [solutionText, setSolutionText] = useState('');
  const {
    isDetecting,
    isAssessing,
    aiDetectionPassed,
    assessmentResult,
    error: assessmentError,
    assessSolution: submitAssessment,
    reset: resetAssessment
  } = useAssessment({
    userId: user?.id,
    caseId: selectedCaseId || undefined
  });

  // Load cases from Supabase by subcategory
  const { cases, loading: casesLoading } = useCasesBySubcategory(expandedSubcategory);
  const { caseData, articles, steps, hints, loading: caseLoading } = useCase(selectedCaseId);

  // Build chat context from current case
  const chatContext: ChatContext | undefined = caseData ? {
    caseTitle: caseData.title,
    caseDescription: caseData.case_description,
    legalProblem: caseData.legal_problem,
    question: caseData.question,
    articles: articles.map(a => a.article_reference)
  } : undefined;

  // AI Chat hook
  const { messages, isLoading: chatLoading, error: chatError, sendMessage } = useChat({
    caseId: selectedCaseId,
    userId: user?.id,
    caseContext: chatContext
  });
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const codeTypes = [
    { id: 'civil', name: 'Codul Civil', icon: '⚖️' },
    { id: 'constitution', name: 'Constituția României', icon: '🏛️' },
    { id: 'criminal', name: 'Codul Penal', icon: '👮' }
  ];

  // Load code when selectedCodeType changes
  useEffect(() => {
    loadCode(selectedCodeType);
  }, [selectedCodeType]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save code container height to localStorage
  useEffect(() => {
    localStorage.setItem('codeContainerHeight', codeContainerHeight.toString());
  }, [codeContainerHeight]);

  // Resize event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const delta = e.clientY - resizeStartY.current;
      const newHeight = Math.min(
        Math.max(resizeStartHeight.current + delta, 150), // min: 150px
        window.innerHeight * 0.8 // max: 80% of viewport height
      );

      setCodeContainerHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const loadCode = async (codeType: 'civil' | 'constitution' | 'criminal') => {
    // Don't load criminal code (not available yet)
    if (codeType === 'criminal') return;

    setLoading(true);
    try {
      let fileName = '';
      let setter: (text: string) => void;

      if (codeType === 'civil') {
        fileName = '/codcivil.txt';
        setter = setCivilCodeText;
      } else if (codeType === 'constitution') {
        fileName = '/constitutie.txt';
        setter = setConstitutionText;
      } else {
        return;
      }

      // Fetch the text file from public folder and display as-is
      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error(`Failed to load ${codeType} code`);
      }

      const content = await response.text();
      setter(content);
    } catch (error) {
      console.error(`Error loading ${codeType} code:`, error);
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

  const toggleCivilCategory = (categoryId: string) => {
    setExpandedCivilCategory(expandedCivilCategory === categoryId ? null : categoryId);
  };

  const toggleConstitutionalCategory = (categoryId: string) => {
    setExpandedConstitutionalCategory(expandedConstitutionalCategory === categoryId ? null : categoryId);
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategory(expandedSubcategory === subcategory ? null : subcategory);
  };

  const handleCaseClick = (caseItem: Case) => {
    setSelectedCaseId(caseItem.id);
    setShowHints(false); // Reset hints when switching cases
    setShowSteps(false); // Reset steps when switching cases
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter function for search - only filters cases by case_code and title
  const matchesSearchCases = (caseItem: Case) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return caseItem.case_code.toLowerCase().includes(query) ||
           caseItem.title.toLowerCase().includes(query);
  };

  const getDifficultyBadge = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'ușor') return '🟢';
    if (normalizedLevel === 'mediu') return '🟡';
    if (normalizedLevel === 'dificil') return '🔴';
    return '';
  };

  const handleCodeTypeClick = (codeType: 'civil' | 'constitution' | 'criminal') => {
    if (codeType === selectedCodeType) {
      // Reload code if already selected
      loadCode(codeType);
    } else {
      setSelectedCodeType(codeType);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const message = chatInput;
    setChatInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartHeight.current = codeContainerHeight;
  };

  // Assessment module handlers
  const SOLUTION_TEMPLATE = `INTRODUCERE:

Fapte esențiale reținute:
[Rezumați faptele relevante juridic din caz]

Calificare juridică:
[Identificați natura juridică a actelor/faptelor]

Problema juridică:
[Formulați concis problema de drept care trebuie rezolvată]


ANALIZA PRIN SILOGISM:

Premisa majoră (Regulile de drept aplicabile):
[Citați și explicați articolele din Codul Civil, jurisprudența relevantă]

Premisa minoră (Aplicarea la cazul concret):
[Conectați faptele concrete cu regulile de drept]

Concluzia:
[Răspuns motivat la întrebarea din caz]`;

  const handleDifficultyChange = (level: 1 | 3 | 5) => {
    setDifficultyLevel(level);
  };

  const handleAssessmentSubmit = () => {
    submitAssessment(solutionText, difficultyLevel);
  };

  const toggleAssessmentModule = () => {
    setAssessmentExpanded(!assessmentExpanded);
  };

  // Reset assessment when case changes
  useEffect(() => {
    resetAssessment();
    setSolutionText('');
  }, [selectedCaseId, resetAssessment]);

  return (
    <div className="app-container">
      {/* Compact Header */}
      <header className="app-header">
        <div className="header-left">
          <Logo />
          <span className="beta-badge">Beta v0.1</span>
        </div>
        <div className="user-menu">
          <button onClick={() => navigate('/reporting')} className="btn-reporting" title="My Progress">
            Progress
          </button>
          {profile?.is_admin && (
            <button onClick={() => navigate('/admin')} className="btn-admin" title="Admin Panel">
              Admin
            </button>
          )}
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

            {/* Global Search for Cases */}
            <div className="search-filter-section">
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Caută caz după cod sau titlu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Șterge căutarea"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          {lawCategories.map((domain) => (
            <div key={domain.id} className="category-section">
              <button
                className={`category-btn ${expandedCategory === domain.id ? 'active' : ''}`}
                onClick={() => toggleCategory(domain.id)}
              >
                {domain.name}
                {domain.categories && domain.categories.length > 0 && (
                  <span className="expand-icon">
                    {expandedCategory === domain.id ? '▼' : '▶'}
                  </span>
                )}
              </button>

              {expandedCategory === domain.id && domain.categories && domain.categories.length > 0 && (
                <ul className="category-list">
                  {domain.categories.map((category) => {
                    const isExpanded = domain.id === 'civil'
                      ? expandedCivilCategory === category.id
                      : expandedConstitutionalCategory === category.id;
                    const toggleFunc = domain.id === 'civil'
                      ? toggleCivilCategory
                      : toggleConstitutionalCategory;

                    return (
                    <li key={category.id} className="category-wrapper">
                      <button
                        className={`category-item ${isExpanded ? 'active' : ''}`}
                        onClick={() => toggleFunc(category.id)}
                        title={category.description}
                      >
                        {category.name}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <span className="expand-icon-small">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        )}
                      </button>
                      {isExpanded && category.subcategories && (
                        <ul className="subcategory-list">
                          {category.subcategories.map((sub, idx) => (
                            <li key={idx} className="subcategory-wrapper">
                              <button
                                className={`subcategory-item ${expandedSubcategory === sub ? 'active' : ''}`}
                                onClick={() => toggleSubcategory(sub)}
                              >
                                {sub.replace(category.name + ' (', '').replace(')', '')}
                                {expandedSubcategory === sub && cases.length > 0 && (
                                  <span className="expand-icon-smaller">
                                    {expandedSubcategory === sub ? '▼' : '▶'}
                                  </span>
                                )}
                              </button>
                              {/* Show cases under selected subcategory */}
                              {expandedSubcategory === sub && (
                                <ul className="case-list">
                                  {casesLoading ? (
                                    <li className="case-item-loading">Se încarcă cazurile...</li>
                                  ) : cases.length === 0 ? (
                                    <li className="case-item-empty">Nu există cazuri</li>
                                  ) : (
                                    cases
                                      .filter(matchesSearchCases)
                                      .map((caseItem) => (
                                      <li key={caseItem.id} className="case-list-item">
                                        <button
                                          className={`case-item-btn ${selectedCaseId === caseItem.id ? 'active' : ''}`}
                                          onClick={() => handleCaseClick(caseItem)}
                                        >
                                          <span className="case-difficulty">{getDifficultyBadge(caseItem.level)}</span>
                                          {caseItem.verified && <span className="verified-badge" title="Verificat de profesionist">✓</span>}
                                          <span className="case-title-short">
                                            {caseItem.case_code}: {caseItem.title.replace(/^Caz \d+:\s*/i, '')}
                                          </span>
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
                    </li>
                    );
                  })}
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
                  <h2 className="case-title">
                    {caseData.case_code}: {caseData.title.replace(/^Caz \d+:\s*/i, '')}
                  </h2>
                  <span className={`case-level-badge ${caseData.level.toLowerCase()}`}>
                    {getDifficultyBadge(caseData.level)} {caseData.level}
                  </span>
                  {caseData.verified && (
                    <span className="verified-badge-large" title="Verificat de profesionist">
                      ✓ Verificat
                    </span>
                  )}
                </div>
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
                  <button
                    className="btn-toggle-hints"
                    onClick={() => setShowSteps(!showSteps)}
                  >
                    {showSteps ? 'Ascunde Pași de analiză' : 'Arată Pași de analiză'} 🔍
                  </button>
                  {showSteps && (
                    <div className="hints-content">
                      <h4>Pași de analiză așteptați:</h4>
                      <ol className="analysis-steps">
                        {steps.map((step) => (
                          <li key={step.id} className="analysis-step">
                            {step.step_description}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
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

          {/* Assessment Module */}
          {caseData && (
            <div className="assessment-module">
              <button
                className="assessment-header"
                onClick={toggleAssessmentModule}
              >
                <span className="assessment-title">✅ Verificare Soluție</span>
                <span className="assessment-toggle-icon">{assessmentExpanded ? '▼' : '▶'}</span>
              </button>

              {assessmentExpanded && (
                <div className="assessment-content">
                  {/* Difficulty Slider */}
                  <div className="difficulty-selector">
                    <label className="difficulty-label">Nivelul de Exigență:</label>
                    <div className="difficulty-slider">
                      <button
                        className={`difficulty-option ${difficultyLevel === 1 ? 'active' : ''}`}
                        onClick={() => handleDifficultyChange(1)}
                        title="Ciocan Juridic Ușor"
                      >
                        <span className="hammer-icon">🔨</span>
                        <span className="difficulty-text">Ușor</span>
                      </button>
                      <button
                        className={`difficulty-option ${difficultyLevel === 3 ? 'active' : ''}`}
                        onClick={() => handleDifficultyChange(3)}
                        title="Ciocan Juridic Mediu"
                      >
                        <span className="hammer-icon">🔨🔨🔨</span>
                        <span className="difficulty-text">Mediu</span>
                      </button>
                      <button
                        className={`difficulty-option ${difficultyLevel === 5 ? 'active' : ''}`}
                        onClick={() => handleDifficultyChange(5)}
                        title="Ciocan Juridic Greu"
                      >
                        <span className="hammer-icon">🔨🔨🔨🔨🔨</span>
                        <span className="difficulty-text">Greu</span>
                      </button>
                    </div>
                  </div>

                  {/* Solution Text Area */}
                  <div className="solution-input-section">
                    <label className="solution-label">Soluția Ta:</label>
                    <textarea
                      className="solution-textarea"
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      placeholder={SOLUTION_TEMPLATE}
                      rows={15}
                      disabled={isDetecting || isAssessing}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="assessment-actions">
                    <button
                      className="btn-assess"
                      onClick={handleAssessmentSubmit}
                      disabled={!solutionText.trim() || isDetecting || isAssessing}
                    >
                      {isDetecting ? 'Verificare AI în curs...' : isAssessing ? 'Evaluare în curs...' : 'Evaluează Soluția'}
                    </button>
                  </div>

                  {/* Loading Spinner */}
                  {(isDetecting || isAssessing) && (
                    <div className="assessment-loading">
                      <div className="spinner"></div>
                      <p>{isDetecting ? 'Se verifică autenticitatea textului...' : 'Se evaluează soluția...'}</p>
                    </div>
                  )}

                  {/* AI Detection Failed Message */}
                  {aiDetectionPassed === false && (
                    <div className="ai-detection-failed">
                      <div className="eggplant-message">
                        <span className="eggplant-emoji">🚫🤖</span>
                        <p>No, pe bune! Dar de ce folosesti AI sa rezolvi? 💀</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {assessmentError && (
                    <div className="assessment-error">
                      <p>{assessmentError}</p>
                    </div>
                  )}

                  {/* Assessment Result */}
                  {assessmentResult && aiDetectionPassed === true && (
                    <div className="assessment-result">
                      <div className="result-header">
                        <h3>✅ Evaluare Completă</h3>
                        <button
                          className="btn-reset-assessment"
                          onClick={() => {
                            resetAssessment();
                            setSolutionText('');
                          }}
                        >
                          Resetează
                        </button>
                      </div>
                      <div className="result-content">
                        <pre className="result-text">{assessmentResult}</pre>
                      </div>
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
          <div
            className="code-display-container"
            style={{ height: `${codeContainerHeight}px` }}
          >
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
                <p className="code-placeholder">
                  Se încarcă {codeTypes.find(c => c.id === selectedCodeType)?.name}...
                </p>
              ) : selectedCodeType === 'civil' && civilCodeText ? (
                <pre className="code-text">{civilCodeText}</pre>
              ) : selectedCodeType === 'constitution' && constitutionText ? (
                <pre className="code-text">{constitutionText}</pre>
              ) : selectedCodeType === 'criminal' ? (
                <div className="coming-soon">
                  <p className="coming-soon-icon">{codeTypes.find(c => c.id === selectedCodeType)?.icon}</p>
                  <p className="coming-soon-text">În curând</p>
                  <p className="coming-soon-subtitle">Acest cod nu este disponibil încă</p>
                </div>
              ) : (
                <p className="code-placeholder">Nu există text</p>
              )}
            </div>
          </div>

          {/* Resize Handle */}
          <div
            className="resize-handle"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          >
            <div className="resize-handle-line"></div>
          </div>

          {/* AI Chat */}
          <div className="chat-container">
            <h3 className="chat-title">AI Assistant</h3>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <p>{message.content}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="message bot-message">
                  <p className="typing-indicator">...</p>
                </div>
              )}
              {chatError && (
                <div className="message error-message">
                  <p>{chatError}</p>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Scrie întrebarea ta aici..."
                className="chat-text-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="btn-send"
                disabled={chatLoading || !chatInput.trim()}
              >
                Trimite
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

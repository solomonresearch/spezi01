import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCasesBySubcategory, useCase } from '../hooks/useCases';
import { useChat } from '../hooks/useChat';
import type { Case } from '../types/case';
import type { ChatContext } from '../types/chat';

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
  const [showSteps, setShowSteps] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCodeType, setSelectedCodeType] = useState<'civil' | 'constitution' | 'criminal'>('civil');
  const [civilCodeText, setCivilCodeText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Resizable code container state
  const [codeContainerHeight, setCodeContainerHeight] = useState<number>(() => {
    const saved = localStorage.getItem('codeContainerHeight');
    return saved ? parseInt(saved, 10) : 400;
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef<number>(0);
  const resizeStartHeight = useRef<number>(0);

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
  const { messages, isLoading: chatLoading, error: chatError, sendMessage } = useChat(selectedCaseId, chatContext);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const codeTypes = [
    { id: 'civil', name: 'Codul Civil', icon: '⚖️' },
    { id: 'constitution', name: 'Constituția României', icon: '🏛️' },
    { id: 'criminal', name: 'Codul Penal', icon: '👮' }
  ];

  // Load civil code on initial mount
  useEffect(() => {
    loadCivilCode();
  }, []);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear text when switching away from civil code
  useEffect(() => {
    if (selectedCodeType !== 'civil') {
      setCivilCodeText('');
    }
  }, [selectedCodeType]);

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
    setShowSteps(false); // Reset steps when switching cases
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
                        {expandedSubcategory === sub && cases.length > 0 && (
                          <span className="expand-icon-small">
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
                            cases.map((caseItem) => (
                              <li key={caseItem.id}>
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

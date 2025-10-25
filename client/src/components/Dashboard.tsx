import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const [showHints, setShowHints] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCodeType, setSelectedCodeType] = useState<'civil' | 'constitution' | 'criminal'>('civil');
  const [civilCodeText, setCivilCodeText] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
                    <li key={idx} className="subcategory-item">
                      {sub}
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
          <div className="case-display">
            <div className="case-header">
              <h2 className="case-title">Capacitatea de folosință a persoanei fizice</h2>
              <span className="case-id">ID: {currentCaseId}</span>
            </div>

            <div className="case-content">
              <h3>Cazul</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maria, în vârstă de 25 de ani,
                a încheiat un contract de vânzare-cumpărare pentru un apartament. La scurt timp după
                semnarea contractului, s-a ridicat problema capacității sale juridice de a încheia acest act.
              </p>
              <p>
                Proin sed libero enim sed faucibus turpis. Se pune întrebarea dacă Maria avea capacitate
                deplină de exercițiu la momentul încheierii contractului și care sunt consecințele juridice
                ale acestui act.
              </p>
            </div>

            <div className="case-questions">
              <h3>Întrebări</h3>
              <ol>
                <li>Care este diferența între capacitatea de folosință și capacitatea de exercițiu?</li>
                <li>La ce vârstă se dobândește capacitatea deplină de exercițiu conform Codului Civil român?</li>
                <li>Care sunt consecințele juridice ale unui contract încheiat de o persoană lipsită de capacitate de exercițiu?</li>
                <li>Ce rol joacă tutorele sau curatorul în protejarea drepturilor persoanelor lipsite de capacitate?</li>
              </ol>
            </div>

            <div className="case-hints">
              <button
                className="btn-toggle-hints"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Ascunde Indicii' : 'Arată Indicii'} 💡
              </button>
              {showHints && (
                <div className="hints-content">
                  <h4>Indicii:</h4>
                  <ul>
                    <li>Consultați Art. 34-41 din Codul Civil privind capacitatea de folosință</li>
                    <li>Analizați Art. 38 referitor la capacitatea de exercițiu</li>
                    <li>Studiați cazurile de incapacitate relativă și absolută</li>
                    <li>Verificați dispozițiile privind nulitatea actelor juridice</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
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

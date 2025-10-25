import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const lawCategories = [
  {
    id: 'civil',
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
  { id: 'constitutional', name: 'Drept Constitutional', subcategories: [] },
  { id: 'roman', name: 'Drept Roman', subcategories: [] }
];

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('civil');
  const [showHints, setShowHints] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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

      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Law Categories</h3>
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

        {/* Main Content */}
        <main className="main-content">
          <div className="case-display">
            <div className="case-header">
              <h2 className="case-title">Capacitatea de folosință a persoanei fizice</h2>
              <span className="case-id">Case ID: #CV-2025-001</span>
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

        {/* Chat Sidebar */}
        <aside className="chat-sidebar">
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

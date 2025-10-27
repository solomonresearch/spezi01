import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

// Mock data for demonstration
const mockCasesProgress = [
  {
    id: '1',
    caseCode: 'CIV-001',
    title: 'Capacitatea de exercițiu - Cazul minorului',
    status: 'completed',
    solvedAt: '2025-10-20',
  },
  {
    id: '2',
    caseCode: 'CIV-002',
    title: 'Persoana juridică - Înființare asociație',
    status: 'in_progress',
    solvedAt: null,
  },
  {
    id: '3',
    caseCode: 'CIV-003',
    title: 'Capacitatea de folosință',
    status: 'completed',
    solvedAt: '2025-10-25',
  },
];

const mockConversations = [
  {
    caseCode: 'CIV-001',
    caseTitle: 'Capacitatea de exercițiu - Cazul minorului',
    messages: [
      { role: 'user', content: 'Care sunt regulile privind capacitatea de exercițiu a minorilor?', timestamp: '2025-10-20 10:15' },
      { role: 'assistant', content: 'Conform art. 38-41 din Codul Civil, minorii au capacitate de exercițiu restrânsă până la vârsta de 14 ani...', timestamp: '2025-10-20 10:15' },
      { role: 'user', content: 'Și după 14 ani?', timestamp: '2025-10-20 10:17' },
      { role: 'assistant', content: 'După împlinirea vârstei de 14 ani, minorul are capacitate de exercițiu restrânsă și poate încheia singur actele juridice...', timestamp: '2025-10-20 10:17' },
    ],
  },
  {
    caseCode: 'CIV-003',
    caseTitle: 'Capacitatea de folosință',
    messages: [
      { role: 'user', content: 'Poate o persoană pierde capacitatea de folosință?', timestamp: '2025-10-25 14:30' },
      { role: 'assistant', content: 'Nu, capacitatea de folosință este caracterizată prin inalienabilitate și imprescriptibilitate...', timestamp: '2025-10-25 14:30' },
    ],
  },
];

const mockSubmissions = [
  {
    caseCode: 'CIV-001',
    caseTitle: 'Capacitatea de exercițiu - Cazul minorului',
    submittedAt: '2025-10-20 11:00',
    difficulty: 3,
    feedback: 'Excelent! Ați identificat corect toate problemele juridice și ați aplicat corespunzător articolele din Codul Civil. Structura răspunsului este clară și argumentată.',
    score: '9/10',
  },
  {
    caseCode: 'CIV-003',
    caseTitle: 'Capacitatea de folosință',
    submittedAt: '2025-10-25 15:45',
    difficulty: 5,
    feedback: 'Bună încercare, dar analiza ar putea fi mai aprofundată. Recomandăm să includeți mai multe referințe la doctrină și jurisprudență.',
    score: '7/10',
  },
];

export const Reporting = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const completedCases = mockCasesProgress.filter(c => c.status === 'completed').length;
  const inProgressCases = mockCasesProgress.filter(c => c.status === 'in_progress').length;
  const totalSubmissions = mockSubmissions.length;
  const averageScore = mockSubmissions.length > 0
    ? (mockSubmissions.reduce((sum, s) => sum + parseInt(s.score.split('/')[0]), 0) / mockSubmissions.length).toFixed(1)
    : 'N/A';

  return (
    <div className="reporting-container">
      <header className="reporting-header">
        <div className="header-left">
          <Logo />
          <span className="beta-badge">Beta v0.1</span>
          <span className="reporting-title">My Progress</span>
        </div>
        <div className="reporting-nav">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="reporting-content">
        {/* Overview Stats */}
        <section className="reporting-section stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{completedCases}</div>
            <div className="stat-label">Cases Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{inProgressCases}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{totalSubmissions}</div>
            <div className="stat-label">Submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{averageScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
        </section>

        {/* Cases Progress */}
        <section className="reporting-section">
          <div className="section-header">
            <h2>📚 Cases Overview</h2>
          </div>
          <div className="cases-progress-list">
            {mockCasesProgress.map((caseItem) => (
              <div key={caseItem.id} className="progress-case-item">
                <div className="case-info">
                  <span className="case-code">{caseItem.caseCode}</span>
                  <span className="case-title">{caseItem.title}</span>
                </div>
                <div className="case-status-info">
                  <span className={`status-badge ${caseItem.status}`}>
                    {caseItem.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                  </span>
                  {caseItem.solvedAt && (
                    <span className="solved-date">{caseItem.solvedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Conversations */}
        <section className="reporting-section">
          <div className="section-header">
            <h2>💬 AI Conversations</h2>
          </div>
          {mockConversations.map((conv, idx) => (
            <div key={idx} className="conversation-block">
              <div className="conversation-header">
                <span className="conv-case-code">{conv.caseCode}</span>
                <span className="conv-case-title">{conv.caseTitle}</span>
              </div>
              <div className="messages-list">
                {conv.messages.map((msg, msgIdx) => (
                  <div key={msgIdx} className={`message-item ${msg.role}`}>
                    <div className="message-meta">
                      <span className="message-role">{msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Submitted Solutions */}
        <section className="reporting-section">
          <div className="section-header">
            <h2>📄 Submitted Solutions & Feedback</h2>
          </div>
          {mockSubmissions.map((sub, idx) => (
            <div key={idx} className="submission-block">
              <div className="submission-header">
                <div>
                  <span className="sub-case-code">{sub.caseCode}</span>
                  <span className="sub-case-title">{sub.caseTitle}</span>
                </div>
                <div className="submission-meta">
                  <span className="difficulty-label">Difficulty: {'🔨'.repeat(sub.difficulty)}</span>
                  <span className="score-badge">{sub.score}</span>
                </div>
              </div>
              <div className="submission-info">
                <span className="submitted-date">Submitted: {sub.submittedAt}</span>
              </div>
              <div className="feedback-content">
                <strong>Feedback:</strong>
                <p>{sub.feedback}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Note about mockup data */}
        <section className="reporting-section mockup-notice">
          <p>📌 <strong>Note:</strong> This is mockup data for demonstration. Real data will be populated from your actual case interactions and submissions.</p>
        </section>
      </div>
    </div>
  );
};

import { useState } from 'react';
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
  const [conversationsExpanded, setConversationsExpanded] = useState(false);

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
        {/* Compact Stats */}
        <div className="stats-compact">
          <div className="stat-compact">
            <span className="stat-compact-value">{completedCases}</span>
            <span className="stat-compact-label">Completed</span>
          </div>
          <div className="stat-compact">
            <span className="stat-compact-value">{inProgressCases}</span>
            <span className="stat-compact-label">In Progress</span>
          </div>
          <div className="stat-compact">
            <span className="stat-compact-value">{totalSubmissions}</span>
            <span className="stat-compact-label">Submissions</span>
          </div>
          <div className="stat-compact">
            <span className="stat-compact-value">{averageScore}</span>
            <span className="stat-compact-label">Avg Score</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="reporting-grid">
          {/* Left Column */}
          <div className="reporting-left">
            {/* Submitted Solutions - Top */}
            <section className="reporting-section scrollable">
              <div className="section-header-compact">
                <h3>📄 Submitted Solutions</h3>
              </div>
              <div className="section-content">
                {mockSubmissions.map((sub, idx) => (
                  <div key={idx} className="submission-compact">
                    <div className="submission-compact-header">
                      <span className="sub-code">{sub.caseCode}</span>
                      <span className="score-compact">{sub.score}</span>
                    </div>
                    <div className="submission-compact-date">{sub.submittedAt}</div>
                    <div className="submission-compact-title">{sub.caseTitle}</div>
                    <div className="feedback-compact">{sub.feedback}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Conversations - Expandable */}
            <section className="reporting-section scrollable">
              <div
                className="section-header-compact expandable"
                onClick={() => setConversationsExpanded(!conversationsExpanded)}
              >
                <h3>💬 AI Conversations</h3>
                <span className="expand-icon">{conversationsExpanded ? '▼' : '▶'}</span>
              </div>
              {conversationsExpanded && (
                <div className="section-content">
                  {mockConversations.map((conv, idx) => (
                    <div key={idx} className="conversation-compact">
                      <div className="conv-compact-header">
                        <span className="conv-code">{conv.caseCode}</span>
                      </div>
                      <div className="conv-compact-title">{conv.caseTitle}</div>
                      <div className="messages-compact">
                        {conv.messages.map((msg, msgIdx) => (
                          <div key={msgIdx} className={`msg-compact ${msg.role}`}>
                            <div className="msg-compact-meta">
                              <span>{msg.role === 'user' ? '👤' : '🤖'}</span>
                              <span className="msg-time">{msg.timestamp}</span>
                            </div>
                            <div className="msg-compact-content">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Cases Overview */}
          <div className="reporting-right">
            <section className="reporting-section scrollable">
              <div className="section-header-compact">
                <h3>📚 Cases Overview</h3>
              </div>
              <div className="section-content">
                {/* Group by date */}
                <div className="date-divider">2025-10-25</div>
                {mockCasesProgress.filter(c => c.solvedAt === '2025-10-25').map((caseItem) => (
                  <div key={caseItem.id} className="case-compact">
                    <div className="case-compact-code">{caseItem.caseCode}</div>
                    <div className="case-compact-title">{caseItem.title}</div>
                    <div className={`case-compact-status ${caseItem.status}`}>
                      {caseItem.status === 'completed' ? '✓' : '⏳'}
                    </div>
                  </div>
                ))}

                <div className="date-divider">2025-10-20</div>
                {mockCasesProgress.filter(c => c.solvedAt === '2025-10-20').map((caseItem) => (
                  <div key={caseItem.id} className="case-compact">
                    <div className="case-compact-code">{caseItem.caseCode}</div>
                    <div className="case-compact-title">{caseItem.title}</div>
                    <div className={`case-compact-status ${caseItem.status}`}>
                      {caseItem.status === 'completed' ? '✓' : '⏳'}
                    </div>
                  </div>
                ))}

                <div className="date-divider">In Progress</div>
                {mockCasesProgress.filter(c => !c.solvedAt).map((caseItem) => (
                  <div key={caseItem.id} className="case-compact">
                    <div className="case-compact-code">{caseItem.caseCode}</div>
                    <div className="case-compact-title">{caseItem.title}</div>
                    <div className={`case-compact-status ${caseItem.status}`}>
                      {caseItem.status === 'completed' ? '✓' : '⏳'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

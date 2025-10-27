import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

interface Submission {
  id: string;
  case_code: string;
  case_title: string;
  submitted_at: string;
  difficulty_rating: number;
  feedback_text: string;
  score: string;
  score_value: number;
  status: string;
}

interface Conversation {
  id: string;
  case_code: string | null;
  case_title: string | null;
  conversation_data: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  message_count: number;
  last_message_at: string;
}

interface CaseProgress {
  id: string;
  case_code: string;
  title: string;
  status: 'completed' | 'in_progress';
  solved_at: string | null;
}

export const Reporting = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [expandedConvs, setExpandedConvs] = useState<Set<number>>(new Set());

  // State for real data
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [casesProgress, setCasesProgress] = useState<CaseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from Supabase
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('submissions_with_details')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
      } else if (data) {
        setSubmissions(data as Submission[]);
      }
    };

    fetchSubmissions();
  }, [user?.id]);

  // Fetch conversations from Supabase
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          id,
          case_id,
          conversation_data,
          message_count,
          last_message_at,
          cases:case_id (
            case_code,
            title
          )
        `)
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
      } else if (data) {
        const formattedConversations: Conversation[] = data.map((conv: any) => ({
          id: conv.id,
          case_code: conv.cases?.case_code || null,
          case_title: conv.cases?.title || 'General Conversation',
          conversation_data: conv.conversation_data,
          message_count: conv.message_count,
          last_message_at: conv.last_message_at
        }));
        setConversations(formattedConversations);
      }
    };

    fetchConversations();
  }, [user?.id]);

  // Fetch cases progress
  useEffect(() => {
    const fetchCasesProgress = async () => {
      if (!user?.id) return;

      // Get all cases that have submissions
      const { data: submissionData, error } = await supabase
        .from('case_submissions')
        .select(`
          case_id,
          score_value,
          submitted_at,
          cases:case_id (
            id,
            case_code,
            title
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases progress:', error);
      } else if (submissionData) {
        // Group by case and determine status
        const casesMap = new Map<string, CaseProgress>();

        submissionData.forEach((sub: any) => {
          if (!sub.cases) return;

          const caseId = sub.cases.id;
          const isPassed = sub.score_value && sub.score_value > 50;

          if (!casesMap.has(caseId)) {
            casesMap.set(caseId, {
              id: caseId,
              case_code: sub.cases.case_code,
              title: sub.cases.title,
              status: isPassed ? 'completed' : 'in_progress',
              solved_at: isPassed ? sub.submitted_at : null
            });
          } else {
            // Update status if this submission passed
            const existing = casesMap.get(caseId)!;
            if (isPassed && existing.status === 'in_progress') {
              existing.status = 'completed';
              existing.solved_at = sub.submitted_at;
            }
          }
        });

        setCasesProgress(Array.from(casesMap.values()));
      }

      setLoading(false);
    };

    fetchCasesProgress();
  }, [user?.id]);

  // Calculate stats from real data
  const completedCases = submissions.filter(sub => {
    return sub.score_value && sub.score_value > 50;
  }).length;

  const totalSubmissions = submissions.length;

  // Average score across all submissions
  const averageScore = submissions.length > 0
    ? (submissions.reduce((sum, s) => {
        return sum + (s.score_value || 0);
      }, 0) / submissions.length).toFixed(1)
    : 'N/A';

  const toggleConversation = (idx: number) => {
    const newExpanded = new Set(expandedConvs);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedConvs(newExpanded);
  };

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
            <span className="stat-compact-value">{totalSubmissions}</span>
            <span className="stat-compact-label">Submissions</span>
          </div>
          <div className="stat-compact">
            <span className="stat-compact-value">{averageScore}%</span>
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
                {loading ? (
                  <div className="loading-message">Se încarcă soluțiile...</div>
                ) : submissions.length === 0 ? (
                  <div className="empty-message">Nu ai soluții trimise încă</div>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="submission-compact">
                      <div className="submission-compact-header">
                        <span className="sub-code">{sub.case_code}</span>
                        <span className="score-compact">{sub.score || 'În curs'}</span>
                      </div>
                      <div className="submission-compact-date">
                        {new Date(sub.submitted_at).toLocaleString('ro-RO')}
                      </div>
                      <div className="submission-compact-title">{sub.case_title}</div>
                      <div className="feedback-compact">
                        {sub.feedback_text
                          ? sub.feedback_text.substring(0, 150) + (sub.feedback_text.length > 150 ? '...' : '')
                          : 'Așteptăm evaluarea...'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* AI Conversations - Each expandable */}
            <section className="reporting-section scrollable">
              <div className="section-header-compact">
                <h3>💬 AI Conversations</h3>
              </div>
              <div className="section-content">
                {loading ? (
                  <div className="loading-message">Se încarcă conversațiile...</div>
                ) : conversations.length === 0 ? (
                  <div className="empty-message">Nu ai conversații încă</div>
                ) : (
                  conversations.map((conv, idx) => (
                    <div key={conv.id} className="conversation-compact">
                      <div
                        className="conv-compact-header expandable"
                        onClick={() => toggleConversation(idx)}
                      >
                        <span className="conv-code">{conv.case_code || 'General'}</span>
                        <span className="expand-icon">{expandedConvs.has(idx) ? '▼' : '▶'}</span>
                      </div>
                      <div className="conv-compact-title">{conv.case_title}</div>
                      {expandedConvs.has(idx) && (
                        <div className="messages-compact">
                          {conv.conversation_data.map((msg, msgIdx) => (
                            <div key={msgIdx} className={`msg-compact ${msg.role}`}>
                              <div className="msg-compact-meta">
                                <span>{msg.role === 'user' ? '👤' : '🤖'}</span>
                                <span className="msg-time">
                                  {new Date(msg.timestamp).toLocaleString('ro-RO', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="msg-compact-content">{msg.content}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Cases Overview */}
          <div className="reporting-right">
            <section className="reporting-section scrollable">
              <div className="section-header-compact">
                <h3>📚 Cases Overview</h3>
              </div>
              <div className="section-content">
                {loading ? (
                  <div className="loading-message">Se încarcă cazurile...</div>
                ) : casesProgress.length === 0 ? (
                  <div className="empty-message">Nu ai început încă niciun caz</div>
                ) : (
                  <>
                    {/* Group cases by date */}
                    {(() => {
                      // Group by date
                      const byDate = new Map<string, CaseProgress[]>();
                      const inProgress: CaseProgress[] = [];

                      casesProgress.forEach(caseItem => {
                        if (caseItem.status === 'completed' && caseItem.solved_at) {
                          const date = new Date(caseItem.solved_at).toLocaleDateString('ro-RO');
                          if (!byDate.has(date)) {
                            byDate.set(date, []);
                          }
                          byDate.get(date)!.push(caseItem);
                        } else {
                          inProgress.push(caseItem);
                        }
                      });

                      // Sort dates descending
                      const sortedDates = Array.from(byDate.keys()).sort((a, b) => {
                        return new Date(b.split('.').reverse().join('-')).getTime() -
                               new Date(a.split('.').reverse().join('-')).getTime();
                      });

                      return (
                        <>
                          {sortedDates.map(date => (
                            <div key={date}>
                              <div className="date-divider">{date}</div>
                              {byDate.get(date)!.map((caseItem) => (
                                <div key={caseItem.id} className="case-compact">
                                  <div className="case-compact-code">{caseItem.case_code}</div>
                                  <div className="case-compact-title">{caseItem.title}</div>
                                  <div className={`case-compact-status ${caseItem.status}`}>
                                    {caseItem.status === 'completed' ? '✓' : '⏳'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}

                          {inProgress.length > 0 && (
                            <div>
                              <div className="date-divider">In Progress</div>
                              {inProgress.map((caseItem) => (
                                <div key={caseItem.id} className="case-compact">
                                  <div className="case-compact-code">{caseItem.case_code}</div>
                                  <div className="case-compact-title">{caseItem.title}</div>
                                  <div className={`case-compact-status ${caseItem.status}`}>
                                    {caseItem.status === 'completed' ? '✓' : '⏳'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

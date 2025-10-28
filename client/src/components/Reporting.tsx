import { useState, useEffect } from 'react';
import { FileText, MessageCircle, User, Bot, Check, Clock, BookOpen, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

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
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="outline" className="hidden sm:flex">Beta v0.1</Badge>
            <h1 className="text-lg sm:text-xl font-semibold hidden sm:block">My Progress</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{completedCases}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{totalSubmissions}</div>
              <div className="text-sm text-muted-foreground">Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{averageScore}%</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Submitted Solutions - Top */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Submitted Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Se încarcă soluțiile...</div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Nu ai soluții trimise încă</div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{sub.case_code}</Badge>
                            <span className="text-sm font-semibold">{sub.score || 'În curs'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(sub.submitted_at).toLocaleString('ro-RO')}
                          </div>
                          <div className="font-medium text-sm">{sub.case_title}</div>
                          <div className="text-sm text-muted-foreground">
                            {sub.feedback_text
                              ? sub.feedback_text.substring(0, 150) + (sub.feedback_text.length > 150 ? '...' : '')
                              : 'Așteptăm evaluarea...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* AI Conversations - Each expandable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  AI Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Se încarcă conversațiile...</div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Nu ai conversații încă</div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.map((conv, idx) => (
                        <div key={conv.id} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleConversation(idx)}
                            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{conv.case_code || 'General'}</Badge>
                              </div>
                              <div className="font-medium text-sm">{conv.case_title}</div>
                            </div>
                            {expandedConvs.has(idx) ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          {expandedConvs.has(idx) && (
                            <div className="border-t bg-muted/30 p-4 space-y-3 max-h-96 overflow-y-auto">
                              {conv.conversation_data.map((msg, msgIdx) => (
                                <div
                                  key={msgIdx}
                                  className={`flex gap-2 ${
                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`max-w-[85%] rounded-lg p-3 ${
                                      msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-background border'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                                      {msg.role === 'user' ? (
                                        <User className="h-3 w-3" />
                                      ) : (
                                        <Bot className="h-3 w-3" />
                                      )}
                                      <span>
                                        {new Date(msg.timestamp).toLocaleString('ro-RO', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    <div className="text-sm">{msg.content}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cases Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Cases Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[832px] pr-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Se încarcă cazurile...</div>
                  ) : casesProgress.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Nu ai început încă niciun caz</div>
                  ) : (
                    <div className="space-y-6">
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
                              <div key={date} className="space-y-2">
                                <div className="text-sm font-semibold text-muted-foreground px-2 py-1 bg-muted rounded">
                                  {date}
                                </div>
                                <div className="space-y-2">
                                  {byDate.get(date)!.map((caseItem) => (
                                    <div key={caseItem.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{caseItem.case_code}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{caseItem.title}</div>
                                      </div>
                                      <div className={`p-2 rounded-full ${
                                        caseItem.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400'
                                      }`}>
                                        {caseItem.status === 'completed' ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          <Clock className="h-4 w-4" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {inProgress.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-muted-foreground px-2 py-1 bg-muted rounded">
                                  In Progress
                                </div>
                                <div className="space-y-2">
                                  {inProgress.map((caseItem) => (
                                    <div key={caseItem.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{caseItem.case_code}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{caseItem.title}</div>
                                      </div>
                                      <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
                                        <Clock className="h-4 w-4" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

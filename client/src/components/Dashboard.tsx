import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCasesBySubcategory, useCase } from '../hooks/useCases';
import { useChat } from '../hooks/useChat';
import { useAssessment } from '../hooks/useAssessment';
import { Logo } from './Logo';
import { FeedbackDialog } from './FeedbackDialog';
import { CIVIL_LAW_CATEGORIES } from '../constants/civilLawCategories';
import { CONSTITUTIONAL_LAW_CATEGORIES } from '../constants/constitutionalLawCategories';
import type { Case } from '../types/case';
import type { ChatContext } from '../types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Hammer,
  BookOpen,
  Bot,
  Check,
  Scale,
  Target,
  Zap,
  Book,
  XCircle,
  Send,
  Search,
  Menu,
  X,
  Shield,
  CheckCircle,
  FileText,
  HelpCircle,
  Eye,
  Lightbulb,
  Sparkles
} from 'lucide-react';

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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [mobileCodeOpen, setMobileCodeOpen] = useState(false);
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

  // Toast notifications for assessment
  useEffect(() => {
    if (assessmentError) {
      toast.error('Eroare la evaluare', {
        description: assessmentError
      });
    }
  }, [assessmentError]);

  useEffect(() => {
    if (aiDetectionPassed === false) {
      toast.error('Text generat de AI detectat', {
        description: 'Te rugăm să scrii soluția cu propriile tale cuvinte.'
      });
    }
  }, [aiDetectionPassed]);

  useEffect(() => {
    if (assessmentResult && aiDetectionPassed === true) {
      toast.success('Evaluare completă!', {
        description: 'Soluția ta a fost evaluată cu succes.'
      });
    }
  }, [assessmentResult, aiDetectionPassed]);

  // AI Chat hook
  const { messages, isLoading: chatLoading, error: chatError, sendMessage } = useChat({
    caseId: selectedCaseId,
    userId: user?.id,
    caseContext: chatContext
  });
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Toast notification for chat errors
  useEffect(() => {
    if (chatError) {
      toast.error('Eroare la trimiterea mesajului', {
        description: chatError
      });
    }
  }, [chatError]);

  const codeTypes = [
    { id: 'civil', name: 'Codul Civil', icon: <Scale className="h-4 w-4" /> },
    { id: 'constitution', name: 'Constituția României', icon: <Book className="h-4 w-4" /> },
    { id: 'criminal', name: 'Codul Penal', icon: <Shield className="h-4 w-4" /> }
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
    setMobileSheetOpen(false); // Close mobile sheet when case is selected
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
    if (normalizedLevel === 'ușor') return <span className="inline-block w-2 h-2 rounded-full bg-green-500" />;
    if (normalizedLevel === 'mediu') return <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />;
    if (normalizedLevel === 'dificil') return <span className="inline-block w-2 h-2 rounded-full bg-red-500" />;
    return null;
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

  // Reusable sidebar content for both desktop and mobile
  const renderSidebarContent = () => (
    <>
      {/* Global Search for Cases */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Caută caz după cod sau titlu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Șterge căutarea"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {lawCategories.map((domain) => (
            <div key={domain.id} className="mb-1">
              <button
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                  expandedCategory === domain.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => toggleCategory(domain.id)}
              >
                <span>{domain.name}</span>
                {domain.categories && domain.categories.length > 0 && (
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    expandedCategory === domain.id ? 'rotate-90' : ''
                  }`} />
                )}
              </button>

              {expandedCategory === domain.id && domain.categories && domain.categories.length > 0 && (
                <ul className="ml-2 mt-1 space-y-1">
                  {domain.categories.map((category) => {
                    const isExpanded = domain.id === 'civil'
                      ? expandedCivilCategory === category.id
                      : expandedConstitutionalCategory === category.id;
                    const toggleFunc = domain.id === 'civil'
                      ? toggleCivilCategory
                      : toggleConstitutionalCategory;

                    return (
                      <li key={category.id}>
                        <button
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                            isExpanded
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => toggleFunc(category.id)}
                          title={category.description}
                        >
                          <span>{category.name}</span>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronRight className={`h-3 w-3 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`} />
                          )}
                        </button>
                        {isExpanded && category.subcategories && (
                          <ul className="ml-2 mt-1 space-y-1">
                            {category.subcategories.map((sub, idx) => (
                              <li key={idx}>
                                <button
                                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                                    expandedSubcategory === sub
                                      ? 'bg-secondary text-secondary-foreground font-medium'
                                      : 'hover:bg-accent/30'
                                  }`}
                                  onClick={() => toggleSubcategory(sub)}
                                >
                                  <span className="truncate">{sub.replace(category.name + ' (', '').replace(')', '')}</span>
                                  {expandedSubcategory === sub && cases.length > 0 && (
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  )}
                                </button>
                                {/* Show cases under selected subcategory */}
                                {expandedSubcategory === sub && (
                                  <ul className="ml-2 mt-1 space-y-0.5">
                                    {casesLoading ? (
                                      <>
                                        <li className="px-2 py-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <Skeleton className="h-5 w-8" />
                                            <Skeleton className="h-5 flex-1" />
                                          </div>
                                        </li>
                                        <li className="px-2 py-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <Skeleton className="h-5 w-8" />
                                            <Skeleton className="h-5 flex-1" />
                                          </div>
                                        </li>
                                        <li className="px-2 py-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <Skeleton className="h-5 w-8" />
                                            <Skeleton className="h-5 flex-1" />
                                          </div>
                                        </li>
                                      </>
                                    ) : cases.length === 0 ? (
                                      <li className="px-3 py-1.5 text-xs text-muted-foreground">Nu există cazuri</li>
                                    ) : (
                                      cases
                                        .filter(matchesSearchCases)
                                        .map((caseItem) => (
                                          <li key={caseItem.id}>
                                            <button
                                              className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                                                selectedCaseId === caseItem.id
                                                  ? 'bg-primary text-primary-foreground'
                                                  : 'hover:bg-accent/50'
                                              }`}
                                              onClick={() => handleCaseClick(caseItem)}
                                            >
                                              <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                                                {getDifficultyBadge(caseItem.level)}
                                              </Badge>
                                              {caseItem.verified && (
                                                <span title="Verificat de profesionist">
                                                  <Check className="h-3 w-3 text-green-600" />
                                                </span>
                                              )}
                                              <span className="truncate text-left">
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
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with Tailwind */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center px-4 gap-4">
          {/* Left section: Mobile menu + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile menu button */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 flex flex-col">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle>Law Categories</SheetTitle>
                </SheetHeader>
                {renderSidebarContent()}
              </SheetContent>
            </Sheet>

            <button
              onClick={() => navigate('/dashboard')}
              title="Go to Dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              <Logo />
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">Beta v0.1</Badge>
            </button>
          </div>

          {/* Center section: Experimental notice */}
          <div className="flex-1 flex items-center justify-center">
            <Badge variant="outline" className="hidden md:inline-flex text-xs border-amber-500/50 text-amber-600 dark:text-amber-400">
              Versiune experimentală - Poate conține erori
            </Badge>
          </div>

          {/* Right section: User actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <Button
              onClick={() => navigate('/case-generator')}
              className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generator de Cazuri</span>
              <span className="sm:hidden">Generator</span>
            </Button>
            <Button
              onClick={() => navigate('/reporting')}
              variant="ghost"
              size="sm"
              title="My Progress"
              className="hidden sm:inline-flex"
            >
              Progress
            </Button>
            {profile?.is_admin && (
              <Button
                onClick={() => navigate('/admin')}
                variant="ghost"
                size="sm"
                title="Admin Panel"
                className="hidden sm:inline-flex"
              >
                Admin
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="text-sm hidden sm:inline">{profile?.username}</span>
                  <span className="text-sm sm:hidden">{profile?.username}</span>
                  <span className="text-xs">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Setări
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/reporting')}>
                  Progress
                </DropdownMenuItem>
                {profile?.is_admin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        {!sidebarCollapsed && (
          <aside className="hidden lg:flex w-80 border-r border-border bg-muted/30 flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-lg font-semibold">Law Categories</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                title="Hide sidebar"
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {renderSidebarContent()}
          </aside>
        )}

        {/* Collapsed sidebar toggle button - Hidden on mobile */}
        {sidebarCollapsed && (
          <Button
            variant="secondary"
            size="icon"
            className="hidden lg:flex fixed left-2 top-20 z-40 h-10 w-10 shadow-lg"
            onClick={toggleSidebar}
            title="Show sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Main Content with Tailwind */}
        <main className="flex-1 overflow-y-auto bg-background">
          {caseLoading ? (
            <div className="container max-w-6xl mx-auto p-6 space-y-6">
              {/* Assessment Module Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
              </Card>

              {/* Case Header Skeleton */}
              <div className="pb-4 border-b border-border space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>

              {/* Case Content Skeletons */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          ) : !caseData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-6">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Selectează un caz</h2>
                  <p className="text-muted-foreground">Alege un caz din bara laterală pentru a începe studiul.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="container max-w-6xl mx-auto p-6 space-y-6">
              {/* Assessment Module with Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <button
                    onClick={toggleAssessmentModule}
                    className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      <Book className="h-5 w-5" />
                      Rezolvă speța!
                    </CardTitle>
                    <ChevronRight className={`h-5 w-5 transition-transform ${assessmentExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </CardHeader>

                {assessmentExpanded && (
                  <CardContent className="space-y-4">
                    {/* Difficulty Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Exigența corectorului:</Label>
                      <div className="flex gap-2 flex-nowrap">
                        <Button
                          variant={difficultyLevel === 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleDifficultyChange(1)}
                          title="Ciocan Juridic Ușor"
                          className="flex-1 min-w-[100px]"
                        >
                          <Hammer className="mr-1 h-4 w-4" />
                          Ușor
                        </Button>
                        <Button
                          variant={difficultyLevel === 3 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleDifficultyChange(3)}
                          title="Ciocan Juridic Mediu"
                          className="flex-1 min-w-[100px] gap-0.5"
                        >
                          <Hammer className="h-3.5 w-3.5" />
                          <Hammer className="h-3.5 w-3.5" />
                          <Hammer className="h-3.5 w-3.5" />
                          <span className="ml-1">Mediu</span>
                        </Button>
                        <Button
                          variant={difficultyLevel === 5 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleDifficultyChange(5)}
                          title="Ciocan Juridic Greu"
                          className="flex-1 min-w-[100px] gap-0.5"
                        >
                          <Hammer className="h-3 w-3" />
                          <Hammer className="h-3 w-3" />
                          <Hammer className="h-3 w-3" />
                          <Hammer className="h-3 w-3" />
                          <Hammer className="h-3 w-3" />
                          <span className="ml-1">Greu</span>
                        </Button>
                      </div>
                    </div>

                    {/* Solution Textarea */}
                    <div className="space-y-2">
                      <Label htmlFor="solution">Soluția Ta:</Label>
                      <Textarea
                        id="solution"
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                        placeholder={SOLUTION_TEMPLATE}
                        rows={15}
                        disabled={isDetecting || isAssessing}
                        className="font-mono text-sm"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleAssessmentSubmit}
                      disabled={!solutionText.trim() || isDetecting || isAssessing}
                      className="w-full"
                      size="lg"
                    >
                      {isDetecting ? 'Verificare AI în curs...' : isAssessing ? 'Evaluare în curs...' : 'Evaluează Soluția'}
                    </Button>

                    {/* Loading Spinner */}
                    {(isDetecting || isAssessing) && (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        <p className="text-sm text-muted-foreground">
                          {isDetecting ? 'Se verifică autenticitatea textului...' : 'Se evaluează soluția...'}
                        </p>
                      </div>
                    )}

                    {/* AI Detection Failed Message */}
                    {aiDetectionPassed === false && (
                      <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 text-center">
                        <div className="space-y-3">
                          <div className="flex justify-center gap-2">
                            <XCircle className="h-10 w-10 text-destructive" />
                            <Bot className="h-10 w-10 text-destructive" />
                          </div>
                          <p className="text-lg font-medium text-destructive">
                            No, pe bune! Dar de ce folosesti AI sa rezolvi?
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {assessmentError && (
                      <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                        {assessmentError}
                      </div>
                    )}

                    {/* Assessment Result */}
                    {assessmentResult && aiDetectionPassed === true && (
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              Evaluare Completă
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                resetAssessment();
                                setSolutionText('');
                              }}
                            >
                              Resetează
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{assessmentResult}</pre>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Case Header with Tailwind */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {caseData.case_code}: {caseData.title.replace(/^Caz \d+:\s*/i, '')}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-sm">
                      {getDifficultyBadge(caseData.level)} {caseData.level}
                    </Badge>
                    {caseData.verified && (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Verificat
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Case Content Sections with Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Problema juridică
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{caseData.legal_problem}</p>
                </CardContent>
              </Card>

              {articles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Articole relevante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {articles.map((article) => (
                        <Badge key={article.id} variant="outline" className="text-xs">
                          {article.article_reference}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Speta (Cazul)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{caseData.case_description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Întrebare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed font-medium">{caseData.question}</p>
                </CardContent>
              </Card>

              {steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Pași de analiză așteptați
                      </CardTitle>
                      <ChevronRight className={`h-5 w-5 transition-transform ${showSteps ? 'rotate-90' : ''}`} />
                    </button>
                  </CardHeader>
                  {showSteps && (
                    <CardContent>
                      <ol className="list-decimal list-inside space-y-2">
                        {steps.map((step) => (
                          <li key={step.id} className="text-foreground leading-relaxed">
                            {step.step_description}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  )}
                </Card>
              )}

              {hints.length > 0 && (
                <Card>
                  <CardHeader>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Indicii
                      </CardTitle>
                      <ChevronRight className={`h-5 w-5 transition-transform ${showHints ? 'rotate-90' : ''}`} />
                    </button>
                  </CardHeader>
                  {showHints && (
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {hints.map((hint) => (
                          <li key={hint.id} className="text-foreground leading-relaxed">
                            {hint.hint_text}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>
          )}
        </main>

        {/* Mobile Floating Action Buttons - Visible only on mobile */}
        <div className="lg:hidden fixed bottom-4 right-4 flex flex-col gap-2 z-40">
          {/* AI Chat Button */}
          <Sheet open={mobileChatOpen} onOpenChange={setMobileChatOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
                title="AI Assistant"
              >
                <Bot className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
              <SheetHeader className="px-4 py-3 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Assistant
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                          <p className="text-sm animate-pulse">...</p>
                        </div>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Scrie întrebarea ta aici..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={chatLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Code Reference Button */}
          <Sheet open={mobileCodeOpen} onOpenChange={setMobileCodeOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-14 w-14 rounded-full shadow-lg"
                title="Legal Code Reference"
              >
                <Book className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
              <SheetHeader className="px-4 py-3 border-b">
                <SheetTitle>Legal Code Reference</SheetTitle>
              </SheetHeader>
              <Tabs
                value={selectedCodeType}
                onValueChange={(value) => handleCodeTypeClick(value as any)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="px-4 pt-3">
                  <TabsList className="grid w-full grid-cols-3">
                    {codeTypes.map((code) => (
                      <TabsTrigger
                        key={code.id}
                        value={code.id}
                        className="text-xs"
                      >
                        <span className="mr-1">{code.icon}</span>
                        <span className="hidden sm:inline">{code.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden p-4">
                  <TabsContent value="civil" className="h-full m-0">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">
                          Se încarcă Codul Civil...
                        </p>
                      </div>
                    ) : civilCodeText ? (
                      <ScrollArea className="h-full">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {civilCodeText}
                        </pre>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Nu există text</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="constitution" className="h-full m-0">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">
                          Se încarcă Constituția...
                        </p>
                      </div>
                    ) : constitutionText ? (
                      <ScrollArea className="h-full">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {constitutionText}
                        </pre>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Nu există text</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="criminal" className="h-full m-0">
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                      <div className="rounded-full bg-muted p-6">
                        <Shield className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">În curând</p>
                        <p className="text-sm text-muted-foreground">Acest cod nu este disponibil încă</p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right Sidebar - Code + Chat (Hidden on mobile) */}
        <aside className="hidden lg:flex w-[450px] border-l border-border flex-col bg-background">
          {/* Legal Code Display */}
          <Card
            className="rounded-none border-0 border-b flex flex-col"
            style={{ height: `${codeContainerHeight}px` }}
          >
            <Tabs
              value={selectedCodeType}
              onValueChange={(value) => handleCodeTypeClick(value as any)}
              className="flex flex-col h-full"
            >
              <CardHeader className="pb-2">
                <TabsList className="grid w-full grid-cols-3">
                  {codeTypes.map((code) => (
                    <TabsTrigger
                      key={code.id}
                      value={code.id}
                      className="text-xs"
                    >
                      <span className="mr-1">{code.icon}</span>
                      {code.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                <TabsContent value="civil" className="h-full m-0 p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">
                        Se încarcă Codul Civil...
                      </p>
                    </div>
                  ) : civilCodeText ? (
                    <ScrollArea className="h-full">
                      <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                        {civilCodeText}
                      </pre>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Nu există text</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="constitution" className="h-full m-0 p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">
                        Se încarcă Constituția...
                      </p>
                    </div>
                  ) : constitutionText ? (
                    <ScrollArea className="h-full">
                      <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                        {constitutionText}
                      </pre>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Nu există text</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="criminal" className="h-full m-0 p-4">
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <div className="rounded-full bg-muted p-6">
                      <Shield className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">În curând</p>
                      <p className="text-sm text-muted-foreground">Acest cod nu este disponibil încă</p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Resize Handle */}
          <div
            className="h-1 cursor-row-resize bg-border hover:bg-primary/50 transition-colors flex items-center justify-center group"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          >
            <div className="w-12 h-0.5 bg-muted-foreground/30 group-hover:bg-primary/70 rounded-full"></div>
          </div>

          {/* AI Chat with Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                        <p className="text-sm animate-pulse">...</p>
                      </div>
                    </div>
                  )}
                  {chatError && (
                    <div className="flex justify-start">
                      <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg px-4 py-2 max-w-[85%]">
                        <p className="text-sm">{chatError}</p>
                      </div>
                    </div>
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Scrie întrebarea ta aici..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={chatLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    size="default"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Trimite
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-3 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <FeedbackDialog
            variant="outline"
            size="sm"
            className="text-xs"
          />
        </div>
      </footer>
    </div>
  );
};

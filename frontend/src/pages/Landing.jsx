import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Mic,
  FileText,
  CheckSquare,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Network,
  Download,
  Shield,
  Clock,
  GraduationCap,
  Briefcase,
  Zap,
  Menu,
  X,
  PlayCircle,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';

export default function Landing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Mic,
      title: 'Audio Transcription',
      desc: 'High-accuracy Whisper AI transcribes lectures, conferences, and conversations into clear text in seconds.',
      color: 'bg-lavender-light text-lavender-dark'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      desc: 'Get concise executive overviews, key topics, and critical bullet points without reading hours of transcripts.',
      color: 'bg-powder text-blue-700'
    },
    {
      icon: FileText,
      title: 'Smart Meeting Minutes',
      desc: 'Automatic extraction of meeting context, key discussions, raised questions, and unresolved topics.',
      color: 'bg-peach text-orange-700'
    },
    {
      icon: CheckSquare,
      title: 'Action Items & Decisions',
      desc: 'Pinpoint explicit commitments, tasks, assignees, and deadlines. Zero hallucinated dates or people.',
      color: 'bg-sage text-emerald-700'
    },
    {
      icon: BookOpen,
      title: 'Lecture Notes & Study Guides',
      desc: 'Structured revision materials with core concepts, clear explanations, definitions, and takeaways.',
      color: 'bg-lavender-light text-lavender-dark'
    },
    {
      icon: HelpCircle,
      title: 'Quiz & MCQ Generation',
      desc: 'Custom quizzes with difficulty options and four-choice questions with answers verified by source context.',
      color: 'bg-powder text-blue-700'
    },
    {
      icon: MessageSquare,
      title: 'Chat with Your Transcript',
      desc: 'Ask direct questions like "What tasks were assigned to me?" or "Explain topic 2" with instant grounded answers.',
      color: 'bg-sage text-emerald-700'
    },
    {
      icon: Network,
      title: 'Automatic Mind Maps',
      desc: 'Visual node relationships connecting topics, sub-themes, and ideas for enhanced spatial retention.',
      color: 'bg-peach text-orange-700'
    },
    {
      icon: Download,
      title: 'PDF & DOCX Export',
      desc: 'Export beautifully formatted PDF documents and Word files with structured headers, bullets, and tables.',
      color: 'bg-lavender-light text-lavender-dark'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload or Paste Content',
      desc: 'Drop your MP3, WAV, or M4A audio files, or directly paste lecture slides, transcripts, or meeting logs.',
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'AI Generates Structure',
      desc: 'MindNotes AI analyzes the recording, extracting executive summaries, action items, definitions, and mind maps.',
      badge: 'Step 2'
    },
    {
      step: '03',
      title: 'Study, Chat & Export',
      desc: 'Engage with transcript Q&A, test your retention with tailored quizzes, and export professional PDF or Word reports.',
      badge: 'Step 3'
    }
  ];

  const benefits = [
    {
      icon: GraduationCap,
      category: 'For Students & Researchers',
      title: 'Learn Faster with Tailored Retention',
      bullets: [
        'Turn 2-hour university lectures into 5-minute structured study sheets',
        'Auto-generate practice exam questions to assess exam readiness',
        'Search specific transcript passages when writing essays or revision'
      ]
    },
    {
      icon: Briefcase,
      category: 'For Teams & Professionals',
      title: 'Zero Ambiguity After Every Meeting',
      bullets: [
        'Never lose track of who agreed to what deadline or deliverable',
        'Share clean PDF/DOCX summaries with stakeholders in one click',
        'Ask the AI for quick recaps during post-meeting catchups'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#302C3B] selection:bg-lavender-light selection:text-lavender-dark overflow-x-hidden font-sans">
      {/* Background Soft Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-lavender-light/40 blur-3xl mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-powder/50 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-peach/40 blur-3xl mix-blend-multiply" />
      </div>

      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-lavender-light/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-lavender transition-colors">
              MindNotes AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-500">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              About & Benefits
            </button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary px-5 py-2.5 text-sm shadow-sm">
                Open Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-lavender-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2.5 text-sm shadow-sm group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-lavender-light px-6 py-5 space-y-4 shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-3 font-medium text-gray-600">
              <button
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left py-2 hover:text-lavender-dark"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left py-2 hover:text-lavender-dark"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left py-2 hover:text-lavender-dark"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-left py-2 hover:text-lavender-dark"
              >
                About & Benefits
              </button>
            </div>
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
              {user ? (
                <Link to="/dashboard" className="btn-primary w-full py-3 text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full py-2.5 text-center">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary w-full py-2.5 text-center">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 2. Hero Section */}
        <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-lavender-light/70 border border-lavender/30 text-lavender-dark text-xs sm:text-sm font-semibold mb-8 shadow-xs">
              <Sparkles className="w-4 h-4 text-lavender" />
              <span>Next-Generation AI Note-Taking & Meeting Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
              Turn Every Conversation into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender via-primary-600 to-primary-900">
                Clarity.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              Transform lectures, meetings, and recordings into organized notes, actionable insights,
              and personalized learning materials with AI.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-soft hover:shadow-md group"
              >
                <span>{user ? 'Open Your Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="btn-secondary w-full sm:w-auto px-7 py-3.5 text-base font-semibold"
              >
                <PlayCircle className="w-5 h-5 mr-2 text-lavender" />
                Explore Features
              </button>
            </div>
          </div>

          {/* Interactive Visual Dashboard Mockup */}
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-white/80 shadow-2xl relative overflow-hidden">
              {/* Inner Mockup Container */}
              <div className="bg-[#FAF9FC] rounded-2xl border border-lavender-light/70 p-5 sm:p-7 space-y-6">
                {/* Mockup Header Bar */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-200/60 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-2">
                      Lecture Session: Advanced Neural Architectures & Applications
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage text-emerald-800">
                      ✓ Transcribed in 4.2s
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-powder text-blue-800">
                      Academic Mode
                    </span>
                  </div>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="p-4 bg-white rounded-xl border border-lavender-light/60 flex items-center space-x-4 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-white flex-shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Recorded Lecture Audio (48:20)</span>
                      <span>100% Processed</span>
                    </div>
                    {/* Simulated Waveform Bars */}
                    <div className="flex items-end space-x-1 h-6 pt-1">
                      {[40, 65, 30, 85, 95, 60, 45, 75, 90, 35, 70, 85, 45, 95, 65, 80, 50, 90, 75, 40, 85, 95, 60, 45, 70, 85, 50, 75, 90, 60, 40, 70, 85, 40, 60].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-lavender rounded-full opacity-80 hover:opacity-100 transition-opacity"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mockup Output Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1: Executive Summary */}
                  <div className="card-soft p-5 bg-white relative">
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center text-lavender-dark">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">AI Summary</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      In-depth breakdown of transformer attention mechanisms, sequence embeddings, and parameter optimization.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-start text-xs text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-lavender mt-1.5 mr-2 flex-shrink-0" />
                        <span>Self-attention computes cross-token relevance</span>
                      </div>
                      <div className="flex items-start text-xs text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-lavender mt-1.5 mr-2 flex-shrink-0" />
                        <span>Multi-head layers learn distinct representations</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Action Items / Key Topics */}
                  <div className="card-soft p-5 bg-white">
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-emerald-700">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">Action Items</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                        <p className="font-semibold text-gray-800">Complete Lab 4 code notebook</p>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                          <span className="text-blue-600 font-medium">Due: Friday 5 PM</span>
                          <span>Priority: High</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                        <p className="font-semibold text-gray-800">Review Flashcards for Exam 1</p>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                          <span className="text-orange-600 font-medium">Chapters 3-5</span>
                          <span>Self-Paced</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Interactive Mind-Map Preview */}
                  <div className="card-soft p-5 bg-white">
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center text-orange-700">
                        <Network className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">Connected Mind Map</h4>
                    </div>
                    <div className="h-32 bg-gray-50/70 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative p-2 overflow-hidden">
                      {/* Interactive Visual Node Diagram */}
                      <div className="flex items-center justify-center space-x-3 w-full">
                        <div className="px-2.5 py-1 bg-white border border-lavender-light rounded-lg text-[10px] font-bold text-lavender-dark shadow-xs">
                          Attention
                        </div>
                        <div className="h-0.5 w-6 bg-lavender/40" />
                        <div className="px-3 py-1.5 bg-lavender text-white rounded-lg text-[11px] font-extrabold shadow-sm">
                          Transformers
                        </div>
                        <div className="h-0.5 w-6 bg-lavender/40" />
                        <div className="px-2.5 py-1 bg-white border border-lavender-light rounded-lg text-[10px] font-bold text-lavender-dark shadow-xs">
                          FeedForward
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 text-center mt-2">
                      Hierarchical relationship mapped automatically
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-lavender uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Everything You Need to Capture & Master Knowledge
            </h2>
            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Designed specifically for fast-paced classrooms, cross-functional engineering teams, and executive syncs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feat, index) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={index}
                  className="card-soft p-7 bg-white hover:-translate-y-1.5 transition-all duration-300 group hover:shadow-lg border border-lavender-light/60 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.color} shadow-xs group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-lavender transition-colors mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-lavender-dark">
                    <span>Powered by MindNotes Engine</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-white/60 to-lavender-light/20 border-y border-lavender-light/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-lavender uppercase tracking-widest block mb-2">
                Simplicity in Action
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                From Audio to Actionable Knowledge in 3 Steps
              </h2>
              <p className="text-gray-500 mt-4 text-base sm:text-lg">
                No complex onboarding. Just upload, let AI process, and immediately interact with structured insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((st, i) => (
                <div key={i} className="card-soft p-8 bg-white relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-lavender-light/30 rounded-bl-full -mr-3 -mt-3" />
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-powder text-blue-700 text-xs font-bold mb-4">
                      {st.badge}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{st.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{st.desc}</p>
                  </div>
                  <div className="flex items-center text-4xl font-black text-lavender/25">
                    {st.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Benefits & About Section */}
        <section id="benefits" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-lavender uppercase tracking-widest block mb-2">
              Measurable Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Designed for High-Performing Thinkers
            </h2>
            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Whether you are preparing for final exams or aligning senior leadership, MindNotes AI saves hours of manual note-taking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((b, i) => {
              const IconComp = b.icon;
              return (
                <div key={i} className="card-soft p-8 md:p-10 bg-white border border-lavender-light/70 flex flex-col justify-between shadow-soft">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-lavender-light flex items-center justify-center text-lavender-dark">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          {b.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{b.title}</h3>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {b.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center text-emerald-700 mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">✓</span>
                          </div>
                          <span className="text-sm text-gray-700 leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Zero manual re-typing</span>
                    <span>100% Grounded in source data</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Final Call To Action Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-lavender-light/60 via-powder/50 to-peach/40 rounded-3xl p-10 md:p-16 border border-white shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lavender/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-white text-lavender-dark shadow-xs mb-6">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-lavender" /> Get Started Today
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                Your Next Great Idea Deserves Better Notes.
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                Start turning your lectures and meetings into useful knowledge. Join students and professionals experiencing clearer notes today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="btn-primary w-full sm:w-auto px-9 py-4 text-base font-bold shadow-soft group"
                >
                  <span>{user ? 'Open Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    className="btn-secondary w-full sm:w-auto px-7 py-4 text-base font-semibold"
                  >
                    Sign In to Existing Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-lavender-light/80 mt-12 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-lavender flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">MindNotes AI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-900 transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="hover:text-gray-900 transition-colors cursor-pointer">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-gray-900 transition-colors cursor-pointer">
                How It Works
              </button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-gray-900 transition-colors cursor-pointer">
                About
              </button>
              <Link to="/login" className="hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-gray-900 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>© {new Date().getFullYear()} MindNotes AI. AI-Powered Lecture & Meeting Assistant. All rights reserved.</p>
            <p className="flex items-center space-x-1">
              <span>Crafted for clarity and retention</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

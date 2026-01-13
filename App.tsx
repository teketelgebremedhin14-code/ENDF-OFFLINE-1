import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import SLASAssistant from './components/SLASAssistant';
import CommandPalette from './components/CommandPalette';
import DataEntryTerminal from './components/DataEntryTerminal';
import SecureInbox from './components/SecureInbox';
import FeedbackModal from './components/FeedbackModal';
import { ViewState } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Bell, Menu, LogOut, AlertTriangle, Globe, ChevronDown, Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import { Language } from './data/translations';

// Views
import DashboardOverview from './views/DashboardOverview';
import PresidentialView from './views/PresidentialView';
import PrimeMinisterView from './views/PrimeMinisterView';
import OperationalView from './views/OperationalView';
import IntelligenceView from './views/IntelligenceView';
import LogisticsView from './views/LogisticsView';
import HRView from './views/HRView';
import HealthView from './views/HealthView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import CommunicationsView from './views/CommunicationsView';
import InfoOpsView from './views/InfoOpsView';
import ForeignRelationsView from './views/ForeignRelationsView';
import VeteransView from './views/VeteransView';
import SpaceCommandView from './views/SpaceCommandView';
import AirForceView from './views/AirForceView';
import NavyView from './views/NavyView';
import GroundForcesView from './views/GroundForcesView';
import WargamingView from './views/WargamingView';
import MinistryView from './views/MinistryView';
import ChiefOfStaffView from './views/ChiefOfStaffView';
import CouncilView from './views/CouncilView';
import IntegrationView from './views/IntegrationView';
import PeacekeepingView from './views/PeacekeepingView';
import SpecialOpsView from './views/SpecialOpsView';
import AINexusView from './views/AINexusView';
import PsychProfileView from './views/PsychProfileView';
import LegalView from './views/LegalView';
import EngineeringView from './views/EngineeringView';
import InspectorGeneralView from './views/InspectorGeneralView';
import TrainingView from './views/TrainingView';
import FinanceView from './views/FinanceView';

// Inner component that uses the LanguageContext
const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.OVERVIEW);
  const [defcon, setDefcon] = useState(3);
  const [mode, setMode] = useState<'standard' | 'green' | 'red'>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [showPalette, setShowPalette] = useState(false);
  const [showDataTerminal, setShowDataTerminal] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Event Listeners for Global Tools
  useEffect(() => {
    const openTerminalHandler = () => setShowDataTerminal(true);
    window.addEventListener('open-data-terminal', openTerminalHandler as EventListener);
    return () => window.removeEventListener('open-data-terminal', openTerminalHandler as EventListener);
  }, []);

  // Simulated Notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alerts = [
          t('notif_1'),
          t('notif_2'),
          t('notif_3'),
          "Satellite realignment complete.",
          "Cyber threat neutralized in Sector 9."
        ];
        const newAlert = alerts[Math.floor(Math.random() * alerts.length)];
        setNotifications(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, t]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(ViewState.OVERVIEW);
  };

  const goBackToDashboard = () => {
      setCurrentView(ViewState.OVERVIEW);
  };

  const getModeClasses = () => {
      switch(mode) {
          case 'green': return 'grayscale contrast-125 sepia hue-rotate-[50deg] saturate-50'; // Night Vision
          case 'red': return 'grayscale contrast-125 sepia hue-rotate-[320deg] saturate-200'; // Tactical Red
          default: return '';
      }
  };

  const languages: { code: Language, label: string }[] = [
      { code: 'en', label: 'English' },
      { code: 'am', label: 'Amharic (አማርኛ)' },
      { code: 'om', label: 'Oromiffa' },
      { code: 'ti', label: 'Tigrinya' },
      { code: 'so', label: 'Somali' }
  ];

  const handleNavigate = (view: ViewState) => {
      setCurrentView(view);
      if(window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  };

  const renderView = () => {
    const commonProps = {
        onBack: goBackToDashboard,
        onFeedback: () => setShowFeedback(true)
    };

    switch (currentView) {
      case ViewState.OVERVIEW: return <DashboardOverview onNavigate={handleNavigate} defcon={defcon} />;
      case ViewState.PRESIDENTIAL: return <PresidentialView defcon={defcon} setDefcon={setDefcon} {...commonProps} />;
      case ViewState.PRIME_MINISTER: return <PrimeMinisterView defcon={defcon} setDefcon={setDefcon} {...commonProps} />;
      case ViewState.OPERATIONS: return <OperationalView {...commonProps} />;
      case ViewState.INTELLIGENCE: return <IntelligenceView {...commonProps} />;
      case ViewState.LOGISTICS: return <LogisticsView {...commonProps} />;
      case ViewState.SPACE_COMMAND: return <SpaceCommandView {...commonProps} />;
      case ViewState.REPORTS: return <ReportsView {...commonProps} />;
      case ViewState.HR: return <HRView {...commonProps} />;
      case ViewState.HEALTH: return <HealthView {...commonProps} />;
      case ViewState.SETTINGS: return <SettingsView currentMode={mode} onModeChange={setMode} {...commonProps} />;
      case ViewState.COMMUNICATIONS: return <CommunicationsView {...commonProps} />;
      case ViewState.INFO_OPS: return <InfoOpsView {...commonProps} />;
      case ViewState.FOREIGN_RELATIONS: return <ForeignRelationsView {...commonProps} />;
      case ViewState.VETERANS: return <VeteransView {...commonProps} />;
      case ViewState.AIR_FORCE: return <AirForceView {...commonProps} />;
      case ViewState.NAVY: return <NavyView {...commonProps} />;
      case ViewState.GROUND_FORCES: return <GroundForcesView {...commonProps} />;
      case ViewState.WARGAMING: return <WargamingView {...commonProps} />;
      case ViewState.MINISTRY: return <MinistryView {...commonProps} />;
      case ViewState.CHIEF_OF_STAFF: return <ChiefOfStaffView {...commonProps} />;
      case ViewState.COUNCIL: return <CouncilView {...commonProps} />;
      case ViewState.INTEGRATION: return <IntegrationView {...commonProps} />;
      case ViewState.PEACEKEEPING: return <PeacekeepingView {...commonProps} />;
      case ViewState.SPECIAL_OPS: return <SpecialOpsView {...commonProps} />;
      case ViewState.AI_NEXUS: return <AINexusView {...commonProps} />;
      case ViewState.PSYCH_EVAL: return <PsychProfileView {...commonProps} />;
      case ViewState.LEGAL: return <LegalView {...commonProps} />;
      case ViewState.ENGINEERING: return <EngineeringView {...commonProps} />;
      case ViewState.INSPECTOR_GENERAL: return <InspectorGeneralView {...commonProps} />;
      case ViewState.TRAINING: return <TrainingView {...commonProps} />;
      case ViewState.FINANCE: return <FinanceView {...commonProps} />;
      default: return <DashboardOverview onNavigate={handleNavigate} defcon={defcon} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`flex h-[100dvh] w-screen overflow-hidden bg-military-950 text-gray-200 font-sans selection:bg-military-accent selection:text-black ${getModeClasses()}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-military-900 border-r border-military-800 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0 flex flex-col shadow-2xl md:shadow-none`}>
        <Sidebar 
            currentView={currentView} 
            onViewChange={handleNavigate} 
            defconLevel={defcon} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0 relative overflow-hidden">
        
        {/* Top Bar */}
        <header className={`h-14 bg-military-900/80 backdrop-blur-md border-b border-military-800 flex items-center justify-between px-4 z-20 flex-shrink-0 transition-all duration-300`}>
          <div className="flex items-center min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-military-800 transition-colors md:hidden"
            >
              <Menu size={20} />
            </button>
            
            {/* Global Back Button (Visible when not on Dashboard) */}
            {currentView !== ViewState.OVERVIEW && (
                <button 
                    onClick={goBackToDashboard}
                    className="flex items-center mr-3 text-gray-400 hover:text-white hover:bg-military-800 px-2 py-1 rounded transition-colors flex-shrink-0"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    <span className="text-[10px] font-bold hidden sm:inline tracking-wider">DASHBOARD</span>
                </button>
            )}

            <div className="flex flex-col min-w-0 overflow-hidden">
               <div className="text-[8px] text-military-500 font-mono tracking-widest uppercase hidden sm:block truncate">{t('news_ticker_label')}</div>
               <div className="w-32 md:w-80 overflow-hidden h-4 relative">
                  <div className="animate-marquee whitespace-nowrap text-[10px] text-military-accent font-mono absolute">
                     {t('news_ticker_items') && notifications.length > 0 ? notifications.join(" ••• ") : "SYSTEM NORMAL ••• SECURE CONNECTION ESTABLISHED ••• ENDF NEXUS ONLINE"}
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Language Switcher */}
            <div className="relative">
                <button 
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex items-center space-x-1 px-2 py-1 bg-military-800 hover:bg-military-700 text-gray-300 rounded border border-military-600 text-[10px] font-bold uppercase transition-colors"
                >
                    <Globe size={12} />
                    <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label.split(' ')[0] || 'EN'}</span>
                    <ChevronDown size={10} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-military-900 border border-military-700 rounded shadow-xl z-50 overflow-hidden">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-military-800 transition-colors ${language === lang.code ? 'text-military-accent font-bold bg-military-800/50' : 'text-gray-400'}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Field Insight Button */}
            <button 
                onClick={() => setShowFeedback(true)}
                className="flex items-center p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow-lg transition-colors animate-pulse hover:animate-none"
                title={t('feedback_title')}
            >
                <MessageSquare size={14} />
                <span className="text-[10px] font-bold ml-1 hidden lg:inline">INSIGHT</span>
            </button>

            <button 
                onClick={() => setShowInbox(true)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-military-800 transition-colors hidden sm:block"
                title={t('inbox_title')}
            >
                <Mail size={18} />
            </button>

            <div className="relative group hidden sm:block">
               <button className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-military-800 relative">
                 <Bell size={18} />
                 {notifications.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>}
               </button>
               {/* Dropdown Notification */}
               <div className="absolute right-0 top-full mt-2 w-72 bg-military-900 border border-military-700 rounded shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                  <div className="p-3 border-b border-military-700 text-xs font-bold text-gray-400">{t('hdr_notifications')}</div>
                  <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-500">{t('hdr_no_alerts')}</div>
                      ) : (
                          notifications.map((n, i) => (
                              <div key={i} className="p-3 border-b border-military-800 text-xs text-gray-300 hover:bg-military-800 cursor-pointer flex items-start">
                                  <AlertTriangle size={12} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0"/>
                                  {n}
                              </div>
                          ))
                      )}
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => setShowPalette(true)}
              className="hidden md:flex items-center px-2 py-1 bg-military-800 hover:bg-military-700 text-gray-400 text-[10px] rounded border border-military-700 transition-colors"
            >
              <span className="mr-1 font-bold">⌘K</span> {t('cmd_footer')}
            </button>

            <div className="h-6 w-[1px] bg-military-700 mx-1 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
                <div className="text-right hidden lg:block">
                    <div className="text-[10px] font-bold text-white leading-tight">CMDR. ABEBE</div>
                    <div className="text-[8px] text-gray-500 font-mono">LEVEL 5</div>
                </div>
                <div className="w-7 h-7 bg-military-800 rounded-full border border-military-600 flex items-center justify-center text-military-accent font-bold text-[10px] relative">
                    CA
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-military-900 rounded-full"></span>
                </div>
            </div>
            
            <button onClick={handleLogout} className="ml-1 text-gray-500 hover:text-red-400 p-1" title={t('logout')}>
                <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 relative overflow-hidden bg-military-950 p-2 md:p-4 flex flex-col h-full w-full">
           {renderView()}
        </main>

        {/* Global Components */}
        <SLASAssistant currentView={currentView} />
        {showInbox && <SecureInbox onClose={() => setShowInbox(false)} />}
        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
        <CommandPalette 
            isOpen={showPalette} 
            onClose={() => setShowPalette(false)} 
            onNavigate={handleNavigate} 
            onAction={(action) => { 
                if(action === 'logout') handleLogout(); 
                if(action === 'inbox') setShowInbox(true);
                if(action === 'feedback') setShowFeedback(true);
            }}
        />
        <DataEntryTerminal 
            currentView={currentView} 
            isOpen={showDataTerminal} 
            onToggle={() => setShowDataTerminal(!showDataTerminal)} 
        />
      </div>
    </div>
  );
};

// Main App component that wraps with LanguageProvider
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
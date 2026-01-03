
import React from 'react';
import { LayoutDashboard, Command, Truck, Eye, Shield, Users, Stethoscope, FileText, Settings, Globe, Plane, Wrench, Crosshair, Anchor, Flag, GraduationCap, DollarSign, Scale, Wifi, Megaphone, FileSearch, Handshake, Heart, Rocket, BrainCircuit, GitMerge, Map, Briefcase, Star, Building2, Swords, Landmark, Factory, Brain } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  defconLevel: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, defconLevel }) => {
  const { t } = useLanguage();

  // Hierarchy based on Section 7-14 of Comprehensive System Design
  const menuItems = [
    // --- 7.0 & 8.0 & 9.0 & 10.0 & 11.0 STRATEGIC COMMAND LAYER ---
    { id: ViewState.PRESIDENTIAL, label: t('nav_presidential'), icon: Globe },       // 7.0
    { id: ViewState.PRIME_MINISTER, label: t('nav_pm'), icon: Landmark },            // 8.0
    { id: ViewState.MINISTRY, label: t('nav_ministry'), icon: Building2 },           // 9.0
    { id: ViewState.CHIEF_OF_STAFF, label: t('nav_cogs'), icon: Star },              // 10.0
    { id: ViewState.COUNCIL, label: t('nav_council'), icon: Briefcase },             // 11.1
    
    // --- 11.0 OPERATIONAL COMMAND LAYER ---
    { id: ViewState.OPERATIONS, label: t('nav_operations'), icon: Command },         // Joint Ops
    { id: ViewState.GROUND_FORCES, label: t('nav_ground_forces'), icon: Map },       // 11.2
    { id: ViewState.AIR_FORCE, label: t('nav_air_force'), icon: Plane },             // 11.3
    { id: ViewState.NAVY, label: t('nav_navy'), icon: Anchor },                      // 11.4
    { id: ViewState.SPACE_COMMAND, label: t('nav_space_command'), icon: Rocket },    // 11.2.1 (Expanded)
    { id: ViewState.SPECIAL_OPS, label: t('nav_special_ops'), icon: Crosshair },     // 11.2.4
    { id: ViewState.WARGAMING, label: t('nav_wargaming'), icon: Swords },            // 14.6 (Sim)

    // --- 12.0 SUPPORTIVE DEPARTMENTS ---
    { id: ViewState.INTELLIGENCE, label: t('nav_intelligence'), icon: Eye },         // 12.5
    { id: ViewState.LOGISTICS, label: t('nav_logistics'), icon: Truck },             // 12.1
    { id: ViewState.ENGINEERING, label: t('nav_engineering'), icon: Factory },       // 12.4 (Defense Industry)
    { id: ViewState.TRAINING, label: t('nav_training'), icon: GraduationCap },       // 12.2
    { id: ViewState.PSYCH_EVAL, label: "Psych Evaluation", icon: Brain },            // New
    { id: ViewState.HR, label: t('nav_hr'), icon: Users },                           // 12.6
    { id: ViewState.HEALTH, label: t('nav_health'), icon: Stethoscope },             // 12.7
    { id: ViewState.INSPECTOR_GENERAL, label: t('nav_inspector_general'), icon: FileSearch }, // 12.3
    { id: ViewState.COMMUNICATIONS, label: t('nav_communications'), icon: Wifi },
    { id: ViewState.INFO_OPS, label: t('nav_info_ops'), icon: Megaphone },
    { id: ViewState.LEGAL, label: t('nav_legal'), icon: Scale },
    { id: ViewState.FINANCE, label: t('nav_finance'), icon: DollarSign },
    { id: ViewState.FOREIGN_RELATIONS, label: t('nav_foreign_relations'), icon: Handshake },
    { id: ViewState.VETERANS, label: t('nav_veterans'), icon: Heart },
    { id: ViewState.PEACEKEEPING, label: t('nav_peacekeeping'), icon: Flag },

    // --- 13.0 & 14.0 SYSTEM CORE ---
    { id: ViewState.INTEGRATION, label: t('nav_integration'), icon: GitMerge },      // 13.0
    { id: ViewState.AI_NEXUS, label: t('nav_ai_nexus'), icon: BrainCircuit },        // 14.0
    { id: ViewState.OVERVIEW, label: t('nav_overview'), icon: LayoutDashboard },     // Dash
  ];

  return (
    <aside className={`w-64 bg-military-900 border-r border-military-800 flex flex-col h-full flex-shrink-0 z-20 transition-all duration-500 ${defconLevel <= 2 ? 'border-r-red-900/50 shadow-[5px_0_20px_rgba(220,38,38,0.1)]' : ''}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-military-700/50 flex items-center space-x-3 bg-black/20">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center shadow-lg transition-colors duration-500 border border-white/10 ${defconLevel <= 2 ? 'bg-red-600 animate-pulse' : 'bg-military-accent'}`}>
            <Shield className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-white tracking-widest leading-none font-display">{t('appTitle')}</h1>
            <p className="text-[10px] text-military-500 tracking-[0.2em] font-bold font-mono uppercase mt-1">{t('appSubtitle')}</p>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3 space-y-1">
        {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all text-sm font-medium group ${
                currentView === item.id
                  ? 'bg-military-800 text-military-accent border border-military-600 shadow-inner'
                  : 'text-gray-400 hover:bg-military-800/50 hover:text-gray-100 hover:pl-5'
              }`}
            >
              <item.icon size={18} className={`transition-colors ${currentView === item.id ? 'text-military-accent' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="font-display tracking-wide text-sm truncate">{item.label}</span>
              {currentView === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-military-accent shadow-[0_0_5px_#0ea5e9]"></div>
              )}
            </button>
        ))}
        
        <div className="mt-8 px-4 pt-6 border-t border-military-800/50">
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 font-mono">{t('sys_modules')}</h4>
            <ul className="space-y-1">
                <li 
                  onClick={() => onViewChange(ViewState.REPORTS)}
                  className={`cursor-pointer flex items-center p-2 rounded transition-colors text-xs ${currentView === ViewState.REPORTS ? 'text-military-accent bg-military-800/50' : 'text-gray-400 hover:text-white'}`}
                >
                  <FileText size={14} className="mr-3 opacity-70"/> <span className="font-medium font-sans">{t('nav_reports')}</span>
                </li>
                <li 
                   onClick={() => onViewChange(ViewState.SETTINGS)}
                   className={`cursor-pointer flex items-center p-2 rounded transition-colors text-xs ${currentView === ViewState.SETTINGS ? 'text-military-accent bg-military-800/50' : 'text-gray-400 hover:text-white'}`}
                >
                  <Settings size={14} className="mr-3 opacity-70"/> <span className="font-medium font-sans">{t('nav_settings')}</span>
                </li>
            </ul>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-military-700/50 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-gray-500 shadow-md font-mono">
                {t('hq_label')}
            </div>
            <div>
                <p className="text-sm font-bold text-white font-display tracking-wide">Gen. Berhanu</p>
                <p className="text-[10px] text-gray-500 uppercase font-mono">ENDF {t('cos_label')}</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

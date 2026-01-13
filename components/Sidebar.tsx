
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

  const menuItems = [
    // --- STRATEGIC ---
    { id: ViewState.PRESIDENTIAL, label: t('nav_presidential'), icon: Globe, color: 'text-blue-400' },
    { id: ViewState.PRIME_MINISTER, label: t('nav_pm'), icon: Landmark, color: 'text-purple-400' },
    { id: ViewState.MINISTRY, label: t('nav_ministry'), icon: Building2, color: 'text-indigo-400' },
    { id: ViewState.CHIEF_OF_STAFF, label: t('nav_cogs'), icon: Star, color: 'text-yellow-400' },
    { id: ViewState.COUNCIL, label: t('nav_council'), icon: Briefcase, color: 'text-orange-400' },
    
    // --- OPERATIONAL ---
    { id: ViewState.OPERATIONS, label: t('nav_operations'), icon: Command, color: 'text-red-400' },
    { id: ViewState.GROUND_FORCES, label: t('nav_ground_forces'), icon: Map, color: 'text-amber-600' },
    { id: ViewState.AIR_FORCE, label: t('nav_air_force'), icon: Plane, color: 'text-sky-400' },
    { id: ViewState.NAVY, label: t('nav_navy'), icon: Anchor, color: 'text-blue-500' },
    { id: ViewState.SPACE_COMMAND, label: t('nav_space_command'), icon: Rocket, color: 'text-violet-400' },
    { id: ViewState.SPECIAL_OPS, label: t('nav_special_ops'), icon: Crosshair, color: 'text-emerald-400' },
    { id: ViewState.WARGAMING, label: t('nav_wargaming'), icon: Swords, color: 'text-rose-400' },

    // --- SUPPORT ---
    { id: ViewState.INTELLIGENCE, label: t('nav_intelligence'), icon: Eye, color: 'text-cyan-400' },
    { id: ViewState.LOGISTICS, label: t('nav_logistics'), icon: Truck, color: 'text-orange-300' },
    { id: ViewState.ENGINEERING, label: t('nav_engineering'), icon: Factory, color: 'text-slate-300' },
    { id: ViewState.TRAINING, label: t('nav_training'), icon: GraduationCap, color: 'text-lime-400' },
    { id: ViewState.PSYCH_EVAL, label: "Psych Evaluation", icon: Brain, color: 'text-pink-400' },
    { id: ViewState.HR, label: t('nav_hr'), icon: Users, color: 'text-teal-400' },
    { id: ViewState.HEALTH, label: t('nav_health'), icon: Stethoscope, color: 'text-red-300' },
    { id: ViewState.INSPECTOR_GENERAL, label: t('nav_inspector_general'), icon: FileSearch, color: 'text-yellow-200' },
    { id: ViewState.COMMUNICATIONS, label: t('nav_communications'), icon: Wifi, color: 'text-blue-300' },
    { id: ViewState.INFO_OPS, label: t('nav_info_ops'), icon: Megaphone, color: 'text-fuchsia-400' },
    { id: ViewState.LEGAL, label: t('nav_legal'), icon: Scale, color: 'text-gray-300' },
    { id: ViewState.FINANCE, label: t('nav_finance'), icon: DollarSign, color: 'text-green-400' },
    { id: ViewState.FOREIGN_RELATIONS, label: t('nav_foreign_relations'), icon: Handshake, color: 'text-indigo-300' },
    { id: ViewState.VETERANS, label: t('nav_veterans'), icon: Heart, color: 'text-pink-500' },
    { id: ViewState.PEACEKEEPING, label: t('nav_peacekeeping'), icon: Flag, color: 'text-blue-200' },

    // --- CORE ---
    { id: ViewState.INTEGRATION, label: t('nav_integration'), icon: GitMerge, color: 'text-purple-300' },
    { id: ViewState.AI_NEXUS, label: t('nav_ai_nexus'), icon: BrainCircuit, color: 'text-neon-purple' },
    { id: ViewState.OVERVIEW, label: t('nav_overview'), icon: LayoutDashboard, color: 'text-white' },
  ];

  return (
    <aside className={`w-64 glass-panel-strong border-r border-white/5 flex flex-col h-full flex-shrink-0 z-20 transition-all duration-500 ${defconLevel <= 2 ? 'border-r-red-500/50 shadow-[5px_0_30px_rgba(220,38,38,0.15)]' : ''}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center space-x-3 bg-gradient-to-r from-black/40 to-transparent">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 border border-white/20 ${defconLevel <= 2 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-br from-blue-600 to-cyan-500'}`}>
            <Shield className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-100 tracking-widest leading-none font-display drop-shadow">{t('appTitle')}</h1>
            <p className="text-[10px] text-cyan-400/80 tracking-[0.2em] font-bold font-mono uppercase mt-1">{t('appSubtitle')}</p>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar px-3 space-y-1">
        {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden ${
                    isActive
                      ? 'text-white shadow-lg border border-white/10'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
                >
                  {/* Active Background Gradient */}
                  {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/10 opacity-100"></div>
                  )}
                  
                  <item.icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-cyan-300' : item.color} group-hover:text-white`} />
                  <span className="font-display tracking-wide text-sm truncate relative z-10">{item.label}</span>
                  
                  {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] z-10"></div>
                  )}
                </button>
            );
        })}
        
        <div className="mt-6 px-4 pt-6 border-t border-white/10">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 font-mono">{t('sys_modules')}</h4>
            <ul className="space-y-1">
                <li 
                  onClick={() => onViewChange(ViewState.REPORTS)}
                  className={`cursor-pointer flex items-center p-2 rounded-md transition-colors text-xs ${currentView === ViewState.REPORTS ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <FileText size={14} className="mr-3 opacity-70 text-blue-300"/> <span className="font-medium font-sans">{t('nav_reports')}</span>
                </li>
                <li 
                   onClick={() => onViewChange(ViewState.SETTINGS)}
                   className={`cursor-pointer flex items-center p-2 rounded-md transition-colors text-xs ${currentView === ViewState.SETTINGS ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Settings size={14} className="mr-3 opacity-70 text-gray-300"/> <span className="font-medium font-sans">{t('nav_settings')}</span>
                </li>
            </ul>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-black/30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white border border-gray-600 shadow-md font-mono">
                {t('hq_label')}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-200 font-display tracking-wide">Gen. Berhanu</p>
                <p className="text-[10px] text-cyan-500 uppercase font-mono">ENDF {t('cos_label')}</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

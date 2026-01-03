
import React, { useState, useEffect } from 'react';
import { Shield, Globe, TrendingUp, DollarSign, Lock, Phone, AlertTriangle, X, Radio, Target, Users, Rocket, Key, Fingerprint, RefreshCcw, Plane, Wifi, FileText, Scale, Star, Calendar, Flag, PenTool } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const stabilityData = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 88 },
  { month: 'Apr', score: 86 },
  { month: 'May', score: 91 },
  { month: 'Jun', score: 89 },
];

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

interface PresidentialViewProps {
    defcon: number;
    setDefcon: (level: number) => void;
    onBack?: () => void;
}

const PresidentialView: React.FC<PresidentialViewProps> = ({ defcon, setDefcon, onBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'triad' | 'oversight' | 'ceremonial'>('overview');
  const [showDefconModal, setShowDefconModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [secureLineStatus, setSecureLineStatus] = useState<'IDLE' | 'CONNECTING' | 'SECURE'>('IDLE');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [authStage, setAuthStage] = useState<'code' | 'biometric' | 'confirmed'>('code');
  const [authCode, setAuthCode] = useState('');

  const budgetData = [
    { name: t('pres_alloc_ground'), value: 45 },
    { name: t('pres_alloc_air'), value: 25 },
    { name: t('pres_alloc_cyber'), value: 15 },
    { name: t('pres_alloc_log'), value: 10 },
    { name: t('pres_alloc_rd'), value: 5 },
  ];

  const handleDefconChange = (level: number) => {
      setDefcon(level);
      setShowDefconModal(false);
  };

  const toggleSecureLine = () => {
      if (secureLineStatus === 'IDLE') {
          setSecureLineStatus('CONNECTING');
          setTimeout(() => setSecureLineStatus('SECURE'), 2000);
      } else {
          setSecureLineStatus('IDLE');
      }
  };

  const handleAuthSubmit = () => {
      if (authCode.length > 0) {
          setAuthStage('biometric');
          setTimeout(() => {
              setAuthStage('confirmed');
          }, 2000);
      }
  };

  const getDefconColor = (level: number) => {
      switch(level) {
          case 1: return 'bg-white text-red-600 border-red-600'; // MAX READINESS
          case 2: return 'bg-red-600 text-white border-red-500';
          case 3: return 'bg-yellow-500 text-black border-yellow-400';
          case 4: return 'bg-green-600 text-white border-green-500';
          case 5: return 'bg-blue-600 text-white border-blue-500';
          default: return 'bg-gray-600 text-white';
      }
  };

  const proclamations = [
      { id: 'PROC-1209/2024', title: 'Veterans Benefits Amendment', status: 'Pending Signature', type: 'Administrative' },
      { id: 'PROC-1210/2024', title: 'National Cyber Defense Act', status: 'Draft', type: 'Strategic' },
      { id: 'PROC-1100/2019', title: 'Defense Forces Proclamation', status: 'Ratified', type: 'Foundational' }
  ];

  const ceremonies = [
      { date: 'Oct 25', event: 'Victory Day Parade', type: t('pres_event_parade'), status: 'Planning', location: 'Meskel Square' },
      { date: 'Nov 02', event: 'State Dinner: Kenya Delegation', type: t('pres_event_dinner'), status: 'Confirmed', location: 'Jubilee Palace' },
      { date: 'Nov 12', event: 'Medal of Honor Ceremony', type: t('pres_event_honor'), status: 'Pending', location: 'Grand Palace' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('pres_title')}</h2>
          <p className="text-gray-400 text-sm font-sans">{t('pres_subtitle')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            {/* Tab Switcher */}
            <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display tracking-wide ${activeTab === 'overview' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <TrendingUp size={12} className="mr-2"/> {t('pres_tab_overview')}
                </button>
                <button 
                    onClick={() => setActiveTab('strategy')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display tracking-wide ${activeTab === 'strategy' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Globe size={12} className="mr-2"/> {t('pres_tab_strategy')}
                </button>
                <button 
                    onClick={() => setActiveTab('triad')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display tracking-wide ${activeTab === 'triad' ? 'bg-red-600 text-white shadow shadow-red-900/50' : 'text-gray-400 hover:text-white'}`}
                >
                    <Rocket size={12} className="mr-2"/> {t('pres_tab_triad')}
                </button>
                 <button 
                    onClick={() => setActiveTab('oversight')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display tracking-wide ${activeTab === 'oversight' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Scale size={12} className="mr-2"/> {t('pres_tab_oversight')}
                </button>
                <button 
                    onClick={() => setActiveTab('ceremonial')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display tracking-wide ${activeTab === 'ceremonial' ? 'bg-yellow-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Star size={12} className="mr-2"/> {t('pres_tab_ceremonial')}
                </button>
            </div>

            {/* Interactive DEFCON Badge */}
            <button 
                onClick={() => setShowDefconModal(true)}
                className={`px-3 py-1.5 rounded flex items-center font-mono font-bold text-xs transition-all transform hover:scale-105 shadow-lg border-2 ${getDefconColor(defcon)}`}
            >
                <Lock size={14} className="mr-2" />
                {t('hdr_defcon')} {defcon}
            </button>
            
            {/* Interactive Secure Line */}
            <button 
                onClick={toggleSecureLine}
                className={`px-3 py-1.5 rounded flex items-center border font-mono font-bold text-xs transition-all ${
                    secureLineStatus === 'SECURE' ? 'bg-red-600 border-red-500 text-white animate-pulse' :
                    secureLineStatus === 'CONNECTING' ? 'bg-yellow-600 border-yellow-500 text-white' :
                    'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-900/50'
                }`}
            >
                <Phone size={14} className={`mr-2 ${secureLineStatus === 'CONNECTING' ? 'animate-spin' : ''}`} />
                {secureLineStatus === 'IDLE' ? t('pres_secure_line') : 
                 secureLineStatus === 'CONNECTING' ? t('pres_encrypting') : t('pres_secure')}
            </button>
            
            {onBack && (
                <button 
                    onClick={onBack}
                    className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors"
                    title="Exit / Back"
                >
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto relative">
        {activeTab === 'overview' && (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-military-800 to-military-900 p-4 rounded-lg border border-military-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-yellow-500/20 p-3 rounded-full border border-yellow-500/50">
                            <Users size={24} className="text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white font-display tracking-wider">COMMANDER-IN-CHIEF</h3>
                            <p className="text-xs text-gray-400">Symbolic Oversight Interface Active</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs text-gray-500 uppercase tracking-widest">Constitutional Authority</span>
                        <span className="text-green-500 font-bold font-mono">UNCONTESTED</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard title={t('pres_metric_readiness')} value={defcon === 1 ? '100%' : defcon === 2 ? '98%' : '92%'} change={1.5} icon={Shield} color="success" />
                    <MetricCard title={t('pres_metric_budget')} value="48.2%" change={-2.1} icon={DollarSign} />
                    <MetricCard title={t('pres_metric_stability')} value={defcon < 3 ? 'Critical' : 'Stable'} icon={Globe} color={defcon < 3 ? 'danger' : 'success'} />
                    <MetricCard title={t('pres_metric_approval')} value="76%" change={3.4} icon={TrendingUp} color="warning" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    {/* Budget Allocation */}
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-[350px]">
                        <h3 className="font-semibold text-lg text-white mb-4 font-display">{t('pres_chart_budget')}</h3>
                        <div className="h-[250px] w-full font-mono text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={budgetData} 
                                        innerRadius={60} 
                                        outerRadius={100} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {budgetData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Regional Stability Trend */}
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-[350px]">
                        <h3 className="font-semibold text-lg text-white mb-4 font-display">{t('pres_chart_stability')}</h3>
                        <div className="h-[250px] w-full font-mono text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stabilityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis domain={[0, 100]} stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r: 6}} activeDot={{r: 8}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ... (Existing Strategy & Triad Tabs - Unchanged) ... */}
        {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Container */}
                <div className="lg:col-span-2 bg-[#0b1120] rounded-lg border border-military-700 relative overflow-hidden group min-h-[400px]">
                     {/* Abstract Map of Horn of Africa */}
                     <div className="absolute inset-0 bg-[#0f172a]">
                        <svg viewBox="0 0 800 600" className="w-full h-full">
                            {/* Water */}
                            <rect width="100%" height="100%" fill="#0f172a" />
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            
                            {/* Ethiopia (Abstract) */}
                            <path 
                                d="M 300 200 L 450 180 L 520 250 L 500 350 L 400 450 L 300 400 L 250 300 Z" 
                                fill="#1e293b" 
                                stroke="#3b82f6" 
                                strokeWidth="2"
                                className="hover:fill-military-800 transition-colors cursor-pointer"
                                onClick={() => setSelectedRegion(t('map_region_ethiopia'))}
                            />
                            
                            {/* Eritrea (North) */}
                            <path 
                                d="M 280 150 L 400 130 L 480 200 L 450 180 L 300 200 Z" 
                                fill="#1e293b" 
                                stroke="#f59e0b" 
                                strokeWidth="1"
                                className="hover:fill-yellow-900/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedRegion(t('reg_north') + t('map_status_patrols'))}
                            />
                            
                            {/* Somalia (East) */}
                            <path 
                                d="M 480 200 L 600 220 L 550 450 L 450 500 L 400 450 L 500 350 L 520 250 Z" 
                                fill="#1e293b" 
                                stroke="#ef4444" 
                                strokeWidth="1"
                                className="hover:fill-red-900/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedRegion(t('reg_east') + t('map_status_threat'))}
                            />

                            {/* Sudan/South Sudan (West) */}
                            <path 
                                d="M 150 150 L 280 150 L 250 300 L 300 400 L 250 450 L 100 350 Z" 
                                fill="#1e293b" 
                                stroke="#f59e0b" 
                                strokeWidth="1"
                                className="hover:fill-yellow-900/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedRegion(t('reg_west') + t('map_status_refugee'))}
                            />

                            {/* Kenya (South) */}
                            <path 
                                d="M 250 450 L 400 450 L 450 500 L 300 600 L 200 600 Z" 
                                fill="#1e293b" 
                                stroke="#10b981" 
                                strokeWidth="1"
                                className="hover:fill-green-900/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedRegion(t('reg_south') + t('map_status_partner'))}
                            />
                            
                            {/* Strategic Markers */}
                            {/* Addis */}
                            <circle cx="380" cy="300" r="5" fill="#3b82f6" className="animate-pulse">
                                <title>Addis Ababa HQ</title>
                            </circle>
                            <circle cx="380" cy="300" r="10" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-ping" />
                            
                            {/* GERD */}
                            <circle cx="260" cy="220" r="4" fill="#0ea5e9">
                                <title>Grand Ethiopian Renaissance Dam</title>
                            </circle>
                        </svg>
                     </div>
                     <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur rounded border-l-4 border-military-accent">
                        <h4 className="text-white font-bold text-sm font-display">{t('pres_map_active')}: {t('pres_tab_strategy')}</h4>
                     </div>
                </div>

                {/* Right Side Strategy Panel */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-auto">
                    <h3 className="font-semibold text-white mb-4 flex items-center font-display">
                        <Target className="mr-2 text-red-500" size={20} /> {t('pres_strat_focus')}
                    </h3>
                    <div className="flex-1 space-y-4">
                         <div className="p-3 bg-military-900 rounded border border-military-600">
                             <div className="text-xs text-gray-500 uppercase font-bold mb-1 font-display">{t('pres_obj_primary')}</div>
                             <p className="text-sm text-white font-bold font-sans">{t('pres_obj_border')}</p>
                             <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                 <div className="bg-green-500 w-3/4 h-full"></div>
                             </div>
                         </div>
                         
                         {selectedRegion && (
                             <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded animate-in fade-in slide-in-from-right-4">
                                 <h4 className="text-sm text-blue-400 font-bold mb-1 font-display">{t('lbl_target')}</h4>
                                 <p className="text-white text-xs font-mono">{selectedRegion}</p>
                             </div>
                         )}

                         <div className="mt-auto">
                            <h4 className="text-xs text-gray-400 uppercase font-bold mb-2 font-display">{t('pres_dip_channel')}</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-300 font-sans">AU Peace Council</span>
                                    <span className="text-green-500 font-mono">{t('status_active')}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-300 font-sans">IGAD Summit</span>
                                    <span className="text-yellow-500 font-mono">{t('status_planning')}</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'triad' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Triad Column 1: Cyber */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col items-center text-center hover:border-military-accent transition-colors">
                    <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4 border border-blue-500">
                        <Wifi size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-display">{t('pres_triad_cyber')}</h3>
                    <p className="text-xs text-gray-400 mb-4 font-sans">{t('pres_triad_cyber_desc')}</p>
                    <div className="w-full bg-military-900 rounded p-3 text-left space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-sans">{t('lbl_status')}</span>
                            <span className="text-green-500 font-bold font-mono">ONLINE</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-sans">Load</span>
                            <span className="text-blue-400 font-mono">45%</span>
                        </div>
                    </div>
                </div>

                {/* Triad Column 2: Strategic Air */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col items-center text-center hover:border-military-accent transition-colors">
                    <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4 border border-green-500">
                        <Plane size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-display">{t('pres_triad_air')}</h3>
                    <p className="text-xs text-gray-400 mb-4 font-sans">{t('pres_triad_air_desc')}</p>
                    <div className="w-full bg-military-900 rounded p-3 text-left space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-sans">Fleet</span>
                            <span className="text-green-500 font-bold font-mono">READY</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-sans">{t('lbl_priority')}</span>
                            <span className="text-yellow-500 font-mono">{t('hdr_defcon')} {defcon}</span>
                        </div>
                    </div>
                </div>

                {/* Triad Column 3: Strategic Assets */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col items-center text-center hover:border-military-accent transition-colors">
                    <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4 border border-red-500">
                        <Rocket size={32} className="text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-display">{t('pres_triad_assets')}</h3>
                    <p className="text-xs text-gray-400 mb-4 font-sans">{t('pres_triad_assets_desc')}</p>
                    <div className="w-full bg-military-900 rounded p-3 text-left space-y-2">
                         <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-sans">Silos</span>
                            <span className="text-gray-500 font-bold font-mono">{t('pres_secure')}</span>
                        </div>
                        <button 
                            onClick={() => setShowAuthModal(true)}
                            className="w-full bg-red-900/50 hover:bg-red-900 text-red-300 text-xs py-1 rounded border border-red-800 transition-colors mt-2 font-display tracking-wide"
                        >
                            {t('pres_btn_auth')}
                        </button>
                    </div>
                </div>

                {/* Authentication Modal for Strategic Launch */}
                {showAuthModal && (
                    <div className="col-span-1 md:col-span-3 mt-4 bg-black/50 p-6 rounded border border-red-900/50 flex flex-col items-center animate-in zoom-in-95">
                        <AlertTriangle size={32} className="text-red-500 mb-2 animate-pulse" />
                        <h3 className="text-red-500 font-bold text-xl mb-4 tracking-widest font-display">{t('pres_auth_protocol')}</h3>
                        
                        {authStage === 'code' && (
                             <div className="space-y-4 w-full max-w-sm">
                                <input 
                                    type="password" 
                                    placeholder={t('pres_auth_code')}
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="w-full bg-black border border-red-700 rounded p-3 text-center text-red-500 font-mono tracking-widest focus:outline-none focus:border-red-500"
                                />
                                <button 
                                    onClick={handleAuthSubmit}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded flex items-center justify-center font-display tracking-wide"
                                >
                                    <Key size={18} className="mr-2" /> {t('pres_auth_verify')}
                                </button>
                             </div>
                        )}

                        {authStage === 'biometric' && (
                            <div className="flex flex-col items-center">
                                <Fingerprint size={64} className="text-red-500 animate-pulse mb-4" />
                                <p className="text-red-400 font-mono text-sm">{t('pres_auth_bio')}</p>
                            </div>
                        )}

                        {authStage === 'confirmed' && (
                            <div className="text-center">
                                <div className="text-green-500 font-bold text-lg mb-2 font-display">{t('pres_auth_success')}</div>
                                <p className="text-gray-400 text-sm font-sans">Access granted to Strategic Command Interface.</p>
                                <button 
                                    onClick={() => {setShowAuthModal(false); setAuthStage('code'); setAuthCode('');}} 
                                    className="mt-4 text-xs text-gray-500 hover:text-white"
                                >
                                    {t('pres_auth_close')}
                                </button>
                            </div>
                        )}
                        
                         {authStage !== 'confirmed' && (
                            <button onClick={() => setShowAuthModal(false)} className="mt-4 text-gray-500 hover:text-white"><X size={24} /></button>
                        )}
                    </div>
                )}
             </div>
        )}

        {/* 7.1 & 7.2: CIVILIAN CONTROL & OVERSIGHT TAB */}
        {activeTab === 'oversight' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                {/* Constitutional Compliance Monitor */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                    <h3 className="font-semibold text-lg text-white mb-4 flex items-center font-display">
                        <Scale className="mr-2 text-yellow-500" size={20} /> Constitutional Oversight Console
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-900/50 rounded">
                            <div>
                                <h4 className="font-bold text-green-400 text-sm font-display tracking-wide">{t('pres_const_status')}</h4>
                                <p className="text-xs text-gray-400 font-sans">Separation of Powers: Art. 87 Adherence</p>
                            </div>
                            <Shield size={24} className="text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-300 border-b border-military-700 pb-2 font-sans">
                                <span>Legislative Review</span>
                                <span className="text-green-500 font-mono">Completed (Q1)</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-300 border-b border-military-700 pb-2 font-sans">
                                <span>Budget Approval</span>
                                <span className="text-green-500 font-mono">Ratified</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-300 border-b border-military-700 pb-2 font-sans">
                                <span>State of Emergency (Art. 93)</span>
                                <span className="text-gray-500 font-mono">Inactive</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Civilian Control Module */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                    <h3 className="font-semibold text-lg text-white mb-4 flex items-center font-display">
                        <Users className="mr-2 text-blue-500" size={20} /> {t('pres_civilian_oversight')}
                    </h3>
                    
                    {/* Constitutional Boundary Monitor */}
                    <div className="mb-6 p-4 bg-military-900 rounded border border-military-600">
                        <h4 className="text-xs font-bold text-white mb-2 uppercase flex items-center">
                            <AlertTriangle size={12} className="mr-2 text-yellow-500"/> {t('pres_boundary_monitor')}
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs bg-black/20 p-2 rounded">
                                <span className="text-gray-300">Domestic Deployment Check</span>
                                <span className="text-green-500 font-bold">Compliant</span>
                            </div>
                            <div className="flex justify-between items-center text-xs bg-black/20 p-2 rounded">
                                <span className="text-gray-300">Police Support Role</span>
                                <span className="text-yellow-500 font-bold">Authorized (Limited)</span>
                            </div>
                        </div>
                    </div>

                    {/* Liaison Portal */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase">{t('pres_liaison_portal')}</h4>
                        <button className="w-full text-left p-3 bg-military-900 rounded border border-military-600 hover:border-military-accent transition-colors flex justify-between items-center">
                            <span className="text-sm font-bold text-white font-sans">National Security Council</span>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-gray-400 font-mono">LINKED</span>
                            </div>
                        </button>
                        <button className="w-full text-left p-3 bg-military-900 rounded border border-military-600 hover:border-military-accent transition-colors flex justify-between items-center">
                            <span className="text-sm font-bold text-white font-sans">MoD Legal Directorate</span>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-gray-400 font-mono">LINKED</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* 7.1: CEREMONIAL & ADMIN TAB */}
        {activeTab === 'ceremonial' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                {/* Proclamation Management System */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                    <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                        <FileText className="mr-2 text-purple-500" size={20} /> {t('pres_proc_mgmt')}
                    </h3>
                    <div className="flex-1 space-y-4">
                        {proclamations.map(proc => (
                            <div key={proc.id} className="p-4 bg-military-900 rounded border border-military-600 hover:border-purple-500 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300">{proc.title}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                        proc.status === 'Ratified' ? 'bg-green-900/50 text-green-300' : 
                                        proc.status === 'Pending Signature' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-gray-700 text-gray-300'
                                    }`}>{proc.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">{proc.id} • {proc.type}</p>
                                
                                {proc.status === 'Pending Signature' && (
                                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center">
                                        <PenTool size={12} className="mr-2" /> {t('pres_proc_sign')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ceremonial Military Event Manager */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                    <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                        <Star className="mr-2 text-yellow-500" size={20} /> {t('pres_event_manager')}
                    </h3>
                    <div className="space-y-4">
                        {ceremonies.map((evt, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-military-900 rounded border border-military-600">
                                <div className="bg-military-800 p-2 rounded text-center min-w-[50px] mr-4 border border-military-700">
                                    <span className="block text-xs text-gray-400 font-bold uppercase">{evt.date.split(' ')[0]}</span>
                                    <span className="block text-lg font-bold text-white">{evt.date.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{evt.event}</h4>
                                    <p className="text-xs text-gray-400 flex items-center mt-1">
                                        <Flag size={10} className="mr-1"/> {evt.type} • {evt.location}
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-mono ${
                                    evt.status === 'Confirmed' ? 'text-green-400 bg-green-900/20' : 'text-yellow-400 bg-yellow-900/20'
                                }`}>{evt.status}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="bg-military-700 hover:bg-military-600 text-white text-xs font-bold py-3 rounded border border-military-500">
                            Request Honor Guard
                        </button>
                        <button className="bg-military-700 hover:bg-military-600 text-white text-xs font-bold py-3 rounded border border-military-500">
                            Authorize Flyover
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* DEFCON Modal */}
      {showDefconModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-military-800 border border-military-600 rounded-lg w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-military-700 flex justify-between items-center bg-military-900">
                      <h3 className="font-bold text-white flex items-center font-display">
                          <Lock className="mr-2 text-white" /> {t('hdr_defcon')}
                      </h3>
                      <button onClick={() => setShowDefconModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleDefconChange(level)}
                            className={`w-full p-4 rounded border-2 transition-all flex items-center justify-between ${
                                defcon === level 
                                ? 'border-white ring-2 ring-white/50 scale-105' 
                                : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                            } ${getDefconColor(level)}`}
                          >
                              <span className="font-bold text-xl font-display tracking-widest">{t('hdr_defcon')} {level}</span>
                              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                                  {t(`pres_defcon_${level}` as any)}
                              </span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PresidentialView;


import React, { useState } from 'react';
import { Crown, Briefcase, Globe, ShieldAlert, Users, FileText, CheckCircle, TrendingUp, AlertTriangle, Radio, Activity, Fingerprint, Lock, Phone, Volume2, Mic, Calendar, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PrimeMinisterViewProps {
    defcon: number;
    setDefcon: (level: number) => void;
    onBack?: () => void;
}

const PrimeMinisterView: React.FC<PrimeMinisterViewProps> = ({ defcon, setDefcon, onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'strat' | 'nsc' | 'auth'>('strat');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);
    const [mobLevel, setMobLevel] = useState(1);

    // Mock Budget Data
    const budgetData = [
        { name: 'Ground', value: 45 },
        { name: 'Air', value: 25 },
        { name: 'Cyber', value: 15 },
        { name: 'Intel', value: 10 },
        { name: 'R&D', value: 5 },
    ];
    const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#6366f1', '#a855f7'];

    const directives = [
        { id: 'NSC-DIR-01', title: 'Horn Stability Initiative', status: 'In Progress', agency: 'MoD + MFA' },
        { id: 'NSC-DIR-04', title: 'Cyber Infrastructure Shield', status: 'Pending', agency: 'INSA' },
        { id: 'NSC-DIR-09', title: 'Critical Resource Protection', status: 'Completed', agency: 'FedPol' },
    ];

    // 2025 Appointments
    const appointments = [
        { name: 'Field Marshal Birhanu Jula', position: 'Chief of General Staff', status: 'Active' },
        { name: 'Gen. Abebaw Tadesse', position: 'Deputy Chief of Staff', status: 'Active' },
        { name: 'Lt. Gen. Yilma Merdasa', position: 'Air Force Commander', status: 'Active' },
        { name: 'Rear Admiral Kindu Gezu', position: 'Navy Commander', status: 'Active' },
        { name: 'Gen. Yimer Mekonnen', position: 'Education Main Dept', status: 'Active' },
    ];

    const activePacts = [
        { partner: 'Kenya', type: 'Joint Border Security', status: 'Active' },
        { partner: 'Djibouti', type: 'Logistics Corridor', status: 'Critical' },
        { partner: 'USA', type: 'Counter-Terrorism (FMS)', status: 'Review' },
    ];

    const upcomingMeetings = [
        { date: 'Oct 24', time: '09:00', title: 'Weekly National Security Briefing', attendees: 'All Agencies' },
        { date: 'Oct 26', time: '14:00', title: 'Emergency Response Review', attendees: 'MoD, FedPol' }
    ];

    const handleAuthorize = () => {
        setAuthSuccess(true);
        setTimeout(() => {
            setShowAuthModal(false);
            setAuthSuccess(false);
            alert("Strategic Operation Authorized. Directives sent to HQ.");
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('pm_title')}</h2>
                    <p className="text-gray-400 text-xs font-sans">{t('pm_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('strat')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'strat' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Globe size={12} className="mr-2"/> {t('pm_tab_strat')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('nsc')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'nsc' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ShieldAlert size={12} className="mr-2"/> {t('pm_tab_nsc')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('auth')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'auth' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Crown size={12} className="mr-2"/> {t('pm_tab_auth')}
                        </button>
                    </div>
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors"
                            title="Exit / Back"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('pm_metric_budget')} value=">$2.0B" change={3.1} icon={Briefcase} color="success" />
                <MetricCard 
                    title={t('pm_metric_security')} 
                    value={`DEFCON ${defcon}`} 
                    icon={ShieldAlert} 
                    color={defcon <= 2 ? "danger" : "warning"}
                    onClick={() => {
                        const next = defcon === 1 ? 5 : defcon - 1;
                        if(confirm(`Change National Security Level to DEFCON ${next}?`)) setDefcon(next);
                    }}
                />
                <MetricCard title={t('pm_metric_approval')} value="78%" change={1.2} icon={TrendingUp} color="accent" />
                <MetricCard title={t('pm_metric_mobilization')} value={`Level ${mobLevel}`} icon={Users} color={mobLevel > 2 ? 'danger' : 'default'} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 8.1 Strategic Command Dashboard */}
                {activeTab === 'strat' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden">
                        {/* Objectives */}
                        <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-y-auto lg:overflow-hidden">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col flex-shrink-0">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Activity className="mr-2 text-blue-500" size={20} /> Strategic Objectives
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-military-900 rounded border border-military-600">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="text-sm font-bold text-white">{t('pm_obj_sovereignty')}</h4>
                                            <span className="text-xs text-green-500">Stable</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div></div>
                                    </div>
                                    <div className="p-4 bg-military-900 rounded border border-military-600">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="text-sm font-bold text-white">{t('pm_obj_stability')}</h4>
                                            <span className="text-xs text-yellow-500">Attention Needed</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-yellow-500 h-2 rounded-full" style={{width: '78%'}}></div></div>
                                    </div>
                                    <div className="p-4 bg-military-900 rounded border border-military-600">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="text-sm font-bold text-white">{t('pm_obj_modernization')}</h4>
                                            <span className="text-xs text-blue-500">On Track</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobilization Control */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-shrink-0">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Users className="mr-2 text-yellow-500" size={20} /> {t('pm_mob_control')}
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-1 w-full">
                                        <label className="text-xs text-gray-400 block mb-2">{t('pm_mob_level')}</label>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="4" 
                                            step="1" 
                                            value={mobLevel} 
                                            onChange={(e) => setMobLevel(parseInt(e.target.value))} 
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                            <span>Normal</span>
                                            <span>Elevated</span>
                                            <span>High</span>
                                            <span>Critical</span>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded border-2 text-center w-full sm:w-32 ${mobLevel > 2 ? 'bg-red-900/30 border-red-500 text-red-500 animate-pulse' : 'bg-green-900/30 border-green-500 text-green-500'}`}>
                                        <span className="block text-2xl font-bold">{mobLevel}</span>
                                        <span className="text-[10px] font-bold">LEVEL</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-military-900 rounded flex justify-between items-center">
                                    <span className="text-sm text-gray-300">{t('pm_mob_reserve')}</span>
                                    <button className="bg-gray-700 text-gray-400 px-3 py-1 rounded text-xs hover:bg-yellow-600 hover:text-white transition-colors">ACTIVATE</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 overflow-y-auto lg:overflow-hidden">
                            {/* Budget */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col flex-1 min-h-[300px]">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Briefcase className="mr-2 text-green-500" size={20} /> Budget Allocation
                                </h3>
                                <div className="flex-1 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={budgetData} 
                                                innerRadius={50} 
                                                outerRadius={70} 
                                                paddingAngle={5} 
                                                dataKey="value"
                                            >
                                                {budgetData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-xs uppercase">
                                    {t('pm_btn_approve')}
                                </button>
                            </div>

                            {/* Foreign Policy */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-shrink-0">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Globe className="mr-2 text-purple-500" size={20} /> {t('pm_fp_dashboard')}
                                </h3>
                                <div className="space-y-3">
                                    {activePacts.map((pact, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs border-b border-military-600 pb-2">
                                            <div>
                                                <span className="font-bold text-white block">{pact.partner}</span>
                                                <span className="text-gray-400">{pact.type}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded ${pact.status === 'Active' ? 'bg-green-900/50 text-green-300' : pact.status === 'Critical' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                                                {pact.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8.2 NSC Portal */}
                {activeTab === 'nsc' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="lg:col-span-2 bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Users className="mr-2 text-purple-500" size={20} /> Multi-Agency Coordination Hub
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-military-900 rounded border border-military-600 flex flex-col items-center">
                                    <Radio className="text-green-500 mb-2" size={24} />
                                    <h4 className="text-white font-bold">{t('pm_agency_niss')}</h4>
                                    <span className="text-[10px] text-green-500">Connected</span>
                                </div>
                                <div className="p-4 bg-military-900 rounded border border-military-600 flex flex-col items-center">
                                    <ShieldAlert className="text-blue-500 mb-2" size={24} />
                                    <h4 className="text-white font-bold">{t('pm_agency_insa')}</h4>
                                    <span className="text-[10px] text-blue-500">Connected</span>
                                </div>
                                <div className="p-4 bg-military-900 rounded border border-military-600 flex flex-col items-center">
                                    <Users className="text-yellow-500 mb-2" size={24} />
                                    <h4 className="text-white font-bold">{t('pm_agency_fedpol')}</h4>
                                    <span className="text-[10px] text-yellow-500">Standby</span>
                                </div>
                                <div className="p-4 bg-military-900 rounded border border-military-600 flex flex-col items-center">
                                    <Globe className="text-red-500 mb-2" size={24} />
                                    <h4 className="text-white font-bold">{t('pm_agency_mod')}</h4>
                                    <span className="text-[10px] text-red-500">Alert</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-military-600">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center"><FileText className="mr-2 text-yellow-500" size={16}/> NSC Decision Tracker</h4>
                                <div className="space-y-3">
                                    {directives.map((dir) => (
                                        <div key={dir.id} className="p-3 bg-military-900 rounded border border-military-600">
                                            <div className="flex justify-between">
                                                <h4 className="text-sm font-bold text-white">{dir.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded ${dir.status === 'Completed' ? 'bg-green-900 text-green-300' : dir.status === 'In Progress' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>{dir.status}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{dir.id} • {dir.agency}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Calendar className="mr-2 text-blue-500" size={20} /> {t('pm_nsc_meetings')}
                            </h3>
                            <div className="flex-1 space-y-4">
                                {upcomingMeetings.map((mtg, i) => (
                                    <div key={i} className="bg-military-900 p-4 rounded border-l-4 border-blue-500">
                                        <div className="flex justify-between text-xs text-blue-400 font-bold mb-1">
                                            <span>{mtg.date}</span>
                                            <span>{mtg.time}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white">{mtg.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{mtg.attendees}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold text-xs">
                                CONVENE EMERGENCY SESSION
                            </button>
                        </div>
                    </div>
                )}

                {/* 8.3 Executive Authority */}
                {activeTab === 'auth' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-red-950/20 rounded-lg p-6 border border-red-900/50 flex flex-col items-center justify-center text-center h-64 lg:h-full">
                            <AlertTriangle className="text-red-500 mb-4 animate-pulse" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">{t('pm_auth_direct')}</h3>
                            <p className="text-sm text-red-300 mb-6">Commander-in-Chief secure channel. Use for strategic authorization only.</p>
                            
                            <button 
                                onClick={() => setShowAuthModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg shadow-red-900/50 transition-all transform hover:scale-105"
                            >
                                {t('pm_btn_authorize')}
                            </button>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Users className="mr-2 text-blue-500" size={20} /> {t('pm_auth_appoint')}
                            </h3>
                            <div className="space-y-4">
                                {appointments.map((app, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{app.name}</h4>
                                            <p className="text-xs text-gray-400">{app.position}</p>
                                        </div>
                                        {app.status === 'Pending Review' ? (
                                            <div className="flex space-x-2">
                                                <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                                                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded">Deny</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-green-500 font-bold">{app.status}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
                        <div className="bg-military-900 border border-red-600 rounded-lg p-8 max-w-sm w-full text-center animate-in zoom-in-95">
                            <Lock className="text-red-500 mx-auto mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg mb-4">CONFIRM IDENTITY</h3>
                            
                            {authSuccess ? (
                                <div className="text-green-500 font-bold animate-pulse flex flex-col items-center">
                                    <CheckCircle size={48} className="mb-2" />
                                    ACCESS GRANTED
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 border-2 border-red-500/50 rounded-full mx-auto flex items-center justify-center animate-pulse cursor-pointer" onClick={handleAuthorize}>
                                        <Fingerprint className="text-red-500" size={32} />
                                    </div>
                                    <p className="text-xs text-red-400">Scan Biometric Signature</p>
                                </div>
                            )}
                            
                            {!authSuccess && (
                                <button onClick={() => setShowAuthModal(false)} className="mt-6 text-gray-500 text-xs hover:text-white">CANCEL</button>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PrimeMinisterView;

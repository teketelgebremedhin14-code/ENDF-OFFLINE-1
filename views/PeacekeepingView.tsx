
import React, { useState } from 'react';
import { Flag, Globe, Users, AlertCircle, ShieldCheck, MapPin, Truck, Radio, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';

interface PeacekeepingViewProps {
    onBack?: () => void;
}

const PeacekeepingView: React.FC<PeacekeepingViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [selectedMission, setSelectedMission] = useState('ATMIS');

    const missions = [
        { id: 'UNISFA', name: 'Abyei (Sudan/S.Sudan)', role: t('peace_role_protect'), strength: '1,800', status: t('status_stable'), alert: false },
        { id: 'ATMIS', name: 'Somalia', role: t('peace_role_terror'), strength: '4,500', status: t('status_high_load'), alert: true },
        { id: 'UNMISS', name: 'South Sudan', role: t('peace_role_civ'), strength: '2,200', status: t('status_active'), alert: false },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t('peace_title')}</h2>
                    <p className="text-gray-400 text-sm">{t('peace_subtitle')}</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded flex items-center shadow-lg border border-blue-400">
                        <Globe size={14} className="mr-2" />
                        Global Contributor Rank: #3
                    </div>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('peace_metric_troops')} value="8,500" change={-1.2} icon={Users} color="accent" />
                <MetricCard title={t('peace_metric_missions')} value="3" icon={Flag} />
                <MetricCard title={t('peace_metric_repat')} value="150" icon={MapPin} color="success" />
                <MetricCard title={t('peace_metric_incidents')} value="12" change={25} icon={AlertCircle} color="warning" />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
                {/* Mission List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-semibold text-lg text-white mb-2 flex items-center">
                        <ShieldCheck className="mr-2 text-green-500" size={20} /> {t('peace_active_deployments')}
                    </h3>
                    {missions.map((mission) => (
                        <div 
                            key={mission.id} 
                            onClick={() => setSelectedMission(mission.id)}
                            className={`rounded-lg border p-6 flex flex-col relative overflow-hidden group cursor-pointer transition-all ${selectedMission === mission.id ? 'bg-military-700 border-blue-500 shadow-lg' : 'bg-military-800 border-military-700 hover:border-military-500'}`}
                        >
                            {mission.alert && (
                                <div className="absolute top-0 right-0 p-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full block animate-pulse shadow-[0_0_10px_#ef4444]"></span>
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{mission.id}</h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{mission.name}</p>
                                </div>
                                <Flag className={mission.alert ? "text-red-500" : "text-blue-500"} size={24} />
                            </div>
                            
                            <div className="space-y-3 mb-4 flex-1">
                                <div className="flex justify-between text-sm border-b border-military-600 pb-2">
                                    <span className="text-gray-400">Primary Role</span>
                                    <span className="text-white">{mission.role}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-military-600 pb-2">
                                    <span className="text-gray-400">Troop Strength</span>
                                    <span className="text-white font-mono">{mission.strength}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{t('lbl_status')}</span>
                                    <span className={`font-bold ${mission.alert ? 'text-red-400' : 'text-green-400'}`}>{mission.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interactive Deployment Map */}
                <div className="lg:col-span-2 bg-military-800 rounded-lg border border-military-700 p-1 flex flex-col">
                    <div className="relative flex-1 bg-[#0f172a] rounded overflow-hidden group min-h-[300px]">
                        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1 rounded border-l-2 border-blue-500">
                            <h4 className="text-xs font-bold text-blue-400 uppercase">{t('lbl_sector')}: {selectedMission}</h4>
                            <p className="text-[10px] text-gray-400">Live Satellite Feed</p>
                        </div>
                        
                        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                            <div className="flex items-center space-x-2 bg-black/60 px-2 py-1 rounded">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] text-red-400">INCIDENTS</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-black/60 px-2 py-1 rounded">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-[10px] text-blue-400">PATROLS</span>
                            </div>
                        </div>

                        <svg viewBox="0 0 400 300" className="w-full h-full">
                            {/* Terrain Map (Abstract) */}
                            <path d="M 50 50 L 150 50 L 130 150 L 50 180 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> 
                            <path d="M 130 150 L 220 140 L 250 200 L 200 250 L 130 220 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> 
                            <path d="M 250 200 L 350 220 L 300 280 L 200 250 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> 
                            
                            {/* Mission Specific Overlay */}
                            {selectedMission === 'ATMIS' && (
                                <g className="animate-in fade-in duration-500">
                                    <circle cx="300" cy="240" r="30" fill="url(#threatGradient)" opacity="0.4" />
                                    <circle cx="300" cy="240" r="4" fill="#ef4444" className="animate-ping" />
                                    <text x="310" y="235" fill="#ef4444" fontSize="8" fontWeight="bold">BAIDOA</text>
                                    
                                    {/* Patrol Paths */}
                                    <path d="M 280 220 Q 300 200 320 230" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" fill="none">
                                        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
                                    </path>
                                    <circle cx="320" cy="230" r="2" fill="#3b82f6" />
                                    <text x="325" y="230" fill="#3b82f6" fontSize="6">PATROL-A</text>
                                </g>
                            )}

                            {selectedMission === 'UNISFA' && (
                                <g className="animate-in fade-in duration-500">
                                    <rect x="110" y="130" width="40" height="40" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="4 2" />
                                    <circle cx="130" cy="150" r="3" fill="#3b82f6" />
                                    <text x="135" y="145" fill="white" fontSize="8" fontWeight="bold">ABYEI HQ</text>
                                    <line x1="130" y1="150" x2="160" y2="180" stroke="#3b82f6" strokeWidth="1" />
                                </g>
                            )}
                            
                            {selectedMission === 'UNMISS' && (
                                <g className="animate-in fade-in duration-500">
                                    <path d="M 200 250 L 220 200 L 250 200" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                                    <circle cx="200" cy="250" r="3" fill="#22c55e" />
                                    <text x="210" y="250" fill="white" fontSize="8" fontWeight="bold">JUBA SECTOR</text>
                                </g>
                            )}

                            <defs>
                                <radialGradient id="threatGradient">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                    
                    <div className="p-4 bg-military-900 border-t border-military-700 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-900/30 rounded border border-yellow-600/50 text-yellow-500">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-200 uppercase">{t('peace_sitrep')}</h4>
                                <p className="text-xs text-gray-400 max-w-md truncate">{t('peace_sitrep_desc')}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-military-800 hover:bg-military-700 text-xs text-white px-3 py-1.5 rounded border border-military-600 flex items-center">
                                <Truck size={12} className="mr-1"/> Logistics
                            </button>
                            <button className="bg-military-800 hover:bg-military-700 text-xs text-white px-3 py-1.5 rounded border border-military-600 flex items-center">
                                <Radio size={12} className="mr-1"/> Comms
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeacekeepingView;

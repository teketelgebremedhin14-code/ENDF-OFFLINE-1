
import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Eye, Target, MapPin, Signal, Battery, Wifi, AlertTriangle, Activity, Shield, UserCheck, Lock, Edit3, User, MousePointer2, Zap, Trash2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PlacedAsset {
    id: number;
    type: 'sniper' | 'breach' | 'drone' | 'intel';
    x: number;
    y: number;
}

interface SpecialOpsViewProps {
    onBack?: () => void;
}

const SpecialOpsView: React.FC<SpecialOpsViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'agazi' | 'republican' | 'planner'>('agazi');
    
    // Planner State
    const [selectedTool, setSelectedTool] = useState<'move' | 'sniper' | 'breach' | 'drone' | 'intel'>('move');
    const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
    const plannerRef = useRef<HTMLDivElement>(null);

    // Combat Operators (Agazi)
    const [operators, setOperators] = useState([
        { id: 'OP-1', status: 'OK', hr: 72, batt: 90, signal: 100 },
        { id: 'OP-2', status: 'OK', hr: 75, batt: 88, signal: 95 },
        { id: 'OP-3', status: 'WARN', hr: 110, batt: 45, signal: 60 },
        { id: 'OP-4', status: 'OK', hr: 68, batt: 92, signal: 98 },
    ]);

    // VIP Protection Detail (Republican Guard)
    const [vipStatus, setVipStatus] = useState({
        pm: { loc: t('vip_secure_zone'), status: t('status_secure'), teams: 3 },
        pres: { loc: t('vip_jubilee'), status: t('status_secure'), teams: 2 },
        convoy: { loc: t('vip_route'), status: t('status_moving'), teams: 4 }
    });

    // Live Biometrics Simulation
    useEffect(() => {
        const interval = window.setInterval(() => {
            setOperators(prev => prev.map(op => ({
                ...op,
                hr: Math.max(60, Math.min(180, op.hr + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 5)))),
                batt: Math.max(0, op.batt - (Math.random() > 0.9 ? 1 : 0)),
                signal: Math.max(0, Math.min(100, op.signal + (Math.random() > 0.5 ? 2 : -2)))
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handlePlannerClick = (e: React.MouseEvent) => {
        if (selectedTool === 'move' || !plannerRef.current) return;
        
        const rect = plannerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setPlacedAssets([...placedAssets, {
            id: Date.now(),
            type: selectedTool,
            x,
            y
        }]);
    };

    const removeAsset = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setPlacedAssets(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-red-500 tracking-tight flex items-center">
                        <Crosshair className="mr-2" /> {t('spec_title')}
                    </h2>
                    <p className="text-gray-500 text-sm uppercase tracking-widest">{t('spec_subtitle')}</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="flex space-x-2 bg-military-800 p-1 rounded-lg border border-military-700">
                        <button 
                            onClick={() => setActiveTab('agazi')}
                            className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${activeTab === 'agazi' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            AGAZI
                        </button>
                        <button 
                            onClick={() => setActiveTab('republican')}
                            className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${activeTab === 'republican' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            REP. GUARD
                        </button>
                        <button 
                            onClick={() => setActiveTab('planner')}
                            className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${activeTab === 'planner' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Edit3 size={12} className="mr-1 inline" /> {t('spec_tab_planning')}
                        </button>
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

            {activeTab === 'agazi' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto lg:overflow-hidden">
                    {/* Live Tactical Feed */}
                    <div className="lg:col-span-2 bg-black rounded-lg border border-gray-800 relative overflow-hidden flex flex-col min-h-[400px]">
                        <div className="absolute top-4 left-4 z-10 flex space-x-2">
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">LIVE</span>
                            <span className="text-xs text-green-500 font-mono">CAM-2B (NIGHT)</span>
                        </div>
                        
                        {/* Simulated Night Vision View */}
                        <div className="flex-1 relative bg-green-900/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595150821685-64582f34842d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay grayscale contrast-150 brightness-50"></div>
                            <div className="absolute inset-0 bg-green-500/10 mix-blend-multiply"></div>
                            
                            {/* HUD Elements */}
                            <svg className="absolute inset-0 w-full h-full opacity-60">
                                 <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="10 5" />
                                 <circle cx="50%" cy="50%" r="20" stroke="#22c55e" strokeWidth="1" fill="none" />
                                 <line x1="48%" y1="50%" x2="52%" y2="50%" stroke="#22c55e" strokeWidth="1" />
                                 <line x1="50%" y1="48%" x2="50%" y2="52%" stroke="#22c55e" strokeWidth="1" />
                            </svg>

                            <div className="z-10 text-green-500 font-mono text-center">
                                <p className="text-sm tracking-widest">NO MOVEMENT DETECTED</p>
                            </div>
                        </div>

                        <div className="bg-black p-4 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {operators.map(op => (
                                <div key={op.id} className={`border ${op.status === 'WARN' || op.hr > 120 ? 'border-red-900 bg-red-900/10' : 'border-gray-800 bg-gray-900'} p-2 rounded transition-colors duration-500`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-bold text-xs ${op.status === 'WARN' ? 'text-red-500' : 'text-gray-400'}`}>{op.id}</span>
                                        {(op.status === 'WARN' || op.hr > 120) && <AlertTriangle size={12} className="text-red-500 animate-pulse"/>}
                                    </div>
                                    <div className="space-y-1 text-[10px] font-mono text-gray-500">
                                        <div className="flex justify-between">
                                            <span className="flex items-center"><Activity size={8} className="mr-1"/> HR</span>
                                            <span className={op.hr > 100 ? 'text-red-500 font-bold' : 'text-green-500'}>{op.hr}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="flex items-center"><Battery size={8} className="mr-1"/> PWR</span>
                                            <span className={op.batt < 50 ? 'text-yellow-500' : 'text-green-500'}>{op.batt}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="flex items-center"><Wifi size={8} className="mr-1"/> LNK</span>
                                            <span className={op.signal < 50 ? 'text-red-500' : 'text-green-500'}>{op.signal}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Target Profiles */}
                    <div className="space-y-6 overflow-y-auto">
                        <div className="bg-military-800 rounded-lg p-4 border border-military-700">
                            <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase">
                                <Target className="mr-2 text-red-500" size={16} /> {t('spec_objectives')}
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-military-900 p-3 rounded border-l-4 border-red-500 opacity-80">
                                    <h4 className="text-xs font-bold text-gray-300">{t('spec_obj_alpha')}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">{t('spec_desc_alpha')}</p>
                                    <span className="inline-block mt-2 text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded">PENDING</span>
                                </div>
                                 <div className="bg-military-900 p-3 rounded border-l-4 border-green-500">
                                    <h4 className="text-xs font-bold text-gray-300">{t('spec_obj_bravo')}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">{t('spec_desc_bravo')}</p>
                                    <span className="inline-block mt-2 text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded">COMPLETED</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-4 border border-military-700">
                            <h3 className="font-bold text-white mb-2 flex items-center text-sm uppercase">
                                <MapPin className="mr-2 text-gray-400" size={16} /> {t('spec_extraction')}
                            </h3>
                            <div className="bg-black h-32 rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
                                {/* Simple Grid Animation */}
                                <div className="absolute inset-0" style={{ 
                                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                                    backgroundSize: '20px 20px',
                                    opacity: 0.3
                                }}></div>
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="mt-2 text-xs text-gray-400 font-mono">
                                COORD: 34.211, 41.992<br/>
                                ETA: 04:00 LOC
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'republican' && (
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Cards */}
                        <div className="bg-military-800 p-6 rounded-lg border border-military-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400">Prime Minister</h3>
                                <p className="text-xl font-bold text-white">{vipStatus.pm.loc}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded font-bold">{vipStatus.pm.status}</span>
                                <p className="text-xs text-gray-500 mt-1">{vipStatus.pm.teams} Teams Active</p>
                            </div>
                        </div>
                        <div className="bg-military-800 p-6 rounded-lg border border-military-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400">President</h3>
                                <p className="text-xl font-bold text-white">{vipStatus.pres.loc}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded font-bold">{vipStatus.pres.status}</span>
                                <p className="text-xs text-gray-500 mt-1">{vipStatus.pres.teams} Teams Active</p>
                            </div>
                        </div>
                        <div className="bg-military-800 p-6 rounded-lg border border-military-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400">Guest Convoy</h3>
                                <p className="text-xl font-bold text-white">{vipStatus.convoy.loc}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded font-bold">{vipStatus.convoy.status}</span>
                                <p className="text-xs text-gray-500 mt-1">{vipStatus.convoy.teams} Teams Active</p>
                            </div>
                        </div>

                        {/* Perimeter Map */}
                        <div className="md:col-span-2 bg-[#020617] rounded-lg border border-military-700 h-96 relative overflow-hidden p-4">
                            <h3 className="text-sm font-bold text-white mb-2 absolute top-4 left-4 z-10 flex items-center"><Shield size={16} className="mr-2 text-blue-500"/> Palace Perimeter Defense</h3>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Palace */}
                                <div className="w-20 h-20 bg-blue-900/30 border border-blue-500 rounded-lg flex items-center justify-center z-10">
                                    <UserCheck size={32} className="text-blue-400" />
                                </div>
                                
                                {/* Defense Rings */}
                                <div className="absolute w-64 h-64 border-2 border-green-900/50 rounded-full animate-[spin_60s_linear_infinite]">
                                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                                </div>
                                <div className="absolute w-96 h-96 border border-yellow-900/30 rounded-full border-dashed"></div>
                            </div>
                        </div>

                        {/* Threat Log */}
                        <div className="bg-military-800 rounded-lg border border-military-700 flex flex-col h-96 md:h-auto">
                            <div className="p-4 border-b border-military-700 bg-military-900/50">
                                <h3 className="font-bold text-white text-sm flex items-center"><Lock size={16} className="mr-2 text-gray-400"/> Security Log</h3>
                            </div>
                            <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto flex-1">
                                <div className="text-green-400">[10:42:15] Perimeter Shift Change Complete.</div>
                                <div className="text-gray-400">[10:30:00] Convoy Alpha departed Bole Airport.</div>
                                <div className="text-yellow-500">[10:15:22] Drone detection system triggered (False Positive - Bird).</div>
                                <div className="text-gray-400">[09:55:10] Routine sweep Sector 4 clear.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'planner' && (
                <div className="h-full flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-military-800 p-2 rounded-lg border border-military-700 flex lg:flex-col lg:w-16 space-x-2 lg:space-x-0 lg:space-y-4 items-center h-min shrink-0 overflow-x-auto">
                        {[
                            { id: 'move', icon: MousePointer2, label: t('spec_tool_move') },
                            { id: 'sniper', icon: Crosshair, label: t('spec_tool_sniper'), color: 'text-red-500' },
                            { id: 'breach', icon: Zap, label: t('spec_tool_breach'), color: 'text-yellow-500' },
                            { id: 'intel', icon: Eye, label: t('spec_tool_intel'), color: 'text-blue-500' },
                            { id: 'drone', icon: MapPin, label: t('spec_tool_drone'), color: 'text-green-500' },
                        ].map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => setSelectedTool(tool.id as any)}
                                className={`p-2 rounded transition-all ${
                                    selectedTool === tool.id 
                                    ? 'bg-military-700 border border-white shadow-lg scale-110' 
                                    : 'hover:bg-military-700 border border-transparent'
                                }`}
                                title={tool.label}
                            >
                                <tool.icon size={20} className={tool.color || 'text-white'} />
                            </button>
                        ))}
                        
                        <div className="flex-1 lg:h-full"></div>
                        <button 
                            onClick={() => setPlacedAssets([])} 
                            className="p-2 hover:text-red-500 text-gray-500" 
                            title="Clear"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Blueprint Canvas */}
                    <div 
                        className={`flex-1 bg-[#f5f5f5] rounded-lg border border-military-700 relative overflow-hidden shadow-inner min-h-[400px] ${selectedTool !== 'move' ? 'cursor-crosshair' : 'cursor-default'}`} 
                        ref={plannerRef} 
                        onClick={handlePlannerClick}
                    >
                        {/* Blueprint Grid */}
                        <div className="absolute inset-0" style={{ 
                            backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
                            backgroundSize: '20px 20px' 
                        }}></div>

                        {/* Room Layout SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                            <rect x="100" y="100" width="400" height="300" fill="none" stroke="#333" strokeWidth="4" />
                            <line x1="300" y1="100" x2="300" y2="400" stroke="#333" strokeWidth="2" />
                            <line x1="100" y1="250" x2="500" y2="250" stroke="#333" strokeWidth="2" />
                            {/* Doors */}
                            <path d="M 150 100 Q 180 130 210 100" fill="none" stroke="#333" strokeWidth="2" />
                            <path d="M 300 320 Q 330 350 300 380" fill="none" stroke="#333" strokeWidth="2" />
                        </svg>

                        {/* Placed Assets */}
                        {placedAssets.map(asset => (
                            <div 
                                key={asset.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md cursor-pointer group"
                                style={{ top: asset.y, left: asset.x }}
                                onClick={(e) => removeAsset(e, asset.id)}
                            >
                                {asset.type === 'sniper' && <Crosshair size={24} className="text-red-600" fill="white" />}
                                {asset.type === 'breach' && <Zap size={24} className="text-yellow-600" fill="white" />}
                                {asset.type === 'intel' && <Eye size={24} className="text-blue-600" fill="white" />}
                                {asset.type === 'drone' && <MapPin size={24} className="text-green-600" fill="white" />}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                    Click to Remove
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecialOpsView;

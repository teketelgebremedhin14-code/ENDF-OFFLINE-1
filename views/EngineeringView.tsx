
import React, { useState } from 'react';
import { Wrench, HardHat, Cpu, Database, Truck, Factory, Settings, Zap, Layers, Box, Activity, Hammer, RefreshCw, PenTool, AlertTriangle, CheckCircle, Search, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface EngineeringViewProps {
    onBack?: () => void;
}

const EngineeringView: React.FC<EngineeringViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'production' | 'rd' | 'infrastructure'>('production');

    // Real-world context: DEIC (Defense Engineering Industry Corp) Clusters
    const factories = [
        { id: 'FAC-01', name: 'Bishoftu Automotive', type: 'Vehicle/Armor', status: 'Operational', output: 92, alert: false },
        { id: 'FAC-02', name: 'Gafat Armament', type: 'Small Arms', status: 'High Load', output: 98, alert: true },
        { id: 'FAC-03', name: 'Homicho Ammunition', type: 'Munitions', status: 'Operational', output: 88, alert: false },
        { id: 'FAC-04', name: 'Dejen Aviation', type: 'MRO (Air)', status: 'Maintenance', output: 65, alert: false },
        { id: 'FAC-05', name: 'Hibret Machine', type: 'Tools/Spare', status: 'Operational', output: 90, alert: false },
    ];

    const productionData = [
        { month: 'Jan', vehicles: 45, arms: 1200, ammo: 50000 },
        { month: 'Feb', vehicles: 48, arms: 1350, ammo: 52000 },
        { month: 'Mar', vehicles: 52, arms: 1100, ammo: 48000 },
        { month: 'Apr', vehicles: 50, arms: 1400, ammo: 55000 },
        { month: 'May', vehicles: 55, arms: 1500, ammo: 60000 },
        { month: 'Jun', vehicles: 60, arms: 1600, ammo: 62000 },
    ];

    const projectStatus = [
        { name: 'On Track', value: 12, color: '#10b981' },
        { name: 'Delayed (Supply)', value: 4, color: '#f59e0b' },
        { name: 'Critical', value: 2, color: '#ef4444' },
    ];

    // R&D Projects (Import Substitution Focus)
    const rdProjects = [
        { id: 'RD-2025-A', name: 'ET-Drone Mk2', progress: 75, phase: 'Flight Test', priority: 'High' },
        { id: 'RD-2025-B', name: 'Secure Radio (Encrypted)', progress: 40, phase: 'Prototyping', priority: 'Medium' },
        { id: 'RD-2025-C', name: 'T-72 Fire Control Upgrade', progress: 90, phase: 'Final QA', priority: 'Critical' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('eng_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('eng_subtitle')} • DEIC Command</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('production')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'production' ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Factory size={12} className="mr-2"/> {t('eng_tab_prod')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('rd')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'rd' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Cpu size={12} className="mr-2"/> {t('eng_tab_rd')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('infrastructure')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'infrastructure' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <HardHat size={12} className="mr-2"/> INFRASTRUCTURE
                        </button>
                    </div>
                    {onBack && (
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors" title="Exit / Back">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('eng_metric_output')} value="92%" change={1.5} icon={Activity} color="success" />
                <MetricCard title={t('eng_metric_projects')} value="18 Active" icon={PenTool} color="accent" />
                <MetricCard title={t('eng_metric_fleet')} value="12 Units/Mo" change={5} icon={Truck} color="warning" />
                <MetricCard title={t('eng_stockpile')} value="Healthy" icon={Box} color="success" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* TAB 1: PRODUCTION DASHBOARD */}
                {activeTab === 'production' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                        {/* Factory Status */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-auto lg:h-full">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Factory className="mr-2 text-orange-500" size={20} /> Industrial Complex Status
                            </h3>
                            <div className="space-y-4">
                                {factories.map(fac => (
                                    <div key={fac.id} className="bg-military-900 p-3 rounded border border-military-600 flex justify-between items-center group hover:border-orange-500 transition-colors">
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-bold text-sm text-white mr-2">{fac.name}</h4>
                                                {fac.alert && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                                            </div>
                                            <p className="text-xs text-gray-400">{fac.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-300 mb-1">Efficiency: <span className={fac.output > 90 ? 'text-green-500' : 'text-yellow-500'}>{fac.output}%</span></div>
                                            <div className="w-24 bg-gray-800 h-1.5 rounded-full ml-auto">
                                                <div className={`h-full rounded-full ${fac.output > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${fac.output}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Production Output Chart */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-full min-h-[300px]">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center flex-shrink-0">
                                <Activity className="mr-2 text-green-500" size={20} /> Production Output Trends
                            </h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={productionData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                        <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '11px' }} />
                                        <Line yAxisId="left" type="monotone" dataKey="vehicles" name="Vehicles (Unit)" stroke="#f59e0b" strokeWidth={2} />
                                        <Line yAxisId="left" type="monotone" dataKey="arms" name="Small Arms (Unit)" stroke="#10b981" strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="ammo" name="Ammo (Rnds)" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: RESEARCH & DEVELOPMENT */}
                {activeTab === 'rd' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                        {/* R&D Pipeline */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Cpu className="mr-2 text-purple-500" size={20} /> Innovation Pipeline
                            </h3>
                            <div className="space-y-6">
                                {rdProjects.map((proj) => (
                                    <div key={proj.id} className="relative pl-6 border-l-2 border-purple-900">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-military-800 ${proj.priority === 'Critical' ? 'bg-red-500' : 'bg-purple-500'}`}></div>
                                        <div className="bg-military-900 p-4 rounded border border-military-600">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${proj.priority === 'Critical' ? 'bg-red-900/50 text-red-300' : 'bg-purple-900/50 text-purple-300'}`}>
                                                    {proj.priority}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>{proj.phase}</span>
                                                <span>{proj.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 rounded-full">
                                                <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{width: `${proj.progress}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Blueprint Viewer (Simulated) */}
                        <div className="bg-[#0b1120] rounded-lg border border-military-700 relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="absolute top-4 left-4 z-10 bg-black/60 px-3 py-1 rounded border-l-2 border-purple-500">
                                <h4 className="text-xs font-bold text-purple-400 uppercase">CAD VIEW: ET-97 ASSAULT RIFLE</h4>
                                <p className="text-[10px] text-gray-400">Modification Block 3</p>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                
                                {/* Wireframe Gun SVG */}
                                <svg viewBox="0 0 400 150" className="w-3/4 opacity-80 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                    <path d="M 50 80 L 100 80 L 100 120 L 80 120 L 80 80" fill="none" stroke="#a855f7" strokeWidth="2" /> {/* Grip */}
                                    <rect x="50" y="50" width="200" height="30" fill="none" stroke="#a855f7" strokeWidth="2" /> {/* Receiver */}
                                    <rect x="250" y="55" width="120" height="10" fill="none" stroke="#a855f7" strokeWidth="2" /> {/* Barrel */}
                                    <path d="M 10 60 L 50 60 L 50 70 L 10 90 Z" fill="none" stroke="#a855f7" strokeWidth="2" /> {/* Stock */}
                                    <rect x="150" y="40" width="60" height="10" fill="none" stroke="#a855f7" strokeWidth="2" /> {/* Sight */}
                                    <rect x="180" y="80" width="40" height="50" fill="none" stroke="#a855f7" strokeWidth="2" rx="0" transform="skewX(-10)" /> {/* Mag */}
                                    
                                    {/* Analysis Points */}
                                    <circle cx="260" cy="60" r="3" fill="#fff" className="animate-ping" />
                                    <circle cx="180" cy="45" r="3" fill="#fff" className="animate-ping" style={{animationDelay: '0.5s'}} />
                                </svg>
                            </div>

                            <div className="p-4 bg-military-900 border-t border-military-700 grid grid-cols-3 gap-4 text-center flex-shrink-0">
                                <div>
                                    <span className="block text-xs text-gray-500">Weight</span>
                                    <span className="text-white font-mono font-bold">3.2 kg</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500">Caliber</span>
                                    <span className="text-white font-mono font-bold">7.62x39mm</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500">Effective Range</span>
                                    <span className="text-white font-mono font-bold">400m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: INFRASTRUCTURE (DCE) */}
                {activeTab === 'infrastructure' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <HardHat className="mr-2 text-blue-500" size={20} /> Defense Construction Enterprise (DCE)
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-military-900 p-4 rounded border border-military-600">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="text-sm font-bold text-white">GERD Defense Zone (Beni-Shangul)</h4>
                                        <span className="text-[10px] bg-green-900 text-green-300 px-2 py-0.5 rounded">Active</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mb-1">
                                        <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                                    </div>
                                    <p className="text-xs text-gray-400">Anti-Air emplacements and perimeter roads nearing completion.</p>
                                </div>

                                <div className="bg-military-900 p-4 rounded border border-military-600">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="text-sm font-bold text-white">Addis Military Hospital (Wing C)</h4>
                                        <span className="text-[10px] bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">Delayed</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mb-1">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '45%'}}></div>
                                    </div>
                                    <p className="text-xs text-gray-400">Material supply bottleneck. Revised completion: Q3 2025.</p>
                                </div>

                                <div className="bg-military-900 p-4 rounded border border-military-600">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="text-sm font-bold text-white">Naval Academy Expansion (Bishoftu)</h4>
                                        <span className="text-[10px] bg-blue-900 text-blue-300 px-2 py-0.5 rounded">Planning</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mb-1">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '15%'}}></div>
                                    </div>
                                    <p className="text-xs text-gray-400">Site survey complete. Awaiting budget approval.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-full min-h-[300px]">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center flex-shrink-0">
                                <Database className="mr-2 text-yellow-500" size={20} /> Resource Allocation
                            </h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectStatus}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {projectStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 flex-shrink-0">
                                <div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                    On Track
                                </div>
                                <div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                    Delayed
                                </div>
                                <div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                                    Critical
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineeringView;

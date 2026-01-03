
import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, CreditCard, ShoppingCart, HardHat, RefreshCw, Activity, Save, Coins, Landmark, X, Wallet, BarChart3 } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface FinanceViewProps {
    onBack?: () => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'budget' | 'procure' | 'dce'>('budget');
    
    // Budget Simulator State
    const [allocations, setAllocations] = useState({ ops: 40, procure: 30, salary: 20, rd: 10 });
    const [projectedReadiness, setProjectedReadiness] = useState([
        { month: 'M1', score: 85 }, { month: 'M2', score: 86 }, { month: 'M3', score: 88 },
        { month: 'M4', score: 89 }, { month: 'M5', score: 91 }, { month: 'M6', score: 92 }
    ]);

    const handleSliderChange = (key: keyof typeof allocations, val: string) => {
        const newValue = parseInt(val);
        setAllocations(prev => {
            const diff = newValue - prev[key];
            const remainingKeys = Object.keys(prev).filter(k => k !== key) as (keyof typeof allocations)[];
            const deduction = diff / remainingKeys.length;
            
            const newAlloc = { ...prev, [key]: newValue };
            remainingKeys.forEach(k => newAlloc[k] = Math.max(0, prev[k] - deduction));
            
            // Recalculate Readiness Mock
            const readyScore = (newAlloc.ops * 0.5) + (newAlloc.procure * 0.3) + (newAlloc.salary * 0.2) + (newAlloc.rd * 0.1);
            const baseData = [82, 83, 84, 85, 86, 87];
            setProjectedReadiness(baseData.map((b, i) => ({
                month: `M${i+1}`,
                score: Math.min(100, b + (readyScore / 10) * (i * 0.2))
            })));

            return newAlloc;
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('fin_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('fin_subtitle')}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button onClick={() => setActiveTab('budget')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'budget' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <PieChart size={14} className="mr-2"/> {t('fin_tab_budget')}
                        </button>
                        <button onClick={() => setActiveTab('procure')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'procure' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <ShoppingCart size={14} className="mr-2"/> {t('fin_tab_procure')}
                        </button>
                        <button onClick={() => setActiveTab('dce')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'dce' ? 'bg-yellow-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <HardHat size={14} className="mr-2"/> {t('fin_tab_dce')}
                        </button>
                    </div>
                    {onBack && (
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors" title="Exit / Back">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('fin_metric_budget')} value="88B ETB" change={2.5} icon={Landmark} color="success" />
                <MetricCard title={t('fin_metric_procure')} value="$320M (Forex)" change={12} icon={Coins} color="warning" />
                <MetricCard title="DCE Revenue" value="6.5B ETB" change={8.4} icon={TrendingUp} color="accent" />
                <MetricCard title={t('fin_metric_emergency')} value="2.1B ETB" icon={CreditCard} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                {activeTab === 'budget' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Budget Sliders */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <RefreshCw className="mr-2 text-green-500" size={20} /> Allocation Simulator (ETB)
                            </h3>
                            <div className="space-y-6 flex-1">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-300">{t('fin_label_ops')}</span>
                                        <span className="text-green-400 font-mono">{allocations.ops.toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={allocations.ops} onChange={(e) => handleSliderChange('ops', e.target.value)} className="w-full h-2 bg-military-900 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-300">{t('fin_label_procure')}</span>
                                        <span className="text-yellow-400 font-mono">{allocations.procure.toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={allocations.procure} onChange={(e) => handleSliderChange('procure', e.target.value)} className="w-full h-2 bg-military-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-300">{t('fin_label_salary')}</span>
                                        <span className="text-blue-400 font-mono">{allocations.salary.toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={allocations.salary} onChange={(e) => handleSliderChange('salary', e.target.value)} className="w-full h-2 bg-military-900 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-300">{t('fin_label_rd')}</span>
                                        <span className="text-purple-400 font-mono">{allocations.rd.toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={allocations.rd} onChange={(e) => handleSliderChange('rd', e.target.value)} className="w-full h-2 bg-military-900 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center">
                                <Save size={16} className="mr-2" /> APPLY PROJECTION
                            </button>
                        </div>

                        {/* Impact Chart */}
                        <div className="lg:col-span-2 bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Activity className="mr-2 text-military-accent" size={20} /> {t('fin_projected_impact')}
                            </h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={projectedReadiness}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorScore)" name="Readiness Index" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 p-3 bg-military-900 rounded border border-military-600 text-xs text-gray-400">
                                <strong>AI Insight:</strong> Increasing <em>Local Procurement (MetEC)</em> by 5% reduces reliance on Forex and stabilizes supply chains for spare parts.
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'procure' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                        {/* 3D Asset Viewer (Simulated) */}
                        <div className="bg-[#0b1120] rounded-lg border border-military-700 relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="absolute top-4 left-4 z-10">
                                <h3 className="text-white font-bold text-lg">ASSET REVIEW: T-72 UPGRADE</h3>
                                <p className="text-xs text-green-500 font-mono">SUPPLIER: GAFAT ARMAMENT ENG.</p>
                            </div>
                            <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                                {/* Rotating Grid Background */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px), backgroundSize: 30px 30px' }}></div>
                                
                                {/* 3D Wireframe Mockup */}
                                <div className="relative w-64 h-48 transform-style-3d animate-[spin_10s_linear_infinite]">
                                    <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-[0_0_15px_#0ea5e9]">
                                        <path d="M20,70 L180,70 L190,50 L10,50 Z" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <path d="M50,50 L150,50 L140,30 L60,30 Z" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <rect x="80" y="20" width="40" height="10" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <line x1="120" y1="25" x2="180" y2="25" stroke="#0ea5e9" strokeWidth="2" />
                                        <circle cx="40" cy="75" r="8" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <circle cx="70" cy="75" r="8" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <circle cx="100" cy="75" r="8" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <circle cx="130" cy="75" r="8" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                        <circle cx="160" cy="75" r="8" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="p-4 bg-military-900 border-t border-military-700 flex justify-between">
                                <div className="text-xs text-gray-400">
                                    <span className="block text-gray-500">UNIT COST</span>
                                    <span className="text-white font-mono">18M ETB</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    <span className="block text-gray-500">DELIVERY</span>
                                    <span className="text-white font-mono">6 MONTHS</span>
                                </div>
                                <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1 rounded">APPROVE PO</button>
                            </div>
                        </div>

                        {/* Procurement List */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 overflow-y-auto">
                            <h3 className="font-semibold text-lg text-white mb-4">Pending Approvals</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-military-900 rounded border-l-4 border-yellow-500 hover:bg-military-700 transition-colors cursor-pointer">
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-bold text-white">Secure Radios (Homicho)</h4>
                                        <span className="text-xs text-yellow-500 font-bold">45M ETB</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Signals Directorate • QTY: 500</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-blue-500 hover:bg-military-700 transition-colors cursor-pointer">
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-bold text-white">Bishoftu APCs</h4>
                                        <span className="text-xs text-blue-400 font-bold">120M ETB</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Logistics Command • QTY: 50</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-green-500 hover:bg-military-700 transition-colors cursor-pointer">
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-bold text-white">Field Rations (MRE)</h4>
                                        <span className="text-xs text-green-500 font-bold">21M ETB</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Supply Corps • QTY: 100k</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dce' && (
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-full overflow-y-auto">
                        <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                            <HardHat className="mr-2 text-yellow-500" size={20} /> Defense Construction Enterprise (DCE)
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                            <div className="bg-military-900 p-4 rounded border border-military-600">
                                <h4 className="font-bold text-white mb-2">GERD Security Roads</h4>
                                <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden relative">
                                    <div className="bg-yellow-500 h-full w-[78%] flex items-center justify-center text-[9px] text-black font-bold">78%</div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-400">
                                    <div><span className="block text-gray-500">START</span> <span className="text-white">Jan 2024</span></div>
                                    <div><span className="block text-gray-500">EST. END</span> <span className="text-white">Dec 2025</span></div>
                                </div>
                            </div>

                            <div className="bg-military-900 p-4 rounded border border-military-600">
                                <h4 className="font-bold text-white mb-2">Bishoftu Hangar Complex</h4>
                                <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden relative">
                                    <div className="bg-blue-500 h-full w-[45%] flex items-center justify-center text-[9px] text-white font-bold">45%</div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-400">
                                    <div><span className="block text-gray-500">START</span> <span className="text-white">Mar 2024</span></div>
                                    <div><span className="block text-gray-500">EST. END</span> <span className="text-white">Jun 2026</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceView;

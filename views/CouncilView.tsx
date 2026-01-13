
import React, { useState } from 'react';
import { Briefcase, Users, Calendar, Network, FileText, CheckCircle, Video, Play, AlertCircle, Share2, Layers, Globe, Radio, Activity, Zap, ThumbsUp, UserCheck, Calculator, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { runStrategySimulation } from '../services/aiService';

interface CouncilViewProps {
    onBack?: () => void;
}

// Safe Render Helper
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        if (content.value) return <>{content.value}</>;
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const CouncilView: React.FC<CouncilViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'center' | 'meet' | 'integ' | 'decisions' | 'idscn'>('center');
    
    // IDSCN State
    const [simOutcome, setSimOutcome] = useState<any | null>(null);
    const [simulating, setSimulating] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState('Increase Border Budget');

    const integData = [
        { subject: 'Ground-Air', A: 92, fullMark: 100 },
        { subject: 'Air-Navy', A: 65, fullMark: 100 },
        { subject: 'Intel-Ops', A: 98, fullMark: 100 },
        { subject: 'Log-Combat', A: 85, fullMark: 100 },
        { subject: 'Cyber-Phys', A: 75, fullMark: 100 },
        { subject: 'Joint-Cmd', A: 90, fullMark: 100 },
    ];

    const promoCandidates = [
        { name: 'Col. Abebe', aiScore: 85, humanScore: 90 },
        { name: 'Col. Sarah', aiScore: 92, humanScore: 88 },
        { name: 'Lt. Col. Dawit', aiScore: 78, humanScore: 95 },
    ];

    const handleSimulate = async () => {
        setSimulating(true);
        setSimOutcome(null);
        try {
            const resultStr = await runStrategySimulation(
                `Simulate the strategic impact of this council decision: ${selectedProposal}. Focus on budget, morale, and readiness.`, 
                'alpha', 
                language, 
                { timeHorizon: '180 Days' }
            );
            
            let parsed;
            try {
                const clean = resultStr.replace(/^```json/, '').replace(/```$/, '').trim();
                parsed = JSON.parse(clean);
            } catch (e) {
                parsed = { summary: resultStr };
            }
            setSimOutcome(parsed);
        } catch (e) {
            setSimOutcome({ summary: "Simulation Failed." });
        }
        setSimulating(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('council_title')}</h2>
                    <p className="text-gray-400 text-xs font-sans">{t('council_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('center')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'center' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Globe size={12} className="mr-2"/> {t('council_tab_center')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('idscn')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'idscn' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Zap size={12} className="mr-2"/> {t('council_tab_idscn')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('meet')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'meet' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Calendar size={12} className="mr-2"/> {t('council_tab_meet')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('integ')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'integ' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Network size={12} className="mr-2"/> {t('council_tab_integ')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('decisions')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'decisions' ? 'bg-yellow-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FileText size={12} className="mr-2"/> {t('council_tab_decisions')}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('council_metric_members')} value="9" icon={Users} color="accent" />
                <MetricCard title={t('council_metric_readiness')} value="88%" change={1.5} icon={Activity} color="success" />
                <MetricCard title={t('council_metric_decisions')} value="4 Pending" change={-1} icon={AlertCircle} color="warning" />
                <MetricCard title={t('council_metric_integration')} value="82.5" change={2.1} icon={Share2} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 11.1.1 Strategic Coordination Command Center */}
                {activeTab === 'center' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="lg:col-span-2 bg-[#0b1120] rounded-lg border border-military-700 relative overflow-hidden flex items-center justify-center shadow-2xl group min-h-[400px]">
                            {/* Digital Round Table Visualization */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15),transparent)]"></div>
                            
                            <div className="relative w-64 h-64 md:w-96 md:h-96 scale-75 md:scale-100">
                                {/* Table Ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-purple-900/50 flex items-center justify-center">
                                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-purple-500/30 bg-purple-900/10 flex items-center justify-center backdrop-blur-sm">
                                        <Globe size={48} className="text-purple-500 opacity-50 animate-pulse md:w-16 md:h-16" />
                                    </div>
                                </div>

                                {/* Seats */}
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                                    <div 
                                        key={i}
                                        className="absolute w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 bg-military-800 border-2 border-military-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer z-10"
                                        style={{ 
                                            left: '50%', top: '50%', 
                                            transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)` 
                                        }}
                                        title={`Commander ${i+1}`}
                                    >
                                        <Users size={16} className={i === 0 ? "text-yellow-500" : "text-gray-400"} />
                                        <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-military-800 ${i < 6 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-4 left-4">
                                <h3 className="text-white font-bold text-lg font-display">Digital Command Round Table</h3>
                                <p className="text-xs text-gray-400">Live Status: <span className="text-green-500 font-bold">6/9 ONLINE</span></p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 h-full overflow-y-auto">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-bold text-white mb-4 flex items-center"><Radio className="mr-2 text-purple-500" size={16}/> Active Channels</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-military-900 rounded border-l-4 border-green-500">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white font-bold">Chief of Staff</span>
                                            <span className="text-green-500">Connected</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-green-500 h-1 rounded-full" style={{width: '100%'}}></div></div>
                                    </div>
                                    <div className="p-3 bg-military-900 rounded border-l-4 border-green-500">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white font-bold">Ground Forces Cmdr</span>
                                            <span className="text-green-500">Connected</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-green-500 h-1 rounded-full" style={{width: '100%'}}></div></div>
                                    </div>
                                    <div className="p-3 bg-military-900 rounded border-l-4 border-yellow-500">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white font-bold">Navy Cmdr</span>
                                            <span className="text-yellow-500">Connecting...</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-yellow-500 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30 flex flex-col items-center justify-center text-center">
                                <AlertCircle size={32} className="text-purple-400 mb-2 animate-bounce" />
                                <h4 className="text-white font-bold text-sm">Strategic Alert</h4>
                                <p className="text-xs text-purple-300 mt-1">Council Meeting Requested by PM Office.</p>
                                <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded">
                                    {t('council_btn_convene')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5.3 IDSCN */}
                {activeTab === 'idscn' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        {/* Simulator & Voting */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Calculator className="mr-2 text-indigo-500" size={20} /> {t('council_idscn_sim')}
                                </h3>
                                <div className="space-y-4">
                                    <label className="text-xs text-gray-400 block mb-1 font-bold">PROPOSAL SELECTOR</label>
                                    <select 
                                        className="w-full bg-military-900 border border-military-600 rounded p-2 text-sm text-white"
                                        value={selectedProposal}
                                        onChange={(e) => setSelectedProposal(e.target.value)}
                                    >
                                        <option>Increase Border Budget</option>
                                        <option>Deploy Rapid Response to East</option>
                                        <option>Cyber Offensive: Sector 9</option>
                                        <option>Force Modernization Procurement</option>
                                    </select>
                                    <button 
                                        onClick={handleSimulate}
                                        disabled={simulating}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-bold disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {simulating ? "RUNNING AGENT ALPHA..." : "RUN STRATEGIC SIMULATION"}
                                    </button>
                                    
                                    {simOutcome && (
                                        <div className="p-4 bg-indigo-900/30 border border-indigo-500/50 rounded animate-in fade-in slide-in-from-bottom-2">
                                            <h4 className="text-xs font-bold text-indigo-300 mb-2 uppercase">Projection Result</h4>
                                            <p className="text-xs text-indigo-100 leading-relaxed"><SafeRender content={simOutcome.summary} /></p>
                                            
                                            {simOutcome.cross_domain_matrix && (
                                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-500/30 text-[10px]">
                                                    <div className="text-center">
                                                        <span className="block text-gray-400">Morale</span>
                                                        <span className={`font-bold ${simOutcome.cross_domain_matrix.domestic_morale > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {simOutcome.cross_domain_matrix.domestic_morale > 0 ? '+' : ''}<SafeRender content={simOutcome.cross_domain_matrix.domestic_morale} />
                                                        </span>
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="block text-gray-400">Budget</span>
                                                        <span className={`font-bold ${simOutcome.cross_domain_matrix.economic_cost < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                            <SafeRender content={simOutcome.cross_domain_matrix.economic_cost} />
                                                        </span>
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="block text-gray-400">Readiness</span>
                                                        <span className={`font-bold ${simOutcome.cross_domain_matrix.military_readiness > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                            {simOutcome.cross_domain_matrix.military_readiness > 0 ? '+' : ''}<SafeRender content={simOutcome.cross_domain_matrix.military_readiness} />
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <ThumbsUp className="mr-2 text-green-500" size={20} /> {t('council_idscn_vote')}
                                </h3>
                                <div className="bg-military-900 p-4 rounded border border-military-600">
                                    <h4 className="font-bold text-white text-sm mb-2">Proposal 882: Force Modernization Fund</h4>
                                    <div className="flex space-x-2 mb-4">
                                        <div className="h-2 flex-1 bg-green-500 rounded-l"></div>
                                        <div className="h-2 w-1/4 bg-red-500 rounded-r"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>7 Ayes</span>
                                        <span>2 Nays</span>
                                    </div>
                                    <div className="flex space-x-4 mt-4">
                                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs">VOTE YES</button>
                                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs">VOTE NO</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promotion Board */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-96 lg:h-full">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center flex-shrink-0">
                                <UserCheck className="mr-2 text-yellow-500" size={20} /> {t('council_idscn_promo')}
                            </h3>
                            <p className="text-xs text-gray-400 mb-4 flex-shrink-0">Weighting: 70% AI Scoring + 30% Council Evaluation</p>
                            
                            <div className="flex-1 w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={promoCandidates} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={11} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        <Legend />
                                        <Bar dataKey="aiScore" name="AI Score (70%)" stackId="a" fill="#8b5cf6" barSize={20} />
                                        <Bar dataKey="humanScore" name="Human Score (30%)" stackId="a" fill="#eab308" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-center flex-shrink-0">
                                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-bold text-xs">APPROVE PROMOTIONS</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11.1.2 Council Meeting Management System */}
                {activeTab === 'meet' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-full overflow-y-auto">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Calendar className="mr-2 text-blue-500" size={20} /> Scheduled Engagements
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start p-4 bg-military-900 rounded border border-military-600">
                                    <div className="bg-blue-900/30 text-blue-400 p-3 rounded mr-4 text-center min-w-[60px]">
                                        <span className="block text-xs uppercase font-bold">MAR</span>
                                        <span className="block text-xl font-bold">15</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-bold text-white text-sm">{t('council_meeting_strategic')}</h4>
                                            <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">Q1 Review</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Agenda: Regional Stability Assessment, Budget ratification.</p>
                                        <div className="mt-3 flex space-x-2">
                                            <button className="text-[10px] bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600">View Agenda</button>
                                            <button className="text-[10px] bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600">Attendees</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start p-4 bg-military-900 rounded border border-military-600">
                                    <div className="bg-green-900/30 text-green-400 p-3 rounded mr-4 text-center min-w-[60px]">
                                        <span className="block text-xs uppercase font-bold">MAR</span>
                                        <span className="block text-xl font-bold">28</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-bold text-white text-sm">{t('council_meeting_operational')}</h4>
                                            <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded">Monthly</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Agenda: Logistics bottlenecks in North, Training output.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black rounded-lg border border-military-700 p-1 flex flex-col relative overflow-hidden min-h-[300px] lg:h-full">
                            <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse flex items-center">
                                <Video size={12} className="mr-1" /> SECURE LINK: OFF-AIR
                            </div>
                            <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 flex items-center justify-center">
                                <button className="bg-military-800/80 hover:bg-military-700 text-white p-4 rounded-full border-2 border-gray-500 backdrop-blur transition-transform hover:scale-110">
                                    <Play size={32} className="ml-1" />
                                </button>
                            </div>
                            <div className="p-3 bg-military-900 border-t border-military-700 flex justify-between items-center text-xs text-gray-400 flex-shrink-0">
                                <span>Encryption: AES-256-GCM (Quantum-Resistant)</span>
                                <span>Bandwidth: 1.2 Gbps</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11.1.3 Branch Integration Management */}
                {activeTab === 'integ' && (
                    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="lg:w-1/2 bg-military-800 rounded-lg p-6 border border-military-700 h-96 lg:h-full">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center flex-shrink-0">
                                <Layers className="mr-2 text-green-500" size={20} /> Interoperability Matrix
                            </h3>
                            <div className="h-full w-full pb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={integData}>
                                        <PolarGrid stroke="#334155" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <Radar name="Current" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-military-800 rounded-lg p-6 border border-military-700 h-full overflow-y-auto">
                            <h3 className="font-semibold text-lg text-white mb-4">Live Synchronization Issues</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-military-900 rounded border-l-4 border-yellow-500">
                                    <h4 className="text-sm font-bold text-white">Air-Navy Comms Relay</h4>
                                    <p className="text-xs text-gray-400 mt-1">Latency spike detected in Red Sea sector handover protocols.</p>
                                    <div className="mt-2 text-[10px] text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded inline-block">Investigating</div>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-red-500">
                                    <h4 className="text-sm font-bold text-white">Logistics-Combat Sync</h4>
                                    <p className="text-xs text-gray-400 mt-1">Munitions tracking mismatch between Warehouse DB and Field Units.</p>
                                    <div className="mt-2 text-[10px] text-red-500 bg-red-900/20 px-2 py-1 rounded inline-block">Critical Fix Required</div>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-green-500">
                                    <h4 className="text-sm font-bold text-white">Intel-Ops Fusion</h4>
                                    <p className="text-xs text-gray-400 mt-1">Real-time drone feed integration successful across all sectors.</p>
                                    <div className="mt-2 text-[10px] text-green-500 bg-green-900/20 px-2 py-1 rounded inline-block">Optimal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11.1.4 Council Decision Implementation System */}
                {activeTab === 'decisions' && (
                    <div className="h-full bg-military-800 rounded-lg border border-military-700 flex flex-col">
                        <div className="p-6 border-b border-military-700">
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                <CheckCircle className="mr-2 text-yellow-500" size={20} /> Strategic Directive Tracking
                            </h3>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white text-sm">DIR-2024-01: Northern Command Restructuring</h4>
                                    <span className="text-xs font-mono text-green-400">85% COMPLETE</span>
                                </div>
                                <div className="w-full bg-military-900 rounded-full h-3 mb-2">
                                    <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                                    <div className="flex items-center"><CheckCircle size={10} className="text-green-500 mr-1"/> Personnel Audit</div>
                                    <div className="flex items-center"><CheckCircle size={10} className="text-green-500 mr-1"/> Officer Reassignment</div>
                                    <div className="flex items-center"><AlertCircle size={10} className="text-yellow-500 mr-1"/> Logistics realignment</div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white text-sm">DIR-2024-04: Naval Base Expansion (Djibouti Corridor)</h4>
                                    <span className="text-xs font-mono text-yellow-400">42% IN PROGRESS</span>
                                </div>
                                <div className="w-full bg-military-900 rounded-full h-3 mb-2">
                                    <div className="bg-yellow-500 h-3 rounded-full transition-all duration-1000" style={{width: '42%'}}></div>
                                </div>
                                <p className="text-xs text-gray-500 italic">Pending diplomatic clearance for Phase 2 construction materials.</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white text-sm">DIR-2024-05: Cyber Defense Sovereignty</h4>
                                    <span className="text-xs font-mono text-blue-400">15% STARTED</span>
                                </div>
                                <div className="w-full bg-military-900 rounded-full h-3 mb-2">
                                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{width: '15%'}}></div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CouncilView;

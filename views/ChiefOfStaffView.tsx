
import React, { useState } from 'react';
import { Shield, Target, Activity, Globe, Map, BookOpen, Clock, FileText, CheckCircle, Award, Crosshair, Users, ChevronRight, AlertTriangle, File, X, MessageSquare, ArrowUpRight, Plus, RefreshCw, BrainCircuit, Lightbulb, Anchor, Plane, Tent, List, Scale, TrendingUp, Brain } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { runStrategySimulation } from '../services/aiService';
import TaskList from '../components/TaskList';
import { Task } from '../types';

interface ChiefOfStaffViewProps {
    onBack?: () => void;
}

// Helper to safely render AI text that might be returned as an object
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        if (content.value !== undefined) return <>{String(content.value)}</>;
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const ChiefOfStaffView: React.FC<ChiefOfStaffViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'command' | 'strategy' | 'directives'>('command');
    
    // Strategy AI Director State
    const [sitRep, setSitRep] = useState('');
    const [stratDomain, setStratDomain] = useState<'Land' | 'Air' | 'Naval' | 'Joint'>('Land');
    const [enemyProfile, setEnemyProfile] = useState('Conventional Force');
    const [isThinking, setIsThinking] = useState(false);
    const [strategyResult, setStrategyResult] = useState<any>(null);
    const [simMode, setSimMode] = useState<'alpha' | 'sigma'>('alpha');
    const [sigmaPersona, setSigmaPersona] = useState<'human_advisory' | 'autonomous_manual'>('human_advisory');
    const [simParams, setSimParams] = useState({
        timeHorizon: '30 Days (Operational)',
        worldModelFocus: 'Geopolitical & Economic'
    });
    const [scenarioInput, setScenarioInput] = useState('');

    // Strategic Directives (Tasks)
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Review Northern Sector Defense Plan', description: 'Assess 4th Mech Div readiness post-maneuvers.', dueDate: '2024-10-30', priority: 'high', status: 'in-progress', isCompleted: false },
        { id: '2', title: 'Authorize Logistics Budget Adjustment', description: 'Emergency fuel allocation for Air Force operations.', dueDate: '2024-10-25', priority: 'medium', status: 'pending', isCompleted: false },
        { id: '3', title: 'Intelligence Briefing: Horn of Africa', description: 'Review weekly INSA report on regional actors.', dueDate: '2024-10-26', priority: 'high', status: 'pending', isCompleted: false }
    ]);

    const handleAddTask = () => {
        const newTask: Task = {
            id: Date.now().toString(),
            title: 'New Strategic Directive',
            description: 'Enter directive details...',
            dueDate: new Date().toISOString().split('T')[0],
            priority: 'medium',
            status: 'pending',
            isCompleted: false
        };
        setTasks([newTask, ...tasks]);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleToggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted, status: !t.isCompleted ? 'completed' : 'in-progress' } : t));
    };

    // Mock Data for Readiness Radar
    const readinessData = [
        { subject: 'Personnel', A: 95, fullMark: 100 },
        { subject: 'Equipment', A: 88, fullMark: 100 },
        { subject: 'Logistics', A: 92, fullMark: 100 },
        { subject: 'Intel', A: 98, fullMark: 100 },
        { subject: 'Cyber', A: 85, fullMark: 100 },
        { subject: 'Morale', A: 90, fullMark: 100 },
    ];

    const [insights, setInsights] = useState([
        { id: 'INS-044', source: 'Sgt. Kebede (3rd Div)', text: 'Rations quality in Sector 4 deteriorating. Morale impact observed.', severity: 'High', status: 'Pending' },
        { id: 'INS-045', source: 'Lt. Sarah (Signals)', text: 'New radio encryption protocols causing lag in remote outposts.', severity: 'Medium', status: 'Pending' },
        { id: 'INS-042', source: 'Cpl. Dawit (Eng)', text: 'Bridge structural weakness detected near Supply Route B.', severity: 'Critical', status: 'Actioned' },
    ]);

    const handleActionInsight = (id: string) => {
        setInsights(prev => prev.map(ins => ins.id === id ? { ...ins, status: 'Actioned' } : ins));
    };

    const cleanJsonString = (str: string) => {
        let cleaned = str.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
        }
        return cleaned.trim();
    };

    const handleGenerateStrategy = async () => {
        if (!sitRep.trim()) return;
        setIsThinking(true);
        setStrategyResult(null);
        
        try {
            // Using runStrategySimulation for deeper analysis than recommendStrategy
            const rawResult = await runStrategySimulation(
                `Generate strategic advice. Domain: ${stratDomain}. Enemy: ${enemyProfile}. Situation: ${sitRep}`, 
                simMode, 
                language,
                { ...simParams, sigmaMode: sigmaPersona }
            );
            
            let parsedResult;
            try {
                parsedResult = JSON.parse(cleanJsonString(rawResult));
            } catch (e) {
                console.error("JSON Parsing failed", e);
                parsedResult = { recommended_strategy: "Analysis Error", rationale: rawResult };
            }
            setStrategyResult(parsedResult);
        } catch (e) {
            console.error(e);
        }
        setIsThinking(false);
    };

    const impactData = strategyResult?.cross_domain_matrix ? [
        { subject: 'Mil', A: strategyResult.cross_domain_matrix.military_readiness },
        { subject: 'Dip', A: strategyResult.cross_domain_matrix.diplomatic_trust },
        { subject: 'Econ', A: strategyResult.cross_domain_matrix.economic_cost },
        { subject: 'Soc', A: strategyResult.cross_domain_matrix.domestic_morale },
        { subject: 'Leg', A: strategyResult.cross_domain_matrix.legal_compliance },
    ] : [];

    const getBarColor = (val: number) => val > 0 ? '#10b981' : '#ef4444';
    const getAgentAccent = () => simMode === 'alpha' ? 'bg-blue-600' : 'bg-red-600';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('cogs_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('cogs_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                    <button 
                        onClick={() => setActiveTab('command')}
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'command' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Shield size={14} className="mr-2"/> {t('cogs_tab_command')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('directives')}
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'directives' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List size={14} className="mr-2"/> {t('cogs_tab_directives')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('strategy')}
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'strategy' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BrainCircuit size={14} className="mr-2"/> AI STRATEGY DIRECTOR
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('cogs_metric_readiness')} value="91.2%" change={0.8} icon={Activity} color="success" />
                <MetricCard title={t('cogs_metric_ops')} value="14" change={2} icon={Crosshair} color="danger" />
                <MetricCard title="Strategy Models" value="Active" icon={BookOpen} color="purple" />
                <MetricCard title={t('cogs_metric_partners')} value="8 Active" icon={Globe} color="accent" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 10.1 Professional Military Command Dashboard */}
                {activeTab === 'command' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        
                        {/* Operations Command Interface */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col min-h-[400px]">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Target className="mr-2 text-red-500" size={20} /> {t('cogs_ops_interface')}
                            </h3>
                            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                <div className="p-3 bg-military-900 rounded border-l-4 border-green-500 flex justify-between items-center group hover:bg-military-800 transition-colors">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Op. Highland Secure</h4>
                                        <p className="text-xs text-gray-400">Sector North • 4th Mech Div</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-green-400 font-bold mb-1">92% Success Prob.</div>
                                        <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded">ACTIVE</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-yellow-500 flex justify-between items-center group hover:bg-military-800 transition-colors">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Op. Desert Watch</h4>
                                        <p className="text-xs text-gray-400">Sector East • 12th Bde</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-yellow-400 font-bold mb-1">Resource Allocation</div>
                                        <span className="text-[10px] bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded">PLANNING</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-blue-500 flex justify-between items-center group hover:bg-military-800 transition-colors">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Op. Blue Shield</h4>
                                        <p className="text-xs text-gray-400">Air Defense Zone • GERD</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-blue-400 font-bold mb-1">100% Coverage</div>
                                        <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">PATROL</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Readiness Management System */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-[300px]">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Activity className="mr-2 text-green-500" size={20} /> {t('cogs_readiness_mgmt')}
                                </h3>
                                <div className="flex-1 w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={readinessData}>
                                            <PolarGrid stroke="#334155" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <Radar name="Current Status" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-0 right-0 p-2 bg-black/40 rounded border border-red-500/30 flex items-center">
                                        <AlertTriangle size={12} className="text-red-500 mr-2" />
                                        <span className="text-[10px] text-red-300">Cyber Resilience: Low</span>
                                    </div>
                                </div>
                            </div>

                            {/* Field Insight Triage */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col flex-1 min-h-[300px]">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <MessageSquare className="mr-2 text-purple-500" size={20} /> Field Insight Triage (Sec 3.3)
                                </h3>
                                <div className="flex-1 space-y-3 overflow-y-auto">
                                    {insights.map(ins => (
                                        <div key={ins.id} className="bg-military-900 p-3 rounded border border-military-600">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ins.severity === 'Critical' ? 'bg-red-900 text-red-300' : ins.severity === 'High' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>
                                                    {ins.severity}
                                                </span>
                                                <span className="text-[10px] text-gray-500">{ins.source}</span>
                                            </div>
                                            <p className="text-xs text-gray-300 mb-2 italic">"{ins.text}"</p>
                                            <div className="flex justify-end">
                                                {ins.status === 'Pending' ? (
                                                    <button 
                                                        onClick={() => handleActionInsight(ins.id)}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold px-3 py-1 rounded flex items-center"
                                                    >
                                                        <ArrowUpRight size={10} className="mr-1" /> APPROVE FOR ACTION
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-green-500 flex items-center">
                                                        <CheckCircle size={10} className="mr-1" /> ACTION TRACKED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DIRECTIVES TRACKER */}
                {activeTab === 'directives' && (
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                <List className="mr-2 text-green-500" size={20} /> {t('cogs_task_title')}
                            </h3>
                            <button 
                                onClick={handleAddTask}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center"
                            >
                                <Plus size={14} className="mr-2" /> ADD DIRECTIVE
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <TaskList 
                                tasks={tasks} 
                                onDelete={handleDeleteTask} 
                                onUpdate={handleUpdateTask} 
                                onToggle={handleToggleTask} 
                            />
                        </div>
                    </div>
                )}

                {/* 10.2 AI Strategy Director */}
                {activeTab === 'strategy' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                        
                        {/* Input Panel */}
                        <div className={`w-full lg:col-span-1 rounded-lg p-6 border flex flex-col h-auto lg:h-full transition-colors duration-500 ${simMode === 'alpha' ? 'bg-blue-950/20 border-blue-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <h3 className={`font-bold text-lg font-display ${simMode === 'alpha' ? 'text-blue-400' : 'text-red-500'}`}>
                                    {simMode === 'alpha' ? 'AGENT ALPHA (INTEGRATOR)' : 'AGENT SIGMA (ADVERSARY)'}
                                </h3>
                                <div className="flex bg-black/30 rounded p-1">
                                    <button onClick={() => setSimMode('alpha')} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${simMode === 'alpha' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>ALPHA</button>
                                    <button onClick={() => setSimMode('sigma')} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${simMode === 'sigma' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>SIGMA</button>
                                </div>
                            </div>
                            
                            {/* Sigma Sub-Mode Toggle */}
                            {simMode === 'sigma' && (
                                <div className="mb-4 bg-red-900/20 p-2 rounded border border-red-500/30 flex justify-between items-center">
                                    <span className="text-[10px] text-red-300 font-bold uppercase">Persona Mode</span>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setSigmaPersona('human_advisory')}
                                            className={`px-2 py-1 text-[9px] rounded border ${sigmaPersona === 'human_advisory' ? 'bg-red-600 text-white border-red-500' : 'text-gray-500 border-transparent'}`}
                                        >
                                            HUMAN ADVISOR
                                        </button>
                                        <button 
                                            onClick={() => setSigmaPersona('autonomous_manual')}
                                            className={`px-2 py-1 text-[9px] rounded border ${sigmaPersona === 'autonomous_manual' ? 'bg-black text-red-500 border-red-500 animate-pulse' : 'text-gray-500 border-transparent'}`}
                                        >
                                            AUTONOMOUS AI
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 flex-1 overflow-y-auto">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">WORLD MODEL FOCUS</label>
                                    <select 
                                        value={simParams.worldModelFocus}
                                        onChange={(e) => setSimParams({...simParams, worldModelFocus: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-xs focus:border-white/30 outline-none"
                                    >
                                        <option>Geopolitical & Economic</option>
                                        <option>Legal & Constitutional</option>
                                        <option>Cultural & Psychological</option>
                                        <option>Military Infrastructure</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">TIME HORIZON</label>
                                    <select 
                                        value={simParams.timeHorizon}
                                        onChange={(e) => setSimParams({...simParams, timeHorizon: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-xs focus:border-white/30 outline-none"
                                    >
                                        <option>48 Hours (Tactical)</option>
                                        <option>30 Days (Operational)</option>
                                        <option>180 Days (Strategic)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">SCENARIO INJECTION</label>
                                    <textarea 
                                        className={`w-full h-40 bg-black/40 border rounded p-3 text-xs focus:outline-none resize-none text-gray-200 ${simMode === 'alpha' ? 'border-blue-500/30 focus:border-blue-500' : 'border-red-500/30 focus:border-red-500'}`}
                                        placeholder={simMode === 'alpha' 
                                            ? "Describe the integration goal (e.g., 'Establish regional energy pact via dam diplomacy')..." 
                                            : "Describe the target system (e.g., 'Destabilize supply chain using legal loopholes')..."} 
                                        value={scenarioInput} 
                                        onChange={(e) => setScenarioInput(e.target.value)} 
                                    />
                                </div>

                                <button 
                                    onClick={handleGenerateStrategy} 
                                    disabled={isThinking || !scenarioInput} 
                                    className={`w-full py-4 text-white font-bold rounded shadow-lg flex items-center justify-center disabled:opacity-50 text-xs transition-all ${getAgentAccent()} hover:scale-105`}
                                >
                                    {isThinking ? <RefreshCw className="animate-spin mr-2" size={14}/> : <BrainCircuit className="mr-2" size={14}/>} 
                                    {simMode === 'alpha' ? 'RUN CONSTRUCTIVE SIMULATION' : 'RUN ADVERSARIAL STRESS TEST'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Output Panel */}
                        <div className="lg:col-span-2 bg-black/30 rounded-lg border border-white/10 p-6 relative h-full overflow-y-auto min-h-[400px]">
                             {!strategyResult && !isThinking && (
                                 <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                     <BrainCircuit size={64} className="mb-4 opacity-20" />
                                     <p className="text-xs font-mono uppercase tracking-widest">Awaiting Simulation Parameters</p>
                                 </div>
                             )}
                             
                             {isThinking && (
                                 <div className={`flex flex-col items-center justify-center h-full ${simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}`}>
                                     <RefreshCw size={64} className="mb-4 animate-spin" />
                                     <p className="text-xs font-mono uppercase tracking-widest animate-pulse">
                                         {simMode === 'alpha' ? 'Building Coalitions & Legal Paths...' : 'Scanning for Vulnerabilities...'}
                                     </p>
                                 </div>
                             )}

                             {strategyResult && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className={`border-b pb-4 ${simMode === 'alpha' ? 'border-blue-900' : 'border-red-900'}`}>
                                        <h2 className="text-2xl font-bold text-white"><SafeRender content={strategyResult.title || strategyResult.recommended_strategy} /></h2>
                                        <p className="text-gray-300 mt-2 text-sm italic"><SafeRender content={strategyResult.summary || strategyResult.rationale} /></p>
                                        
                                        {/* Insider Inference Engine Display */}
                                        {strategyResult.insider_inference && (
                                            <div className="mt-4 p-3 bg-black/50 border border-gray-700 rounded flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Lock size={16} className={simMode === 'alpha' ? 'text-blue-500' : 'text-red-500'} />
                                                    <span className="ml-2 text-xs font-bold text-gray-400 uppercase">Insider Inference Model</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-500 block">Probable Architecture:</span>
                                                    <span className="text-xs font-mono text-white"><SafeRender content={strategyResult.insider_inference.system_guess} /></span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-500 block">Confidence:</span>
                                                    <span className={`text-xs font-mono font-bold ${strategyResult.insider_inference.confidence > 75 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        <SafeRender content={strategyResult.insider_inference.confidence} />%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 1. Psychological & Legal Vectors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className={`p-4 rounded border ${simMode === 'alpha' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                                            <h3 className={`text-xs font-bold uppercase mb-3 flex items-center ${simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}`}>
                                                <Brain size={14} className="mr-2"/> Psych-Social Exploitation
                                            </h3>
                                            <div className="space-y-2 text-[10px]">
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span className="text-gray-400">Cultural Fault Line:</span>
                                                    <span className="text-white text-right"><SafeRender content={strategyResult.psych_social_vector?.cultural_fault_line} /></span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span className="text-gray-400">Cognitive Bias:</span>
                                                    <span className="text-white text-right"><SafeRender content={strategyResult.psych_social_vector?.cognitive_bias_target} /></span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Bio/Physical Limit:</span>
                                                    <span className="text-white text-right"><SafeRender content={strategyResult.psych_social_vector?.biological_factor} /></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded border ${simMode === 'alpha' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                                            <h3 className={`text-xs font-bold uppercase mb-3 flex items-center ${simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}`}>
                                                <Scale size={14} className="mr-2"/> Legal Matrix Analysis
                                            </h3>
                                            <div className="space-y-2 text-[10px]">
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span className="text-gray-400">Mechanism:</span>
                                                    <span className="text-white text-right"><SafeRender content={strategyResult.legal_matrix?.mechanism} /></span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Viability:</span>
                                                    <span className={`${strategyResult.legal_matrix?.compliance_score || 0 > 50 ? 'text-green-500' : 'text-yellow-500'} text-right font-bold`}>
                                                        <SafeRender content={strategyResult.legal_matrix?.status} /> (<SafeRender content={strategyResult.legal_matrix?.compliance_score} />%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Impact Matrix (Bar Chart) */}
                                    <div className="bg-military-900/50 p-4 rounded border border-military-600">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                            <Activity size={14} className="mr-2"/> Cross-Domain Impact Assessment
                                        </h3>
                                        <div className="h-40 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={impactData} layout="vertical" margin={{left: 40}}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                                    <XAxis type="number" domain={[-10, 10]} hide />
                                                    <YAxis dataKey="subject" type="category" width={80} stroke="#94a3b8" fontSize={10} />
                                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                                    <ReferenceLine x={0} stroke="#666" />
                                                    <Bar dataKey="A" fill={simMode === 'alpha' ? '#3b82f6' : '#ef4444'} barSize={15}>
                                                        {impactData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={getBarColor(entry.A)} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* 3. Strategic Options Table */}
                                    {strategyResult.strategic_options && (
                                        <div className="overflow-x-auto">
                                            <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center">
                                                <Target size={14} className="mr-2 text-yellow-500"/> Recommended Courses of Action
                                            </h3>
                                            <table className="w-full text-left text-[10px] text-gray-300 border-collapse">
                                                <thead className="bg-military-800 text-gray-400 uppercase font-display border-b border-military-600">
                                                    <tr>
                                                        <th className="p-3">Option</th>
                                                        <th className="p-3">Score</th>
                                                        <th className="p-3">Cost</th>
                                                        <th className="p-3">Risk</th>
                                                        <th className="p-3">Probability</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-military-700 bg-military-900/30">
                                                    {strategyResult.strategic_options.map((opt: any) => (
                                                        <tr key={opt.id} className="hover:bg-military-800 transition-colors">
                                                            <td className="p-3">
                                                                <strong className="text-white block mb-1"><SafeRender content={opt.name} /></strong>
                                                                <span className="text-[9px] text-gray-500"><SafeRender content={opt.description} /></span>
                                                            </td>
                                                            <td className="p-3 font-mono font-bold text-blue-400"><SafeRender content={opt.deterrence_score} /></td>
                                                            <td className="p-3"><SafeRender content={opt.cost_projection} /></td>
                                                            <td className="p-3"><SafeRender content={opt.civilian_risk} /></td>
                                                            <td className="p-3">
                                                                <div className="flex items-center">
                                                                    <span className="mr-2 font-bold"><SafeRender content={opt.win_probability} />%</span>
                                                                    <div className="w-16 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                                        <div className={`h-full ${simMode === 'alpha' ? 'bg-blue-500' : 'bg-red-500'}`} style={{width: `${opt.win_probability}%`}}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* 4. Rationale */}
                                    <div className={`border-l-4 p-4 rounded text-xs text-gray-300 ${simMode === 'alpha' ? 'bg-blue-900/10 border-blue-500' : 'bg-red-900/10 border-red-500'}`}>
                                        <strong className={simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}>STRATEGIC RATIONALE:</strong>
                                        <div className="mt-1"><SafeRender content={strategyResult.rationale} /></div>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChiefOfStaffView;

import React, { useState, useEffect, useRef } from 'react';
import { Swords, Monitor, Activity, Shield, Crosshair, AlertTriangle, Zap, Play, Square, Pause, RotateCcw, Settings, Terminal, ShieldAlert, Sparkles, BrainCircuit, Hexagon, Link, Skull, CheckCircle, ArrowRight, ChevronDown, ChevronRight, Volume2, StopCircle, RefreshCw, FileText, Lightbulb, Hammer, Archive, TrendingUp, Scale, Brain, Users, TrendingDown, Fuel, Package, Box, BarChart2, DollarSign, Target, X, Network, Lock, Eye, Image as ImageIcon } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TacticalMap, { Unit } from '../components/TacticalMap';
import { useLanguage } from '../contexts/LanguageContext';
import { generateScenarioBriefing, runStrategySimulation, generateSpeech, generateAAR, generateTacticalImage } from '../services/aiService';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from 'recharts';

interface StrategyOption {
    id: string;
    name: string;
    description: string;
    deterrence_score: number;
    cost_projection: string;
    civilian_risk: string;
    win_probability: number;
}

interface SimResult {
    title?: string;
    summary?: string;
    adversary_analysis?: {
        profile: string;
        perception_filter: string;
        likely_response: string;
        red_lines: string[];
    };
    insider_inference?: {
        system_guess: string;
        confidence: number;
        vulnerability_point: string;
    };
    psych_social_vector?: {
        cultural_fault_line: string;
        cognitive_bias_target: string;
        biological_factor: string;
    };
    legal_matrix?: {
        mechanism: string;
        status: string;
        compliance_score: number;
    };
    cross_domain_matrix?: {
        military_readiness: number;
        diplomatic_trust: number;
        economic_cost: number;
        domestic_morale: number;
        legal_compliance: number;
    };
    resource_impact?: {
        fuel_depletion: number;
        ammo_depletion: number;
        budget_burn: number;
        manpower_stress: number;
    };
    strategic_options?: StrategyOption[];
    rationale?: string;
}

interface WargamingViewProps {
    onBack?: () => void;
}

// Helper to safely render AI text that might be returned as an object
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const WargamingView: React.FC<WargamingViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    
    // View State
    const [activeTab, setActiveTab] = useState<'ai_strat' | 'tactical' | 'config' | 'aar'>('ai_strat');

    // --- TACTICAL SIM STATE ---
    const [simState, setSimState] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETE'>('IDLE');
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [turn, setTurn] = useState(0);
    const [integrityBlue, setIntegrityBlue] = useState(100);
    const [integrityRed, setIntegrityRed] = useState(100);
    const logEndRef = useRef<HTMLDivElement>(null);
    const [activeUnits, setActiveUnits] = useState<Unit[]>([]);
    
    // Tactical Config
    const [blueForce, setBlueForce] = useState(80);
    const [redForce, setRedForce] = useState(60);
    const [terrain, setTerrain] = useState('Mountainous / Rough');
    const [weather, setWeather] = useState('Clear / Day');
    const [enemyProfile, setEnemyProfile] = useState('Insurgent (Guerilla)');
    const [strategicDoctrine, setStrategicDoctrine] = useState('Maneuver Warfare'); 
    const [briefing, setBriefing] = useState<string>('');
    const [generatingBrief, setGeneratingBrief] = useState(false);
    
    // Viz State
    const [vizImage, setVizImage] = useState<string | null>(null);
    const [vizLoading, setVizLoading] = useState(false);
    
    // AAR State
    const [aarContent, setAarContent] = useState('');
    const [generatingAar, setGeneratingAar] = useState(false);

    // --- STRATEGIC AI STATE (ALPHA/SIGMA) ---
    const [simMode, setSimMode] = useState<'alpha' | 'sigma'>('alpha');
    const [sigmaPersona, setSigmaPersona] = useState<'human_advisory' | 'autonomous_manual'>('human_advisory');
    const [simParams, setSimParams] = useState({
        timeHorizon: '180 Days',
        adversaryProfile: 'Paranoid',
        resources: 'Standard Readiness (Level 3)',
        worldModelFocus: 'Geopolitical'
    });
    const [scenarioInput, setScenarioInput] = useState('');
    const [simResult, setSimResult] = useState<SimResult | null>(null);
    const [simulating, setSimulating] = useState(false);
    
    // Audio
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Initial Briefing Load
    useEffect(() => {
        handleGenerateBrief();
    }, []);

    // Generate AAR when simulation completes
    useEffect(() => {
        if (simState === 'COMPLETE' && activeTab === 'aar' && !aarContent && !generatingAar) {
            handleGenerateAar();
        }
    }, [simState, activeTab]);

    // Cleanup Audio
    useEffect(() => {
        return () => stopAudio();
    }, []);

    const stopAudio = () => {
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch(e) {}
            audioSourceRef.current = null;
        }
        setIsSpeaking(false);
    };

    const playBriefing = async (text: string) => {
        if (!text) return;
        stopAudio();
        setIsSpeaking(true);
        const voice = simMode === 'sigma' ? 'Fenrir' : 'Kore'; 
        try {
            const buffer = await generateSpeech(text, voice);
            if (buffer) {
                 if (!audioContextRef.current) {
                      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
                  }
                  const ctx = audioContextRef.current;
                  if (ctx.state === 'suspended') await ctx.resume();
                  
                  const source = ctx.createBufferSource();
                  source.buffer = buffer;
                  source.connect(ctx.destination);
                  source.onended = () => setIsSpeaking(false);
                  source.start();
                  audioSourceRef.current = source;
            } else {
                setIsSpeaking(false);
            }
        } catch (e) {
            console.error("TTS Failed", e);
            setIsSpeaking(false);
        }
    }

    const handleGenerateBrief = async () => {
        setGeneratingBrief(true);
        const text = await generateScenarioBriefing(terrain, weather, enemyProfile, language);
        setBriefing(text);
        setGeneratingBrief(false);
    }

    const handleGenerateAar = async () => {
        setGeneratingAar(true);
        const text = await generateAAR(integrityBlue, integrityRed, turn, terrain);
        setAarContent(text);
        setGeneratingAar(false);
    }
    
    const handleVisualize = async () => {
        setVizLoading(true);
        const prompt = `Tactical military battlefield visualization. Terrain: ${terrain}. Weather: ${weather}. Enemy Force: ${enemyProfile}. Blue Force Doctrine: ${strategicDoctrine}. Cinematic, high detail, photorealistic style.`;
        const result = await generateTacticalImage(prompt);
        setVizImage(result);
        setVizLoading(false);
    };

    // --- TACTICAL SIM LOGIC ---
    const generateUnits = () => {
        const units: Unit[] = [];
        const blueCount = Math.ceil(blueForce / 10) + 2;
        const redCount = Math.ceil(redForce / 10) + 2;

        for (let i = 0; i < blueCount; i++) {
            units.push({
                id: `ALPHA-${i+1}`,
                name: `Alpha Team ${i+1}`,
                type: 'friendly',
                category: i === 0 ? 'armor' : i % 3 === 0 ? 'air' : 'infantry',
                x: 10 + Math.random() * 10,
                y: 20 + Math.random() * 60,
                status: 'moving',
                health: 100,
                ammo: 100
            });
        }

        for (let i = 0; i < redCount; i++) {
            units.push({
                id: `SIGMA-${i+1}`,
                name: `Sigma Team ${i+1}`,
                type: 'hostile',
                category: enemyProfile.includes('Insurgent') ? 'infantry' : (i % 2 === 0 ? 'armor' : 'infantry'),
                x: 80 + Math.random() * 10,
                y: 20 + Math.random() * 60,
                status: 'moving',
                health: 100,
                ammo: 100
            });
        }
        setActiveUnits(units);
    };

    useEffect(() => {
        if (activeTab === 'tactical' && simState === 'RUNNING') {
            const interval = setInterval(() => {
                setTurn(prev => prev + 1);
                
                setActiveUnits(prevUnits => {
                    let logUpdates: string[] = [];
                    const nextUnits = prevUnits.map(unit => {
                        let { x, y, health, status } = unit;
                        
                        if (status !== 'engaged' && health > 0) {
                            const direction = unit.type === 'friendly' ? 1 : -1;
                            const speed = unit.category === 'air' ? 2 : unit.category === 'armor' ? 1 : 0.5;
                            let mod = 1;
                            if (terrain.includes('Mountain')) mod = 0.6;
                            
                            x += direction * speed * mod;
                        }

                        const enemyType = unit.type === 'friendly' ? 'hostile' : 'friendly';
                        const nearbyEnemy = prevUnits.find(u => 
                            u.type === enemyType && 
                            u.health > 0 &&
                            Math.sqrt(Math.pow(u.x - x, 2) + Math.pow(u.y - y, 2)) < 15
                        );

                        if (nearbyEnemy) {
                            status = 'engaged';
                            const damage = Math.random() * 10;
                            health -= damage;
                            if (Math.random() > 0.8) {
                                logUpdates.push(`${unit.name} engaged ${nearbyEnemy.name}. Damage sustained.`);
                            }
                        } else {
                            status = 'moving';
                        }

                        return { ...unit, x, y, health, status };
                    }).filter(u => {
                        if (u.health <= 0) {
                            logUpdates.push(`CRITICAL: ${u.name} neutralized.`);
                            return false; 
                        }
                        return true;
                    });

                    if (logUpdates.length > 0) {
                        setBattleLog(prev => [...prev, ...logUpdates].slice(-20));
                    }

                    const totalBlueStart = Math.ceil(blueForce / 10) + 2;
                    const totalRedStart = Math.ceil(redForce / 10) + 2;
                    const currentBlue = nextUnits.filter(u => u.type === 'friendly').length;
                    const currentRed = nextUnits.filter(u => u.type === 'hostile').length;

                    setIntegrityBlue(Math.round((currentBlue / totalBlueStart) * 100));
                    setIntegrityRed(Math.round((currentRed / totalRedStart) * 100));

                    if (currentBlue === 0 || currentRed === 0 || turn > 60) {
                        setSimState('COMPLETE');
                        setActiveTab('aar');
                    }

                    return nextUnits;
                });

            }, 1000);
            return () => clearInterval(interval);
        }
    }, [simState, activeTab, turn, terrain, blueForce, redForce]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [battleLog]);

    const handleStartTacticalSim = () => {
        setSimState('RUNNING');
        setActiveTab('tactical');
        setBattleLog(["INITIALIZING BATTLEFIELD SIMULATION...", `TERRAIN: ${terrain.toUpperCase()}`, `ENEMY: ${enemyProfile.toUpperCase()}`, `DOCTRINE: ${strategicDoctrine.toUpperCase()}`, "--- START ---"]);
        setTurn(0);
        setIntegrityBlue(100);
        setIntegrityRed(100);
        setAarContent('');
        generateUnits();
    };

    // --- STRATEGIC AI LOGIC ---
    const cleanJsonString = (str: string) => {
        let cleaned = str.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
        }
        return cleaned.trim();
    };

    const handleStrategicSim = async () => {
        if (!scenarioInput.trim()) return;
        
        setSimulating(true);
        stopAudio();
        setSimResult(null);

        try {
            const rawResult = await runStrategySimulation(scenarioInput, simMode, language, { ...simParams, sigmaMode: sigmaPersona });
            let parsedResult: SimResult;
            try {
                parsedResult = JSON.parse(cleanJsonString(rawResult));
            } catch (e) {
                console.error("JSON Parsing failed", e);
                parsedResult = { 
                    summary: rawResult, 
                    title: "Simulation Output (Raw)", 
                    strategic_options: [], 
                    cross_domain_matrix: { military_readiness: 0, diplomatic_trust: 0, economic_cost: 0, domestic_morale: 0, legal_compliance: 0 } 
                };
            }

            setSimResult(parsedResult);
            // Construct a briefing text for audio
            const audioText = `${parsedResult.title}. ${parsedResult.summary}. ${parsedResult.rationale}`;
            playBriefing(audioText);
        } catch (e) {
            console.error(e);
        }
        setSimulating(false);
    };

    const getBarColor = (val: number) => val > 0 ? '#10b981' : '#ef4444';

    const impactData = simResult?.cross_domain_matrix ? [
        { subject: 'Military', A: simResult.cross_domain_matrix.military_readiness, fullMark: 10 },
        { subject: 'Diplomatic', A: simResult.cross_domain_matrix.diplomatic_trust, fullMark: 10 },
        { subject: 'Economic', A: simResult.cross_domain_matrix.economic_cost, fullMark: 10 },
        { subject: 'Morale', A: simResult.cross_domain_matrix.domestic_morale, fullMark: 10 },
        { subject: 'Legal', A: simResult.cross_domain_matrix.legal_compliance, fullMark: 10 },
    ] : [];

    const getAgentColor = () => simMode === 'alpha' ? 'blue' : 'red';
    const getAgentAccent = () => simMode === 'alpha' ? 'bg-blue-600' : 'bg-red-600';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('war_title')}</h2>
                    <p className="text-gray-400 text-xs font-sans">{t('war_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('ai_strat')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'ai_strat' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <BrainCircuit size={12} className="mr-2"/> ALPHA/SIGMA
                        </button>
                        <button 
                            onClick={() => setActiveTab('config')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'config' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Settings size={12} className="mr-2"/> SETUP
                        </button>
                        <button 
                            onClick={() => setActiveTab('tactical')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'tactical' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Monitor size={12} className="mr-2"/> LIVE MAP
                        </button>
                        <button 
                            onClick={() => setActiveTab('aar')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'aar' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Activity size={12} className="mr-2"/> A.A.R.
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

            <div className="flex-1 min-h-0 overflow-y-auto relative w-full">
                
                {/* TAB: STRATEGIC AI SIMULATION (ALPHA/SIGMA) */}
                {activeTab === 'ai_strat' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                        {/* Input Panel */}
                        <div className={`w-full lg:col-span-1 rounded-lg p-6 border flex flex-col h-full overflow-y-auto transition-colors duration-500 ${simMode === 'alpha' ? 'bg-blue-950/20 border-blue-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
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

                            <div className="space-y-4 flex-1">
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
                                    onClick={handleStrategicSim} 
                                    disabled={simulating || !scenarioInput} 
                                    className={`w-full py-4 text-white font-bold rounded shadow-lg flex items-center justify-center disabled:opacity-50 text-xs transition-all ${getAgentAccent()} hover:scale-105`}
                                >
                                    {simulating ? <RefreshCw className="animate-spin mr-2" size={14}/> : <BrainCircuit className="mr-2" size={14}/>} 
                                    {simMode === 'alpha' ? 'RUN CONSTRUCTIVE SIMULATION' : 'RUN ADVERSARIAL STRESS TEST'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Output Panel */}
                        <div className="lg:col-span-2 bg-black/30 rounded-lg border border-white/10 p-6 relative h-full overflow-y-auto min-h-[400px]">
                             {!simResult && !simulating && (
                                 <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                     <Hexagon size={64} className="mb-4 opacity-20" />
                                     <p className="text-xs font-mono uppercase tracking-widest">Awaiting Simulation Parameters</p>
                                 </div>
                             )}
                             
                             {simulating && (
                                 <div className={`flex flex-col items-center justify-center h-full ${simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}`}>
                                     <RefreshCw size={64} className="mb-4 animate-spin" />
                                     <p className="text-xs font-mono uppercase tracking-widest animate-pulse">
                                         {simMode === 'alpha' ? 'Building Coalitions & Legal Paths...' : 'Scanning for Vulnerabilities...'}
                                     </p>
                                 </div>
                             )}

                             {simResult && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className={`border-b pb-4 ${simMode === 'alpha' ? 'border-blue-900' : 'border-red-900'}`}>
                                        <h2 className="text-2xl font-bold text-white"><SafeRender content={simResult.title} /></h2>
                                        <p className="text-gray-300 mt-2 text-sm italic"><SafeRender content={simResult.summary} /></p>
                                        
                                        {/* Insider Inference Engine Display */}
                                        {simResult.insider_inference && (
                                            <div className="mt-4 p-3 bg-black/50 border border-gray-700 rounded flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Lock size={16} className={simMode === 'alpha' ? 'text-blue-500' : 'text-red-500'} />
                                                    <span className="ml-2 text-xs font-bold text-gray-400 uppercase">Insider Inference Model</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-500 block">Probable Architecture:</span>
                                                    <span className="text-xs font-mono text-white"><SafeRender content={simResult.insider_inference.system_guess} /></span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-500 block">Confidence:</span>
                                                    <span className={`text-xs font-mono font-bold ${simResult.insider_inference.confidence > 75 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        <SafeRender content={simResult.insider_inference.confidence} />%
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
                                                    <span className="text-white text-right"><SafeRender content={simResult.psych_social_vector?.cultural_fault_line} /></span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span className="text-gray-400">Cognitive Bias:</span>
                                                    <span className="text-white text-right"><SafeRender content={simResult.psych_social_vector?.cognitive_bias_target} /></span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Bio/Physical Limit:</span>
                                                    <span className="text-white text-right"><SafeRender content={simResult.psych_social_vector?.biological_factor} /></span>
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
                                                    <span className="text-white text-right"><SafeRender content={simResult.legal_matrix?.mechanism} /></span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Viability:</span>
                                                    <span className={`${simResult.legal_matrix?.compliance_score || 0 > 50 ? 'text-green-500' : 'text-yellow-500'} text-right font-bold`}>
                                                        <SafeRender content={simResult.legal_matrix?.status} /> (<SafeRender content={simResult.legal_matrix?.compliance_score} />%)
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
                                                {simResult.strategic_options?.map((opt) => (
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

                                    {/* 4. Rationale */}
                                    <div className={`border-l-4 p-4 rounded text-xs text-gray-300 ${simMode === 'alpha' ? 'bg-blue-900/10 border-blue-500' : 'bg-red-900/10 border-red-500'}`}>
                                        <strong className={simMode === 'alpha' ? 'text-blue-400' : 'text-red-400'}>STRATEGIC RATIONALE:</strong>
                                        <div className="mt-1"><SafeRender content={simResult.rationale} /></div>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                )}

                {/* TAB: CONFIGURATION (TACTICAL) */}
                {activeTab === 'config' && (
                    <div className="bg-military-800 rounded-lg p-8 border border-military-700 flex flex-col justify-center max-w-4xl mx-auto h-full overflow-y-auto">
                        <div className="mb-8 p-4 bg-purple-900/10 border border-purple-500/30 rounded flex items-start space-x-3 flex-shrink-0">
                            <Sparkles className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-purple-400 mb-1 font-display">AI TACTICAL BRIEFING GENERATOR</h4>
                                {generatingBrief ? (
                                    <div className="text-xs text-gray-400 animate-pulse">GENERATING SCENARIO PARAMETERS...</div>
                                ) : (
                                    <p className="text-xs text-gray-300 italic leading-relaxed whitespace-pre-wrap">"<SafeRender content={briefing} />"</p>
                                )}
                            </div>
                            <button onClick={handleGenerateBrief} className="text-gray-500 hover:text-white"><RotateCcw size={14}/></button>
                        </div>

                        {/* Sliders and Selects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-shrink-0">
                            <div className="space-y-6 p-6 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                                <h3 className="font-bold text-blue-400 text-lg border-b border-blue-900/50 pb-2">ALPHA FORCE (BLUE)</h3>
                                <input type="range" min="0" max="100" value={blueForce} onChange={(e) => setBlueForce(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg accent-blue-500"/>
                                
                                <div className="mt-4">
                                    <label className="text-xs text-blue-300 font-bold block mb-2">STRATEGIC DOCTRINE</label>
                                    <select 
                                        value={strategicDoctrine}
                                        onChange={(e) => setStrategicDoctrine(e.target.value)}
                                        className="w-full bg-military-900 border border-military-600 text-white text-sm rounded p-2 focus:border-blue-500"
                                    >
                                        <option>Attrition Strategy</option>
                                        <option>Maneuver Strategy</option>
                                        <option>Indirect Approach</option>
                                        <option>Deterrence Strategy</option>
                                        <option>Guerrilla / Asymmetric</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-6 p-6 bg-red-900/10 border border-red-900/30 rounded-lg">
                                <h3 className="font-bold text-red-400 text-lg border-b border-red-900/50 pb-2">SIGMA FORCE (RED)</h3>
                                <input type="range" min="0" max="100" value={redForce} onChange={(e) => setRedForce(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg accent-red-500"/>
                                <div className="mt-4">
                                    <label className="text-xs text-red-300 font-bold block mb-2">ENEMY PROFILE</label>
                                    <select 
                                        value={enemyProfile}
                                        onChange={(e) => setEnemyProfile(e.target.value)}
                                        className="w-full bg-military-900 border border-military-600 text-white text-sm rounded p-2 focus:border-red-500"
                                    >
                                        <option>Insurgent (Guerilla)</option>
                                        <option>Conventional Armor</option>
                                        <option>Air Assault</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Visualization Panel */}
                        <div className="mt-6 flex flex-col items-center">
                            <button 
                                onClick={handleVisualize}
                                disabled={vizLoading}
                                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold flex items-center mb-4 disabled:opacity-50"
                            >
                                <ImageIcon size={14} className="mr-2"/> 
                                {vizLoading ? "GENERATING VISUAL..." : "VISUALIZE SCENARIO (AI)"}
                            </button>
                            
                            {vizImage && (
                                <div className="w-full max-w-lg aspect-video bg-black rounded border border-purple-500/50 overflow-hidden relative group">
                                    <img src={vizImage} alt="Tactical Viz" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">AI GENERATED TERRAIN PREVIEW</div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center pb-4 flex-shrink-0">
                            <button 
                                onClick={handleStartTacticalSim}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-[0_0_20px_#ef4444] transition-all hover:scale-105 flex items-center font-display tracking-wider text-lg"
                            >
                                <Swords size={24} className="mr-3" /> INITIALIZE TACTICAL SIM
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB: VISUAL SIMULATION */}
                {activeTab === 'tactical' && (
                    <div className="h-full flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 bg-black rounded-lg border border-military-700 relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="flex-1 relative">
                                <TacticalMap holoMode={true} customUnits={activeUnits} terrainType={terrain} />
                            </div>
                            <div className="bg-military-900 border-t border-military-700 p-3 flex justify-center space-x-4 flex-shrink-0">
                                <button onClick={() => setSimState(simState === 'RUNNING' ? 'PAUSED' : 'RUNNING')} className="p-2 bg-military-800 rounded hover:bg-military-700 text-white">
                                    {simState === 'RUNNING' ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <button onClick={() => { setSimState('IDLE'); setActiveTab('config'); }} className="p-2 bg-military-800 rounded hover:bg-military-700 text-white">
                                    <Square size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-80 bg-military-800 rounded-lg border border-military-700 flex flex-col overflow-hidden h-64 lg:h-full">
                            <div className="p-3 bg-military-900 border-b border-military-700 flex-shrink-0">
                                <h3 className="font-bold text-white text-sm flex items-center font-mono"><Terminal size={14} className="mr-2 text-green-500"/> LOG</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 bg-black font-mono text-xs space-y-2">
                                {battleLog.map((log, i) => (
                                    <div key={i} className="text-green-400 border-l-2 border-green-800 pl-2"><SafeRender content={log} /></div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: AAR */}
                {activeTab === 'aar' && (
                    <div className="bg-military-800 rounded-lg p-8 border border-military-700 flex flex-col items-center overflow-y-auto h-full">
                        <ShieldAlert size={64} className="text-yellow-500 mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-wider">SIMULATION COMPLETE</h2>
                        
                        <div className="w-full max-w-4xl mt-8 flex-shrink-0">
                            {generatingAar ? (
                                <div className="text-center p-8 border border-military-600 rounded bg-military-900/50 animate-pulse">
                                    <RefreshCw className="mx-auto mb-2 animate-spin text-green-500" size={32} />
                                    <p className="text-green-400 font-mono">COMPILING AFTER ACTION REPORT...</p>
                                </div>
                            ) : aarContent ? (
                                <div className="bg-black/30 border border-military-600 rounded p-6 text-left">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                        <FileText className="mr-2 text-blue-400" /> TACTICAL DEBRIEF (AI GENERATED)
                                    </h3>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed text-gray-300 font-mono text-xs">
                                            <SafeRender content={aarContent} />
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={handleGenerateAar} className="text-blue-400 hover:text-blue-300 underline">Generate Report Manually</button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8 flex-shrink-0">
                            <div className="bg-military-900 p-6 rounded border border-military-600 text-center">
                                <span className="block text-sm text-gray-400 mb-1">Blue Strength Rem.</span>
                                <span className="text-2xl font-bold text-blue-500"><SafeRender content={integrityBlue} />%</span>
                            </div>
                            <div className="bg-military-900 p-6 rounded border border-military-600 text-center">
                                <span className="block text-sm text-gray-400 mb-1">Red Strength Rem.</span>
                                <span className="text-2xl font-bold text-red-500"><SafeRender content={integrityRed} />%</span>
                            </div>
                            <div className="bg-military-900 p-6 rounded border border-military-600 text-center">
                                <span className="block text-sm text-gray-400 mb-1">Engagement Duration</span>
                                <span className="text-2xl font-bold text-white"><SafeRender content={turn} /> Turns</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default WargamingView;

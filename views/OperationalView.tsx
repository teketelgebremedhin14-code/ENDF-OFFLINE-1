
import React, { useState, useEffect, useRef } from 'react';
import { Swords, Monitor, Activity, Shield, Crosshair, AlertTriangle, Zap, Play, Square, Pause, RotateCcw, Settings, Terminal, ShieldAlert, Sparkles, BrainCircuit, Hexagon, Link, Skull, CheckCircle, ArrowRight, ChevronDown, ChevronRight, Volume2, StopCircle, RefreshCw, FileText, Lightbulb, Hammer, Archive, TrendingUp, Scale, Brain, Users, TrendingDown, Fuel, Package, Box, BarChart2, DollarSign, Target, Network, List, Layers, Plus, X, Maximize2, Map, Lock, Globe, Share2 } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TacticalMap, { Unit } from '../components/TacticalMap';
import { useLanguage } from '../contexts/LanguageContext';
import { generateScenarioBriefing, runStrategySimulation, generateSpeech, generateAAR, expandSimulationDetail } from '../services/aiService';
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
    agent_specific_data?: {
        archetype: string;
        primary_methodology: string;
        key_insight: string;
    };
    adversary_analysis?: {
        profile: string;
        perception_filter: string;
        likely_response: string;
        red_lines: string[];
    };
    insider_inference?: { // Sigma-AI Specific
        system_guess: string;
        confidence: number;
        vulnerability_point: string;
        data_source_inferred?: string;
    };
    antifragility_metrics?: { // Alpha-Prime Specific
        stress_tolerance: number;
        gain_from_disorder: string;
        redundancy_score: number;
    };
    chaos_factors?: { // Theta Specific
        black_swan_event: string;
        entropy_level: number;
        description: string;
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
    strategic_options?: StrategyOption[];
    rationale?: string;
    outcome_vector?: string;
}

interface OperationalViewProps {
    onBack?: () => void;
}

// Helper to safely render AI text that might be returned as an object
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        if (content.value !== undefined) return <>{String(content.value)}</>;
        if (content.text !== undefined) return <>{String(content.text)}</>;
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const OrgNode = ({ label, role, children, defaultOpen = false, level = 'Unit', status = 'Active' }: { label: string, role: string, children?: React.ReactNode, defaultOpen?: boolean, level?: string, status?: string }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    const getBorderColor = () => {
        switch(status) {
            case 'Active': return 'border-l-emerald-500';
            case 'Engaged': return 'border-l-rose-500';
            case 'Reserve': return 'border-l-amber-500';
            default: return 'border-l-slate-600';
        }
    };

    return (
        <div className={`ml-6 border-l-2 ${getBorderColor()} pl-4 py-2 relative animate-in slide-in-from-left-2`}>
            <div 
                className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded transition-colors group"
                onClick={() => setIsOpen(!isOpen)}
            >
                {children ? (
                    isOpen ? <ChevronDown size={14} className="mr-2 text-slate-400" /> : <ChevronRight size={14} className="mr-2 text-slate-400" />
                ) : <span className="w-5 mr-2"></span>}
                
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-[9px] uppercase bg-black/40 text-slate-300 px-1 rounded mr-2 border border-slate-700/50">{level}</span>
                            <span className="text-xs font-bold text-gray-100 group-hover:text-cyan-400 transition-colors">{label}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold shadow-lg ${
                            status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            status === 'Engaged' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
                            'bg-slate-700/50 text-slate-400 border border-slate-600'
                        }`}>
                            {status}
                        </span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center mt-0.5">
                        <Users size={10} className="mr-1" /> {role}
                    </div>
                </div>
            </div>
            {isOpen && children && (
                <div className="mt-1 border-l border-white/5 ml-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const OperationalView: React.FC<OperationalViewProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'live' | 'missions' | 'readiness' | 'structure'>('live');
  const [showSimModal, setShowSimModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  
  // ACSAS (4.2) Toggles
  const [acsasBFT, setAcsasBFT] = useState(true); 
  const [acsasPredict, setAcsasPredict] = useState(false);
  const [acsasUAV, setAcsasUAV] = useState(true); 

  // --- ENTANGLED AGENT SIMULATION STATE ---
  const [agentType, setAgentType] = useState<'alpha_prime' | 'sigma_human' | 'sigma_ai' | 'theta'>('alpha_prime');
  const [simParams, setSimParams] = useState({
      timeHorizon: '180 Days',
      worldModelFocus: 'Geopolitical & Economic',
  });
  const [scenarioInput, setScenarioInput] = useState('');
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [holoMode, setHoloMode] = useState(false);
  const [mapUnits, setMapUnits] = useState<Unit[]>([]);

  // Cleanup audio on unmount
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

  const playBriefing = async (result: SimResult) => {
      if (!result) return;
      stopAudio();
      setIsSpeaking(true);

      const intro = `${result.agent_specific_data?.archetype || 'System'} Report.`;
      const title = typeof result.title === 'string' ? result.title : "Simulation Report";
      const outcome = typeof result.outcome_vector === 'string' ? `Projected End State: ${result.outcome_vector}.` : "";
      
      let summary = typeof result.summary === 'string' ? result.summary : "Analysis data available on screen.";
      if (summary.length > 500) summary = summary.substring(0, 500) + "...";

      const script = `${intro} ${title}. ${outcome} ${summary}`;
      // Distinct voices for archetypes
      const voice = (agentType === 'sigma_ai' || agentType === 'theta') ? 'Fenrir' : 'Kore'; 

      try {
          const buffer = await generateSpeech(script, voice);
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

  // Initialize Map Units with detailed telemetry
  useEffect(() => {
      const units: Unit[] = [
          { id: 'u1', name: 'Alpha Co.', type: 'friendly', category: 'infantry', x: 30, y: 40, status: 'engaged', health: 85, ammo: 40, speed: 5, heading: 45 },
          { id: 'u2', name: 'Bravo Bat.', type: 'friendly', category: 'armor', x: 45, y: 55, status: 'moving', health: 92, ammo: 78, speed: 45, heading: 120 },
          { id: 'u3', name: 'Eagle 1', type: 'friendly', category: 'air', x: 60, y: 20, status: 'active', health: 100, ammo: 100, speed: 450, heading: 90, altitude: 15400 },
          { id: 'h1', name: 'Insurgent Grp A', type: 'hostile', category: 'infantry', x: 35, y: 35, status: 'engaged', health: 40, ammo: 20, speed: 0, heading: 225 },
          { id: 'h2', name: 'Unknown Vehicle', type: 'hostile', category: 'armor', x: 70, y: 60, status: 'moving', health: 100, ammo: 0, speed: 60, heading: 270 },
      ];
      setMapUnits(units);
  }, []);

  // Map Simulation Loop for Live View
  useEffect(() => {
      if (activeTab !== 'live') return;

      const interval = setInterval(() => {
          setMapUnits(prev => prev.map(u => {
              if (u.status === 'moving' || u.category === 'air') {
                  const dx = (Math.random() - 0.5) * 0.5;
                  const dy = (Math.random() - 0.5) * 0.5;
                  
                  let newHeading = u.heading;
                  if (u.heading !== undefined) {
                      newHeading = (u.heading + (Math.random() - 0.5) * 5 + 360) % 360;
                  }
                  
                  let newSpeed = u.speed;
                  if (u.speed !== undefined) {
                      newSpeed = Math.max(0, u.speed + (Math.random() - 0.5) * 5);
                  }

                  let newAlt = u.altitude;
                  if (u.category === 'air' && u.altitude !== undefined) {
                      newAlt = u.altitude + (Math.random() - 0.5) * 50;
                  }

                  return { 
                      ...u, 
                      x: Math.max(5, Math.min(95, u.x + dx)), 
                      y: Math.max(5, Math.min(95, u.y + dy)),
                      heading: newHeading,
                      speed: newSpeed,
                      altitude: newAlt
                  };
              }
              return u;
          }));
      }, 1000);
      return () => clearInterval(interval);
  }, [activeTab]);

  const cleanJsonString = (str: string) => {
      let cleaned = str.trim();
      if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
      } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
      }
      return cleaned.trim();
  };

  const handleSimulation = async () => {
    if (!scenarioInput.trim()) return;
    
    setSimulating(true);
    stopAudio(); 
    setSimResult(null);

    try {
        const rawResult = await runStrategySimulation(
            scenarioInput, 
            agentType, 
            language,
            simParams
        );
        
        let parsedResult: SimResult;
        try {
            const cleaned = cleanJsonString(rawResult);
            parsedResult = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse JSON, falling back to text wrapper", e);
            parsedResult = { 
                summary: rawResult, 
                title: "Simulation Output (Raw Text)", 
                rationale: "Data parsing failed. Raw output displayed." 
            };
        }

        setSimResult(parsedResult);
        playBriefing(parsedResult);

    } catch (e) {
        console.error(e);
    }
    
    setSimulating(false);
  };

  const [missions, setMissions] = useState<any[]>([
      { id: 'OP-ALPHA', name: 'Operation Desert Wind', status: 'Active', priority: 'High', commander: 'Col. Tadesse', progress: 65, start: '06:00', end: '18:00', phase: 'Execution' },
      { id: 'OP-BETA', name: 'Border Security Phase II', status: 'Planning', priority: 'Medium', commander: 'Gen. Abate', progress: 15, start: 'Mar 15', end: 'Mar 20', phase: 'Logistics Prep' },
      { id: 'OP-GAMMA', name: 'Relief Convoy Escort', status: 'Active', priority: 'Critical', commander: 'Maj. Girma', progress: 88, start: '08:30', end: '14:00', phase: 'Extraction' },
      { id: 'OP-DELTA', name: 'Night Watch Surveillance', status: 'Completed', priority: 'Low', commander: 'Lt. Col. Bekele', progress: 100, start: 'Yesterday', end: 'Today', phase: 'Debrief' },
  ]);
  
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionCommander, setNewMissionCommander] = useState('');
  const [newMissionPriority, setNewMissionPriority] = useState('Medium');

  const handleCreateMission = (e: React.FormEvent) => {
      e.preventDefault();
      const newMission = {
          id: `OP-${Math.floor(Math.random() * 10000)}`.toUpperCase(),
          name: newMissionName,
          status: 'Planning',
          priority: newMissionPriority,
          commander: newMissionCommander,
          progress: 0,
          start: 'TBD',
          end: 'TBD',
          phase: 'Init'
      };
      setMissions([newMission, ...missions]);
      setShowMissionModal(false);
      setNewMissionName('');
      setNewMissionCommander('');
  };

  const getBarColor = (val: number) => val > 0 ? '#10b981' : '#ef4444';

  const getThemeColor = () => {
      switch(agentType) {
          case 'alpha_prime': return 'blue';
          case 'sigma_human': return 'orange';
          case 'sigma_ai': return 'red';
          case 'theta': return 'purple';
      }
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
         <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 tracking-tight font-display">{t('op_title')}</h2>
          <p className="text-gray-400 text-sm font-sans">{t('op_subtitle')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            {/* Sub-Module Tabs */}
            <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                <button 
                    onClick={() => setActiveTab('live')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display ${activeTab === 'live' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <Map size={12} className="mr-1"/> {t('op_tab_live')}
                </button>
                <button 
                    onClick={() => setActiveTab('structure')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display ${activeTab === 'structure' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <Network size={12} className="mr-1"/> STRUCT
                </button>
                <button 
                    onClick={() => setActiveTab('missions')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display ${activeTab === 'missions' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow shadow-amber-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <List size={12} className="mr-1"/> {t('op_tab_mission')}
                </button>
                <button 
                    onClick={() => setActiveTab('readiness')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all font-display ${activeTab === 'readiness' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                    <Shield size={12} className="mr-1"/> READY
                </button>
            </div>

            <button 
                onClick={() => setShowSimModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center shadow-lg transition-all font-display tracking-wider animate-pulse ring-1 ring-purple-400"
            >
                <BrainCircuit size={12} className="mr-1" /> STRAT ENGINE
            </button>

            {onBack && (
                <button 
                    onClick={onBack}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Exit / Back"
                >
                    <X size={16} />
                </button>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto relative">
          {activeTab === 'live' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                  {/* Left: ACSAS Controls */}
                  <div className="glass-panel rounded-xl p-4 space-y-4 h-auto lg:col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                      <h3 className="font-bold text-white text-sm flex items-center mb-4 font-display">
                          <Layers size={16} className="mr-2 text-cyan-400" /> {t('acsas_title')}
                      </h3>
                      
                      <div className="space-y-3">
                          <label className="flex items-center justify-between cursor-pointer p-2 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors">
                              <span className="text-xs text-gray-300 font-medium">{t('acsas_bft')}</span>
                              <div className={`w-8 h-4 rounded-full relative transition-colors ${acsasBFT ? 'bg-emerald-500' : 'bg-gray-600'}`} onClick={() => setAcsasBFT(!acsasBFT)}>
                                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-md ${acsasBFT ? 'left-4.5' : 'left-0.5'}`}></div>
                              </div>
                          </label>
                          <label className="flex items-center justify-between cursor-pointer p-2 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors">
                              <span className="text-xs text-gray-300 font-medium">{t('acsas_enemy')}</span>
                              <div className={`w-8 h-4 rounded-full relative transition-colors ${acsasPredict ? 'bg-rose-500' : 'bg-gray-600'}`} onClick={() => setAcsasPredict(!acsasPredict)}>
                                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-md ${acsasPredict ? 'left-4.5' : 'left-0.5'}`}></div>
                              </div>
                          </label>
                          <label className="flex items-center justify-between cursor-pointer p-2 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors">
                              <span className="text-xs text-gray-300 font-medium">{t('acsas_uav')}</span>
                              <div className={`w-8 h-4 rounded-full relative transition-colors ${acsasUAV ? 'bg-sky-500' : 'bg-gray-600'}`} onClick={() => setAcsasUAV(!acsasUAV)}>
                                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-md ${acsasUAV ? 'left-4.5' : 'left-0.5'}`}></div>
                              </div>
                          </label>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10">
                          <h4 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('op_active_units')}</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                              {mapUnits.filter(u => u.type === 'friendly').map(u => (
                                  <div key={u.id} className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded transition-colors border border-transparent hover:border-white/5">
                                      <span className="text-cyan-300 font-medium">{u.name}</span>
                                      <span className="text-emerald-400 font-mono text-[10px]">{u.speed ? u.speed.toFixed(0) + ' km/h' : 'Static'}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Right: Tactical Map with Telemetry */}
                  <div className="lg:col-span-3 glass-panel-strong rounded-xl overflow-hidden relative min-h-[400px] border border-white/10 shadow-2xl h-full">
                      <TacticalMap holoMode={holoMode} customUnits={mapUnits} />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                          <button 
                              onClick={() => setHoloMode(!holoMode)}
                              className={`px-3 py-1.5 rounded text-xs font-bold border backdrop-blur-md transition-all ${holoMode ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-black/50 text-gray-300 border-gray-600'}`}
                          >
                              {holoMode ? '2D VIEW' : '3D HOLO'}
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'missions' && (
              <div className="h-full glass-panel rounded-xl p-4 border border-white/10 flex flex-col">
                  {/* ... mission content ... */}
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg text-white font-display">Active Mission Manifest</h3>
                      <button 
                          onClick={() => setShowMissionModal(true)}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded flex items-center shadow-lg transition-all"
                      >
                          <Plus size={16} className="mr-2" /> {t('op_mission_create')}
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {missions.map(mission => (
                              <div key={mission.id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-amber-500/50 transition-all group relative overflow-hidden backdrop-blur-sm">
                                  {mission.priority === 'Critical' && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/20 to-transparent pointer-events-none"></div>}
                                  
                                  <div className="flex justify-between items-start mb-2">
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                          mission.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                          mission.status === 'Planning' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                                          'bg-slate-700/50 text-slate-400'
                                      }`}>{mission.status}</span>
                                      <span className={`text-[10px] font-mono font-bold ${mission.priority === 'Critical' ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>{mission.priority}</span>
                                  </div>
                                  
                                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors font-display tracking-wide">{mission.name}</h4>
                                  <p className="text-xs text-gray-400 mb-4 font-mono">{mission.id} • {mission.commander}</p>
                                  
                                  <div className="space-y-2">
                                      <div className="flex justify-between text-[10px] text-gray-400">
                                          <span>Progress</span>
                                          <span>{mission.progress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
                                          <div 
                                              className={`h-full rounded-full shadow-[0_0_8px_currentColor] ${mission.status === 'Completed' ? 'bg-gray-500' : 'bg-amber-500'}`} 
                                              style={{ width: `${mission.progress}%` }}
                                          ></div>
                                      </div>
                                      <div className="flex justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-white/5">
                                          <span>Phase: {mission.phase}</span>
                                          <span>ETA: {mission.end}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'readiness' && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                  {/* Readiness Chart */}
                  <div className="glass-panel rounded-xl p-4 border border-white/10 h-[350px] lg:h-auto flex flex-col">
                      <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                          <Shield size={18} className="mr-2 text-green-400" /> Unit Readiness Levels
                      </h3>
                      <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                  { name: '4th Mech', value: 92 },
                                  { name: '12th Inf', value: 85 },
                                  { name: 'Air Wing', value: 95 },
                                  { name: 'Spec Ops', value: 98 },
                                  { name: 'Logistics', value: 88 },
                              ]} layout="vertical">
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                  <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} fontSize={10} />
                                  <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={10} />
                                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(4px)', fontSize: '11px' }} />
                                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
                  
                  {/* Supply Status */}
                  <div className="glass-panel rounded-xl p-4 border border-white/10 h-[300px] lg:h-auto flex flex-col">
                      <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                          <Package size={18} className="mr-2 text-yellow-400" /> Critical Supply Status
                      </h3>
                      <div className="space-y-6 flex-1">
                          <div>
                              <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span className="text-gray-300">Fuel Reserves (North)</span>
                                  <span className="text-yellow-400 font-bold">45%</span>
                              </div>
                              <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 h-2 rounded-full shadow-[0_0_10px_#eab308]" style={{width: '45%'}}></div></div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span className="text-gray-300">Ammunition (Small Arms)</span>
                                  <span className="text-emerald-400 font-bold">92%</span>
                              </div>
                              <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_#10b981]" style={{width: '92%'}}></div></div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span className="text-gray-300">Medical Kits</span>
                                  <span className="text-emerald-400 font-bold">88%</span>
                              </div>
                              <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_#10b981]" style={{width: '88%'}}></div></div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          
          {activeTab === 'structure' && (
              <div className="h-full glass-panel rounded-xl p-4 border border-white/10 overflow-y-auto">
                  {/* ... structure content ... */}
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center font-display">
                          <Network size={24} className="mr-3 text-cyan-400"/> 
                          Joint Operations Command Structure
                      </h3>
                      <div className="flex space-x-2">
                          <span className="text-[10px] bg-emerald-900/30 text-emerald-300 px-3 py-1 rounded border border-emerald-500/30">7 Principles Compliant</span>
                      </div>
                  </div>
                  
                  <div className="max-w-4xl mx-auto space-y-4">
                      <OrgNode label="Joint Operations HQ" role="Lt. Gen. [Redacted]" level="Strategic" defaultOpen={true} status="Active">
                          {/* ... hierarchy ... */}
                          <OrgNode label="Ground Forces Command" role="Field Marshal Birhanu Jula" level="Component" defaultOpen={true} status="Active">
                              <OrgNode label="Northern Command" role="Maj. Gen. [Redacted]" level="Regional" status="Active">
                                  <OrgNode label="4th Mechanized Division" role="Brig. Gen. [Redacted]" level="Tactical" status="Engaged" />
                              </OrgNode>
                              {/* ... */}
                          </OrgNode>
                          
                          {/* ... other commands ... */}
                          <OrgNode label="Air Force Command" role="Lt. Gen. Yilma Merdasa" level="Component" status="Active">
                              <OrgNode label="Harar Meda Air Base (HQ)" role="Brig. Gen. [Redacted]" level="Base" status="Active" />
                              <OrgNode label="Dire Dawa Air Base" role="Col. [Redacted]" level="Base" status="Active" />
                          </OrgNode>
                          
                          {/* ... */}
                      </OrgNode>
                  </div>
              </div>
          )}
      </div>

      {/* Advanced Entangled Simulation Modal - UPDATED LAYOUT */}
      {showSimModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className={`bg-[#0f172a] w-full max-w-[95vw] lg:max-w-[1600px] h-[95vh] md:h-[90vh] rounded-2xl border ${agentType === 'alpha_prime' ? 'border-blue-500/30 shadow-blue-900/20' : agentType === 'sigma_human' ? 'border-orange-500/30 shadow-orange-900/20' : agentType === 'sigma_ai' ? 'border-red-500/30 shadow-red-900/20' : 'border-purple-500/30 shadow-purple-900/20'} shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300`}>
                <div className="p-4 border-b flex justify-between items-center bg-white/5 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <BrainCircuit className="text-white" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-white font-display tracking-wider">JOINT STRATEGIC FORESIGHT ENGINE</h3>
                            <p className="text-[10px] text-gray-400 font-mono hidden md:block">ENTANGLED AGENT COGNITION PROTOCOL</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 gap-1 overflow-x-auto max-w-[500px]">
                            <button onClick={() => setAgentType('alpha_prime')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${agentType === 'alpha_prime' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>ALPHA-PRIME</button>
                            <button onClick={() => setAgentType('sigma_human')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${agentType === 'sigma_human' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}>SIGMA-HUMAN</button>
                            <button onClick={() => setAgentType('sigma_ai')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${agentType === 'sigma_ai' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>SIGMA-AI</button>
                            <button onClick={() => setAgentType('theta')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${agentType === 'theta' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>THETA</button>
                        </div>
                        <button onClick={() => { setShowSimModal(false); stopAudio(); }} className="text-gray-400 hover:text-white p-2"><X size={24}/></button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Left: Input & Config Panel - Mobile Max Height Fix */}
                    <div className="w-full lg:w-1/3 xl:w-1/4 bg-black/20 p-6 border-r border-white/10 flex flex-col overflow-y-auto max-h-[40vh] lg:max-h-full border-b lg:border-b-0">
                        
                        {/* Agent Persona Description */}
                        <div className="mb-6 p-3 rounded border bg-white/5 border-white/10 text-gray-200">
                            <h4 className="text-xs font-bold uppercase mb-1 flex items-center">
                                <Users size={12} className="mr-1"/> DIRECTIVE: {agentType.replace('_', ' ').toUpperCase()}
                            </h4>
                            <p className="text-[10px] leading-relaxed opacity-80">
                                {agentType === 'alpha_prime' && "The Architect. Builds antifragile systems. Design systems that gain from disorder."}
                                {agentType === 'sigma_human' && "The Human Adversary. Exploits bureaucracy, psychology, and legal loopholes."}
                                {agentType === 'sigma_ai' && "The Synthetic Adversary. Uses pure game theory, insider inference, and temporal compression."}
                                {agentType === 'theta' && "The Chaotic Catalyst. Generates Black Swan events and stochastic noise."}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold uppercase block mb-2 font-display tracking-wide text-gray-400">Simulation Vector</label>
                            <textarea 
                                className="w-full h-32 lg:h-40 bg-black/40 border border-white/20 rounded-lg p-4 text-sm focus:outline-none focus:border-white/50 text-white placeholder-gray-600"
                                placeholder={
                                    agentType === 'alpha_prime' ? "Describe the system to fortify (e.g., 'Logistics Network against Cyber Attack')..." :
                                    agentType === 'sigma_ai' ? "Describe target system for computational exploitation..." :
                                    "Describe scenario..."
                                }
                                value={scenarioInput}
                                onChange={(e) => setScenarioInput(e.target.value)}
                            />
                        </div>

                        <div className="space-y-5 mb-8 flex-1">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">World Model Focus</label>
                                <select 
                                    value={simParams.worldModelFocus}
                                    onChange={(e) => setSimParams({...simParams, worldModelFocus: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white text-xs focus:border-white/30 outline-none"
                                >
                                    <option>Geopolitical & Economic</option>
                                    <option>Legal & Constitutional</option>
                                    <option>Cultural & Psychological</option>
                                    <option>Military Infrastructure</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleSimulation}
                                disabled={simulating || !scenarioInput}
                                className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center relative overflow-hidden group ${
                                    agentType === 'alpha_prime' ? 'bg-blue-600 hover:bg-blue-500' : 
                                    agentType === 'sigma_human' ? 'bg-orange-600 hover:bg-orange-500' :
                                    agentType === 'sigma_ai' ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {simulating ? (
                                    <span className="flex items-center animate-pulse">
                                        <RefreshCw className="animate-spin mr-2" /> PROCESSING...
                                    </span>
                                ) : (
                                    <span className="flex items-center tracking-widest font-display text-sm">
                                        <Play className="mr-2 fill-current" size={16} /> EXECUTE SIMULATION
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Output Panel */}
                    <div className="flex-1 bg-black/40 p-8 overflow-y-auto relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                        {!simResult && !simulating && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                <Hexagon size={64} className="mb-4 opacity-20" />
                                <p className="text-sm font-mono uppercase tracking-widest">Awaiting Simulation Parameters</p>
                            </div>
                        )}

                        {simResult && !simulating && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8 max-w-7xl mx-auto pb-8">
                                {/* Header */}
                                <div className={`border-l-4 pl-6 py-6 rounded-r-lg ${
                                    agentType === 'alpha_prime' ? 'border-blue-500 bg-blue-900/10' :
                                    agentType === 'sigma_human' ? 'border-orange-500 bg-orange-900/10' :
                                    agentType === 'sigma_ai' ? 'border-red-500 bg-red-900/10' : 'border-purple-500 bg-purple-900/10'
                                }`}>
                                    <div className="flex flex-col md:flex-row justify-between items-start">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-white/10 text-white border border-white/20`}>
                                                    {simResult.agent_specific_data?.archetype?.toUpperCase()}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white font-display uppercase tracking-wide drop-shadow-md">
                                                <SafeRender content={simResult.title || "SIMULATION REPORT"} />
                                            </h2>
                                        </div>
                                        {isSpeaking ? (
                                            <button onClick={stopAudio} className="text-red-400 hover:text-white flex items-center text-xs animate-pulse mt-2 md:mt-0 font-bold bg-red-900/20 px-3 py-1 rounded border border-red-500/30"><StopCircle size={16} className="mr-2"/> STOP AUDIO</button>
                                        ) : (
                                            <button onClick={() => playBriefing(simResult)} className="text-green-400 hover:text-white flex items-center text-xs mt-2 md:mt-0 font-bold bg-green-900/20 px-3 py-1 rounded border border-green-500/30 transition-colors"><Volume2 size={16} className="mr-2"/> PLAY BRIEFING</button>
                                        )}
                                    </div>
                                    <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed font-serif max-w-4xl border-l-2 border-white/5 pl-4">
                                        <SafeRender content={simResult.summary} />
                                    </p>
                                    
                                    {/* Agent Specific Widgets */}
                                    {simResult.insider_inference && (
                                        <div className="mt-6 p-4 bg-black/40 border border-red-500/30 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center">
                                                <Lock size={20} className="text-red-500" />
                                                <div className="ml-3">
                                                    <span className="text-[10px] font-bold text-red-400 uppercase block">Insider Inference (Sigma-AI)</span>
                                                    <span className="text-sm font-mono text-white font-bold block"><SafeRender content={simResult.insider_inference.system_guess} /></span>
                                                    <span className="text-[10px] text-gray-500 italic"><SafeRender content={simResult.insider_inference.data_source_inferred} /></span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-500 block">Probability Confidence</span>
                                                <div className="flex items-center justify-end">
                                                    <div className="w-32 h-2 bg-gray-800 rounded-full mr-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full ${simResult.insider_inference.confidence > 75 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                                            style={{width: `${simResult.insider_inference.confidence}%`}}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-mono font-bold text-white">
                                                        <SafeRender content={simResult.insider_inference.confidence} />%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {simResult.antifragility_metrics && (
                                        <div className="mt-6 p-4 bg-black/40 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <Shield size={20} className="text-blue-500 mr-2" />
                                                <span className="text-[10px] font-bold text-blue-400 uppercase">Antifragility Assessment (Alpha-Prime)</span>
                                            </div>
                                            <p className="text-sm text-white italic mb-2">"<SafeRender content={simResult.antifragility_metrics.gain_from_disorder} />"</p>
                                            <div className="flex gap-4 text-xs text-gray-400">
                                                <span>Stress Tol: <span className="text-white"><SafeRender content={simResult.antifragility_metrics.stress_tolerance} />%</span></span>
                                                <span>Redundancy: <span className="text-white"><SafeRender content={simResult.antifragility_metrics.redundancy_score} />%</span></span>
                                            </div>
                                        </div>
                                    )}

                                    {simResult.chaos_factors && (
                                        <div className="mt-6 p-4 bg-black/40 border border-purple-500/30 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <Zap size={20} className="text-purple-500 mr-2" />
                                                <span className="text-[10px] font-bold text-purple-400 uppercase">Black Swan Generator (Theta)</span>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-1"><SafeRender content={simResult.chaos_factors.black_swan_event} /></h4>
                                            <p className="text-xs text-gray-300"><SafeRender content={simResult.chaos_factors.description} /></p>
                                        </div>
                                    )}
                                </div>

                                {/* World Model Graph Visualization */}
                                <div className="bg-[#0b1120] rounded-lg border border-white/10 p-4 relative overflow-hidden min-h-[300px] flex flex-col shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center z-10">
                                        <Share2 size={14} className="mr-2" /> Dynamic World Model Graph
                                    </h3>
                                    
                                    <div className="flex-1 relative z-0 flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                        
                                        <svg viewBox="0 0 600 300" className="w-full h-full max-w-2xl">
                                            <defs>
                                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                                    <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                                                </marker>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur"/>
                                                        <feMergeNode in="SourceGraphic"/>
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            {/* Central Node (Scenario Core) */}
                                            <circle cx="300" cy="150" r="30" fill="#1e293b" stroke="white" strokeWidth="2" filter="url(#glow)" />
                                            <text x="300" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">CORE</text>

                                            {/* Left Node: Adversary / Target */}
                                            <g transform="translate(100, 150)">
                                                <line x1="30" y1="0" x2="170" y2="0" stroke="#475569" strokeWidth="1" strokeDasharray="5 5" />
                                                <circle cx="0" cy="0" r="25" fill="#1e293b" stroke={agentType === 'sigma_ai' ? '#ef4444' : 'white'} strokeWidth="1" />
                                                <text x="0" y="-35" textAnchor="middle" fill="gray" fontSize="8">PROFILE</text>
                                                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" className="truncate" style={{maxWidth: '40px'}}>
                                                    {simResult.adversary_analysis?.profile ? (simResult.adversary_analysis.profile.length > 10 ? simResult.adversary_analysis.profile.substring(0,10)+'...' : simResult.adversary_analysis.profile) : 'TARGET'}
                                                </text>
                                            </g>

                                            {/* Top Right Node: Legal Matrix */}
                                            <g transform="translate(450, 80)">
                                                <line x1="-25" y1="10" x2="-125" y2="55" stroke="#475569" strokeWidth="1" />
                                                <circle cx="0" cy="0" r="25" fill="#1e293b" stroke={agentType === 'sigma_human' ? '#f97316' : 'white'} strokeWidth="1" />
                                                <text x="0" y="-35" textAnchor="middle" fill="gray" fontSize="8">LEGAL</text>
                                                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8">{simResult.legal_matrix?.status || 'N/A'}</text>
                                            </g>

                                            {/* Bottom Right Node: Psych Vector */}
                                            <g transform="translate(450, 220)">
                                                <line x1="-25" y1="-10" x2="-125" y2="-55" stroke="#475569" strokeWidth="1" />
                                                <circle cx="0" cy="0" r="25" fill="#1e293b" stroke={agentType === 'theta' ? '#a855f7' : 'white'} strokeWidth="1" />
                                                <text x="0" y="35" textAnchor="middle" fill="gray" fontSize="8">PSYCH</text>
                                                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8">
                                                    {simResult.psych_social_vector?.cognitive_bias_target ? (simResult.psych_social_vector.cognitive_bias_target.length > 12 ? simResult.psych_social_vector.cognitive_bias_target.substring(0,12)+'...' : simResult.psych_social_vector.cognitive_bias_target) : 'BIAS'}
                                                </text>
                                            </g>

                                            {/* Special Node: Insider (Sigma) or Coalition (Alpha) */}
                                            {simResult.insider_inference && (
                                                <g transform="translate(150, 50)">
                                                    <line x1="20" y1="20" x2="130" y2="85" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
                                                    <rect x="-40" y="-15" width="80" height="30" rx="4" fill="#000" stroke="#ef4444" strokeWidth="1" />
                                                    <text x="0" y="4" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">INSIDER DATA</text>
                                                </g>
                                            )}
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-2 right-2 text-[9px] text-gray-600 font-mono">
                                        GRAPH_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                    </div>
                                </div>

                                {/* World Model Impact Visualization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-5 rounded-lg border bg-white/5 border-white/10`}>
                                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center text-white`}>
                                            <Brain size={14} className="mr-2"/> Psych-Social & Cultural Factors
                                        </h3>
                                        <div className="space-y-3 text-xs">
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-gray-400">Cultural Fault Line</span>
                                                <span className="text-white text-right font-medium max-w-[60%]"><SafeRender content={simResult.psych_social_vector?.cultural_fault_line} /></span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-gray-400">Cognitive Bias</span>
                                                <span className="text-white text-right font-medium max-w-[60%]"><SafeRender content={simResult.psych_social_vector?.cognitive_bias_target} /></span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Biological/Physical Limit</span>
                                                <span className="text-white text-right font-medium max-w-[60%]"><SafeRender content={simResult.psych_social_vector?.biological_factor} /></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-lg border bg-white/5 border-white/10`}>
                                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center text-white`}>
                                            <Scale size={14} className="mr-2"/> Legal & Bureaucratic Matrix
                                        </h3>
                                        <div className="space-y-3 text-xs">
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-gray-400">Legal Mechanism</span>
                                                <span className="text-white text-right font-medium max-w-[60%]"><SafeRender content={simResult.legal_matrix?.mechanism} /></span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Exploitability / Viability</span>
                                                <span className={`${(simResult.legal_matrix?.compliance_score || 0) > 50 ? 'text-green-400' : 'text-yellow-400'} text-right font-bold`}>
                                                    <SafeRender content={simResult.legal_matrix?.status} /> (<SafeRender content={simResult.legal_matrix?.compliance_score} />%)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cross-Domain Impact (Bar Chart) */}
                                {simResult.cross_domain_matrix && (
                                    <div className="bg-military-900/50 p-5 rounded-lg border border-military-600">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center">
                                            <Activity size={14} className="mr-2"/> Cross-Domain Impact Assessment
                                        </h3>
                                        <div className="h-48 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    data={[
                                                        { subject: 'Military', A: simResult.cross_domain_matrix.military_readiness },
                                                        { subject: 'Diplomatic', A: simResult.cross_domain_matrix.diplomatic_trust },
                                                        { subject: 'Economic', A: simResult.cross_domain_matrix.economic_cost },
                                                        { subject: 'Morale', A: simResult.cross_domain_matrix.domestic_morale },
                                                        { subject: 'Legal', A: simResult.cross_domain_matrix.legal_compliance },
                                                    ]} 
                                                    layout="vertical" 
                                                    margin={{left: 40}}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                                    <XAxis type="number" domain={[-10, 10]} hide />
                                                    <YAxis dataKey="subject" type="category" width={80} stroke="#94a3b8" fontSize={10} />
                                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                                    <ReferenceLine x={0} stroke="#666" />
                                                    <Bar dataKey="A" fill={
                                                        agentType === 'alpha_prime' ? '#3b82f6' :
                                                        agentType === 'sigma_human' ? '#f97316' :
                                                        agentType === 'sigma_ai' ? '#ef4444' : '#a855f7'
                                                    } barSize={20}>
                                                        {
                                                            [
                                                                simResult.cross_domain_matrix.military_readiness,
                                                                simResult.cross_domain_matrix.diplomatic_trust,
                                                                simResult.cross_domain_matrix.economic_cost,
                                                                simResult.cross_domain_matrix.domestic_morale,
                                                                simResult.cross_domain_matrix.legal_compliance
                                                            ].map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                                                            ))
                                                        }
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}

                                {/* Strategic Options Table */}
                                {simResult.strategic_options && (
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
                                                {simResult.strategic_options.map((opt) => (
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
                                                                    <div className={`h-full bg-blue-500`} style={{width: `${opt.win_probability}%`}}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Rationale */}
                                <div className={`border-l-4 p-4 rounded text-xs text-gray-300 bg-white/5 border-white/20`}>
                                    <strong className="text-white">STRATEGIC RATIONALE:</strong>
                                    <div className="mt-1"><SafeRender content={simResult.rationale} /></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Mission Creation Modal */}
      {showMissionModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-military-800 border border-amber-500/30 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-amber-900/20 to-transparent rounded-t-xl">
                      <h3 className="font-bold text-white flex items-center font-display tracking-wide">
                          <List className="mr-2 text-amber-500" /> {t('op_mission_create')}
                      </h3>
                      <button onClick={() => setShowMissionModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleCreateMission} className="p-6 space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">{t('op_lbl_codename')}</label>
                          <input 
                              type="text" 
                              required
                              value={newMissionName}
                              onChange={(e) => setNewMissionName(e.target.value)}
                              className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                              placeholder="e.g. Operation Iron Shield"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Commander</label>
                          <input 
                              type="text" 
                              required
                              value={newMissionCommander}
                              onChange={(e) => setNewMissionCommander(e.target.value)}
                              className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                              placeholder="Rank & Name"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Priority</label>
                          <div className="grid grid-cols-4 gap-2">
                              {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => setNewMissionPriority(p)}
                                    className={`py-2 rounded text-xs font-bold border transition-all ${
                                        newMissionPriority === p 
                                        ? 'bg-amber-600 text-white border-amber-500' 
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                    }`}
                                  >
                                      {p}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div className="pt-4 flex justify-end">
                          <button 
                            type="submit" 
                            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-lg flex items-center transition-all font-display tracking-wide shadow-lg shadow-amber-900/20"
                          >
                              {t('op_btn_authorize')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default OperationalView;

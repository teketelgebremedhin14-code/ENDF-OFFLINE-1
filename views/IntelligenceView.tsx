
import React, { useState, useRef, useEffect } from 'react';
import { Eye, Radio, ShieldAlert, Wifi, Globe, Terminal, Activity, Share2, Crosshair, Video, Search, ExternalLink, Zap, User, DollarSign, Home, Box, CheckCircle, X, BrainCircuit, Scale, Upload, MapPin, Bot, FileWarning, ScanFace, Lock, AlertTriangle, Network, RefreshCw, ChevronRight } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TacticalMap, { Unit } from '../components/TacticalMap';
import { searchIntelligence, runTerminalCommand, runStrategySimulation } from '../services/aiService';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, BarChart, Bar, CartesianGrid } from 'recharts';

interface OsintResult {
    text: string;
    sources: any[];
}

interface GraphNode {
    id: string;
    label: string;
    type: 'target' | 'finance' | 'location' | 'cache';
    x: number;
    y: number;
    connections: string[];
}

interface IntelligenceViewProps {
    onBack?: () => void;
}

// Helper to safely render AI text that might be returned as an object
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        if (content.value) return <>{content.value}</>;
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const IntelligenceView: React.FC<IntelligenceViewProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const activeTabRef = useRef<'dashboard' | 'cyber' | 'sigint' | 'surveillance' | 'osint' | 'link' | 'fusion'>('dashboard');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cyber' | 'sigint' | 'surveillance' | 'osint' | 'link' | 'fusion'>('dashboard');
  
  // OSINT & Deepfake State
  const [osintQuery, setOsintQuery] = useState('');
  const [osintLoading, setOsintLoading] = useState(false);
  const [osintData, setOsintData] = useState<OsintResult | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const [deepfakeAnalysis, setDeepfakeAnalysis] = useState<any>(null);

  // Link Analysis State
  const [nodes, setNodes] = useState<GraphNode[]>([
      { id: 'n1', label: 'Cmdr. X', type: 'target', x: 400, y: 300, connections: ['n2', 'n3', 'n4'] },
      { id: 'n2', label: 'Bank Acc #992', type: 'finance', x: 250, y: 150, connections: ['n1', 'n5'] },
      { id: 'n3', label: 'Safehouse Alpha', type: 'location', x: 550, y: 150, connections: ['n1', 'n6'] },
      { id: 'n4', label: 'Arms Cache B', type: 'cache', x: 400, y: 450, connections: ['n1'] },
      { id: 'n5', label: 'Shell Corp', type: 'finance', x: 100, y: 100, connections: ['n2'] },
      { id: 'n6', label: 'Lt. Y', type: 'target', x: 700, y: 100, connections: ['n3'] }
  ]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  // Terminal Logic
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
      "root@endf-cyber:~# initializing threat_scan --deep",
      "[SYSTEM] Connection established to secure node.",
      "[SYSTEM] Monitoring active channels...",
      "[INFO] 4.0.3 Cyber and Electronic Warfare Directorate Module Loaded.",
      "Type 'help' for available commands."
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalProcessing, setTerminalProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // IFAN: Red Team & Threat Library
  const [redTeamLogs, setRedTeamLogs] = useState<string[]>([]);
  const [sigmaTarget, setSigmaTarget] = useState('');
  const [sigmaRunning, setSigmaRunning] = useState(false);
  const [sigmaResult, setSigmaResult] = useState<any>(null);

  const threatLibrary = [
      { name: 'APT-29', type: 'State Actor', risk: 'Critical', status: 'Active' },
      { name: 'DarkSide', type: 'Ransomware', risk: 'High', status: 'Monitoring' },
      { name: 'Lazarus', type: 'Finance', risk: 'High', status: 'Dormant' },
      { name: 'Sandworm', type: 'Grid Attack', risk: 'Critical', status: 'Active' },
  ];

  const suggestedVectors = [
      t('intel_vec_sudan'),
      t('intel_vec_redsea'),
      t('intel_vec_drought'),
      t('intel_vec_gerd')
  ];

  useEffect(() => {
      activeTabRef.current = activeTab;
      if (activeTab === 'cyber') {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      if (activeTab === 'osint') {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  (pos) => setUserLocation({lat: pos.coords.latitude, lng: pos.coords.longitude}),
                  (err) => console.log("Location access denied")
              );
          }
      }
  }, [terminalHistory, activeTab]);

  // Graph Interactions
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      setDraggingNode(nodeId);
      setSelectedNode(nodes.find(n => n.id === nodeId) || null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (draggingNode) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
      }
  };

  const handleMouseUp = () => {
      setDraggingNode(null);
  };

  const handleTerminalCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          const rawCommand = terminalInput.trim();
          if (!rawCommand) return;

          setTerminalHistory(prev => [...prev, `root@endf-cyber:~# ${rawCommand}`]);
          setTerminalInput('');
          setTerminalProcessing(true);

          if (rawCommand.toLowerCase() === 'clear') {
              setTerminalHistory(["Console cleared."]);
              setTerminalProcessing(false);
              return;
          }

          try {
              const response = await runTerminalCommand(rawCommand);
              setTerminalHistory(prev => [...prev, response]);
          } catch (e) {
              setTerminalHistory(prev => [...prev, "Error: Command failed execution."]);
          }
          setTerminalProcessing(false);
      }
  };

  const handleOsintSearch = async (query?: string) => {
      const q = query || osintQuery;
      if (!q.trim()) return;
      
      setOsintLoading(true);
      setOsintData(null);
      setDeepfakeAnalysis(null);
      const result = await searchIntelligence(q, userLocation);
      setOsintData(result);
      
      // Simulate Deepfake Analysis if keywords match media/video
      if (q.toLowerCase().includes('video') || q.toLowerCase().includes('speech') || q.toLowerCase().includes('fake')) {
          setTimeout(() => {
              setDeepfakeAnalysis({
                  score: Math.floor(Math.random() * 80) + 10,
                  verdict: Math.random() > 0.5 ? "Manipulated Media" : "Authentic Source",
                  details: "Frame-by-frame artifact analysis complete. Audio spectrum inconsistencies detected."
              });
              setOsintLoading(false);
          }, 2000);
      } else {
          setOsintLoading(false);
      }
  };

  const handleRunSigma = async () => {
      if (!sigmaTarget) return;
      setSigmaRunning(true);
      setRedTeamLogs([`[SIGMA] Initiating vulnerability scan on vector: ${sigmaTarget}...`]);
      setSigmaResult(null);

      try {
          const resultStr = await runStrategySimulation(
              `Conduct a Red Team vulnerability assessment on: ${sigmaTarget}`, 
              'sigma', 
              language, 
              { sigmaMode: 'autonomous_manual' }
          );
          
          let parsed;
          try {
              // Basic clean up of JSON if needed, though geminiService does it too
              const clean = resultStr.replace(/^```json/, '').replace(/```$/, '').trim();
              parsed = JSON.parse(clean);
          } catch (e) {
              parsed = { summary: resultStr };
          }

          setSigmaResult(parsed);
          setRedTeamLogs(prev => [...prev, `[SIGMA] Assessment Complete. Vulnerabilities identified.`]);
      } catch (e) {
          setRedTeamLogs(prev => [...prev, `[SIGMA] Error: Simulation failed.`]);
      }
      setSigmaRunning(false);
  };

  // Simulated SIGINT Data
  const [sigintFeed, setSigintFeed] = useState([
      { id: 1, freq: '442.5 MHz', sourceKey: 'intel_sig_source_unk', contentKey: 'intel_sig_content_enc', type: 'raw' },
      { id: 2, freq: '121.8 MHz', sourceKey: 'Sector 9', contentKey: 'intel_sig_content_move', type: 'voice' },
  ]);

  useEffect(() => {
      const interval = window.setInterval(() => {
          if (activeTabRef.current === 'sigint') {
              const newSignal = {
                  id: Date.now(),
                  freq: `${(Math.random() * 500 + 100).toFixed(1)} MHz`,
                  sourceKey: Math.random() > 0.5 ? 'Intercept 4' : 'intel_sig_source_unk',
                  contentKey: Math.random() > 0.7 ? 'intel_sig_content_enc' : 'intel_sig_content_move',
                  type: Math.random() > 0.7 ? 'raw' : 'voice'
              };
              setSigintFeed(prev => [newSignal, ...prev].slice(0, 15));
          }
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  // Surveillance Logic
  const [selectedDrone, setSelectedDrone] = useState('UAV-01');
  const [droneUnits, setDroneUnits] = useState<Unit[]>([
      { id: 't1', name: 'Convoy Alpha', type: 'hostile', category: 'armor', x: 45, y: 50, status: 'moving', health: 100, ammo: 50, speed: 45, heading: 270 },
      { id: 't2', name: 'Scout 1', type: 'hostile', category: 'recon', x: 55, y: 40, status: 'active', health: 100, ammo: 20, speed: 20, heading: 180 },
      { id: 'f1', name: 'Patrol 4', type: 'friendly', category: 'infantry', x: 30, y: 60, status: 'engaged', health: 90, ammo: 80, speed: 0, heading: 90 },
  ]);

  const getNodeIcon = (type: string) => {
      switch(type) {
          case 'target': return <User size={24} className="text-rose-500 pointer-events-none" />;
          case 'finance': return <DollarSign size={24} className="text-emerald-500 pointer-events-none" />;
          case 'location': return <Home size={24} className="text-blue-500 pointer-events-none" />;
          case 'cache': return <Box size={24} className="text-amber-500 pointer-events-none" />;
          default: return <Activity size={24} className="pointer-events-none" />;
      }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
         <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight font-display">{t('intel_title')}</h2>
          <p className="text-gray-400 text-xs font-sans">{t('intel_subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-data-terminal'))}
                className="text-[10px] flex items-center bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-lg animate-pulse"
            >
                <Upload size={12} className="mr-1"/> REPORT
            </button>
            <div className="glass-panel p-1 rounded-lg border border-white/10 flex flex-wrap gap-1">
                 <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Eye size={12} className="mr-1"/> {t('intel_tab_dash')}
                </button>
                <button 
                    onClick={() => setActiveTab('fusion')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'fusion' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <BrainCircuit size={12} className="mr-1"/> {t('ifan_tab_fusion')}
                </button>
                <button 
                    onClick={() => setActiveTab('link')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'link' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Share2 size={12} className="mr-1"/> {t('intel_tab_link')}
                </button>
                <button 
                    onClick={() => setActiveTab('osint')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'osint' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Globe size={12} className="mr-1"/> {t('intel_tab_osint')}
                </button>
                <button 
                    onClick={() => setActiveTab('surveillance')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'surveillance' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Video size={12} className="mr-1"/> {t('intel_tab_drone')}
                </button>
                <button 
                    onClick={() => setActiveTab('cyber')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'cyber' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Terminal size={12} className="mr-1"/> {t('intel_tab_cyber')}
                </button>
                <button 
                    onClick={() => setActiveTab('sigint')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'sigint' ? 'bg-sky-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Wifi size={12} className="mr-1"/> {t('intel_tab_sigint')}
                </button>
            </div>
            
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

      <div className="flex-1 min-h-0 overflow-y-auto relative">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard title={t('intel_metric_cyber')} value="2,405" change={12.5} icon={ShieldAlert} color="accent" />
                    <MetricCard title={t('intel_metric_drone')} value="18" change={2} icon={Eye} color="success" />
                    <MetricCard title={t('intel_metric_sigint')} value="14.2k" change={5.1} icon={Wifi} />
                    <MetricCard title="Threat Level" value="MODERATE" icon={Radio} color="warning" />
                  </div>

                  <div className="glass-panel rounded-lg border border-white/10 flex flex-col">
                      <div className="p-3 border-b border-white/10 bg-gradient-to-r from-emerald-900/20 to-transparent">
                          <h3 className="font-semibold text-white flex items-center font-display text-sm">
                              <Globe size={14} className="mr-2 text-emerald-400" />
                              {t('intel_active_recon')}
                          </h3>
                      </div>
                      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/5 p-3 rounded border-l-4 border-emerald-500 hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start">
                                  <h4 className="text-xs font-bold text-gray-200 font-sans">{t('intel_op_silent')}</h4>
                                  <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-1.5 py-0.5 rounded font-mono">LIVE</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 font-sans">{t('intel_op_silent_desc')}</p>
                          </div>
                           <div className="bg-white/5 p-3 rounded border-l-4 border-amber-500 hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start">
                                  <h4 className="text-xs font-bold text-gray-200 font-sans">{t('intel_op_echo')}</h4>
                                  <span className="text-[9px] bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded font-mono">ANALYSIS</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 font-sans">{t('intel_op_echo_desc')}</p>
                          </div>
                           <div className="bg-white/5 p-3 rounded border-l-4 border-cyan-500 hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start">
                                  <h4 className="text-xs font-bold text-gray-200 font-sans">{t('intel_op_deep')}</h4>
                                  <span className="text-[9px] bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded font-mono">ROUTINE</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 font-sans">{t('intel_op_deep_desc')}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: FUSION (IFAN) */}
          {activeTab === 'fusion' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                  {/* Central Cognitive Core */}
                  <div className="lg:col-span-2 bg-[#050b14] rounded-lg border border-violet-500/30 relative flex flex-col items-center justify-center shadow-2xl shadow-violet-900/20 p-6 min-h-[400px]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.1),transparent)]"></div>
                      
                      <div className="relative w-64 h-64 md:w-80 md:h-80 scale-90 md:scale-100">
                          {/* Rotating Rings */}
                          <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-[spin_10s_linear_infinite]"></div>
                          <div className="absolute inset-4 rounded-full border border-cyan-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                          <div className="absolute inset-8 rounded-full border border-emerald-500/30 animate-[spin_20s_linear_infinite]"></div>
                          
                          {/* Core Brain */}
                          <div className="absolute inset-0 flex items-center justify-center">
                              <BrainCircuit size={64} className="text-violet-400 animate-pulse drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
                          </div>

                          {/* Data Nodes */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded border border-cyan-500 text-cyan-400 text-[10px] font-bold backdrop-blur-sm">SIGINT</div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded border border-emerald-500 text-emerald-400 text-[10px] font-bold backdrop-blur-sm">HUMINT</div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-1 rounded border border-amber-500 text-amber-400 text-[10px] font-bold backdrop-blur-sm">OSINT</div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-1 rounded border border-rose-500 text-rose-400 text-[10px] font-bold backdrop-blur-sm">GEOINT</div>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-4 font-display tracking-widest">{t('ifan_title')} CORE</h3>
                      <p className="text-[10px] text-violet-300 mt-1 max-w-md text-center">{t('ifan_fusion')}: Integrating multi-spectrum data for predictive foresight.</p>
                  </div>

                  {/* Analysis Modules */}
                  <div className="space-y-4 overflow-y-auto">
                      {/* Cognitive Red Team - Agent Sigma */}
                      <div className="glass-panel rounded-lg p-4 border border-rose-500/30 flex flex-col h-auto min-h-[300px]">
                          <h4 className="text-xs font-bold text-rose-400 mb-4 flex items-center justify-between">
                              <span className="flex items-center"><Bot size={14} className="mr-2" /> AGENT SIGMA: RED TEAM</span>
                              {sigmaRunning && <RefreshCw className="animate-spin" size={12} />}
                          </h4>
                          
                          <div className="mb-4">
                              <label className="text-[10px] text-gray-400 font-bold block mb-1">TARGET VECTOR</label>
                              <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={sigmaTarget}
                                    onChange={(e) => setSigmaTarget(e.target.value)}
                                    placeholder="e.g. Cyber Infrastructure"
                                    className="flex-1 bg-black/40 border border-white/10 rounded p-2 text-white text-xs focus:border-rose-500"
                                />
                                <button 
                                    onClick={handleRunSigma}
                                    disabled={sigmaRunning || !sigmaTarget}
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded px-3 text-[10px] font-bold disabled:opacity-50"
                                >
                                    SIMULATE
                                </button>
                              </div>
                          </div>

                          <div className="flex-1 bg-black/50 p-2 rounded text-[10px] font-mono overflow-y-auto max-h-[150px] border border-white/5 mb-3 custom-scrollbar">
                              {redTeamLogs.length === 0 ? <span className="text-gray-600 italic">Ready for assignment...</span> : redTeamLogs.map((log, i) => (
                                  <div key={i} className="text-rose-300 mb-1">{log}</div>
                              ))}
                          </div>

                          {sigmaResult && (
                              <div className="bg-rose-900/20 p-2 rounded border border-rose-500/30 animate-in fade-in slide-in-from-bottom-2">
                                  <div className="text-[10px] font-bold text-rose-400 mb-1">VULNERABILITY DETECTED</div>
                                  <p className="text-[9px] text-gray-300 leading-relaxed">
                                      <SafeRender content={sigmaResult.insider_inference?.vulnerability_point || sigmaResult.summary} />
                                  </p>
                              </div>
                          )}
                      </div>

                      {/* Global Threat Library */}
                      <div className="glass-panel p-4 rounded-lg border border-white/10 hover:border-violet-500/50 transition-colors">
                          <h4 className="text-xs font-bold text-white mb-2 flex items-center">
                              <FileWarning size={14} className="text-amber-400 mr-2" /> Global Threat Library
                          </h4>
                          <div className="space-y-2">
                              {threatLibrary.map((threat, i) => (
                                  <div key={i} className="flex justify-between items-center text-[10px] bg-white/5 p-1.5 rounded border border-white/5">
                                      <span className="text-white font-bold">{threat.name}</span>
                                      <div className="flex space-x-2">
                                          <span className="text-gray-400">{threat.type}</span>
                                          <span className={`font-bold ${threat.risk === 'Critical' ? 'text-rose-500' : 'text-amber-500'}`}>{threat.risk}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="glass-panel p-4 rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors">
                          <h4 className="text-xs font-bold text-white mb-2 flex items-center">
                              <Scale size={14} className="text-blue-400 mr-2" /> {t('ifan_cognitive')}
                          </h4>
                          <p className="text-[10px] text-gray-400 mb-2">Sector 9 Civilian Sentiment</p>
                          <div className="w-full bg-gray-700 h-1.5 rounded-full mb-1">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '65%'}}></div>
                          </div>
                          <span className="text-[9px] text-blue-300">65% Supportive of Government Initiatives</span>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: LINK ANALYSIS */}
          {activeTab === 'link' && (
              <div className="h-full flex flex-col relative overflow-hidden bg-[#0a0f1c] rounded-lg border border-white/10 min-h-[500px]">
                  <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                  
                  {/* Toolbar */}
                  <div className="absolute top-4 left-4 z-10 glass-panel p-2 rounded flex space-x-2">
                      <div className="flex items-center space-x-1 px-2 border-r border-white/20">
                          <User size={12} className="text-rose-500"/>
                          <span className="text-[10px] text-gray-300 font-sans">{t('intel_net_hvt')}</span>
                      </div>
                      <div className="flex items-center space-x-1 px-2 border-r border-white/20">
                          <DollarSign size={12} className="text-emerald-500"/>
                          <span className="text-[10px] text-gray-300 font-sans">{t('intel_net_fin')}</span>
                      </div>
                      <div className="flex items-center space-x-1 px-2">
                          <Home size={12} className="text-blue-500"/>
                          <span className="text-[10px] text-gray-300 font-sans">{t('intel_net_loc')}</span>
                      </div>
                  </div>

                  {/* Graph Canvas */}
                  <svg 
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                      {/* Connections */}
                      {nodes.map(node => 
                          node.connections.map(targetId => {
                              const target = nodes.find(n => n.id === targetId);
                              if (!target) return null;
                              return (
                                  <line 
                                    key={`${node.id}-${targetId}`}
                                    x1={node.x} y1={node.y}
                                    x2={target.x} y2={target.y}
                                    stroke="#64748b" strokeWidth="1"
                                    strokeOpacity="0.5"
                                  />
                              );
                          })
                      )}

                      {/* Nodes */}
                      {nodes.map(node => (
                          <g 
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            onMouseDown={(e) => handleMouseDown(e, node.id)}
                            className="cursor-pointer group"
                          >
                              {/* Pulse Effect for Selected */}
                              {selectedNode?.id === node.id && (
                                  <circle r="35" fill="none" stroke="white" strokeWidth="1" opacity="0.3" className="animate-ping" />
                              )}
                              
                              <circle r="24" fill="#1e293b" stroke={selectedNode?.id === node.id ? '#fff' : '#475569'} strokeWidth="2" className="transition-all group-hover:fill-slate-700" />
                              <g transform="translate(-12, -12)">
                                  {getNodeIcon(node.type)}
                              </g>
                              <text y="40" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold" className="group-hover:fill-white">{node.label}</text>
                          </g>
                      ))}
                  </svg>
                  
                  {/* Details Panel */}
                  {selectedNode && (
                      <div className="absolute top-4 right-4 w-64 glass-panel-strong p-4 rounded-lg border border-white/20 animate-in slide-in-from-right-10 shadow-2xl">
                          <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                              <div>
                                  <h4 className="font-bold text-white text-sm">{selectedNode.label}</h4>
                                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                                      selectedNode.type === 'target' ? 'bg-rose-900/50 text-rose-300' :
                                      selectedNode.type === 'finance' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-blue-900/50 text-blue-300'
                                  }`}>
                                      {selectedNode.type}
                                  </span>
                              </div>
                              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                          </div>
                          
                          <div className="space-y-2 text-[10px] text-gray-300 mb-3">
                              <div className="flex justify-between"><span className="text-gray-500">ENTITY ID</span><span className="font-mono">{selectedNode.id.toUpperCase()}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">CONNECTIONS</span><span>{selectedNode.connections.length} Linked Nodes</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">THREAT SCORE</span><span className="text-rose-400 font-bold">HIGH</span></div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-[10px] font-bold transition-colors">DEEP DIVE</button>
                              <button className="bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded text-[10px] font-bold transition-colors">FLAG TARGET</button>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* TAB: OSINT */}
          {activeTab === 'osint' && (
              <div className="flex flex-col p-4 glass-panel rounded-lg border border-white/10 h-full overflow-y-auto">
                  <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
                      <div className="mb-6 text-center">
                          <h3 className="text-xl font-bold text-white mb-1 font-display">{t('intel_global_search')}</h3>
                          <p className="text-gray-400 text-xs">{t('intel_search_placeholder')}</p>
                          {userLocation && (
                              <div className="mt-1 text-[10px] text-emerald-500 flex justify-center items-center">
                                  <MapPin size={10} className="mr-1" />
                                  Geospatial Context Active: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                              </div>
                          )}
                      </div>

                      <div className="flex space-x-2 mb-4">
                          <input 
                              type="text" 
                              value={osintQuery}
                              onChange={(e) => setOsintQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleOsintSearch()}
                              placeholder="e.g. Red Sea maritime security incidents or 'Deepfake analysis'..."
                              className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-teal-500 font-sans transition-colors"
                          />
                          <button 
                              onClick={() => handleOsintSearch()}
                              disabled={osintLoading}
                              className="bg-teal-600 hover:bg-teal-500 text-white px-4 rounded-lg font-bold flex items-center transition-colors disabled:opacity-50 shadow-lg shadow-teal-900/20"
                          >
                              {osintLoading ? <Zap size={16} className="animate-spin" /> : <Search size={16} />}
                          </button>
                      </div>

                      <div className="flex-1 space-y-4">
                          {!osintData && !osintLoading && !deepfakeAnalysis && (
                              <div className="text-center text-gray-500 mt-10">
                                  <Globe size={32} className="mx-auto mb-2 opacity-20" />
                                  <p className="text-xs">{t('intel_await_input')}</p>
                                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                                      {suggestedVectors.map((vec, i) => (
                                          <button 
                                            key={i}
                                            onClick={() => { setOsintQuery(vec); handleOsintSearch(vec); }}
                                            className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full hover:border-teal-500 hover:text-white transition-colors"
                                          >
                                              {vec}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {osintLoading && (
                              <div className="text-center text-teal-400 mt-10">
                                  <div className="inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                                  <p className="font-mono text-xs animate-pulse">{t('intel_scan_btn')}</p>
                              </div>
                          )}

                          {/* Deepfake Analysis Panel */}
                          {deepfakeAnalysis && (
                              <div className="bg-violet-900/20 border border-violet-500/50 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm">
                                  <div className="flex items-center">
                                      <ScanFace size={24} className="text-violet-400 mr-3" />
                                      <div>
                                          <h4 className="text-sm font-bold text-white mb-1">AI Media Verification</h4>
                                          <p className="text-[10px] text-gray-300 max-w-md"><SafeRender content={deepfakeAnalysis.details} /></p>
                                          <p className="text-xs font-bold mt-1 text-violet-300"><SafeRender content={deepfakeAnalysis.verdict} /></p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-[10px] text-gray-400 uppercase">Manipulated Prob.</div>
                                      <div className={`text-xl font-bold ${deepfakeAnalysis.score > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                          <SafeRender content={deepfakeAnalysis.score} />%
                                      </div>
                                  </div>
                              </div>
                          )}

                          {osintData && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                      <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center font-display">
                                          <CheckCircle size={12} className="mr-2" /> {t('intel_briefing')}
                                      </h4>
                                      <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                          <p className="whitespace-pre-wrap leading-relaxed text-xs"><SafeRender content={osintData.text} /></p>
                                      </div>
                                  </div>

                                  {osintData.sources.length > 0 && (
                                      <div>
                                          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">
                                              {t('intel_sources')} / GEO-LINKS
                                          </h4>
                                          <div className="grid gap-2">
                                              {osintData.sources.map((source, idx) => {
                                                  const link = source.maps?.uri || source.web?.uri;
                                                  const title = source.maps?.title || source.web?.title || "Unknown Source";
                                                  const isMap = !!source.maps?.uri;

                                                  return (
                                                      <a 
                                                        key={idx} 
                                                        href={link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-between p-2 bg-white/5 rounded border transition-colors group ${isMap ? 'border-emerald-900 hover:border-emerald-500' : 'border-white/10 hover:border-white/30'}`}
                                                      >
                                                          <div className="flex items-center space-x-3 overflow-hidden">
                                                              {isMap ? <MapPin size={12} className="text-emerald-500 flex-shrink-0" /> : <Globe size={12} className="text-blue-400 flex-shrink-0" />}
                                                              <span className={`text-xs group-hover:underline truncate ${isMap ? 'text-emerald-300' : 'text-blue-300'}`}>{title}</span>
                                                          </div>
                                                          <ExternalLink size={10} className="text-gray-600 group-hover:text-white flex-shrink-0" />
                                                      </a>
                                                  );
                                              })}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: DRONE SURVEILLANCE */}
          {activeTab === 'surveillance' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                  {/* Main Feed */}
                  <div className="lg:col-span-2 bg-black rounded-lg border border-white/20 relative overflow-hidden group min-h-[400px]">
                      <div className="absolute inset-0">
                          {/* Use TacticalMap for Live Feed */}
                          <TacticalMap holoMode={true} customUnits={droneUnits} terrainType='Desert / Open' />
                      </div>
                      
                      {/* Drone HUD Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-4 left-4 font-mono text-[10px] text-white z-20">
                              <p className="text-rose-500 font-bold bg-black/60 px-1">{t('intel_live_feed')}</p>
                              <p className="bg-black/60 px-1 mt-1">CAM-1 [IR]</p>
                              <p className="bg-black/60 px-1">{selectedDrone}</p>
                          </div>
                          
                          <div className="absolute bottom-4 right-4 text-right font-mono text-[10px] text-white z-20">
                              <p className="bg-black/60 px-1 mb-1">{t('lbl_alt')}: 18,400 FT</p>
                              <p className="bg-black/60 px-1 mb-1">{t('lbl_spd')}: 140 KTS</p>
                              <p className="bg-black/60 px-1">{t('lbl_hdg')}: 330 NW</p>
                          </div>
                          
                          {/* Crosshair Center */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                              <div className="w-1 h-1 bg-rose-500"></div>
                          </div>
                      </div>
                  </div>

                  {/* Drone List */}
                  <div className="glass-panel rounded-lg p-4 border border-white/10 flex flex-col h-full overflow-y-auto">
                      <h3 className="font-semibold text-white mb-4 text-sm">{t('intel_active_recon')}</h3>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                          {['UAV-01', 'UAV-04', 'UAV-09'].map(drone => (
                              <div 
                                  key={drone}
                                  onClick={() => setSelectedDrone(drone)}
                                  className={`p-3 rounded border cursor-pointer flex justify-between items-center transition-colors ${selectedDrone === drone ? 'bg-indigo-900/40 border-indigo-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                              >
                                  <div className="flex items-center">
                                      <div className={`w-2 h-2 rounded-full mr-3 ${selectedDrone === drone ? 'bg-indigo-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                      <span className="text-xs font-bold text-white">{drone}</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400">Sector 4</span>
                              </div>
                          ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-black/40 rounded border border-white/10">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">{t('intel_detected')}</h4>
                          <div className="space-y-1 text-[10px] text-white font-mono">
                              <div className="flex justify-between"><span>Vehicle (Truck)</span><span className="text-amber-500">88%</span></div>
                              <div className="flex justify-between"><span>Personnel (Armed)</span><span className="text-rose-500">92%</span></div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: CYBER COMMAND */}
          {activeTab === 'cyber' && (
              <div className="bg-[#0c0c0c] font-mono text-xs p-4 rounded-lg border border-emerald-500/30 overflow-hidden flex flex-col min-h-[500px] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <div className="flex justify-between items-center border-b border-emerald-900/50 pb-2 mb-2">
                      <span className="text-emerald-500 font-bold tracking-widest">{t('intel_terminal')}</span>
                      <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 p-2 max-h-[400px] custom-scrollbar" onClick={() => document.getElementById('terminal-input')?.focus()}>
                      {terminalHistory.map((line, i) => (
                          <div key={i} className={`whitespace-pre-wrap ${line.startsWith('root') ? 'text-blue-400' : line.includes('Error') ? 'text-rose-500' : 'text-emerald-400'}`}>
                              <SafeRender content={line} />
                          </div>
                      ))}
                      {terminalProcessing && <div className="text-emerald-500 animate-pulse">_</div>}
                      <div ref={terminalEndRef} />
                  </div>
                  <div className="flex items-center mt-2 border-t border-emerald-900/50 pt-2">
                      <span className="text-blue-400 mr-2">root@endf-cyber:~#</span>
                      <input 
                          id="terminal-input"
                          type="text" 
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={handleTerminalCommand}
                          className="flex-1 bg-transparent border-none focus:outline-none text-white caret-emerald-500"
                          autoFocus
                          autoComplete="off"
                          disabled={terminalProcessing}
                      />
                  </div>
              </div>
          )}

          {/* TAB: SIGINT */}
          {activeTab === 'sigint' && (
              <div className="flex flex-col space-y-6 h-full overflow-y-auto">
                  <div className="glass-panel rounded-lg p-6 border border-white/10 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg text-white flex items-center">
                              <Radio className="mr-2 text-sky-400" size={20} /> {t('intel_sig_live')}
                          </h3>
                          <span className="text-[10px] bg-rose-900/50 text-rose-300 px-2 py-1 rounded border border-rose-900 animate-pulse">RECORDING</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[400px] custom-scrollbar">
                          {sigintFeed.map(sig => (
                              <div key={sig.id} className="bg-white/5 p-3 rounded border border-white/5 flex items-start space-x-3 animate-in slide-in-from-left-2 hover:bg-white/10 transition-colors">
                                  <div className="mt-1">
                                      {sig.type === 'voice' ? <Radio size={14} className="text-blue-400"/> : <Wifi size={14} className="text-gray-400"/>}
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
                                          <span>{sig.freq}</span>
                                          <span>{t(sig.sourceKey as any)}</span>
                                      </div>
                                      <p className={`text-xs font-mono ${sig.type === 'voice' ? 'text-white' : 'text-gray-500 italic'}`}>
                                          {t(sig.contentKey as any)}
                                      </p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  {/* Frequency Visualizer (Fake) */}
                  <div className="h-24 bg-[#050b14] rounded-lg border border-sky-900/50 relative overflow-hidden shadow-inner flex-shrink-0">
                      <div className="absolute inset-0 flex items-end justify-between px-1">
                          {[...Array(60)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1 bg-sky-500/50 rounded-t transition-all duration-100"
                                style={{ 
                                    height: `${Math.random() * 80 + 5}%`,
                                    opacity: Math.random() * 0.8 + 0.2
                                }}
                              ></div>
                          ))}
                      </div>
                      <div className="absolute top-2 left-2 text-[10px] text-sky-500 font-mono">SPECTRUM ANALYZER [VHF/UHF]</div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default IntelligenceView;

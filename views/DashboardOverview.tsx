
import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import { Activity, Users, ShieldAlert, Truck, Radio, Target, BrainCircuit, RefreshCw, AlertTriangle, Satellite, Wifi, Globe, Zap, MapPin, Maximize2, LayoutGrid, Video, Crosshair, Eye, GraduationCap, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getStrategicForecast } from '../services/aiService';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';
import TacticalMap from '../components/TacticalMap';

interface DashboardOverviewProps {
    onNavigate: (view: ViewState) => void;
    defcon: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, defcon }) => {
  const { t, language } = useLanguage();
  const [sitRoomMode, setSitRoomMode] = useState(false);
  const [telemetryData, setTelemetryData] = useState([
    { name: '00:00', readiness: 85, threats: 12 },
    { name: '04:00', readiness: 86, threats: 15 },
    { name: '08:00', readiness: 89, threats: 10 },
    { name: '12:00', readiness: 88, threats: 8 },
    { name: '16:00', readiness: 90, threats: 14 },
    { name: '20:00', readiness: 87, threats: 11 },
    { name: '24:00', readiness: 88, threats: 9 },
  ]);
  const [forecast, setForecast] = useState<string | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [userCoords, setUserCoords] = useState<string>("Locating...");

  // Live Telemetry Simulation
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTelemetryData(prevData => {
        const lastItem = prevData[prevData.length - 1];
        const newReadiness = Math.min(100, Math.max(70, lastItem.readiness + (Math.random() - 0.5) * 5));
        const newThreats = Math.max(0, Math.min(50, lastItem.threats + (Math.random() - 0.5) * 4));
        
        const now = new Date();
        const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newData = [...prevData.slice(1), { name: timeLabel, readiness: parseFloat(newReadiness.toFixed(1)), threats: parseFloat(newThreats.toFixed(1)) }];
        return newData;
      });
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      handleRefreshForecast();
      
      // Get Geolocation with proper error handling
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserCoords(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
              },
              (error) => {
                  console.warn("Geolocation warning:", error.message);
                  setUserCoords("GPS SIGNAL LOST");
              },
              { timeout: 10000, maximumAge: 60000 }
          );
      } else {
          setUserCoords("GPS N/A");
      }
  }, [language]);

  const handleRefreshForecast = async () => {
      setLoadingForecast(true);
      const data = await getStrategicForecast(language);
      setForecast(data);
      setLoadingForecast(false);
  }

  const isForecastError = forecast?.includes("offline") || forecast?.includes("unavailable");

  // Situation Room View
  if (sitRoomMode) {
      return (
          <div className="h-full flex flex-col space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-center bg-red-950/40 p-2 rounded-xl border border-red-500/30 shrink-0 backdrop-blur-md">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                      <span className="text-red-500 font-bold text-lg animate-pulse tracking-widest font-display px-2">ENDF JOINT CMD :: SITUATION ROOM</span>
                      <span className="text-xs text-red-100 font-mono bg-red-600 px-2 py-0.5 rounded shadow-lg shadow-red-500/20">DEFCON {defcon}</span>
                  </div>
                  <div className="text-xs text-red-200/70 font-mono hidden md:block">
                      LOC: {userCoords}
                  </div>
                  <button 
                    onClick={() => setSitRoomMode(false)}
                    className="bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs flex items-center border border-slate-600 font-sans transition-colors"
                  >
                      <LayoutGrid size={14} className="mr-2" /> EXIT SITROOM
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto">
                  {/* Top Left: Tactical Map */}
                  <div className="bg-black rounded-xl border border-slate-700 relative overflow-hidden flex flex-col min-h-[300px] shadow-2xl">
                      <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 rounded text-[10px] text-green-400 font-bold font-mono border border-green-800/50 backdrop-blur">LIVE OPS MAP</div>
                      <div className="flex-1">
                          <TacticalMap holoMode={true} />
                      </div>
                  </div>

                  {/* Top Right: Live Drone Feed */}
                  <div className="bg-black rounded-xl border border-slate-700 relative overflow-hidden flex flex-col min-h-[300px] shadow-2xl">
                      <div className="absolute top-2 left-2 z-10 bg-red-600/80 px-2 rounded text-[10px] text-white font-bold animate-pulse font-mono backdrop-blur">UAV-09 FEED</div>
                      <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Crosshair size={48} className="text-green-500/50" strokeWidth={1} />
                      </div>
                  </div>

                  {/* Bottom Left: Comms Waterfall */}
                  <div className="bg-black/80 rounded-xl border border-slate-700 p-4 overflow-hidden relative min-h-[200px] backdrop-blur-md">
                      <div className="absolute top-2 left-2 text-[10px] text-yellow-500 font-bold font-mono">ENCRYPTED COMMS STREAM</div>
                      <div className="mt-6 space-y-1 font-mono text-[10px] text-green-400/90">
                          <p>[10:42:12] ALPHA-1 &gt; CMD: Reached waypoint. Holding.</p>
                          <p>[10:42:15] BRAVO-6 &gt; CMD: Visual on target. Awaiting green light.</p>
                          <p>[10:42:18] INTEL &gt; ALL: Signal spike detected Sector 4.</p>
                          <p className="text-red-400 animate-pulse">[10:42:22] ALERT: Unidentified aircraft bearing 220.</p>
                          <p>[10:42:25] AIR &gt; CMD: Scrambling interceptors.</p>
                          <p>[10:42:30] LOG &gt; BASE: Convoy delayed. Rerouting.</p>
                          <p>[10:42:35] SAT &gt; LINK: Handshake complete. High bandwidth active.</p>
                      </div>
                  </div>

                  {/* Bottom Right: Threat Radar */}
                  <div className="bg-black/90 rounded-xl border border-slate-700 relative flex items-center justify-center min-h-[200px] backdrop-blur-xl">
                      <div className="absolute top-2 left-2 text-[10px] text-blue-400 font-bold font-mono">THREAT RADAR</div>
                      <div className="w-48 h-48 rounded-full border border-green-500/30 relative flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                          <div className="absolute w-full h-full rounded-full border border-green-500/10 animate-ping" style={{animationDuration: '3s'}}></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                          {/* Blips */}
                          <div className="absolute top-10 right-10 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                          <div className="absolute bottom-12 left-14 w-2 h-2 bg-yellow-500 rounded-full"></div>
                          {/* Sweep */}
                          <div className="absolute w-24 h-24 top-0 left-0 origin-bottom-right bg-gradient-to-t from-transparent to-green-500/30 animate-spin" style={{animationDuration: '4s'}}></div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight font-display">{t('dash_title')}</h2>
          <div className="flex items-center space-x-2 mt-1">
              <p className="text-slate-400 text-xs font-sans">{t('dash_subtitle')}</p>
              <span className="text-slate-600 text-xs">•</span>
              <div className="flex items-center text-[10px] text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  <MapPin size={10} className="mr-1"/> {userCoords}
              </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <button 
                onClick={() => setSitRoomMode(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg flex items-center shadow-lg shadow-red-900/40 transition-all border border-red-500/50 font-display tracking-wider hover:scale-105"
            >
                <Maximize2 size={12} className="mr-2" /> SITROOM
            </button>
            <div className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-lg flex items-center shadow-[0_0_15px_rgba(16,185,129,0.1)] font-mono">
                <Activity size={10} className="mr-2 animate-pulse text-emerald-300" />
                {t('dash_live_feed')}
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-6 pb-6">
            {/* Strategic Goals Cards - More Colorful */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-3 rounded-xl flex items-center transition-transform hover:scale-[1.01] cursor-default bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-l-4 border-blue-500">
                    <div className="p-2.5 rounded-full bg-blue-500/20 text-blue-300 mr-3 border border-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]"><Users size={18} /></div>
                    <div>
                        <h4 className="font-bold text-white text-xs">Ethical Leadership</h4>
                        <p className="text-[10px] text-slate-400">Data-driven personnel development.</p>
                    </div>
                </div>
                <div className="glass-panel p-3 rounded-xl flex items-center transition-transform hover:scale-[1.01] cursor-default bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-l-4 border-emerald-500">
                    <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-300 mr-3 border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><Eye size={18} /></div>
                    <div>
                        <h4 className="font-bold text-white text-xs">Situational Awareness</h4>
                        <p className="text-[10px] text-slate-400">Real-time intelligence picture.</p>
                    </div>
                </div>
                <div className="glass-panel p-3 rounded-xl flex items-center transition-transform hover:scale-[1.01] cursor-default bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-l-4 border-purple-500">
                    <div className="p-2.5 rounded-full bg-purple-500/20 text-purple-300 mr-3 border border-purple-400/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><BrainCircuit size={18} /></div>
                    <div>
                        <h4 className="font-bold text-white text-xs">Optimal Decisions</h4>
                        <p className="text-[10px] text-slate-400">AI-driven predictive analysis.</p>
                    </div>
                </div>
            </div>

            {/* System Uplink Matrix - Glass Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div 
                    onClick={() => onNavigate(ViewState.SPACE_COMMAND)}
                    className="glass-panel px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group border border-purple-500/30"
                >
                    <div className="flex items-center space-x-2">
                        <Satellite size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-300 font-display tracking-wider group-hover:text-white">SPACE CMD</span>
                    </div>
                    <span className="text-[9px] text-green-400 font-mono shadow-green-500/20 drop-shadow">LINKED</span>
                </div>
                <div 
                    onClick={() => onNavigate(ViewState.AI_NEXUS)}
                    className="glass-panel px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group border border-cyan-500/30"
                >
                    <div className="flex items-center space-x-2">
                        <BrainCircuit size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-300 font-display tracking-wider group-hover:text-white">AI NEXUS</span>
                    </div>
                    <span className="text-[9px] text-green-400 font-mono">ONLINE</span>
                </div>
                <div 
                    onClick={() => onNavigate(ViewState.COMMUNICATIONS)}
                    className="glass-panel px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group border border-yellow-500/30"
                >
                    <div className="flex items-center space-x-2">
                        <Wifi size={14} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-300 font-display tracking-wider group-hover:text-white">GLOBENET</span>
                    </div>
                    <span className="text-[9px] text-green-400 font-mono">SECURE</span>
                </div>
                <div 
                    onClick={() => onNavigate(ViewState.INTELLIGENCE)}
                    className="glass-panel px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group border border-red-500/30"
                >
                    <div className="flex items-center space-x-2">
                        <ShieldAlert size={14} className="text-red-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-300 font-display tracking-wider group-hover:text-white">CYBER DEF</span>
                    </div>
                    <span className="text-[9px] text-yellow-400 font-mono animate-pulse">ALERT</span>
                </div>
            </div>

            {/* Interactive Top Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard 
                    title={t('dash_readiness')} 
                    value={`${telemetryData[telemetryData.length-1].readiness}%`} 
                    change={1.2} 
                    icon={Activity} 
                    color="success" 
                    onClick={() => onNavigate(ViewState.OPERATIONS)}
                />
                <MetricCard 
                    title={t('dash_personnel')} 
                    value="162,040" 
                    change={0.5} 
                    icon={Users} 
                    color="accent"
                    onClick={() => onNavigate(ViewState.HR)}
                />
                <MetricCard 
                    title={t('dash_threats')} 
                    value={Math.floor(telemetryData[telemetryData.length-1].threats).toString()} 
                    change={-20} 
                    icon={ShieldAlert} 
                    color="danger" 
                    onClick={() => onNavigate(ViewState.INTELLIGENCE)}
                />
                <MetricCard 
                    title={t('dash_logistics')} 
                    value="94.5%" 
                    change={2.1} 
                    icon={Truck} 
                    color="warning" 
                    onClick={() => onNavigate(ViewState.LOGISTICS)}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Chart Area */}
                <div className="lg:col-span-2 glass-panel p-4 rounded-xl border border-white/5 flex flex-col shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-white flex items-center font-display">
                        <Activity className="mr-2 text-cyan-400" size={16}/> 
                        {t('dash_chart_main')}
                        </h3>
                        <div className="flex space-x-3">
                            <span className="flex items-center text-[10px] text-slate-400 font-mono"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 shadow-[0_0_5px_#34d399]"></div> Readiness</span>
                            <span className="flex items-center text-[10px] text-slate-400 font-mono"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 shadow-[0_0_5px_#ef4444]"></div> Threats</span>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={telemetryData}>
                            <defs>
                            <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} fontFamily="monospace" />
                            <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', backdropFilter: 'blur(8px)', fontSize: '11px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReadiness)" isAnimationActive={false} />
                            <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" isAnimationActive={false} />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI & Alerts Side Panel */}
                <div className="space-y-4">
                    {/* AI Status */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden flex flex-col min-h-[180px] shadow-xl bg-gradient-to-br from-purple-900/20 to-transparent">
                        <div className="absolute -top-10 -right-10 p-4 opacity-10">
                            <BrainCircuit size={120} className="text-purple-500" />
                        </div>
                        <div className="flex justify-between items-center mb-3 z-10">
                            <h3 className="font-semibold text-sm text-white flex items-center font-display">
                            <BrainCircuit className="mr-2 text-purple-400" size={16} />
                            {t('dash_ai_forecast')}
                            </h3>
                            <button onClick={handleRefreshForecast} disabled={loadingForecast} className="text-slate-400 hover:text-white transition-colors">
                                <RefreshCw size={12} className={loadingForecast ? "animate-spin" : ""} />
                            </button>
                        </div>
                        
                        <div className="flex-1 relative z-10 bg-black/30 rounded-lg border border-purple-500/20 p-3 text-xs text-slate-300 shadow-inner overflow-y-auto max-h-[150px] custom-scrollbar">
                            {loadingForecast ? (
                                <div className="flex items-center justify-center h-full space-x-2 text-purple-400">
                                    <BrainCircuit size={14} className="animate-pulse" />
                                    <span className="font-mono">{t('intel_scan_btn')}</span>
                                </div>
                            ) : isForecastError ? (
                                <div className="flex flex-col items-center justify-center h-full text-amber-500 p-2 text-center">
                                    <AlertTriangle size={20} className="mb-1" />
                                    <span className="font-bold text-[10px] font-mono">AI OFFLINE</span>
                                    <p className="text-[9px] text-slate-400 mt-1 font-sans">Network unavailable or API key restricted. Displaying last cached metrics.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 whitespace-pre-line text-[11px] animate-in fade-in font-sans leading-relaxed">
                                    {forecast}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Training Quick Link Widget */}
                    <div 
                        onClick={() => onNavigate(ViewState.TRAINING)}
                        className="glass-panel p-3 rounded-xl border border-white/5 hover:border-lime-500/50 cursor-pointer transition-all shadow-lg group relative overflow-hidden bg-gradient-to-br from-lime-900/20 to-transparent"
                    >
                        <div className="absolute -right-4 -top-4 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GraduationCap size={70} className="text-lime-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-1 flex items-center font-display relative z-10 text-sm">
                            <GraduationCap className="mr-2 text-lime-400" size={16} /> Education Cmd
                        </h3>
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <p className="text-[10px] text-slate-400">Next Cycle: 12 Oct</p>
                                <p className="text-[10px] text-lime-400 font-bold">Recruits: 12,500</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center group-hover:bg-lime-500 group-hover:text-black transition-colors">
                                <ChevronRight size={14} className="text-lime-400 group-hover:text-black" />
                            </div>
                        </div>
                    </div>

                    {/* Active Theaters */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 shadow-xl">
                        <h3 className="font-semibold text-sm text-white mb-3 flex items-center font-display">
                        <MapPin className="mr-2 text-cyan-400" size={16} />
                        Active Theaters
                        </h3>
                        <div className="space-y-2">
                        <div 
                            onClick={() => onNavigate(ViewState.ENGINEERING)}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg border-l-2 border-emerald-500 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div>
                            <h4 className="text-[11px] font-bold text-white font-sans">GERD Defense Zone</h4>
                            <p className="text-[9px] text-slate-400 font-mono">Air Defense: Active</p>
                            </div>
                            <ShieldAlert size={12} className="text-emerald-500" />
                        </div>
                        <div 
                            onClick={() => onNavigate(ViewState.PEACEKEEPING)}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg border-l-2 border-amber-500 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div>
                            <h4 className="text-[11px] font-bold text-white font-sans">Somalia (ATMIS)</h4>
                            <p className="text-[9px] text-slate-400 font-mono">Sector 3: High Alert</p>
                            </div>
                            <AlertTriangle size={12} className="text-amber-500" />
                        </div>
                        <div 
                            onClick={() => onNavigate(ViewState.OPERATIONS)}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg border-l-2 border-blue-500 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div>
                            <h4 className="text-[11px] font-bold text-white font-sans">Northern Border</h4>
                            <p className="text-[9px] text-slate-400 font-mono">Patrols: Routine</p>
                            </div>
                            <Activity size={12} className="text-blue-500" />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

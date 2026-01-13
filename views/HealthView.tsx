
import React, { useState, useEffect } from 'react';
import { HeartPulse, Stethoscope, Ambulance, Activity, X, Siren, MapPin, Building, Package, BrainCircuit, Moon, AlertTriangle, ShieldCheck, UserCheck, Plus } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { getAIContextInsight } from '../services/aiService';

interface MedevacMission {
    id: string;
    location: string;
    type: 'Air (Helo)' | 'Ground (Ambulance)';
    status: 'Dispatched' | 'En Route' | 'Retrieving' | 'Returning';
    patients: number;
    eta: string;
}

interface HealthViewProps {
    onBack?: () => void;
}

const HealthView: React.FC<HealthViewProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'logistics' | 'resilience'>('overview');
  const [triageStats, setTriageStats] = useState({ critical: 4, serious: 12, minor: 45 });
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [missions, setMissions] = useState<MedevacMission[]>([
      { id: 'MED-992', location: 'Sector 4', type: 'Air (Helo)', status: 'Returning', patients: 2, eta: '12m' }
  ]);
  const [aiInsight, setAiInsight] = useState<string>("Click to analyze unit stress levels.");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  // 6.2 Resilience Data
  const stressData = [
      { unit: '3rd Div', stress: 78, sleep: 5.5, fatigue: 82 },
      { unit: 'Agazi', stress: 65, sleep: 6.2, fatigue: 60 },
      { unit: '4th Mech', stress: 45, sleep: 7.0, fatigue: 40 },
      { unit: 'Air Wing', stress: 55, sleep: 6.5, fatigue: 50 },
  ];

  const trendData = [
      { day: 'Mon', risk: 30 }, { day: 'Tue', risk: 32 }, { day: 'Wed', risk: 45 },
      { day: 'Thu', risk: 42 }, { day: 'Fri', risk: 68 }, { day: 'Sat', risk: 65 },
  ];
  
  const facilities = [
      { name: 'Armed Forces General Hospital', loc: 'Addis Ababa', beds: 400, occupied: 345, status: 'Operational' },
      { name: 'Northern Command Referral', loc: 'Mekelle', beds: 150, occupied: 98, status: 'High Load' },
      { name: 'Air Force Hospital', loc: 'Bishoftu', beds: 80, occupied: 20, status: 'Operational' },
  ];

  // Dispatch Form State
  const [dispatchLoc, setDispatchLoc] = useState('Sector 1');
  const [dispatchType, setDispatchType] = useState<MedevacMission['type']>('Ground (Ambulance)');

  // Simulate Live Triage Updates
  useEffect(() => {
    const interval = window.setInterval(() => {
        setTriageStats(prev => ({
            critical: Math.max(0, prev.critical + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
            serious: Math.max(0, prev.serious + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : -1) : 0)),
            minor: Math.max(0, prev.minor + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 3 : -2) : 0)),
        }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRunBioAnalysis = async () => {
      setLoadingInsight(true);
      try {
          const insight = await getAIContextInsight("Biometric Unit Fatigue", { current_data: stressData, trend: trendData });
          setAiInsight(insight);
      } catch (e) {
          setAiInsight("Unable to connect to Medical AI Core.");
      }
      setLoadingInsight(false);
  }

  const handleDispatch = (e: React.FormEvent) => {
      e.preventDefault();
      const newMission: MedevacMission = {
          id: `MED-${Math.floor(Math.random() * 9000) + 1000}`,
          location: dispatchLoc,
          type: dispatchType,
          status: 'Dispatched',
          patients: 1,
          eta: 'Calculating...'
      };
      setMissions(prev => [newMission, ...prev]);
      setShowDispatchModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('health_title')}</h2>
          <p className="text-gray-400 text-sm font-sans">{t('health_subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
            <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Activity size={14} className="mr-2"/> OVERVIEW
                </button>
                <button 
                    onClick={() => setActiveTab('facilities')}
                    className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'facilities' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Building size={14} className="mr-2"/> FACILITIES
                </button>
                <button 
                    onClick={() => setActiveTab('resilience')}
                    className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'resilience' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <BrainCircuit size={14} className="mr-2"/> {t('health_tab_resilience')}
                </button>
            </div>
            
            <button 
                onClick={() => setShowDispatchModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center shadow-lg animate-pulse"
            >
                <Siren size={14} className="mr-2" /> {t('health_dispatch_btn')}
            </button>

            {onBack && (
                <button onClick={onBack} className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors" title="Exit / Back">
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <MetricCard title={t('health_metric_readiness')} value="92%" change={0.5} icon={HeartPulse} color="success" />
        <MetricCard title={t('health_metric_capacity')} value="85%" change={2.1} icon={Building} color="warning" />
        <MetricCard title={t('health_metric_medevac')} value={missions.length.toString()} icon={Ambulance} color="danger" />
        <MetricCard title={t('health_stress_index')} value="Medium" icon={BrainCircuit} color="accent" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                      <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                          <Activity className="mr-2 text-red-500" size={20} /> {t('health_triage')}
                      </h3>
                      <div className="space-y-4">
                          <div className="bg-red-900/20 p-4 rounded border border-red-500/30 flex justify-between items-center">
                              <span className="text-red-400 font-bold">CRITICAL</span>
                              <span className="text-3xl font-bold text-white">{triageStats.critical}</span>
                          </div>
                          <div className="bg-yellow-900/20 p-4 rounded border border-yellow-500/30 flex justify-between items-center">
                              <span className="text-yellow-400 font-bold">SERIOUS</span>
                              <span className="text-3xl font-bold text-white">{triageStats.serious}</span>
                          </div>
                          <div className="bg-green-900/20 p-4 rounded border border-green-500/30 flex justify-between items-center">
                              <span className="text-green-400 font-bold">WALKING WOUNDED</span>
                              <span className="text-3xl font-bold text-white">{triageStats.minor}</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                      <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                          <Ambulance className="mr-2 text-blue-500" size={20} /> {t('health_operations')}
                      </h3>
                      <div className="flex-1 overflow-y-auto space-y-3">
                          {missions.map(mission => (
                              <div key={mission.id} className="p-3 bg-military-900 rounded border border-military-600 flex justify-between items-center">
                                  <div>
                                      <h4 className="font-bold text-sm text-white">{mission.id}</h4>
                                      <p className="text-xs text-gray-400">{mission.type} • {mission.location}</p>
                                  </div>
                                  <div className="text-right">
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                          mission.status === 'Dispatched' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'
                                      }`}>{mission.status}</span>
                                      <p className="text-xs text-gray-400 mt-1">ETA: {mission.eta}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: FACILITIES */}
          {activeTab === 'facilities' && (
              <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-full overflow-y-auto">
                  <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                      <Building className="mr-2 text-green-500" size={20} /> Medical Facility Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {facilities.map((fac, i) => (
                          <div key={i} className="bg-military-900 p-4 rounded border border-military-600 hover:border-green-500 transition-colors">
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h4 className="font-bold text-white text-sm">{fac.name}</h4>
                                      <p className="text-xs text-gray-400 flex items-center mt-1"><MapPin size={10} className="mr-1"/> {fac.loc}</p>
                                  </div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                      fac.status === 'Operational' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                                  }`}>{fac.status}</span>
                              </div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Occupancy</span>
                                      <span className={`${fac.occupied / fac.beds > 0.9 ? 'text-red-500' : 'text-green-500'}`}>{Math.round((fac.occupied / fac.beds) * 100)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-800 h-2 rounded-full">
                                      <div 
                                          className={`h-2 rounded-full ${fac.occupied / fac.beds > 0.9 ? 'bg-red-500' : 'bg-green-500'}`} 
                                          style={{ width: `${(fac.occupied / fac.beds) * 100}%` }}
                                      ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 text-right">{fac.occupied} / {fac.beds} Beds</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* TAB: RESILIENCE (6.2) */}
          {activeTab === 'resilience' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                  <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-semibold text-lg text-white flex items-center">
                              <BrainCircuit className="mr-2 text-purple-500" size={20} /> {t('health_bio_analysis')}
                          </h3>
                          <button onClick={handleRunBioAnalysis} disabled={loadingInsight} className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">
                              {loadingInsight ? "ANALYZING..." : "RUN AI BIO-SCAN"}
                          </button>
                      </div>
                      <div className="flex-1 w-full min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stressData} layout="vertical">
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                  <XAxis type="number" stroke="#94a3b8" />
                                  <YAxis dataKey="unit" type="category" width={80} stroke="#94a3b8" fontSize={11} />
                                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                  <Bar dataKey="stress" name="Stress Level" fill="#ef4444" barSize={15} />
                                  <Bar dataKey="fatigue" name="Fatigue Index" fill="#eab308" barSize={15} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="flex flex-col gap-6">
                      <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                          <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                              <Moon className="mr-2 text-blue-500" size={20} /> {t('health_early_warn')}
                          </h3>
                          <div className="h-40 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={trendData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                      <YAxis stroke="#94a3b8" fontSize={10} />
                                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                      <Line type="monotone" dataKey="risk" stroke="#a855f7" strokeWidth={2} name="PTSD Risk Marker" />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                          <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">
                              <strong>AI Insight:</strong> {aiInsight}
                          </div>
                      </div>

                      <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                          <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                              <ShieldCheck className="mr-2 text-green-500" size={20} /> {t('health_anon_portal')}
                          </h3>
                          <div className="flex items-center justify-between bg-military-900 p-4 rounded border border-military-600">
                              <div>
                                  <h4 className="text-sm font-bold text-white">Mental Health Support</h4>
                                  <p className="text-xs text-gray-400">Encrypted, anonymous counseling request.</p>
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold">
                                  CONNECT
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-military-900 border border-military-600 rounded-lg w-full max-w-md shadow-2xl animate-in zoom-in-95">
                  <div className="p-4 border-b border-military-700 flex justify-between items-center">
                      <h3 className="font-bold text-white flex items-center">
                          <Siren className="mr-2 text-red-500" /> {t('health_dispatch_btn')}
                      </h3>
                      <button onClick={() => setShowDispatchModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleDispatch} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('health_target_loc')}</label>
                          <select 
                              value={dispatchLoc} 
                              onChange={(e) => setDispatchLoc(e.target.value)}
                              className="w-full bg-black border border-military-600 rounded p-2 text-white text-sm"
                          >
                              <option>Sector 1 (North)</option>
                              <option>Sector 2 (East)</option>
                              <option>Sector 3 (West)</option>
                              <option>Base Alpha (Training)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('health_asset_type')}</label>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                type="button"
                                onClick={() => setDispatchType('Air (Helo)')}
                                className={`p-3 rounded border text-sm font-bold flex flex-col items-center ${dispatchType === 'Air (Helo)' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-military-800 border-military-600 text-gray-400'}`}
                              >
                                  <Activity size={20} className="mb-1" /> {t('health_air_evac')}
                              </button>
                              <button 
                                type="button"
                                onClick={() => setDispatchType('Ground (Ambulance)')}
                                className={`p-3 rounded border text-sm font-bold flex flex-col items-center ${dispatchType === 'Ground (Ambulance)' ? 'bg-green-600 border-green-400 text-white' : 'bg-military-800 border-military-600 text-gray-400'}`}
                              >
                                  <Ambulance size={20} className="mb-1" /> {t('health_ground_unit')}
                              </button>
                          </div>
                      </div>
                      <div className="pt-4 border-t border-military-700">
                          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded flex items-center justify-center">
                              <Siren size={16} className="mr-2 animate-pulse" /> {t('health_confirm_btn')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default HealthView;

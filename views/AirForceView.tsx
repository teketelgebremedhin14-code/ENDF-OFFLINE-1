
import React, { useState } from 'react';
import { Plane, Radio, Map, Crosshair, Users, Activity, Globe, Shield, Zap, TrendingUp, Handshake, Info, Target, CloudRain, Clock, Database, ChevronRight, PenTool, CheckCircle, AlertTriangle, Edit3, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from 'recharts';

interface AirForceViewProps {
    onBack?: () => void;
}

const AirForceView: React.FC<AirForceViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'ops' | 'future'>('overview');
    const [selectedBase, setSelectedBase] = useState<string | null>(null);

    // III. Capabilities & Inventory Data
    const fleetData = [
        { name: 'Su-27/UB', type: 'Fighter', count: 12, role: t('role_air_sup'), gen: '4th' },
        { name: 'Su-30K', type: 'Multirole', count: 2, role: t('role_deep_strike'), gen: '4th+' }, // Recent acquisition
        { name: 'MiG-23', type: 'Attack', count: 8, role: t('role_ground_att'), gen: '3rd' },
        { name: 'L-39', type: 'Trainer/COIN', count: 10, role: t('role_training'), gen: '3rd' },
        { name: 'C-130/L-100', type: 'Transport', count: 3, role: t('role_transport'), gen: 'N/A' },
        { name: 'Mi-24/35', type: 'Helo', count: 18, role: t('role_cas'), gen: 'N/A' },
        { name: 'Mi-17', type: 'Helo', count: 20, role: t('role_transport'), gen: 'N/A' },
        { name: 'Akıncı', type: 'UAV', count: 4, role: t('role_deep_strike'), gen: 'Modern' },
        { name: 'TB2', type: 'UAV', count: 6, role: t('role_cas'), gen: 'Modern' },
        { name: 'Wing Loong', type: 'UAV', count: 4, role: t('role_isr'), gen: 'Modern' },
    ];

    // V. Operations & Readiness Data
    const readinessMetrics = [
        { subject: 'Mission Capable', A: 78, fullMark: 100 }, // Aging fleet affects this
        { subject: 'Sortie Gen', A: 85, fullMark: 100 },
        { subject: 'Logistics', A: 70, fullMark: 100 },
        { subject: 'Training', A: 90, fullMark: 100 }, // High quality training history
        { subject: 'Base Def', A: 95, fullMark: 100 },
        { subject: 'Munitions', A: 82, fullMark: 100 },
    ];

    const flightHours = [
        { month: 'Jan', hours: 1200 }, { month: 'Feb', hours: 1350 }, 
        { month: 'Mar', hours: 1280 }, { month: 'Apr', hours: 1450 }, 
        { month: 'May', hours: 1600 }, { month: 'Jun', hours: 1550 }
    ];

    // VI. Alliances & Partnerships Data
    const partners = [
        { country: t('foreign_country_russia'), role: 'Legacy Fleet (Su-27, MiG)', status: 'Main Supplier' },
        { country: t('foreign_country_turkey'), role: 'Drone Tech (TB2, Akinci)', status: 'Strategic' },
        { country: t('foreign_country_china'), role: 'UAVs (Wing Loong)', status: 'Partner' },
        { country: 'Iran', role: 'Loitering Munitions', status: 'Emerging' },
        { country: 'USA/West', role: 'Transport/Training (Legacy)', status: 'Limited' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            {/* Header with Strategic Context (I. Foundational & Strategic Role) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('air_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">Cmdr: Lt. Gen. Yilma Merdasa • HQ: Bishoftu</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'overview' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Map size={14} className="mr-2"/> STRAT & ORG
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'inventory' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Plane size={14} className="mr-2"/> FLEET (CAPS)
                        </button>
                        <button 
                            onClick={() => setActiveTab('ops')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'ops' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Activity size={14} className="mr-2"/> OPS & PERSONNEL
                        </button>
                        <button 
                            onClick={() => setActiveTab('future')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'future' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <TrendingUp size={14} className="mr-2"/> FUTURE & ALLIANCES
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
                <MetricCard title="Total Inventory" value="~103" change={2} icon={Plane} color="accent" />
                <MetricCard title="Mission Capable" value="78%" change={-1.5} icon={Activity} color="warning" />
                <MetricCard title="Active Personnel" value="~5,000" icon={Users} color="success" />
                <MetricCard title="Drone Sorties" value="High" change={15} icon={Radio} color="purple" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* TAB 1: OVERVIEW (STRATEGY & ORG) */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto lg:overflow-hidden">
                        {/* I. Foundational Role - Doctrine */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-96 lg:h-auto">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Target className="mr-2 text-cyan-500" size={20} /> Foundational Role & Doctrine
                            </h3>
                            <div className="space-y-4 text-sm text-gray-300">
                                <div className="p-3 bg-military-900 rounded border-l-4 border-cyan-500">
                                    <h4 className="font-bold text-white mb-1">Primary Mission</h4>
                                    <p className="text-xs">Territorial Defense & Sovereignty Protection. Critical focus on protecting the Grand Ethiopian Renaissance Dam (GERD) against aerial threats.</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-green-500">
                                    <h4 className="font-bold text-white mb-1">Operational Support</h4>
                                    <p className="text-xs">Providing Close Air Support (CAS) to ground forces in counter-insurgency operations (North/West).</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-purple-500">
                                    <h4 className="font-bold text-white mb-1">Strategic Shift</h4>
                                    <p className="text-xs">Moving from legacy interceptor doctrine to a modern, drone-centric asymmetric strike capability.</p>
                                </div>
                            </div>
                        </div>

                        {/* II. Organization & Structure - Map */}
                        <div className="lg:col-span-2 bg-[#0f172a] rounded-lg border border-military-700 relative overflow-hidden group min-h-[400px]">
                            <div className="absolute top-4 left-4 z-10 bg-black/60 px-3 py-1 rounded border-l-2 border-cyan-500">
                                <h4 className="text-xs font-bold text-cyan-400">AIR BASE NETWORK</h4>
                                <p className="text-[10px] text-gray-400">Strategic Positioning</p>
                            </div>

                            <svg viewBox="0 0 800 600" className="w-full h-full opacity-80">
                                {/* Ethiopia Abstract Shape */}
                                <path d="M 200 150 L 450 120 L 650 250 L 550 500 L 250 550 L 150 400 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                                
                                {/* Bases */}
                                {[
                                    { id: 'base-bishoftu', name: 'Harar Meda (HQ)', x: 400, y: 320, type: 'Main' },
                                    { id: 'base-diredawa', name: 'Dire Dawa AB', x: 550, y: 280, type: 'Forward' },
                                    { id: 'base-mekelle', name: 'Alula Aba Nega', x: 380, y: 180, type: 'Forward' },
                                    { id: 'base-bahirdar', name: 'Bahir Dar AB', x: 280, y: 250, type: 'Forward' }
                                ].map(base => (
                                    <g 
                                        key={base.id} 
                                        className="cursor-pointer hover:opacity-100 transition-opacity opacity-80"
                                        onClick={() => setSelectedBase(base.name)}
                                    >
                                        <circle cx={base.x} cy={base.y} r={base.type === 'Main' ? 8 : 5} fill={base.type === 'Main' ? '#06b6d4' : '#22c55e'} />
                                        <circle cx={base.x} cy={base.y} r={base.type === 'Main' ? 12 : 8} fill="none" stroke={base.type === 'Main' ? '#06b6d4' : '#22c55e'} strokeWidth="1" className="animate-ping" />
                                        <text x={base.x + 15} y={base.y + 4} fill="white" fontSize="10" fontWeight="bold">{base.name}</text>
                                    </g>
                                ))}
                            </svg>

                            {selectedBase && (
                                <div className="absolute bottom-4 right-4 bg-military-900/90 p-4 rounded border border-cyan-500/50 w-64 animate-in slide-in-from-right-4">
                                    <h4 className="font-bold text-white text-sm mb-2">{selectedBase}</h4>
                                    <div className="space-y-1 text-xs text-gray-300">
                                        <p><strong>Role:</strong> {selectedBase.includes('HQ') ? 'Central Command & Logistics' : 'Forward Operating Base'}</p>
                                        <p><strong>Key Assets:</strong> {selectedBase.includes('HQ') ? 'Su-27, Transport, Trainers' : 'MiG-23, Helos, Drones'}</p>
                                        <p><strong>Status:</strong> <span className="text-green-400">OPERATIONAL</span></p>
                                    </div>
                                    <button onClick={() => setSelectedBase(null)} className="mt-2 text-[10px] text-cyan-400 hover:text-white">CLOSE</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: INVENTORY (CAPABILITIES) */}
                {activeTab === 'inventory' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-96 lg:h-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg text-white flex items-center">
                                    <Plane className="mr-2 text-cyan-500" size={20} /> Aircraft Inventory (Estimate)
                                </h3>
                                <button 
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-data-terminal'))}
                                    className="text-[10px] flex items-center bg-military-900 px-2 py-1 rounded text-gray-300 hover:text-white border border-military-600 hover:border-gray-400"
                                >
                                    <Edit3 size={10} className="mr-1"/> Update Fleet
                                </button>
                            </div>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fleetData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" />
                                        <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={11} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                            cursor={{fill: 'transparent'}}
                                        />
                                        <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-4">Key Platforms (Quality vs Quantity)</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-military-900 rounded border border-cyan-900 flex justify-between items-center group hover:border-cyan-500 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Sukhoi Su-30K</h4>
                                            <p className="text-xs text-gray-400">4th+ Gen Multirole • The "Tip of the Spear"</p>
                                        </div>
                                        <span className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded">High Value</span>
                                    </div>
                                    <div className="p-3 bg-military-900 rounded border border-purple-900 flex justify-between items-center group hover:border-purple-500 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Akıncı & TB2 Drones</h4>
                                            <p className="text-xs text-gray-400">Unmanned Strike • Force Multiplier</p>
                                        </div>
                                        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">Strategic</span>
                                    </div>
                                    <div className="p-3 bg-military-900 rounded border border-yellow-900 flex justify-between items-center group hover:border-yellow-500 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Pantsir-S1 / S-125</h4>
                                            <p className="text-xs text-gray-400">Air Defense • GERD Protection</p>
                                        </div>
                                        <span className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded">Defensive</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-2">Space & Cyber Capabilities</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-black/30 p-3 rounded">
                                        <Globe size={24} className="mx-auto text-blue-500 mb-2" />
                                        <span className="block text-sm font-bold text-white">ETRSS-1</span>
                                        <span className="text-[10px] text-gray-400">Earth Observation Sat</span>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded">
                                        <Database size={24} className="mx-auto text-green-500 mb-2" />
                                        <span className="block text-sm font-bold text-white">INSA Link</span>
                                        <span className="text-[10px] text-gray-400">Secure Data Feed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: OPS & PERSONNEL */}
                {activeTab === 'ops' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-96 lg:h-auto">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Activity className="mr-2 text-green-500" size={20} /> Readiness & Tempo
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={readinessMetrics}>
                                        <PolarGrid stroke="#334155" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <Radar name="Status" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-center text-xs text-gray-400">
                                <em>Challenge:</em> Maintenance of aging Soviet-era platforms impacts mission capable rates.
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-4">Personnel & Culture</h3>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex items-start"><CheckCircle size={16} className="text-cyan-500 mr-2 mt-0.5"/> <strong>History:</strong> Inheritor of a proud tradition (one of Africa's oldest air forces).</li>
                                    <li className="flex items-start"><CheckCircle size={16} className="text-cyan-500 mr-2 mt-0.5"/> <strong>Training:</strong> Rigorous pilot selection at Bishoftu Academy. High flight hour requirements.</li>
                                    <li className="flex items-start"><AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5"/> <strong>Retention:</strong> Competition with commercial airlines (Ethiopian Airlines) for skilled pilots/mechanics.</li>
                                </ul>
                            </div>

                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-semibold text-lg text-white mb-4">Operational Tempo (Sortie Hours)</h3>
                                <div className="h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={flightHours}>
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                            <Line type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: FUTURE & ALLIANCES */}
                {activeTab === 'future' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Handshake className="mr-2 text-blue-500" size={20} /> Strategic Partnerships
                            </h3>
                            <div className="space-y-4">
                                {partners.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <div>
                                            <span className="font-bold text-white text-sm">{p.country}</span>
                                            <span className="text-xs text-gray-400 block">{p.role}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                                            p.status === 'Strategic' ? 'bg-purple-900/30 text-purple-300' :
                                            p.status === 'Main Supplier' ? 'bg-blue-900/30 text-blue-300' : 'bg-gray-700 text-gray-300'
                                        }`}>{p.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <TrendingUp className="mr-2 text-purple-500" size={20} /> Future Trajectory & Challenges
                            </h3>
                            
                            <div className="space-y-6 relative pl-4 border-l-2 border-military-600">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-military-900"></div>
                                    <h4 className="text-sm font-bold text-cyan-400">Current: Drone Integration</h4>
                                    <p className="text-xs text-gray-400 mt-1">Mastering asymmetric warfare. Heavy reliance on UAVs for cost-effective strike capability.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-military-900"></div>
                                    <h4 className="text-sm font-bold text-yellow-400">Challenge: Aging Fleet</h4>
                                    <p className="text-xs text-gray-400 mt-1">Replacement of MiG-23s and older Su-27s is critical. Budget constraints limit 4.5/5th gen acquisition.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-military-900"></div>
                                    <h4 className="text-sm font-bold text-purple-400">Future: Air Defense 2030</h4>
                                    <p className="text-xs text-gray-400 mt-1">Building an integrated IADS (Integrated Air Defense System) covering key infrastructure (GERD) with layered SAMs.</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-military-900 rounded border border-military-600">
                                <h4 className="text-xs font-bold text-white mb-2 flex items-center"><Info size={12} className="mr-2 text-blue-400"/> Strategic Gap Analysis</h4>
                                <p className="text-xs text-gray-400">
                                    Primary gap identified in <strong>Electronic Warfare (EW)</strong> and <strong>Airborne Early Warning (AEW)</strong> capabilities to counter regional peer competitors.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AirForceView;

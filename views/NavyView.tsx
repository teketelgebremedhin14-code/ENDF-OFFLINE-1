
import React, { useState } from 'react';
import { Anchor, Compass, Navigation, Map, Ship, Target, AlertTriangle, Eye, Package, Droplets, Activity, Crosshair, Radio, Truck, Search, Shield, GraduationCap, Construction, Users, TrendingUp, Handshake, Globe, Anchor as AnchorIcon, Edit3, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface NavyViewProps {
    onBack?: () => void;
}

const NavyView: React.FC<NavyViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    // 7-Point Framework Logic
    const [activeTab, setActiveTab] = useState<'strat_org' | 'fleet_tiers' | 'ops_personnel' | 'future_alliances'>('strat_org');

    // II. Inventory Data (Reconstituted Fleet Estimates)
    const fleetData = [
        { name: 'Patrol Boats', count: 8, tier: t('tier_littoral'), active: 6, maint: 2 },
        { name: 'Fast Attack', count: 4, tier: t('tier_littoral'), active: 3, maint: 1 }, // Planned/Training
        { name: 'Amphibious', count: 2, tier: t('tier_support'), active: 2, maint: 0 },
        { name: 'Training', count: 12, tier: t('tier_support'), active: 10, maint: 2 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('navy_title')} (Reconstituting)</h2>
                    <p className="text-gray-400 text-sm font-sans">Cmdr: Rear Admiral Kindu Gezu • HQ: Addis/Bishoftu</p>
                </div>
                <div className="mt-4 md:mt-0 bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                    <button 
                        onClick={() => setActiveTab('strat_org')} 
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'strat_org' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Map size={14} className="mr-2"/> I. STRAT & ORG
                    </button>
                    <button 
                        onClick={() => setActiveTab('fleet_tiers')} 
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'fleet_tiers' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Ship size={14} className="mr-2"/> II. FLEET TIERS
                    </button>
                    <button 
                        onClick={() => setActiveTab('ops_personnel')} 
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'ops_personnel' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Users size={14} className="mr-2"/> III. OPS & PERS
                    </button>
                    <button 
                        onClick={() => setActiveTab('future_alliances')} 
                        className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'future_alliances' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Globe size={14} className="mr-2"/> IV. FUTURE
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
                <MetricCard title={t('navy_metric_assets')} value="~14 (Small)" icon={Ship} color="warning" />
                <MetricCard title="Personnel (Core)" value="~3,000" icon={Users} color="accent" />
                <MetricCard title="Training Sites" value="2 + Foreign" icon={GraduationCap} />
                <MetricCard title={t('navy_metric_ports')} value="Negotiating" icon={Anchor} color="danger" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* TAB 1: STRATEGY & ORGANIZATION */}
                {activeTab === 'strat_org' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden">
                        {/* Map Visualization */}
                        <div className="lg:col-span-2 bg-[#081b33] rounded-lg border border-blue-900 relative overflow-hidden group min-h-[400px]">
                            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1 rounded border-l-2 border-blue-500">
                                <h4 className="text-xs font-bold text-blue-400 uppercase">MARITIME STRATEGY</h4>
                                <p className="text-[10px] text-gray-400">Red Sea & Gulf of Aden Access</p>
                            </div>
                            
                            <svg viewBox="0 0 800 600" className="w-full h-full opacity-80">
                                {/* Water Background */}
                                <rect width="100%" height="100%" fill="#0a2239" />
                                
                                {/* Land Masses (Abstract) */}
                                <path d="M 0 0 L 300 0 L 250 200 L 100 250 L 0 200 Z" fill="#1e293b" stroke="#334155" /> {/* Eritrea/Sudan Coast */}
                                <path d="M 300 0 L 800 0 L 800 600 L 500 600 L 400 400 L 300 350 Z" fill="#1e293b" stroke="#334155" /> {/* Yemen/Somalia/Djibouti */}
                                
                                {/* Ethiopia (Landlocked) */}
                                <path d="M 100 250 L 250 200 L 300 350 L 400 400 L 200 550 L 50 400 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
                                
                                {/* Strategic Corridor Arrows */}
                                <path d="M 350 320 L 450 250" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrow)" strokeDasharray="10 5" className="animate-pulse" /> {/* Djibouti Corridor */}
                                <path d="M 300 350 L 320 220" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="5 2" /> {/* Assab Potential */}
                                <path d="M 400 400 L 550 500" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="5 2" /> {/* Berbera Corridor */}

                                <defs>
                                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                        <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                                    </marker>
                                </defs>

                                {/* Base Markers */}
                                <circle cx="450" cy="250" r="5" fill="#3b82f6" />
                                <text x="460" y="255" fill="white" fontSize="10">DJIBOUTI (Key Port)</text>
                                
                                <circle cx="200" cy="350" r="5" fill="#f59e0b" />
                                <text x="160" y="355" fill="white" fontSize="10">Bishoftu (HQ)</text>
                            </svg>
                        </div>

                        {/* Strategic Goals */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Target className="mr-2 text-blue-500" size={20} /> Core Objectives
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-military-900 rounded border-l-4 border-blue-500">
                                    <h4 className="text-sm font-bold text-white">1. Secure Access</h4>
                                    <p className="text-xs text-gray-400 mt-1">Guarantee commercial maritime access via Djibouti and alternative ports (Berbera, Lamu).</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-yellow-500">
                                    <h4 className="text-sm font-bold text-white">2. Littoral Capability</h4>
                                    <p className="text-xs text-gray-400 mt-1">Develop 'Brown Water' and 'Green Water' capacity for coastal protection and anti-piracy.</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border-l-4 border-green-500">
                                    <h4 className="text-sm font-bold text-white">3. Institution Building</h4>
                                    <p className="text-xs text-gray-400 mt-1">Re-establish Naval Academy and specialized marine training centers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: FLEET TIERS */}
                {activeTab === 'fleet_tiers' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-96 lg:h-auto">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Ship className="mr-2 text-blue-500" size={20} /> Current Fleet Strength
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fleetData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={11} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="active" stackId="a" fill="#3b82f6" name="Active" />
                                        <Bar dataKey="maint" stackId="a" fill="#eab308" name="Maintenance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-4">Acquisition Roadmap</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <div>
                                            <span className="text-sm font-bold text-white">Coastal Patrol Craft</span>
                                            <span className="text-xs text-gray-400 block">Short-range interdiction</span>
                                        </div>
                                        <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">Delivered</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <div>
                                            <span className="text-sm font-bold text-white">Frigate Class (Future)</span>
                                            <span className="text-xs text-gray-400 block">Blue water projection</span>
                                        </div>
                                        <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">Negotiating</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: OPS & PERSONNEL */}
                {activeTab === 'ops_personnel' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 h-96 lg:h-auto">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <GraduationCap className="mr-2 text-yellow-500" size={20} /> Naval Education Center
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">Training the next generation of maritime officers at Babogaya/Bishoftu.</p>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-military-900 p-3 rounded border border-military-600">
                                    <div className="text-2xl font-bold text-white">450</div>
                                    <div className="text-xs text-gray-400">Cadets Enrolled</div>
                                </div>
                                <div className="bg-military-900 p-3 rounded border border-military-600">
                                    <div className="text-2xl font-bold text-blue-500">12</div>
                                    <div className="text-xs text-gray-400">Foreign Instructors</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Activity className="mr-2 text-green-500" size={20} /> Operational Readiness
                            </h3>
                            <div className="w-full bg-military-900 rounded-full h-4 mb-2">
                                <div className="bg-yellow-500 h-4 rounded-full text-xs text-black text-center font-bold" style={{width: '65%'}}>65% INITIAL OPERATIONAL CAPABILITY</div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Currently limited to inland water bodies and cooperative training missions abroad.</p>
                        </div>
                    </div>
                )}

                {/* TAB 4: FUTURE & ALLIANCES */}
                {activeTab === 'future_alliances' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Handshake className="mr-2 text-blue-500" size={20} /> Strategic Partnerships
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-military-900 rounded border border-military-600">
                                    <h4 className="text-sm font-bold text-white">France</h4>
                                    <p className="text-xs text-gray-400">Naval cooperation agreement (2019). Assistance in fleet reconstitution.</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border border-military-600">
                                    <h4 className="text-sm font-bold text-white">Russia</h4>
                                    <p className="text-xs text-gray-400">Potential supplier of patrol vessels and technical training.</p>
                                </div>
                                <div className="p-3 bg-military-900 rounded border border-military-600">
                                    <h4 className="text-sm font-bold text-white">Djibouti</h4>
                                    <p className="text-xs text-gray-400">Primary basing and logistics hub access.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <TrendingUp className="mr-2 text-purple-500" size={20} /> 2030 Vision
                            </h3>
                            <div className="border-l-2 border-purple-500 pl-4 space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-purple-400">Phase 1: Foundation (Current)</h4>
                                    <p className="text-xs text-gray-400">Training, doctrine development, small craft acquisition.</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-purple-400">Phase 2: Littoral Presence</h4>
                                    <p className="text-xs text-gray-400">Permanent Red Sea basing, corvette-class vessel acquisition.</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-purple-400">Phase 3: Blue Water</h4>
                                    <p className="text-xs text-gray-400">Frigates, support ships, sustained deep-sea operations.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default NavyView;


import React, { useState } from 'react';
import { GitMerge, Users, AlertCircle, Globe, ShieldCheck, Share2, Activity, Zap, FileText, CheckCircle, BarChart2, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface IntegrationViewProps {
    onBack?: () => void;
}

const IntegrationView: React.FC<IntegrationViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'cross_dept' | 'emergency' | 'international' | 'national_sec'>('cross_dept');

    // Simulated Data for Charts
    const jointOpsData = [
        { name: 'Ground-Air', value: 85 },
        { name: 'Intel-Cyber', value: 92 },
        { name: 'Logistics-Eng', value: 78 },
        { name: 'Navy-Coastal', value: 65 },
    ];

    const crisisTimeline = [
        { stage: 'Alert', time: '00:00', status: 'Automated' },
        { stage: 'Assess', time: '00:15', status: 'AI Triage' },
        { stage: 'Mobilize', time: '00:45', status: 'Unit Dispatch' },
        { stage: 'Respond', time: '02:00', status: 'On Site' },
        { stage: 'Recover', time: 'TBD', status: 'Planning' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('coord_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('coord_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('cross_dept')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'cross_dept' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Share2 size={14} className="mr-2"/> {t('coord_tab_dept')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('emergency')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'emergency' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <AlertCircle size={14} className="mr-2"/> {t('coord_tab_crisis')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('international')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'international' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Globe size={14} className="mr-2"/> {t('coord_tab_global')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('national_sec')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'national_sec' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ShieldCheck size={14} className="mr-2"/> {t('coord_tab_natsec')}
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

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('coord_metric_joint')} value="12" change={2} icon={GitMerge} color="accent" />
                <MetricCard title={t('coord_metric_response')} value="18m" change={-12} icon={Zap} color="warning" />
                <MetricCard title={t('coord_metric_partners')} value="8 Active" icon={Globe} color="success" />
                <MetricCard title={t('coord_metric_reform')} value="65%" icon={Activity} />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 13.1 Cross-Department Coordination */}
                {activeTab === 'cross_dept' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <Share2 className="mr-2 text-blue-500" size={20} /> Department Collaboration System
                            </h3>
                            <p className="text-xs text-gray-400 mb-6">{t('coord_joint_desc')}</p>
                            
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-300 mb-2">Resource Synchronization Score</h4>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={jointOpsData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                            <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                                            <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 overflow-y-auto">
                            <h3 className="font-semibold text-lg text-white mb-4">Live Joint Operations</h3>
                            <div className="space-y-4">
                                <div className="bg-military-900 p-4 rounded border-l-4 border-green-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-sm">Op. Northern Shield</h4>
                                        <span className="text-[10px] bg-green-900 text-green-300 px-2 py-0.5 rounded font-mono">ACTIVE</span>
                                    </div>
                                    <div className="flex space-x-2 text-[10px] text-gray-400 mb-2">
                                        <span className="bg-black/30 px-2 py-1 rounded">Ground</span>
                                        <span className="bg-black/30 px-2 py-1 rounded">Air</span>
                                        <span className="bg-black/30 px-2 py-1 rounded">Intel</span>
                                    </div>
                                    <p className="text-xs text-gray-300">Synchronized border patrol. Real-time drone feed sharing enabled.</p>
                                </div>

                                <div className="bg-military-900 p-4 rounded border-l-4 border-yellow-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-sm">Op. Blue Horizon</h4>
                                        <span className="text-[10px] bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded font-mono">PLANNING</span>
                                    </div>
                                    <div className="flex space-x-2 text-[10px] text-gray-400 mb-2">
                                        <span className="bg-black/30 px-2 py-1 rounded">Navy</span>
                                        <span className="bg-black/30 px-2 py-1 rounded">Logistics</span>
                                    </div>
                                    <p className="text-xs text-gray-300">Red Sea supply corridor security drill. Pending resource allocation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 13.2 Emergency Response Integrations */}
                {activeTab === 'emergency' && (
                    <div className="h-full bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                <AlertCircle className="mr-2 text-red-500" size={20} /> Crisis Management Coordination
                            </h3>
                            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded shadow-lg animate-pulse">
                                ACTIVATE RAPID RESPONSE
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-8">{t('coord_crisis_desc')}</p>

                        <div className="relative flex justify-between items-center px-4 md:px-10 mb-12 overflow-x-auto">
                            {/* Connection Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-military-700 -z-10 min-w-[500px]"></div>
                            
                            {crisisTimeline.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center group min-w-[80px]">
                                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-military-900 z-10 transition-all ${idx < 3 ? 'border-green-500 text-green-500' : 'border-gray-600 text-gray-500'}`}>
                                        <span className="font-bold text-sm">{idx + 1}</span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h4 className={`font-bold text-sm ${idx < 3 ? 'text-white' : 'text-gray-500'}`}>{step.stage}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono">{step.time}</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded mt-1 inline-block ${idx < 3 ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-600'}`}>{step.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-military-900 p-4 rounded border border-military-600">
                                <h4 className="text-sm font-bold text-white mb-2">Live Incident Feed</h4>
                                <div className="space-y-2 text-xs font-mono">
                                    <div className="text-green-400">[10:45] Flood warning issued for Region 5.</div>
                                    <div className="text-yellow-500">[10:48] Civil defense units mobilized (Standby).</div>
                                    <div className="text-gray-400">[11:00] Logistics preparing relief convoy C-9.</div>
                                </div>
                            </div>
                            <div className="bg-military-900 p-4 rounded border border-military-600">
                                <h4 className="text-sm font-bold text-white mb-2">Recovery Operations Mgmt</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Project: Bridge Rebuild (Tigray)</span>
                                            <span>45%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Project: Med Clinic Stabilization</span>
                                            <span>88%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '88%'}}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 13.3 International Cooperation Interface */}
                {activeTab === 'international' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <Globe className="mr-2 text-green-500" size={20} /> Global Partnership Management
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-military-900 rounded border border-military-600">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center mr-3 font-bold text-xs text-blue-200">US</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">United States (FMS)</h4>
                                            <p className="text-[10px] text-gray-400">Strategic Partner</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-military-900 rounded border border-military-600">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center mr-3 font-bold text-xs text-red-200">CN</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">China (Tech Transfer)</h4>
                                            <p className="text-[10px] text-gray-400">Infrastructure Partner</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-military-900 rounded border border-military-600">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 font-bold text-xs text-white">UN</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">UN Peacekeeping (UNDPKO)</h4>
                                            <p className="text-[10px] text-gray-400">Multilateral</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded">Review</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                                <FileText className="mr-2 text-yellow-500" size={20} /> {t('coord_aid_mgmt')}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-300">
                                    <thead className="bg-military-900 text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Program</th>
                                            <th className="px-4 py-2">Partner</th>
                                            <th className="px-4 py-2">Value</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-military-700 font-mono">
                                        <tr>
                                            <td className="px-4 py-3">Pilot Training Ph.2</td>
                                            <td className="px-4 py-3">France</td>
                                            <td className="px-4 py-3">$12M</td>
                                            <td className="px-4 py-3 text-green-500">Delivered</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Cyber Defense Kit</td>
                                            <td className="px-4 py-3">Israel</td>
                                            <td className="px-4 py-3">$8.5M</td>
                                            <td className="px-4 py-3 text-yellow-500">In Transit</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Field Hospital</td>
                                            <td className="px-4 py-3">Turkey</td>
                                            <td className="px-4 py-3">$5.0M</td>
                                            <td className="px-4 py-3 text-blue-400">Deployed</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 13.4 National Security Integration */}
                {activeTab === 'national_sec' && (
                    <div className="h-full bg-military-800 rounded-lg p-6 border border-military-700 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                <ShieldCheck className="mr-2 text-purple-500" size={20} /> Comprehensive Defense Coordination
                            </h3>
                            <div className="flex space-x-2 text-xs">
                                <span className="bg-military-900 px-3 py-1 rounded border border-military-600 text-gray-400">Plan: Vision 2030</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-military-900 p-6 rounded-lg border border-military-600">
                                <h4 className="text-sm font-bold text-white mb-4">{t('coord_reform_plan')}</h4>
                                <div className="space-y-6 relative pl-4 border-l-2 border-purple-900">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-military-900"></div>
                                        <h5 className="text-xs font-bold text-green-400">Phase 1: Professionalization</h5>
                                        <p className="text-[10px] text-gray-400 mt-1">Curriculum update & rank structure standardization.</p>
                                        <span className="text-[9px] bg-green-900/50 text-green-300 px-1 rounded mt-1 inline-block">COMPLETED</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-military-900 animate-pulse"></div>
                                        <h5 className="text-xs font-bold text-yellow-400">Phase 2: Tech Integration</h5>
                                        <p className="text-[10px] text-gray-400 mt-1">C4I implementation & Cyber Command establishment.</p>
                                        <span className="text-[9px] bg-yellow-900/50 text-yellow-300 px-1 rounded mt-1 inline-block">IN PROGRESS</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-600 rounded-full border-2 border-military-900"></div>
                                        <h5 className="text-xs font-bold text-gray-400">Phase 3: Force Projection</h5>
                                        <p className="text-[10px] text-gray-500 mt-1">Expeditionary capability & Blue Water Navy.</p>
                                        <span className="text-[9px] bg-gray-800 text-gray-500 px-1 rounded mt-1 inline-block">PENDING</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="bg-military-900 p-4 rounded border border-military-600 flex-1">
                                    <h4 className="text-sm font-bold text-white mb-4">Security Policy Tracking</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-300">Border Security Strategy</span>
                                                <span className="text-green-400">92%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-300">Cyber Resilience Framework</span>
                                                <span className="text-blue-400">45%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-300">Local Defense Initiative</span>
                                                <span className="text-yellow-400">15%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 rounded-full"><div className="bg-yellow-500 h-2 rounded-full" style={{width: '15%'}}></div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded text-center">
                                    <h4 className="text-2xl font-bold text-white mb-1">2030</h4>
                                    <p className="text-xs text-blue-300 uppercase tracking-widest">Target Year</p>
                                    <p className="text-[10px] text-gray-400 mt-2">Full Modernization Milestone</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default IntegrationView;

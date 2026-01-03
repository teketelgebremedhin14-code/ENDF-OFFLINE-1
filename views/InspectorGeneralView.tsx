
import React, { useState } from 'react';
import { FileSearch, CheckCircle, AlertTriangle, ClipboardList, Shield, XCircle, MapPin, Lock, Send, Hash, Activity, MessageSquare, BarChart2, Play, RefreshCw, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const anomalyData = [
    { x: 10, y: 30, z: 200, name: 'Normal Ops' },
    { x: 50, y: 50, z: 400, name: 'Standard Procurement' },
    { x: 80, y: 90, z: 1000, name: 'High Value Anomaly' }, // Outlier
    { x: 20, y: 20, z: 100, name: 'Routine' },
    { x: 90, y: 10, z: 800, name: 'Speed Mismatch' }, // Outlier
];

interface InspectorGeneralViewProps {
    onBack?: () => void;
}

const InspectorGeneralView: React.FC<InspectorGeneralViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'risk' | 'audit' | 'feedback' | 'compliance'>('risk');
    const [auditInProgress, setAuditInProgress] = useState(false);
    const [auditProgress, setAuditProgress] = useState(0);

    const auditTrail = [
        { id: 'TX-9921', action: 'Budget Allocation: Sector 4', user: 'Gen. Abebaw', timestamp: '10:42:15', hash: '0x8f...2a1c', verified: true },
        { id: 'TX-9922', action: 'Asset Transfer: T-72', user: 'Logistics Cmd', timestamp: '10:45:00', hash: '0x3b...9d4e', verified: true },
        { id: 'TX-9923', action: 'Intel Access: Level 5', user: 'Unknown User', timestamp: '10:48:30', hash: '0x1a...f882', verified: false },
    ];

    const feedbackStats = [
        { topic: 'Leadership', positive: 65, negative: 12 },
        { topic: 'Supplies', positive: 40, negative: 45 },
        { topic: 'Housing', positive: 55, negative: 20 },
    ];

    const handleRunAudit = () => {
        setAuditInProgress(true);
        setAuditProgress(0);
        const interval = setInterval(() => {
            setAuditProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setAuditInProgress(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 200);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('ig_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('ig_subtitle')}</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex flex-wrap gap-1">
                        <button 
                            onClick={() => setActiveTab('risk')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'risk' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MapPin size={14} className="mr-2"/> {t('ig_tab_risk')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('audit')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Hash size={14} className="mr-2"/> {t('ig_tab_audit')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('feedback')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'feedback' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MessageSquare size={14} className="mr-2"/> {t('ig_feedback_analysis')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('compliance')}
                            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'compliance' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <CheckCircle size={14} className="mr-2"/> {t('ig_tab_compliance')}
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
                <MetricCard title={t('ig_metric_audits')} value="14" change={2} icon={ClipboardList} color="accent" />
                <MetricCard title={t('ig_metric_compliance')} value="94.5%" change={0.5} icon={CheckCircle} color="success" />
                <MetricCard title={t('ig_metric_investigations')} value="3" change={-1} icon={FileSearch} color="warning" />
                <MetricCard title={t('ig_metric_ethics')} value="0" icon={Shield} color="success" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 6.1 - Anomaly Heatmaps & Risk */}
                {activeTab === 'risk' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <AlertTriangle className="mr-2 text-red-500" size={20} /> {t('ig_anomaly_detect')}
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">Visualizing unusual patterns in spending vs. delivery time (AOIM Engine).</p>
                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis type="number" dataKey="x" name="Cost" unit="k" stroke="#94a3b8" fontSize={10} />
                                        <YAxis type="number" dataKey="y" name="Time" unit="d" stroke="#94a3b8" fontSize={10} />
                                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Volume" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        <Scatter name="Transactions" data={anomalyData} fill="#ef4444" shape="circle" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                <MapPin className="mr-2 text-red-500" size={20} /> Geospatial Risk Heatmap
                            </h3>
                            <div className="flex-1 bg-[#0f172a] rounded border border-military-700 relative overflow-hidden">
                                <svg viewBox="0 0 400 300" className="w-full h-full opacity-50">
                                    <path d="M 50 50 L 150 50 L 130 150 L 50 180 Z" fill="#1e293b" stroke="#334155" /> 
                                    <path d="M 130 150 L 220 140 L 250 200 L 200 250 L 130 220 Z" fill="#1e293b" stroke="#334155" /> 
                                    <path d="M 250 200 L 350 220 L 300 280 L 200 250 Z" fill="#1e293b" stroke="#334155" /> 
                                </svg>
                                <div className="absolute top-1/4 left-1/4">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-full animate-ping absolute"></div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full border border-white cursor-pointer relative z-10"></div>
                                    <div className="absolute left-4 top-0 bg-black/80 px-2 py-1 rounded text-[10px] whitespace-nowrap border border-red-500">Logistics Hub B - High Risk</div>
                                </div>
                                <div className="absolute bottom-1/4 right-1/3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full border border-white cursor-pointer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6.1 - Immutable Audit Trail */}
                {activeTab === 'audit' && (
                    <div className="h-full bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                <Hash className="mr-2 text-blue-500" size={20} /> Immutable Audit Ledger (Blockchain)
                            </h3>
                            <button 
                                onClick={handleRunAudit}
                                disabled={auditInProgress}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center disabled:opacity-50"
                            >
                                {auditInProgress ? <RefreshCw className="mr-2 animate-spin" size={14}/> : <Play className="mr-2" size={14}/>}
                                {auditInProgress ? "SCANNING..." : "RUN FULL SYSTEM AUDIT"}
                            </button>
                        </div>
                        
                        {auditInProgress && (
                            <div className="mb-6 p-4 bg-blue-900/10 border border-blue-500/30 rounded">
                                <div className="flex justify-between text-xs text-blue-300 mb-1">
                                    <span>Verifying Hashes...</span>
                                    <span>{auditProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all duration-200" style={{ width: `${auditProgress}%` }}></div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-military-900 text-xs uppercase text-gray-500 font-display">
                                    <tr>
                                        <th className="px-4 py-3">Transaction ID</th>
                                        <th className="px-4 py-3">Action</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">Hash Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-military-700 font-mono text-xs">
                                    {auditTrail.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-military-700/50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">{tx.id}</td>
                                            <td className="px-4 py-3 text-gray-400 font-sans">{tx.action}</td>
                                            <td className="px-4 py-3 text-blue-400">{tx.user}</td>
                                            <td className="px-4 py-3">{tx.timestamp}</td>
                                            <td className="px-4 py-3">
                                                <span className={`flex items-center ${tx.verified ? 'text-green-500' : 'text-red-500'}`}>
                                                    {tx.verified ? <CheckCircle size={14} className="mr-2"/> : <XCircle size={14} className="mr-2"/>}
                                                    {tx.verified ? t('ig_blockchain_verified') : 'INTEGRITY FAIL'}
                                                    <span className="ml-2 opacity-50 text-[10px]">{tx.hash}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {auditInProgress && (
                                        <tr className="animate-pulse bg-blue-900/20">
                                            <td colSpan={5} className="px-4 py-3 text-blue-400 text-center">SCANNING BLOCKCHAIN NODES...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 6.1 - Feedback Engine */}
                {activeTab === 'feedback' && (
                    <div className="h-full bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                        <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                            <MessageSquare className="mr-2 text-purple-500" size={20} /> {t('ig_feedback_analysis')}
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">Aggregated sentiment from "REPORT OF ENDF" secure channels.</p>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={feedbackStats} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" />
                                        <YAxis dataKey="topic" type="category" width={80} stroke="#94a3b8" fontSize={12} />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                        <Bar dataKey="positive" fill="#10b981" name="Positive" stackId="a" barSize={20} />
                                        <Bar dataKey="negative" fill="#ef4444" name="Negative" stackId="a" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-military-900 p-4 rounded border border-military-600">
                                <h4 className="font-bold text-white text-sm mb-4">Key Insights</h4>
                                <ul className="space-y-2 text-xs text-gray-300">
                                    <li className="flex items-start"><AlertTriangle size={12} className="text-red-500 mr-2 mt-0.5"/> Supply chain delays in Sector 4 causing morale dip.</li>
                                    <li className="flex items-start"><CheckCircle size={12} className="text-green-500 mr-2 mt-0.5"/> New housing initiative received positively by NCOs.</li>
                                    <li className="flex items-start"><Activity size={12} className="text-yellow-500 mr-2 mt-0.5"/> Leadership communication gap identified in 3rd Division.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6.1 - Automated Compliance */}
                {activeTab === 'compliance' && (
                    <div className="h-full bg-military-800 rounded-lg p-6 border border-military-700">
                        <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
                            <Shield className="mr-2 text-green-500" size={20} /> Automated Legal Compliance Checker
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-military-900 p-4 rounded border border-military-600 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Procurement Act 2024</h4>
                                    <p className="text-xs text-gray-400">Verifying vendor contracts against anti-corruption clauses.</p>
                                </div>
                                <span className="text-xs bg-green-900/50 text-green-400 px-3 py-1 rounded border border-green-900 flex items-center">
                                    <CheckCircle size={12} className="mr-2"/> 100% COMPLIANT
                                </span>
                            </div>
                            <div className="bg-military-900 p-4 rounded border border-military-600 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">HR Deployment Limits</h4>
                                    <p className="text-xs text-gray-400">Checking consecutive deployment days against regulations.</p>
                                </div>
                                <span className="text-xs bg-yellow-900/50 text-yellow-400 px-3 py-1 rounded border border-yellow-900 flex items-center">
                                    <AlertTriangle size={12} className="mr-2"/> 3 WARNINGS
                                </span>
                            </div>
                            <div className="bg-military-900 p-4 rounded border border-military-600 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Data Sovereignty</h4>
                                    <p className="text-xs text-gray-400">Ensuring classified data remains on local servers.</p>
                                </div>
                                <span className="text-xs bg-green-900/50 text-green-400 px-3 py-1 rounded border border-green-900 flex items-center">
                                    <CheckCircle size={12} className="mr-2"/> SECURE
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InspectorGeneralView;

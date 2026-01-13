
import React, { useState } from 'react';
import { Handshake, Globe, MapPin, Users, FileText, Info, Lock, Eye, X, RefreshCw, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { draftSRSCommunication, runStrategySimulation } from '../services/aiService';

interface ForeignRelationsViewProps {
    onBack?: () => void;
}

// Safe Render Helper
const SafeRender = ({ content }: { content: any }) => {
    if (typeof content === 'string' || typeof content === 'number') return <>{content}</>;
    if (typeof content === 'object' && content !== null) {
        if (content.value) return <>{content.value}</>;
        return <>{JSON.stringify(content)}</>;
    }
    return null;
};

const ForeignRelationsView: React.FC<ForeignRelationsViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [selectedNation, setSelectedNation] = useState<any | null>(null);
    const [showCable, setShowCable] = useState(false);
    const [cableContent, setCableContent] = useState('');
    const [loadingCable, setLoadingCable] = useState(false);
    
    // Agent Sigma State
    const [sigmaLoading, setSigmaLoading] = useState(false);
    const [sigmaAnalysis, setSigmaAnalysis] = useState<any>(null);

    const attaches = [
        { country: t('foreign_country_usa'), city: 'Washington D.C.', officer: 'Col. Haile', status: t('status_active') },
        { country: t('foreign_country_china'), city: 'Beijing', officer: 'Brig. Gen. Bekele', status: t('status_active') },
        { country: t('foreign_country_russia'), city: 'Moscow', officer: 'Col. Girma', status: t('status_active') },
        { country: t('foreign_country_kenya'), city: 'Nairobi', officer: 'Lt. Col. Sara', status: t('status_active') },
        { country: t('foreign_country_turkey'), city: 'Ankara', officer: 'Maj. Dawit', status: t('status_active') },
    ];

    const mapPoints = [
        { id: 'us', x: 25, y: 35, name: t('foreign_country_usa'), status: t('foreign_status_ally'), summary: t('foreign_summary_usa'), color: '#3b82f6' },
        { id: 'cn', x: 75, y: 35, name: t('foreign_country_china'), status: t('foreign_status_partner'), summary: t('foreign_summary_china'), color: '#3b82f6' },
        { id: 'ru', x: 65, y: 20, name: t('foreign_country_russia'), status: t('foreign_status_neutral'), summary: t('foreign_summary_russia'), color: '#f59e0b' },
        { id: 'ke', x: 58, y: 55, name: t('foreign_country_kenya'), status: t('foreign_status_ally'), summary: t('foreign_summary_kenya'), color: '#10b981' },
        { id: 'tr', x: 55, y: 32, name: t('foreign_country_turkey'), status: t('foreign_status_partner'), summary: t('foreign_summary_turkey'), color: '#3b82f6' },
        { id: 'dj', x: 60, y: 50, name: t('foreign_country_djibouti'), status: t('foreign_status_critical'), summary: t('foreign_summary_djibouti'), color: '#10b981' },
    ];

    const handleOpenCable = async () => {
        if (!selectedNation) return;
        setShowCable(true);
        setLoadingCable(true);
        setCableContent('');
        
        try {
            const content = await draftSRSCommunication(
                "Ministry of Defense HQ (Addis Ababa)", 
                `Subject: ${selectedNation.name} Strategic Update. 
                Current Status: ${selectedNation.status}. 
                Context: ${selectedNation.summary}. 
                Include recent developments, military cooperation items, and a classified assessment of the relationship stability.`, 
                "Strictly Confidential Diplomatic Cable (Military Attaché Channel)"
            );
            setCableContent(content);
        } catch (e) {
            setCableContent(":: ERROR :: SECURE CHANNEL HANDSHAKE FAILED. CABLE RETRIEVAL ABORTED.");
        }
        setLoadingCable(false);
    };

    const handleSigmaStressTest = async () => {
        if (!selectedNation) return;
        setSigmaLoading(true);
        setSigmaAnalysis(null);

        try {
            const prompt = `Conduct a rigorous stress-test on the diplomatic and military relationship between Ethiopia and ${selectedNation.name}. 
            Identify 'Fracture Points', 'Leverage Opportunities', and 'Hidden Risks'. 
            Assume the role of Agent Sigma (Adversarial/De-Integrator) looking for weaknesses in the alliance.`;
            
            const resultStr = await runStrategySimulation(prompt, 'sigma', language, {
                worldModelFocus: 'Geopolitical & Economic',
                timeHorizon: '180 Days'
            });

            let parsed;
            try {
                const clean = resultStr.replace(/^```json/, '').replace(/```$/, '').trim();
                parsed = JSON.parse(clean);
            } catch (e) {
                parsed = { summary: resultStr, title: "Stress Test Output" };
            }
            setSigmaAnalysis(parsed);
        } catch (e) {
            console.error(e);
        }
        setSigmaLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('foreign_title')}</h2>
                    <p className="text-gray-400 text-xs font-sans">{t('foreign_subtitle')}</p>
                </div>
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="mt-4 md:mt-0 p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors"
                        title="Exit / Back"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('foreign_metric_attaches')} value="24" icon={Users} color="accent" />
                <MetricCard title={t('foreign_metric_pacts')} value="15" icon={Handshake} color="success" />
                <MetricCard title={t('foreign_metric_delegations')} value="2" icon={Globe} color="warning" />
                <MetricCard title={t('foreign_metric_mous')} value="4" icon={FileText} />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
                {/* Interactive World Map */}
                <div className="lg:col-span-2 bg-[#0f172a] rounded-lg border border-military-700 relative overflow-hidden flex flex-col shadow-2xl group min-h-[400px]">
                     {/* Dot Matrix Background */}
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                     
                     <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1.5 rounded border-l-2 border-blue-500 pointer-events-none">
                         <h3 className="text-xs font-bold text-blue-400 uppercase font-display">Diplomatic Horizon</h3>
                         <p className="text-xs text-gray-400 font-mono">GLOBAL POSTURE</p>
                     </div>

                     <svg viewBox="0 0 100 60" className="w-full h-full">
                         {/* Abstract Continents (Simplified Shapes) */}
                         <path d="M 5 10 L 30 10 L 25 35 L 10 30 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                         <path d="M 20 35 L 35 35 L 30 55 L 20 50 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                         <path d="M 40 10 L 90 10 L 95 35 L 80 45 L 60 40 L 50 35 L 45 25 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                         <path d="M 45 25 L 65 25 L 60 50 L 45 45 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                         <path d="M 80 45 L 95 45 L 90 55 L 80 50 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

                         {/* Connection Lines */}
                         {mapPoints.map((point) => (
                             <line 
                                key={`line-${point.id}`}
                                x1="58" y1="35" 
                                x2={point.x} y2={point.y} 
                                stroke={point.color} 
                                strokeWidth="0.2" 
                                strokeDasharray="1 1"
                                className="opacity-30"
                             />
                         ))}

                         {/* Interactive Points Group */}
                         {mapPoints.map((point) => (
                             <g 
                                key={point.id} 
                                onClick={() => { setSelectedNation(point); setSigmaAnalysis(null); }}
                                className="cursor-pointer hover:opacity-100 transition-opacity"
                             >
                                 <circle 
                                    cx={point.x} 
                                    cy={point.y} 
                                    r={selectedNation?.id === point.id ? 2 : 1.5} 
                                    fill={point.color} 
                                    stroke="white" 
                                    strokeWidth="0.2"
                                    className="transition-all duration-300"
                                 />
                                 {selectedNation?.id === point.id && (
                                     <circle cx={point.x} cy={point.y} r="3" fill="none" stroke={point.color} strokeWidth="0.2">
                                         <animate attributeName="r" from="1.5" to="3" dur="1.5s" repeatCount="indefinite" />
                                         <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
                                     </circle>
                                 )}
                             </g>
                         ))}

                         <circle cx="58" cy="35" r="1" fill="white">
                             <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                         </circle>
                     </svg>
                </div>

                <div className="space-y-6 flex flex-col h-full overflow-y-auto">
                    {/* Selected Nation Detail */}
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col justify-start flex-shrink-0 min-h-[300px]">
                        {selectedNation ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Globe size={24} style={{ color: selectedNation.color }} />
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-display">{selectedNation.name}</h3>
                                        <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">Status: <span style={{ color: selectedNation.color }}>{selectedNation.status}</span></span>
                                    </div>
                                </div>
                                <div className="bg-military-900 p-3 rounded border border-military-600 mb-3">
                                    <p className="text-sm text-gray-300 font-sans">{selectedNation.summary}</p>
                                </div>
                                
                                {/* Standard Actions */}
                                <div className="flex space-x-2 mb-4">
                                    <button 
                                        onClick={handleOpenCable}
                                        className="flex-1 bg-military-700 hover:bg-military-600 text-white text-xs py-2 rounded flex items-center justify-center font-bold border border-military-600"
                                    >
                                        <Lock size={12} className="mr-1" /> Secure Cable
                                    </button>
                                </div>

                                {/* Sigma Stress Test */}
                                <div className="mt-auto border-t border-military-700 pt-4">
                                    <button 
                                        onClick={handleSigmaStressTest}
                                        disabled={sigmaLoading}
                                        className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs py-2 rounded border border-red-500/50 flex items-center justify-center font-bold disabled:opacity-50"
                                    >
                                        {sigmaLoading ? <RefreshCw className="animate-spin mr-2" size={12}/> : <ShieldAlert className="mr-2" size={14}/>}
                                        RUN SIGMA STRESS TEST
                                    </button>

                                    {sigmaAnalysis && (
                                        <div className="mt-3 p-3 bg-red-950/40 rounded border border-red-500/30 animate-in fade-in slide-in-from-bottom-2">
                                            <h4 className="text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center">
                                                <Zap size={10} className="mr-1"/> Fracture Point Identified
                                            </h4>
                                            <p className="text-[10px] text-gray-300 leading-relaxed">
                                                <SafeRender content={sigmaAnalysis.psych_social_vector?.cultural_fault_line || sigmaAnalysis.summary} />
                                            </p>
                                            {sigmaAnalysis.legal_matrix && (
                                                <div className="mt-2 pt-2 border-t border-red-900/30">
                                                    <span className="text-[9px] text-red-300 block font-bold">EXPLOIT VECTOR:</span>
                                                    <span className="text-[9px] text-gray-400"><SafeRender content={sigmaAnalysis.legal_matrix.mechanism} /></span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                                <Info size={40} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm uppercase tracking-widest font-mono">Select a region on the map</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1 overflow-y-auto">
                        <h3 className="font-semibold text-lg text-white mb-4 flex items-center font-display">
                            <Users className="mr-2 text-purple-500" size={20} /> {t('foreign_attaches_list')}
                        </h3>
                        <div className="space-y-3">
                            {attaches.map((att, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                    <div>
                                        <span className="font-bold text-white text-sm block font-sans">{att.country}</span>
                                        <span className="text-xs text-gray-400 font-mono">{att.city} • {att.officer}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cable Viewer Modal */}
            {showCable && selectedNation && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#f0f0f0] text-black w-full max-w-lg rounded shadow-2xl overflow-hidden font-mono animate-in zoom-in-95">
                        <div className="bg-red-800 text-white p-2 text-center text-xs font-bold tracking-widest flex justify-between items-center">
                            <span>TOP SECRET // NOFORN</span>
                            <button onClick={() => setShowCable(false)} className="hover:text-gray-300"><X size={14}/></button>
                        </div>
                        <div className="p-8 text-sm leading-relaxed whitespace-pre-wrap relative min-h-[300px]">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                                <Lock size={200} />
                            </div>
                            <p className="mb-4"><strong>TO:</strong> MINISTRY OF DEFENSE</p>
                            <p className="mb-6"><strong>FROM:</strong> {selectedNation.name.toUpperCase()} STATION</p>
                            
                            {loadingCable ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                    <RefreshCw className="animate-spin mb-2" size={24} />
                                    <p className="text-xs">DECRYPTING SECURE FEED...</p>
                                </div>
                            ) : (
                                <p className="animate-in fade-in slide-in-from-bottom-2">{cableContent}</p>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-300 text-center">
                            <button 
                                onClick={() => setShowCable(false)}
                                className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-gray-700"
                            >
                                CLOSE & ARCHIVE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForeignRelationsView;
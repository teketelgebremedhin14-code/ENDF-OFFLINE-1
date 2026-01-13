
import React, { useState } from 'react';
import { Building2, ShoppingCart, Globe, FileText, Briefcase, Share2, AlertCircle, CheckCircle, Truck, ClipboardCheck, Scale, DollarSign, Activity, X, BrainCircuit, RefreshCw } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { runStrategySimulation } from '../services/aiService';

interface MinistryViewProps {
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

const MinistryView: React.FC<MinistryViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'admin' | 'procure'>('admin');

    // Alpha Policy Agent State
    const [policyProposal, setPolicyProposal] = useState('');
    const [alphaRunning, setAlphaRunning] = useState(false);
    const [alphaResult, setAlphaResult] = useState<any>(null);

    // Mock Data for Budget Sankey (Simplified for visualization)
    const budgetData = {
        nodes: [
            { name: "Total Budget" }, // 0
            { name: "Salaries" }, // 1
            { name: "Operations" }, // 2
            { name: "Procurement" }, // 3
            { name: "R&D" }, // 4
            { name: "Ground" }, // 5
            { name: "Air" }, // 6
            { name: "Navy" } // 7
        ],
        links: [
            { source: 0, target: 1, value: 30 },
            { source: 0, target: 2, value: 35 },
            { source: 0, target: 3, value: 25 },
            { source: 0, target: 4, value: 10 },
            { source: 2, target: 5, value: 20 },
            { source: 2, target: 6, value: 10 },
            { source: 2, target: 7, value: 5 }
        ]
    };

    const policies = [
        { id: "POL-2024-01", title: "National Service Reform Act", status: "Drafting", dept: "HR & Legal" },
        { id: "POL-2023-15", title: "Cyber Sovereignty Directive", status: "Ratified", dept: "Cyber Cmd" },
        { id: "POL-2024-03", title: "Veterans Benefits Amendment", status: "Review", dept: "Veterans Affairs" }
    ];

    const procurements = [
        { id: "ACQ-882", item: "T-72 Upgrade Kits", vendor: "MetEC / Gafat", status: "Production", progress: 65, value: "120M ETB" },
        { id: "ACQ-901", item: "Secure Tactical Radios", vendor: "Homicho Ammunition", status: "Tender", progress: 20, value: "45M ETB" },
        { id: "ACQ-905", item: "Field Uniforms (Type C)", vendor: "Adama Garment", status: "QA Testing", progress: 90, value: "15M ETB" },
        { id: "ACQ-910", item: "Medium Transport Trucks", vendor: "Bishoftu Auto", status: "Delivery", progress: 98, value: "300M ETB" }
    ];

    const handleRunAlpha = async () => {
        if (!policyProposal) return;
        setAlphaRunning(true);
        setAlphaResult(null);

        try {
            const resultStr = await runStrategySimulation(
                `Analyze this defense policy proposal for integration and stability impacts: ${policyProposal}`, 
                'alpha', 
                language, 
                { worldModelFocus: 'Legal & Constitutional' }
            );
            
            let parsed;
            try {
                const clean = resultStr.replace(/^```json/, '').replace(/```$/, '').trim();
                parsed = JSON.parse(clean);
            } catch (e) {
                parsed = { summary: resultStr };
            }
            setAlphaResult(parsed);
        } catch (e) {
            console.error(e);
        }
        setAlphaRunning(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('mod_title')}</h2>
                    <p className="text-gray-400 text-xs font-sans">{t('mod_subtitle')}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex space-x-1">
                        <button 
                            onClick={() => setActiveTab('admin')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'admin' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Building2 size={12} className="mr-2"/> {t('mod_tab_admin')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('procure')}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded flex items-center transition-all ${activeTab === 'procure' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ShoppingCart size={12} className="mr-2"/> {t('mod_tab_procure')}
                        </button>
                    </div>
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors"
                            title="Exit / Back"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('mod_metric_budget')} value="88B ETB" change={3.1} icon={DollarSign} color="success" />
                <MetricCard title={t('mod_metric_contracts')} value="12 Active" icon={FileText} />
                <MetricCard title={t('mod_metric_policy')} value="3" icon={Briefcase} color="warning" />
                <MetricCard title={t('mod_metric_partners')} value="8" icon={Globe} color="accent" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
                
                {/* 9.1 Ministerial Command Dashboard */}
                {activeTab === 'admin' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto lg:overflow-hidden">
                        {/* Budget Administration Console */}
                        <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-96 lg:h-full">
                            <h3 className="font-semibold text-lg text-white mb-4 flex items-center flex-shrink-0">
                                <DollarSign className="mr-2 text-green-500" size={20} /> {t('mod_budget_admin')}
                            </h3>
                            <div className="flex-1 min-h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <Sankey
                                        data={budgetData}
                                        node={{ strokeWidth: 0 }}
                                        nodePadding={50}
                                        margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                                        link={{ stroke: '#0891b2' }}
                                    >
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '11px' }} />
                                    </Sankey>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 h-full overflow-y-auto">
                            {/* Defense Policy Management & Agent Alpha */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center justify-between">
                                    <span className="flex items-center"><Briefcase className="mr-2 text-yellow-500" size={20} /> {t('mod_policy_mgmt')}</span>
                                    <span className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-500/30 flex items-center">
                                        <BrainCircuit size={10} className="mr-1"/> AGENT ALPHA
                                    </span>
                                </h3>
                                
                                {/* Alpha Agent Interaction */}
                                <div className="mb-6 p-4 bg-military-900 rounded border border-blue-500/30">
                                    <label className="text-[10px] text-gray-400 font-bold block mb-2">POLICY SIMULATOR (ALPHA)</label>
                                    <div className="flex gap-2 mb-3">
                                        <input 
                                            type="text" 
                                            value={policyProposal}
                                            onChange={(e) => setPolicyProposal(e.target.value)}
                                            placeholder="e.g. Increase reserve force benefits..."
                                            className="flex-1 bg-black/30 border border-white/10 rounded p-2 text-white text-xs focus:border-blue-500"
                                        />
                                        <button 
                                            onClick={handleRunAlpha}
                                            disabled={alphaRunning || !policyProposal}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 text-[10px] font-bold disabled:opacity-50"
                                        >
                                            {alphaRunning ? <RefreshCw className="animate-spin" size={12}/> : 'CONSULT'}
                                        </button>
                                    </div>
                                    
                                    {alphaResult && (
                                        <div className="bg-blue-900/10 p-3 rounded border border-blue-500/20 animate-in fade-in">
                                            <h4 className="text-[10px] font-bold text-blue-400 mb-1">INTEGRATION ANALYSIS</h4>
                                            <p className="text-[10px] text-gray-300 mb-2"><SafeRender content={alphaResult.summary} /></p>
                                            <div className="flex gap-4">
                                                <div className="flex-1 bg-black/20 p-2 rounded">
                                                    <span className="text-[9px] text-gray-500 block">LEGAL VIABILITY</span>
                                                    <span className="text-xs text-white font-bold"><SafeRender content={alphaResult.legal_matrix?.compliance_score} />%</span>
                                                </div>
                                                <div className="flex-1 bg-black/20 p-2 rounded">
                                                    <span className="text-[9px] text-gray-500 block">PUBLIC SENTIMENT</span>
                                                    <span className="text-xs text-white font-bold"><SafeRender content={alphaResult.psych_social_vector?.cognitive_bias_target || "Stable"} /></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {policies.map((pol) => (
                                        <div key={pol.id} className="p-3 bg-military-900 rounded border border-military-600 flex justify-between items-center group hover:border-yellow-500 transition-colors cursor-pointer">
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-yellow-400">{pol.title}</h4>
                                                <p className="text-xs text-gray-400">{pol.id} • {pol.dept}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                pol.status === 'Ratified' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
                                            }`}>{pol.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inter-Ministerial & Intl Hub */}
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Share2 className="mr-2 text-cyan-500" size={20} /> {t('mod_inter_coord')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-military-900 rounded border border-military-600">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-300">Finance Ministry</span>
                                            <Activity size={12} className="text-green-500"/>
                                        </div>
                                        <p className="text-[10px] text-gray-500">Budget Audit: Pending</p>
                                    </div>
                                    <div className="p-3 bg-military-900 rounded border border-military-600">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-300">Foreign Affairs</span>
                                            <Activity size={12} className="text-green-500"/>
                                        </div>
                                        <p className="text-[10px] text-gray-500">Attaché Briefing: Daily</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-military-700">
                                    <h4 className="text-sm font-bold text-white mb-2 flex items-center">
                                        <Globe size={14} className="mr-2 text-blue-500"/> Active Agreements
                                    </h4>
                                    <div className="flex space-x-2">
                                        <span className="text-[10px] bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-1 rounded">USA (FMS)</span>
                                        <span className="text-[10px] bg-red-900/30 text-red-300 border border-red-500/30 px-2 py-1 rounded">China (Infra)</span>
                                        <span className="text-[10px] bg-green-900/30 text-green-300 border border-green-500/30 px-2 py-1 rounded">Kenya (Border)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 9.2 Defense Procurement Management System */}
                {activeTab === 'procure' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden">
                        
                        {/* Procurement Oversight Interface */}
                        <div className="lg:col-span-2 bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col h-auto lg:h-full">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center flex-shrink-0">
                                <Truck className="mr-2 text-green-500" size={20} /> {t('mod_proc_oversight')}
                            </h3>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                {procurements.map((proc) => (
                                    <div key={proc.id} className="bg-military-900/50 p-4 rounded border border-military-600 hover:border-green-500 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{proc.item}</h4>
                                                <p className="text-xs text-gray-400">{proc.id} • {proc.vendor}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-mono text-green-400 font-bold text-sm">{proc.value}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">{proc.status}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                                            <div 
                                                className={`h-2 rounded-full ${proc.progress > 80 ? 'bg-green-500' : proc.progress > 40 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${proc.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QA & Compliance */}
                        <div className="flex flex-col gap-6 h-full overflow-y-auto">
                            <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <ClipboardCheck className="mr-2 text-yellow-500" size={20} /> {t('mod_qa_mgmt')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <span className="text-xs text-gray-300">Ammunition Testing</span>
                                        <span className="text-xs font-bold text-green-500">99.8% PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <span className="text-xs text-gray-300">Vehicle Armor</span>
                                        <span className="text-xs font-bold text-yellow-500">92.0% PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-military-900 rounded border border-military-600">
                                        <span className="text-xs text-gray-300">Comms Encryption</span>
                                        <span className="text-xs font-bold text-green-500">100% PASS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex-1">
                                <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                                    <Scale className="mr-2 text-purple-500" size={20} /> Compliance
                                </h3>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-green-900/20 rounded-full border border-green-500/30">
                                        <CheckCircle size={24} className="text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Audit Ready</h4>
                                        <p className="text-xs text-gray-400">All procurements aligned with Proc. 1100/2019</p>
                                    </div>
                                </div>
                                <button className="w-full bg-military-700 hover:bg-military-600 text-white text-xs py-2 rounded border border-military-500">
                                    Generate Compliance Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MinistryView;

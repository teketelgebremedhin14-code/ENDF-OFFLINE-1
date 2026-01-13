import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Database, Monitor, Save, RefreshCw, Eye, Globe, Shield, Server, Book, CheckCircle, Info, Layers, ArrowDown, Cpu, Code, Zap, Terminal, AlertTriangle, Copy, Wifi, CloudRain, ExternalLink, X, BrainCircuit, Network } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../data/translations';

interface SettingsViewProps {
    currentMode: 'standard' | 'green' | 'red';
    onModeChange: (mode: 'standard' | 'green' | 'red') => void;
    onBack?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentMode, onModeChange, onBack }) => {
    const { t, language, setLanguage } = useLanguage();
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(true);
    const [refreshRate, setRefreshRate] = useState('30s');
    const [dataSovereignty, setDataSovereignty] = useState(true);
    const [activeTab, setActiveTab] = useState<'general' | 'stack'>('general');
    
    const languages: { code: Language, label: string }[] = [
        { code: 'en', label: 'English' },
        { code: 'am', label: 'Amharic (አማርኛ)' },
        { code: 'om', label: 'Oromiffa (Afaan Oromoo)' },
        { code: 'ti', label: 'Tigrinya (ትግርኛ)' },
        { code: 'so', label: 'Somali (Soomaaliga)' },
        { code: 'aa', label: 'Afar (Qafaraf)' },
        { code: 'sid', label: 'Sidama (Sidaamu Afoo)' },
        { code: 'wal', label: 'Wolayita (Wolayttattuwa)' },
        { code: 'had', label: 'Hadiyya (Hadiyyisa)' },
        { code: 'kam', label: 'Kambata (Kambaata)' }
    ];

    const principles = [
        { title: "Hierarchical Design", desc: "Mirrors exact ENDF command structure with automatic updates to new regulations" },
        { title: "Modular View-Based Access", desc: "Custom interfaces per user role and legal permissions" },
        { title: "AI-First Approach", desc: "Artificial intelligence integrated at every functional level" },
        { title: "Security-First Implementation", desc: "Military-grade encryption and access controls" },
        { title: "Online Operation", desc: "Complete functionality via Gemini" },
        { title: "Multilingual Support", desc: "English, Amharic, Oromo, Tigrinya, Somali, Afar, Sidamo, Wolayita, Hadiyya, Kambata" },
        { title: "Single Nervous System", desc: "Every module interacts through controlled interfaces with centralized data" }
    ];

    const techStack = [
        { module: "Core AI Engine", tech: "Google Gemini 3.0 Pro", desc: "Strategic Reasoning & Multimodal Analysis" },
        { module: "Voice Synthesis", tech: "Gemini 2.5 Flash TTS", desc: "Real-time tactical audio generation" },
        { module: "Vision Systems", tech: "Gemini Vision", desc: "Satellite & Drone Imagery Analysis" },
        { module: "14.1 Knowledge Corpus", tech: "Palantir Gotham, QuantCube, BlackSky, Westlaw Edge", desc: "Geopolitical, Legal & Economic Modeling" },
        { module: "14.2 CommandHive", tech: "Microsoft Copilot, DeepMind AlphaFold-Arch, LangChain", desc: "Hierarchical AI Swarm System" },
        { module: "14.3 DefenseEcho", tech: "Causalens, BlackRock Aladdin, C3 AI Gov", desc: "Predictive Governance & Policy Impact" },
        { module: "14.4 FedForceNet", tech: "PySyft, NVIDIA FLARE, IBM Federated Learning", desc: "Privacy-Preserving Federated Intelligence" },
        { module: "14.5 GlobeNet AI", tech: "Google Translate/Whisper, CesiumJS, Raytheon C2", desc: "Global Fusion Command Nexus" },
        { module: "14.6 ThreatEcho", tech: "DARPA PALADIN, Graphika, Unity ML-Agents", desc: "Advanced Wargaming & Disinfo Analysis" },
        { module: "14.7 MatGenForge", tech: "DeepMind GNoME, Citrine Informatics, MATLAB", desc: "Material Discovery Accelerator" },
    ];

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t('settings_title')}</h2>
                    <p className="text-gray-400 text-sm">Manage ENDF Nexus preferences and system parameters.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'general' ? 'bg-military-accent text-white' : 'bg-military-800 text-gray-400'}`}>
                        GENERAL
                    </button>
                    <button onClick={() => setActiveTab('stack')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'stack' ? 'bg-purple-600 text-white' : 'bg-military-800 text-gray-400'}`}>
                        TECH STACK
                    </button>
                    {onBack && (
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white hover:bg-military-700 rounded transition-colors ml-2" title="Back">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full pb-4">
                {activeTab === 'general' ? (
                    <div className="space-y-6">
                        {/* System Principles Section */}
                        <div className="bg-military-800 rounded-lg border border-military-700 overflow-hidden">
                            <div className="p-4 border-b border-military-700 bg-military-900/50">
                                <h3 className="font-semibold text-lg text-white flex items-center">
                                    <Info size={20} className="mr-2 text-cyan-500" /> Foundational Principles
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {principles.map((p, i) => (
                                        <div key={i} className="flex items-start p-3 bg-military-900/50 rounded border border-military-600">
                                            <CheckCircle size={16} className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Configuration Section */}
                        <div className="bg-military-800 rounded-lg border border-military-700 overflow-hidden">
                            <div className="p-4 border-b border-military-700 bg-military-900/50">
                                <h3 className="font-semibold text-lg text-white flex items-center">
                                    <BrainCircuit size={20} className="mr-2 text-purple-500" /> AI Core Status
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between p-4 bg-military-900/50 rounded border border-military-600">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 border border-purple-500/50">
                                            <Zap size={20} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">WALIA AI</h4>
                                            <p className="text-xs text-gray-400">Strategic Reasoning & Multimodal Processing</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                        <span className="text-green-500 font-bold text-xs">OPERATIONAL</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between p-4 bg-military-900/50 rounded border border-military-600">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 border border-blue-500/50">
                                            <Wifi size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">WALIA AI</h4>
                                            <p className="text-xs text-gray-400">Low-latency Voice Synthesis</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                        <span className="text-green-500 font-bold text-xs">ONLINE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-military-800 rounded-lg border border-military-700 overflow-hidden">
                            <div className="p-6 space-y-8">
                                {/* Visual Interface / Tactical Mode */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white flex items-center mb-4 pb-2 border-b border-military-700">
                                        <Eye size={20} className="mr-2 text-green-500" /> {t('settings_tactical_mode')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div 
                                            onClick={() => onModeChange('standard')}
                                            className={`p-4 rounded border-2 cursor-pointer flex flex-col items-center justify-center transition-all ${currentMode === 'standard' ? 'border-blue-500 bg-blue-900/20' : 'border-military-600 bg-military-900 hover:bg-military-700'}`}
                                        >
                                            <Monitor size={24} className="mb-2 text-blue-400" />
                                            <span className="font-bold text-white text-sm">{t('set_mode_standard')}</span>
                                            <span className="text-xs text-gray-500 text-center mt-1">{t('set_mode_standard_desc')}</span>
                                        </div>
                                        <div 
                                            onClick={() => onModeChange('green')}
                                            className={`p-4 rounded border-2 cursor-pointer flex flex-col items-center justify-center transition-all ${currentMode === 'green' ? 'border-green-500 bg-green-900/20' : 'border-military-600 bg-military-900 hover:bg-military-700'}`}
                                        >
                                            <Eye size={24} className="mb-2 text-green-500" />
                                            <span className="font-bold text-green-500 text-sm">{t('set_mode_green')}</span>
                                            <span className="text-xs text-gray-500 text-center mt-1">{t('set_mode_green_desc')}</span>
                                        </div>
                                        <div 
                                            onClick={() => onModeChange('red')}
                                            className={`p-4 rounded border-2 cursor-pointer flex flex-col items-center justify-center transition-all ${currentMode === 'red' ? 'border-red-500 bg-red-900/20' : 'border-military-600 bg-military-900 hover:bg-military-700'}`}
                                        >
                                            <Eye size={24} className="mb-2 text-red-500" />
                                            <span className="font-bold text-red-500 text-sm">{t('set_mode_red')}</span>
                                            <span className="text-xs text-gray-500 text-center mt-1">{t('set_mode_red_desc')}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Language Settings */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white flex items-center mb-4 pb-2 border-b border-military-700">
                                        <Globe size={20} className="mr-2 text-purple-500" /> {t('settings_language')}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code)}
                                                className={`p-2 rounded border text-xs font-bold transition-all ${
                                                    language === lang.code 
                                                    ? 'border-purple-500 bg-purple-900/20 text-white' 
                                                    : 'border-military-600 bg-military-900 text-gray-400 hover:text-white hover:border-gray-500'
                                                }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Security Section */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white flex items-center mb-4 pb-2 border-b border-military-700">
                                        <Lock size={20} className="mr-2 text-red-500" /> {t('settings_security')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">{t('set_bio')}</h4>
                                                <p className="text-xs text-gray-500">{t('set_bio_desc')}</p>
                                            </div>
                                            <div 
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${biometric ? 'bg-green-500' : 'bg-gray-600'}`}
                                                onClick={() => setBiometric(!biometric)}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${biometric ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">{t('set_timeout')}</h4>
                                                <p className="text-xs text-gray-500">{t('set_timeout_desc')}</p>
                                            </div>
                                            <select className="bg-military-800 text-white border border-military-600 rounded px-2 py-1 text-sm">
                                                <option>5 Minutes</option>
                                                <option>15 Minutes</option>
                                                <option>1 Hour</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Notifications Section */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white flex items-center mb-4 pb-2 border-b border-military-700">
                                        <Bell size={20} className="mr-2 text-yellow-500" /> {t('settings_notifications')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">{t('set_alert_sound')}</h4>
                                                <p className="text-xs text-gray-500">{t('set_alert_sound_desc')}</p>
                                            </div>
                                            <div 
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-green-500' : 'bg-gray-600'}`}
                                                onClick={() => setNotifications(!notifications)}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">{t('set_email')}</h4>
                                                <p className="text-xs text-gray-500">{t('set_email_desc')}</p>
                                            </div>
                                            <div className="w-12 h-6 rounded-full p-1 cursor-pointer transition-colors bg-green-500">
                                                <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Data Section */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white flex items-center mb-4 pb-2 border-b border-military-700">
                                        <Database size={20} className="mr-2 text-blue-500" /> {t('settings_data')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">{t('set_refresh')}</h4>
                                                <p className="text-xs text-gray-500">{t('set_refresh_desc')}</p>
                                            </div>
                                            <select 
                                                value={refreshRate}
                                                onChange={(e) => setRefreshRate(e.target.value)}
                                                className="bg-military-800 text-white border border-military-600 rounded px-2 py-1 text-sm"
                                            >
                                                <option value="10s">10s (High Bandwidth)</option>
                                                <option value="30s">30s (Standard)</option>
                                                <option value="1m">1m (Low Bandwidth)</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-military-900 rounded border border-military-600">
                                            <div>
                                                <h4 className="font-medium text-gray-200">Data Sovereignty</h4>
                                                <p className="text-xs text-gray-500">Local-only caching for classified intel</p>
                                            </div>
                                            <div 
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${dataSovereignty ? 'bg-green-500' : 'bg-gray-600'}`}
                                                onClick={() => setDataSovereignty(!dataSovereignty)}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${dataSovereignty ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                ) : (
                    // TECH STACK TAB
                    <div className="space-y-6">
                        <div className="bg-military-800 rounded-lg border border-military-700 overflow-hidden">
                            <div className="p-4 border-b border-military-700 bg-military-900/50">
                                <h3 className="font-semibold text-lg text-white flex items-center">
                                    <Server size={20} className="mr-2 text-purple-500" /> Integrated Technology Stack
                                </h3>
                            </div>
                            <div className="p-0">
                                {techStack.map((tech, i) => (
                                    <div key={i} className="flex flex-col md:flex-row items-start md:items-center p-4 border-b border-military-700 last:border-0 hover:bg-military-900/30 transition-colors">
                                        <div className="md:w-1/3 mb-2 md:mb-0">
                                            <h4 className="text-sm font-bold text-white flex items-center">
                                                <div className="w-2 h-2 bg-military-accent rounded-full mr-2"></div>
                                                {tech.module}
                                            </h4>
                                        </div>
                                        <div className="md:w-1/3 mb-1 md:mb-0">
                                            <span className="text-xs font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/30">
                                                {tech.tech}
                                            </span>
                                        </div>
                                        <div className="md:w-1/3">
                                            <p className="text-xs text-gray-400">{tech.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-military-800 rounded-lg border border-military-700 p-6 flex flex-col items-center justify-center text-center">
                            <Terminal size={48} className="text-gray-500 mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-white mb-2">System Architecture</h3>
                            <p className="text-sm text-gray-400 max-w-2xl">
                                ENDF Nexus is built on a distributed micro-frontend architecture, utilizing secure encrypted channels for all data transmission. 
                                The core leverages WALIA AI for advanced reasoning, integrated with specialized modules for geospatial, signals, and cyber analysis.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">v4.2.0</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Version</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">STABLE</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Build Status</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-500">12ms</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Avg Latency</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
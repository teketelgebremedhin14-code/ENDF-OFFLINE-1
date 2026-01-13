
import React, { useState } from 'react';
import { Megaphone, MessageSquare, ThumbsUp, ThumbsDown, Globe, Edit3, Send, AlertTriangle, X, Image as ImageIcon, Sparkles, Loader } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generatePressRelease, generateTacticalImage } from '../services/aiService';
import { useLanguage } from '../contexts/LanguageContext';

const sentimentData = [
    { time: '08:00', sentiment: 65 },
    { time: '10:00', sentiment: 68 },
    { time: '12:00', sentiment: 72 },
    { time: '14:00', sentiment: 70 },
    { time: '16:00', sentiment: 75 },
    { time: '18:00', sentiment: 78 },
];

interface InfoOpsViewProps {
    onBack?: () => void;
}

const InfoOpsView: React.FC<InfoOpsViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text');
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Reassuring');
    const [draft, setDraft] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Image Gen State
    const [imgPrompt, setImgPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [imgLoading, setImgLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const result = await generatePressRelease(topic, tone, language);
        setDraft(result);
        setLoading(false);
    };

    const handleGenerateImage = async () => {
        if (!imgPrompt) return;
        setImgLoading(true);
        const result = await generateTacticalImage(`Photorealistic military poster style. ${imgPrompt}. High definition, cinematic lighting.`);
        setGeneratedImage(result);
        setImgLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('info_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('info_subtitle')}</p>
                </div>
                
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex">
                        <button 
                            onClick={() => setActiveTab('text')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all ${activeTab === 'text' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Edit3 size={12} className="mr-1 inline"/> TEXT OPS
                        </button>
                        <button 
                            onClick={() => setActiveTab('visual')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all ${activeTab === 'visual' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ImageIcon size={12} className="mr-1 inline"/> VISUAL OPS
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
                <MetricCard title={t('info_metric_sentiment')} value="78%" change={3.2} icon={ThumbsUp} color="success" />
                <MetricCard title={t('info_metric_mentions')} value="1.2k" change={15} icon={MessageSquare} color="accent" />
                <MetricCard title={t('info_metric_disinfo')} value={t('status_low')} icon={AlertTriangle} color="warning" />
                <MetricCard title={t('info_metric_releases')} value="5" icon={Megaphone} />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
                {/* Social Sentiment Analysis */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                    <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                        <MessageSquare className="mr-2 text-blue-500" size={20} /> {t('info_sentiment_analysis')}
                    </h3>
                    <div className="h-64 w-full mb-6">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sentimentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 flex-1">
                        <h4 className="text-sm font-bold text-gray-300 border-b border-military-700 pb-2">Trending Narratives</h4>
                        <div className="bg-military-900 p-3 rounded border-l-4 border-green-500">
                             <p className="text-xs text-gray-300">"ENDF rapid response to flood victims in Somali region praised by locals."</p>
                             <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                                 <span>Source: Twitter/X</span>
                                 <span className="text-green-500">{t('info_narrative_pos')}</span>
                             </div>
                        </div>
                        <div className="bg-military-900 p-3 rounded border-l-4 border-red-500">
                             <p className="text-xs text-gray-300">"Rumors of checkpoint delays near border causing commercial frustration."</p>
                             <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                                 <span>Source: Telegram</span>
                                 <span className="text-red-500">{t('info_narrative_neg')}</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Generator Panel */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                     {activeTab === 'text' ? (
                         <>
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                                <Edit3 className="mr-2 text-purple-500" size={20} /> {t('info_drafter')}
                            </h3>
                            
                            <div className="space-y-4 flex-1">
                                {!draft ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic / Event</label>
                                            <input 
                                                type="text" 
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="e.g. Successful conclusion of joint training exercise"
                                                className="w-full bg-military-900 border border-military-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tone</label>
                                            <select 
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value)}
                                                className="w-full bg-military-900 border border-military-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
                                            >
                                                <option>Reassuring</option>
                                                <option>Authoritative</option>
                                                <option>Warning</option>
                                                <option>Celebratory</option>
                                            </select>
                                        </div>
                                        <button 
                                            onClick={handleGenerate}
                                            disabled={loading || !topic}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded mt-4 transition-all disabled:opacity-50 flex justify-center items-center font-display tracking-wide"
                                        >
                                            {loading ? 'Drafting...' : <><Megaphone size={16} className="mr-2" /> GENERATE DRAFT</>}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 bg-white text-black p-6 font-serif rounded shadow-inner overflow-y-auto mb-4 text-sm leading-relaxed whitespace-pre-wrap">
                                            {draft}
                                        </div>
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={() => setDraft('')}
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded"
                                            >
                                                Discard
                                            </button>
                                            <button 
                                                onClick={() => alert('Sent to Press Office for review.')}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex justify-center items-center"
                                            >
                                                <Send size={16} className="mr-2" /> Send for Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                         </>
                     ) : (
                         <>
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                                <Sparkles className="mr-2 text-pink-500" size={20} /> Visual Asset Generator
                            </h3>
                            <div className="space-y-4 flex-1 flex flex-col">
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={imgPrompt}
                                        onChange={(e) => setImgPrompt(e.target.value)}
                                        placeholder="e.g. Humanitarian aid delivery in remote region..."
                                        className="flex-1 bg-military-900 border border-military-600 rounded p-2 text-white focus:outline-none focus:border-pink-500 text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                                    />
                                    <button 
                                        onClick={handleGenerateImage}
                                        disabled={imgLoading || !imgPrompt}
                                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded font-bold text-xs disabled:opacity-50"
                                    >
                                        GENERATE
                                    </button>
                                </div>

                                <div className="flex-1 bg-black/40 rounded border border-military-700 flex items-center justify-center overflow-hidden relative">
                                    {imgLoading && (
                                        <div className="text-pink-400 flex flex-col items-center">
                                            <Loader className="animate-spin mb-2" size={32} />
                                            <span className="text-xs font-mono animate-pulse">RENDERING ASSET...</span>
                                        </div>
                                    )}
                                    {!imgLoading && !generatedImage && (
                                        <div className="text-gray-600 text-center">
                                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">Enter prompt to generate imagery</p>
                                        </div>
                                    )}
                                    {generatedImage && !imgLoading && (
                                        <img src={generatedImage} alt="Generated Asset" className="w-full h-full object-contain" />
                                    )}
                                </div>
                                
                                {generatedImage && (
                                    <div className="flex justify-end gap-2">
                                        <button className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600">Download</button>
                                        <button className="bg-pink-600 text-white text-xs px-3 py-1 rounded hover:bg-pink-700">Send to Media Team</button>
                                    </div>
                                )}
                            </div>
                         </>
                     )}
                </div>
            </div>
        </div>
    );
};

export default InfoOpsView;

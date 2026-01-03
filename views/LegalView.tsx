
import React, { useState } from 'react';
import { Scale, FileText, CheckCircle, Gavel, Book, Search, Bookmark, AlertTriangle, Clock, User, File as FileIcon, X } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { ETHIOPIAN_LEGAL_FRAMEWORK } from '../data/legalDatabase';
import { useLanguage } from '../contexts/LanguageContext';

interface LegalViewProps {
    onBack?: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ onBack }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'proceedings' | 'library'>('proceedings');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [viewingArticle, setViewingArticle] = useState<any | null>(null);

    const filteredDocs = ETHIOPIAN_LEGAL_FRAMEWORK.map(doc => ({
        ...doc,
        articles: doc.articles.filter(art => {
            const query = searchQuery.toLowerCase();
            return (
                art.title.toLowerCase().includes(query) || 
                art.content.toLowerCase().includes(query) ||
                (art.title_am && art.title_am.includes(query)) ||
                (art.content_am && art.content_am.includes(query)) ||
                doc.title.toLowerCase().includes(query) ||
                (doc.title_am && doc.title_am.includes(query)) ||
                art.tags.some(tag => tag.toLowerCase().includes(query))
            );
        })
    })).filter(doc => doc.articles.length > 0 || doc.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const caseTimeline = [
        { date: '2024-03-01', event: 'Incident Reported', desc: 'Logistics discrepancy filed by Depot Commander.', icon: AlertTriangle, color: 'text-yellow-500' },
        { date: '2024-03-05', event: 'Investigation Opened', desc: 'Military Police Unit 4 assigned.', icon: Search, color: 'text-blue-500' },
        { date: '2024-03-10', event: 'Evidence Submitted', desc: 'Digital logs and witness statements secured.', icon: FileIcon, color: 'text-purple-500' },
        { date: '2024-03-12', event: 'Court Martial Convened', desc: 'Panel selection complete. Hearing scheduled.', icon: Gavel, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t('legal_title')}</h2>
                    <p className="text-gray-400 text-sm">{t('legal_subtitle')}</p>
                </div>
                
                 <div className="flex flex-wrap gap-2 mt-4 md:mt-0 items-center">
                    <div className="bg-military-800 p-1 rounded-lg border border-military-700 flex space-x-1">
                        <button onClick={() => setActiveTab('proceedings')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'proceedings' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <Gavel size={14} className="mr-2"/> {t('legal_proceedings')}
                        </button>
                        <button onClick={() => setActiveTab('library')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center transition-all ${activeTab === 'library' ? 'bg-military-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <Book size={14} className="mr-2"/> {t('legal_library')}
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

            {activeTab === 'proceedings' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
                    {/* Case List */}
                    <div className="bg-military-800 rounded-lg p-4 border border-military-700 flex flex-col">
                        <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
                            <Scale className="mr-2 text-red-500" size={20} /> Active Cases
                        </h3>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                            {['22-89', '22-92', '22-85'].map(id => (
                                <div 
                                    key={id} 
                                    onClick={() => setSelectedCase(id)}
                                    className={`p-3 rounded border cursor-pointer transition-colors ${selectedCase === id ? 'bg-military-700 border-military-accent' : 'bg-military-900 border-military-600 hover:border-gray-500'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white text-sm">Case #{id}</span>
                                        <span className="text-[10px] bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded font-bold">HEARING</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Negligence of Duty • Lt. [REDACTED]</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Visualizer */}
                    <div className="lg:col-span-2 bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-military-700">
                            <div>
                                <h3 className="font-bold text-xl text-white">Proceeding Timeline</h3>
                                <p className="text-xs text-gray-400">Case #{selectedCase || '22-89'} • Status: ACTIVE</p>
                            </div>
                            <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded font-bold flex items-center">
                                <Gavel size={14} className="mr-2" /> ENTER VERDICT
                            </button>
                        </div>

                        <div className="flex-1 relative pl-4">
                            <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-military-700"></div>
                            <div className="space-y-8">
                                {caseTimeline.map((item, idx) => (
                                    <div key={idx} className="relative flex items-start group">
                                        <div className={`absolute left-0 w-10 h-10 rounded-full bg-military-900 border-2 ${idx === caseTimeline.length-1 ? 'border-green-500 animate-pulse' : 'border-military-600'} flex items-center justify-center z-10`}>
                                            <item.icon size={18} className={item.color} />
                                        </div>
                                        <div className="ml-16 bg-military-900/50 p-4 rounded border border-military-700 w-full group-hover:border-military-500 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-sm">{item.event}</h4>
                                                <span className="text-xs text-gray-500 font-mono flex items-center"><Clock size={10} className="mr-1"/> {item.date}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col min-h-0 bg-military-800 rounded-lg border border-military-700">
                    <div className="p-4 border-b border-military-700 bg-military-900/50 flex items-center space-x-3">
                         <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                            <input 
                                type="text" 
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-military-900 border border-military-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-military-accent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                         {filteredDocs.map(doc => (
                             <div key={doc.id} className="space-y-4">
                                 <div className="border-b border-military-600 pb-2 flex justify-between items-end">
                                     <div>
                                         <h3 className="text-xl font-bold text-military-accent flex items-center">
                                            <Book size={20} className="mr-2"/> 
                                            {language === 'am' && doc.title_am ? doc.title_am : doc.title}
                                         </h3>
                                         <p className="text-xs text-gray-400 mt-1">{doc.description} • Year: {doc.year}</p>
                                     </div>
                                     <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-1 rounded">{doc.type.toUpperCase()}</span>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {doc.articles.map(article => (
                                         <div 
                                            key={article.id} 
                                            onClick={() => setViewingArticle(article)}
                                            className="bg-military-900 p-4 rounded border border-military-700 hover:border-military-500 transition-colors group cursor-pointer"
                                         >
                                             <div className="flex justify-between items-start mb-2">
                                                 <span className="text-sm font-bold text-white px-2 py-0.5 bg-military-800 rounded border border-military-600">{article.id}</span>
                                                 <Bookmark size={14} className="text-gray-500 hover:text-military-accent cursor-pointer transition-colors" />
                                             </div>
                                             <h4 className="text-sm font-semibold text-gray-200 mb-2 group-hover:text-white transition-colors">
                                                 {language === 'am' && article.title_am ? article.title_am : article.title}
                                             </h4>
                                             <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap line-clamp-3">
                                                 {language === 'am' && article.content_am ? article.content_am : article.content}
                                             </p>
                                             <div className="mt-3 flex flex-wrap gap-2">
                                                 {article.tags.map(tag => (
                                                     <span key={tag} className="text-[9px] bg-blue-900/10 text-blue-400 px-2 py-0.5 rounded border border-blue-900/20">#{tag}</span>
                                                 ))}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            )}

            {/* Article Modal */}
            {viewingArticle && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-military-800 border border-military-600 rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95">
                        <div className="p-4 border-b border-military-700 flex justify-between items-center">
                             <div className="flex items-center space-x-2">
                                 <FileText size={20} className="text-military-accent" />
                                 <h3 className="font-bold text-white font-display text-lg">{viewingArticle.id}: {language === 'am' ? viewingArticle.title_am : viewingArticle.title}</h3>
                             </div>
                             <button onClick={() => setViewingArticle(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <div className="p-6 overflow-y-auto font-serif leading-relaxed text-gray-200 whitespace-pre-wrap">
                            {language === 'am' && viewingArticle.content_am ? viewingArticle.content_am : viewingArticle.content}
                        </div>
                        <div className="p-4 border-t border-military-700 bg-military-900/50 flex justify-end">
                            <button onClick={() => setViewingArticle(null)} className="bg-military-700 hover:bg-military-600 text-white px-4 py-2 rounded text-xs font-bold">CLOSE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegalView;


import React from 'react';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DocumentViewerProps {
    title: string;
    content: string;
    type: string;
    date: string;
    classification: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET';
    onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ title, content, type, date, classification, onClose }) => {
    const { t } = useLanguage();
    
    const getClassificationColor = () => {
        switch(classification) {
            case 'TOP SECRET': return 'text-red-500 border-red-500';
            case 'SECRET': return 'text-orange-500 border-orange-500';
            case 'CONFIDENTIAL': return 'text-blue-500 border-blue-500';
            default: return 'text-green-500 border-green-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
            <div className="bg-[#f0f0f0] text-black w-full max-w-3xl h-[85vh] rounded shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
                {/* Header Actions */}
                <div className="bg-gray-800 text-gray-200 p-2 flex justify-between items-center print:hidden">
                    <div className="flex items-center space-x-2 text-xs">
                         <span className="bg-gray-700 px-2 py-1 rounded">DOC-ID: {Math.floor(Math.random() * 100000)}</span>
                         <span>{type.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                         <button className="p-2 hover:bg-gray-700 rounded" title="Print">
                             <Printer size={16} />
                         </button>
                         <button className="p-2 hover:bg-gray-700 rounded" title="Download">
                             <Download size={16} />
                         </button>
                         <button onClick={onClose} className="p-2 hover:bg-red-600 rounded" title="Close">
                             <X size={16} />
                         </button>
                    </div>
                </div>

                {/* Document Body */}
                <div className="flex-1 overflow-y-auto p-8 font-serif relative">
                     {/* Watermark */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                         <ShieldCheck size={400} />
                     </div>

                     {/* Classification Header */}
                     <div className="text-center mb-8">
                         <span className={`inline-block border-2 px-4 py-1 text-sm font-bold tracking-[0.2em] mb-2 ${getClassificationColor()}`}>
                             {classification}
                         </span>
                         <div className="text-[10px] text-gray-500 uppercase">Ethiopian National Defense Force • {type}</div>
                     </div>

                     {/* Content */}
                     <div className="max-w-2xl mx-auto">
                         <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6">
                             <h1 className="text-2xl font-bold uppercase">{title}</h1>
                             <span className="text-sm font-mono">{date}</span>
                         </div>

                         <div className="text-justify leading-relaxed whitespace-pre-wrap text-sm">
                             {content}
                         </div>

                         <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between items-end">
                             <div>
                                 <p className="text-xs uppercase font-bold">{t('doc_auth_by')}</p>
                                 <div className="h-12 w-32 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png')] bg-contain bg-no-repeat opacity-60"></div>
                                 <p className="text-sm font-bold">Gen. Berhanu</p>
                                 <p className="text-xs text-gray-600">{t('doc_chief_staff')}</p>
                             </div>
                             <div className="text-right">
                                 <div className="w-20 h-20 border-4 border-double border-red-900 opacity-30 rounded-full flex items-center justify-center transform -rotate-12">
                                     <span className="text-[10px] font-bold text-red-900 uppercase text-center leading-none whitespace-pre-line">
                                         {t('doc_official')}
                                     </span>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     {/* Classification Footer */}
                     <div className="text-center mt-12 pt-12">
                         <span className={`inline-block border-2 px-4 py-1 text-sm font-bold tracking-[0.2em] ${getClassificationColor()}`}>
                             {classification}
                         </span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;

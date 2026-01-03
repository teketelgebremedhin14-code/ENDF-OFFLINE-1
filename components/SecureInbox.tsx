
import React, { useState, useEffect } from 'react';
import { Mail, X, Shield, Lock, Reply, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
    id: string;
    sender: string;
    subject: string;
    timestamp: string;
    classification: string;
    body: string;
}

interface SecureInboxProps {
    onClose: () => void;
}

const SecureInbox: React.FC<SecureInboxProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [decryptedBody, setDecryptedBody] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);

    useEffect(() => {
        // Defined locally to access translations
        const simulatedMessages = [
            {
                id: 'MSG-8821-A',
                sender: 'Gen. Abebaw (Dep. Chief of Staff)',
                subject: t('msg_log_sub'),
                timestamp: '10:42 Z',
                classification: 'SECRET',
                body: t('msg_log_body')
            },
            {
                id: 'MSG-8821-B',
                sender: 'Space Command (Entoto)',
                subject: t('msg_sat_sub'),
                timestamp: '09:15 Z',
                classification: 'CONFIDENTIAL',
                body: t('msg_sat_body')
            },
            {
                id: 'MSG-8821-C',
                sender: 'PM Office (Security Detail)',
                subject: t('msg_pm_sub'),
                timestamp: '08:00 Z',
                classification: 'SECRET',
                body: t('msg_pm_body')
            },
            {
                id: 'MSG-8821-D',
                sender: 'Peacekeeping Ops (ATMIS)',
                subject: t('msg_peace_sub'),
                timestamp: 'Yesterday',
                classification: 'TOP SECRET',
                body: t('msg_peace_body')
            }
        ];
        setMessages(simulatedMessages);
    }, [t]);

    // Decryption Effect
    useEffect(() => {
        if (selectedMessage) {
            setDecryptedBody('');
            setIsDecrypting(true);
            let currentText = '';
            const fullText = selectedMessage.body;
            let index = 0;

            const interval = setInterval(() => {
                if (index < fullText.length) {
                    // Add random chars for effect before real char
                    const char = fullText[index];
                    currentText += char;
                    setDecryptedBody(currentText);
                    index++;
                } else {
                    clearInterval(interval);
                    setIsDecrypting(false);
                }
            }, 5); // Speed of decryption

            return () => clearInterval(interval);
        }
    }, [selectedMessage]);

    const getClassificationColor = (cls: string) => {
        switch (cls) {
            case 'TOP SECRET': return 'text-red-500 border-red-500';
            case 'SECRET': return 'text-orange-500 border-orange-500';
            default: return 'text-green-500 border-green-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0f172a] w-full max-w-6xl h-[85vh] rounded-lg border-2 border-military-600 shadow-2xl flex overflow-hidden font-mono relative">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white z-20 p-2 bg-black/50 rounded-full">
                    <X size={20} />
                </button>

                {/* Left Panel: Message List */}
                <div className="w-1/3 border-r border-military-700 bg-military-900/50 flex flex-col">
                    <div className="p-4 border-b border-military-700 flex justify-between items-center bg-black/20">
                        <div className="flex items-center space-x-2 text-military-accent">
                            <Mail size={18} />
                            <span className="font-bold tracking-wider">{t('inbox_title')}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{t('inbox_encrypted')}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map(msg => (
                            <div 
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 border-b border-military-800 cursor-pointer hover:bg-military-800 transition-colors ${selectedMessage?.id === msg.id ? 'bg-military-800 border-l-4 border-l-military-accent' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-1 rounded border ${getClassificationColor(msg.classification)}`}>
                                        {msg.classification}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                                </div>
                                <h4 className={`text-sm font-bold truncate ${selectedMessage?.id === msg.id ? 'text-white' : 'text-gray-300'}`}>
                                    {msg.subject}
                                </h4>
                                <p className="text-xs text-gray-500 truncate mt-1">{msg.sender}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Reading Pane */}
                <div className="flex-1 flex flex-col bg-[#0b1120] relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-military-700 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center text-gray-400">
                                            <span className="text-military-accent mr-2">{t('lbl_from')}:</span>
                                            {selectedMessage.sender}
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <span className="text-military-accent mr-2">{t('lbl_date')}:</span>
                                            {selectedMessage.timestamp}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <Shield size={32} className={`mb-1 ${getClassificationColor(selectedMessage.classification).split(' ')[0]}`} />
                                    <span className={`text-xs font-bold tracking-widest ${getClassificationColor(selectedMessage.classification).split(' ')[0]}`}>
                                        {selectedMessage.classification}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="max-w-3xl mx-auto bg-black/20 p-6 rounded border border-military-700 shadow-inner min-h-[400px] text-gray-300 leading-relaxed relative">
                                    {isDecrypting && (
                                        <div className="absolute top-2 right-2 text-[10px] text-green-500 animate-pulse flex items-center">
                                            <Lock size={10} className="mr-1" /> {t('inbox_decrypting')}
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap font-mono">
                                        {decryptedBody}
                                        {isDecrypting && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse align-middle"></span>}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-military-700 bg-military-900/30 flex space-x-3">
                                <button className="flex items-center px-4 py-2 bg-military-accent hover:bg-sky-500 text-white rounded text-sm font-bold transition-colors">
                                    <Reply size={16} className="mr-2" /> {t('btn_reply_enc')}
                                </button>
                                <button className="flex items-center px-4 py-2 bg-military-700 hover:bg-military-600 text-white rounded text-sm font-bold transition-colors">
                                    <FileText size={16} className="mr-2" /> {t('btn_forward')}
                                </button>
                                <div className="flex-1"></div>
                                <button className="flex items-center px-4 py-2 hover:bg-red-900/50 text-red-400 rounded text-sm font-bold transition-colors border border-transparent hover:border-red-900">
                                    <Trash2 size={16} className="mr-2" /> {t('btn_delete_cable')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                            <div className="w-24 h-24 rounded-full bg-military-900 flex items-center justify-center mb-4 border border-military-700">
                                <Lock size={48} className="text-military-700" />
                            </div>
                            <p className="text-sm tracking-widest uppercase">{t('inbox_select')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureInbox;

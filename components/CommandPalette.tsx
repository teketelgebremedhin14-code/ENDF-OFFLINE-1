
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Command, LayoutDashboard, Globe, Plane, Anchor, Crosshair, Eye, Truck, Users, FileText, Lock, LogOut, FileSearch, Handshake, Heart, Rocket, BookOpen, Shield, Mail, MessageSquare } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ETHIOPIAN_LEGAL_FRAMEWORK } from '../data/legalDatabase';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
    onAction: (action: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onAction }) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Navigation Commands
    const navCommands = [
        { id: 'nav-overview', label: t('nav_overview'), icon: LayoutDashboard, type: 'navigation', target: ViewState.OVERVIEW },
        { id: 'nav-pres', label: t('nav_presidential'), icon: Globe, type: 'navigation', target: ViewState.PRESIDENTIAL },
        { id: 'nav-ops', label: t('nav_operations'), icon: Crosshair, type: 'navigation', target: ViewState.OPERATIONS },
        { id: 'nav-intel', label: t('nav_intelligence'), icon: Eye, type: 'navigation', target: ViewState.INTELLIGENCE },
        { id: 'nav-space', label: t('nav_space_command'), icon: Rocket, type: 'navigation', target: ViewState.SPACE_COMMAND },
        { id: 'nav-log', label: t('nav_logistics'), icon: Truck, type: 'navigation', target: ViewState.LOGISTICS },
        { id: 'nav-air', label: t('nav_air_force'), icon: Plane, type: 'navigation', target: ViewState.AIR_FORCE },
        { id: 'nav-navy', label: t('nav_navy'), icon: Anchor, type: 'navigation', target: ViewState.NAVY },
        { id: 'nav-hr', label: t('nav_hr'), icon: Users, type: 'navigation', target: ViewState.HR },
        { id: 'nav-legal', label: t('nav_legal'), icon: BookOpen, type: 'navigation', target: ViewState.LEGAL },
        { id: 'nav-ig', label: t('nav_inspector_general'), icon: FileSearch, type: 'navigation', target: ViewState.INSPECTOR_GENERAL },
        { id: 'nav-foreign', label: t('nav_foreign_relations'), icon: Handshake, type: 'navigation', target: ViewState.FOREIGN_RELATIONS },
        { id: 'nav-vets', label: t('nav_veterans'), icon: Heart, type: 'navigation', target: ViewState.VETERANS },
        { id: 'nav-reports', label: t('nav_reports'), icon: FileText, type: 'navigation', target: ViewState.REPORTS },
        
        // Actions
        { id: 'act-inbox', label: t('inbox_title'), icon: Mail, type: 'action', action: 'inbox' },
        { id: 'act-feedback', label: t('feedback_title'), icon: MessageSquare, type: 'action', action: 'feedback' },
        { id: 'act-lock', label: t('logout'), icon: Lock, type: 'action', action: 'logout' },
    ];

    // Simulated Asset Database
    const assetCommands = [
        { id: 'unit-alpha', label: 'Alpha Company (Infantry) - Sector 4', icon: Shield, type: 'navigation', target: ViewState.OPERATIONS, subtext: 'Unit' },
        { id: 'unit-bravo', label: 'Bravo Battalion (Armor) - Moving', icon: Shield, type: 'navigation', target: ViewState.OPERATIONS, subtext: 'Unit' },
        { id: 'asset-su27', label: 'Su-27 Flanker Sqd - Bishoftu', icon: Plane, type: 'navigation', target: ViewState.AIR_FORCE, subtext: 'Asset' },
        { id: 'asset-etrss', label: 'ETRSS-1 Satellite - LEO', icon: Rocket, type: 'navigation', target: ViewState.SPACE_COMMAND, subtext: 'Asset' },
    ];

    // Generate Legal Search Results
    const legalCommands = ETHIOPIAN_LEGAL_FRAMEWORK.flatMap(doc => 
        doc.articles.map(art => ({
            id: `legal-${art.id}`,
            label: `${doc.id} ${art.title}`,
            icon: BookOpen,
            type: 'navigation',
            target: ViewState.LEGAL,
            subtext: 'Legal',
            keywords: [art.content, doc.title, art.id]
        }))
    );

    // Combine and Filter
    const allCommands = [...navCommands, ...assetCommands, ...legalCommands];
    
    const filteredCommands = allCommands.filter(cmd => {
        const q = query.toLowerCase();
        const labelMatch = cmd.label.toLowerCase().includes(q);
        const keywordMatch = (cmd as any).keywords?.some((k: string) => k.toLowerCase().includes(q));
        return labelMatch || keywordMatch;
    }).slice(0, 10); // Limit results

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                executeCommand(filteredCommands[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const executeCommand = (cmd: typeof allCommands[0]) => {
        if (cmd.type === 'navigation') {
            onNavigate((cmd as any).target as ViewState);
        } else {
            onAction((cmd as any).action as string);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-start justify-center pt-[15vh]" onClick={onClose}>
            <div 
                className="bg-military-800 w-full max-w-2xl rounded-xl border border-military-600 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center p-4 border-b border-military-700">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('cmd_placeholder')}
                        className="bg-transparent border-none focus:outline-none text-white text-lg w-full placeholder-gray-500"
                    />
                    <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500 border border-military-600 rounded px-2 py-1">
                        <span className="font-mono">ESC</span>
                        <span>{t('cmd_esc')}</span>
                    </div>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">{t('cmd_no_results')}</div>
                    ) : (
                        filteredCommands.map((cmd, idx) => (
                            <div 
                                key={cmd.id}
                                onClick={() => executeCommand(cmd)}
                                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                                    idx === selectedIndex ? 'bg-military-accent/20 border-l-2 border-military-accent' : 'hover:bg-military-700 border-l-2 border-transparent'
                                }`}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                <div className="flex items-center overflow-hidden">
                                    <cmd.icon size={18} className={`mr-3 flex-shrink-0 ${idx === selectedIndex ? 'text-military-accent' : 'text-gray-400'}`} />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className={`truncate ${idx === selectedIndex ? 'text-white font-medium' : 'text-gray-300'}`}>{cmd.label}</span>
                                        {(cmd as any).subtext && (
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">{(cmd as any).subtext}</span>
                                        )}
                                    </div>
                                </div>
                                {idx === selectedIndex && <ArrowRight size={16} className="text-military-accent flex-shrink-0" />}
                            </div>
                        ))
                    )}
                </div>
                
                <div className="bg-military-900/50 p-2 border-t border-military-700 flex justify-between items-center text-[10px] text-gray-500 px-4">
                    <span>{t('cmd_footer')}</span>
                    <span className="flex items-center"><Command size={10} className="mr-1"/> + K</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;

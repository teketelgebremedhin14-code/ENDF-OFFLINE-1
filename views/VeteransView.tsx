
import React, { useState } from 'react';
import { Heart, Users, Activity, FileText, Briefcase, Search, User, X, ClipboardList } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../contexts/LanguageContext';

interface VeteransViewProps {
    onBack?: () => void;
}

const VeteransView: React.FC<VeteransViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVeteran, setSelectedVeteran] = useState<any | null>(null);

    const veterans = [
        { id: 'VET-1001', name: 'Sgt. Major Tesfaye (Ret)', unit: '3rd Division', status: 'Pension Active', injury: 'None', needs: 'Housing Grant' },
        { id: 'VET-1002', name: 'Cpl. Almaz', unit: 'Logistics', status: 'Rehab Active', injury: 'Lower Limb', needs: 'Prosthetic Renewal' },
        { id: 'VET-1003', name: 'Lt. Berhanu', unit: 'Air Force', status: 'Pension Active', injury: 'None', needs: 'None' },
        { id: 'VET-1004', name: 'Pvt. Jemal', unit: '4th Mech', status: 'Pension Pending', injury: 'Vision', needs: 'Medical Review' },
    ];

    const filteredVets = veterans.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">{t('vet_title')}</h2>
                    <p className="text-gray-400 text-sm font-sans">{t('vet_subtitle')}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title={t('vet_metric_registered')} value="45,200" icon={Users} color="default" />
                <MetricCard title={t('vet_metric_pension')} value="$12.5M" change={0} icon={FileText} color="success" />
                <MetricCard title={t('vet_metric_rehab')} value="340" change={-5} icon={Activity} color="warning" />
                <MetricCard title={t('vet_metric_jobs')} value="1,200" change={15} icon={Briefcase} color="accent" />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
                {/* Search & List */}
                <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                    <h3 className="font-semibold text-lg text-white mb-4 flex items-center font-display">
                        <Search className="mr-2 text-blue-500" size={20} /> Veteran Case Search
                    </h3>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Search by Name or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-military-900 border border-military-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none font-mono text-sm"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredVets.map(vet => (
                            <div 
                                key={vet.id} 
                                onClick={() => setSelectedVeteran(vet)}
                                className={`p-3 rounded border cursor-pointer transition-colors ${selectedVeteran?.id === vet.id ? 'bg-blue-900/30 border-blue-500' : 'bg-military-900 border-military-600 hover:border-gray-500'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-white text-sm font-sans">{vet.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded ${vet.status.includes('Active') ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{vet.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 font-mono">{vet.id} • {vet.unit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details / Rehab */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rehab Stats (Existing) */}
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700 flex flex-col">
                        <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                            <Activity className="mr-2 text-red-500" size={20} /> Rehabilitation Center Status
                        </h3>
                        <div className="flex justify-center items-center relative mb-4">
                             {/* Abstract Body Map */}
                            <div className="relative h-48 w-32 opacity-80">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-gray-600"></div> {/* Head */}
                                <div className="absolute top-9 left-1/2 -translate-x-1/2 w-16 h-24 border-2 border-gray-600 rounded"></div> {/* Torso */}
                                <div className="absolute top-10 left-[-10px] w-4 h-24 border-2 border-gray-600 rounded origin-top -rotate-12"></div> {/* L Arm */}
                                <div className="absolute top-10 right-[-10px] w-4 h-24 border-2 border-yellow-500 rounded origin-top rotate-12 animate-pulse"></div> {/* R Arm - Injured */}
                                <div className="absolute top-32 left-2 w-5 h-32 border-2 border-gray-600 rounded origin-top -rotate-6"></div> {/* L Leg */}
                                <div className="absolute top-32 right-2 w-5 h-32 border-2 border-blue-500 rounded origin-top rotate-6"></div> {/* R Leg - Prosthetic */}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-military-900 p-3 rounded">
                                <span className="block text-xl font-bold text-white">85%</span>
                                <span className="text-[10px] text-gray-400">Recovery Rate</span>
                            </div>
                            <div className="bg-military-900 p-3 rounded">
                                <span className="block text-xl font-bold text-blue-500">45</span>
                                <span className="text-[10px] text-gray-400">3D Printed Limbs</span>
                            </div>
                            <div className="bg-military-900 p-3 rounded">
                                <span className="block text-xl font-bold text-yellow-500">12d</span>
                                <span className="text-[10px] text-gray-400">Avg Wait Time</span>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Panel */}
                    <div className="bg-military-800 rounded-lg p-6 border border-military-700">
                        <h3 className="font-semibold text-lg text-white mb-6 flex items-center font-display">
                            <FileText className="mr-2 text-blue-500" size={20} /> {t('vet_benefits')}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300 font-sans">Monthly Pension Run</span>
                                    <span className="text-green-400 font-bold">100% Complete</span>
                                </div>
                                <div className="w-full bg-military-900 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300 font-sans">Housing Grant Apps</span>
                                    <span className="text-yellow-400 font-bold">Processing (45%)</span>
                                </div>
                                <div className="w-full bg-military-900 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Veteran Details Modal */}
            {selectedVeteran && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-military-800 border border-military-600 rounded-lg w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="p-4 border-b border-military-700 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <User size={20} className="text-blue-500" />
                                <h3 className="font-bold text-white text-lg font-display">Veteran Profile</h3>
                            </div>
                            <button onClick={() => setSelectedVeteran(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center bg-military-900 p-4 rounded border border-military-600">
                                <div>
                                    <h4 className="text-xl font-bold text-white font-sans">{selectedVeteran.name}</h4>
                                    <p className="text-sm text-gray-400 font-mono">{selectedVeteran.id} • {selectedVeteran.unit}</p>
                                </div>
                                <span className={`px-3 py-1 rounded font-bold text-xs ${selectedVeteran.status.includes('Active') ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                    {selectedVeteran.status}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 p-3 rounded border border-military-700">
                                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Injury Record</span>
                                    <span className="text-white font-sans">{selectedVeteran.injury}</span>
                                </div>
                                <div className="bg-black/30 p-3 rounded border border-military-700">
                                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Active Needs</span>
                                    <span className="text-white font-sans">{selectedVeteran.needs}</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center transition-colors">
                                <ClipboardList size={16} className="mr-2" /> VIEW FULL SERVICE RECORD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VeteransView;

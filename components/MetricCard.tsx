
import React from 'react';
import { MetricCardProps } from '../types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface ExtendedMetricCardProps extends MetricCardProps {
    onClick?: () => void;
}

const MetricCard: React.FC<ExtendedMetricCardProps> = ({ title, value, change, icon: Icon, color = 'default', onClick }) => {
  const getColorConfig = () => {
    switch (color) {
      case 'danger': return { 
          border: 'border-l-red-500', 
          text: 'text-red-500', 
          bgIcon: 'bg-red-500/10 text-red-500 border-red-500/20' 
      };
      case 'success': return { 
          border: 'border-l-emerald-500', 
          text: 'text-emerald-500', 
          bgIcon: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
      };
      case 'warning': return { 
          border: 'border-l-amber-500', 
          text: 'text-amber-500', 
          bgIcon: 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
      };
      case 'accent': return { 
          border: 'border-l-sky-500', 
          text: 'text-sky-500', 
          bgIcon: 'bg-sky-500/10 text-sky-500 border-sky-500/20' 
      };
      case 'purple': return { 
          border: 'border-l-purple-500', 
          text: 'text-purple-500', 
          bgIcon: 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
      };
      default: return { 
          border: 'border-l-slate-500', 
          text: 'text-slate-400', 
          bgIcon: 'bg-slate-700/30 text-slate-300 border-slate-600/30' 
      };
    }
  };

  const config = getColorConfig();

  const getChangeDisplay = () => {
    if (change === undefined) return null;
    if (change > 0) return <span className="text-emerald-400 flex items-center text-xs font-mono bg-emerald-950/30 px-1 rounded"><ArrowUp size={10} className="mr-1" /> {change}%</span>;
    if (change < 0) return <span className="text-red-400 flex items-center text-xs font-mono bg-red-950/30 px-1 rounded"><ArrowDown size={10} className="mr-1" /> {Math.abs(change)}%</span>;
    return <span className="text-gray-500 flex items-center text-xs font-mono"><Minus size={10} className="mr-1" /> 0%</span>;
  };

  return (
    <div 
        onClick={onClick}
        className={`glass-panel p-5 rounded-lg shadow-lg flex items-center justify-between border-l-4 ${config.border} transition-all duration-300 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:bg-white/5 hover:translate-y-[-4px] hover:shadow-2xl' : ''}`}
    >
      {/* Hover Glow Effect */}
      {onClick && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>}
      
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 opacity-80 font-sans">{title}</p>
        <div className="flex items-end space-x-3">
          <h3 className="text-3xl font-bold text-white font-display tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</h3>
          <div className="mb-1.5">{getChangeDisplay()}</div>
        </div>
      </div>
      <div className={`p-3 rounded-lg border ${config.bgIcon} backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default MetricCard;

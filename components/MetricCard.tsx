
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
          bg: 'bg-gradient-to-br from-red-500/10 to-red-900/5',
          border: 'border-l-red-500', 
          text: 'text-red-400', 
          iconColor: 'text-red-400',
          bgIcon: 'bg-red-500/20 border-red-500/30' 
      };
      case 'success': return { 
          bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-900/5',
          border: 'border-l-emerald-500', 
          text: 'text-emerald-400', 
          iconColor: 'text-emerald-400',
          bgIcon: 'bg-emerald-500/20 border-emerald-500/30' 
      };
      case 'warning': return { 
          bg: 'bg-gradient-to-br from-amber-500/10 to-amber-900/5',
          border: 'border-l-amber-500', 
          text: 'text-amber-400', 
          iconColor: 'text-amber-400',
          bgIcon: 'bg-amber-500/20 border-amber-500/30' 
      };
      case 'accent': return { 
          bg: 'bg-gradient-to-br from-sky-500/10 to-sky-900/5',
          border: 'border-l-sky-500', 
          text: 'text-sky-400', 
          iconColor: 'text-sky-400',
          bgIcon: 'bg-sky-500/20 border-sky-500/30' 
      };
      case 'purple': return { 
          bg: 'bg-gradient-to-br from-purple-500/10 to-purple-900/5',
          border: 'border-l-purple-500', 
          text: 'text-purple-400', 
          iconColor: 'text-purple-400',
          bgIcon: 'bg-purple-500/20 border-purple-500/30' 
      };
      default: return { 
          bg: 'bg-gradient-to-br from-slate-700/10 to-slate-900/5',
          border: 'border-l-slate-500', 
          text: 'text-slate-400', 
          iconColor: 'text-slate-300',
          bgIcon: 'bg-slate-500/20 border-slate-500/30' 
      };
    }
  };

  const config = getColorConfig();

  const getChangeDisplay = () => {
    if (change === undefined) return null;
    if (change > 0) return <span className="text-emerald-400 flex items-center text-[10px] font-mono bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20"><ArrowUp size={8} className="mr-0.5" /> {change}%</span>;
    if (change < 0) return <span className="text-red-400 flex items-center text-[10px] font-mono bg-red-500/10 px-1 py-0.5 rounded border border-red-500/20"><ArrowDown size={8} className="mr-0.5" /> {Math.abs(change)}%</span>;
    return <span className="text-gray-400 flex items-center text-[10px] font-mono"><Minus size={8} className="mr-0.5" /> 0%</span>;
  };

  return (
    <div 
        onClick={onClick}
        className={`glass-panel p-3 rounded-lg shadow-sm flex items-center justify-between border-l-2 ${config.border} ${config.bg} backdrop-blur-md transition-all duration-300 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:bg-white/5 hover:translate-y-[-1px]' : ''}`}
    >
      {/* Decorative Glow */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-10 ${config.bgIcon.split(' ')[0].replace('/20', '/40')}`}></div>

      <div className="flex-1 min-w-0">
        <p className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 opacity-80 font-sans truncate ${config.text}`}>{title}</p>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight leading-none">{value}</h3>
          <div>{getChangeDisplay()}</div>
        </div>
      </div>
      <div className={`p-2 rounded-md border ${config.bgIcon} backdrop-blur-sm shadow-sm ml-2 group-hover:scale-105 transition-transform duration-300 z-10`}>
        <Icon size={18} strokeWidth={2} className={config.iconColor} />
      </div>
    </div>
  );
};

export default MetricCard;

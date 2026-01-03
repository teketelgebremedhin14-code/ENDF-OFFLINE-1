
import React, { useState, useEffect } from 'react';
import { Crosshair, Shield, Plane, User, HelpCircle, Layers, CloudRain, Grid, Navigation, Activity, ArrowUp, Thermometer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Unit {
  id: string;
  name: string;
  type: 'friendly' | 'hostile' | 'neutral';
  category: 'infantry' | 'armor' | 'air' | 'recon';
  x: number;
  y: number;
  status: 'active' | 'engaged' | 'moving';
  health: number;
  ammo: number;
  // Telemetry
  speed?: number;   // km/h
  heading?: number; // 0-360 degrees
  altitude?: number; // feet (for air assets)
}

const INITIAL_UNITS: Unit[] = [
  { id: 'u1', name: 'Alpha Co.', type: 'friendly', category: 'infantry', x: 30, y: 40, status: 'engaged', health: 85, ammo: 40, speed: 0, heading: 45 },
  { id: 'u2', name: 'Bravo Bat.', type: 'friendly', category: 'armor', x: 45, y: 55, status: 'moving', health: 92, ammo: 78, speed: 45, heading: 120 },
  { id: 'u3', name: 'Eagle 1', type: 'friendly', category: 'air', x: 60, y: 20, status: 'active', health: 100, ammo: 100, speed: 280, heading: 90, altitude: 15400 },
  { id: 'h1', name: 'Insurgent Grp A', type: 'hostile', category: 'infantry', x: 35, y: 35, status: 'engaged', health: 40, ammo: 20, speed: 0, heading: 225 },
  { id: 'h2', name: 'Unknown Vehicle', type: 'hostile', category: 'armor', x: 70, y: 60, status: 'moving', health: 100, ammo: 0, speed: 35, heading: 270 },
];

interface TacticalMapProps {
    holoMode?: boolean;
    customUnits?: Unit[];
    terrainType?: string; // 'Mountainous / Rough', 'Desert / Open', 'Urban / Dense', 'Jungle / Forest'
}

const TacticalMap: React.FC<TacticalMapProps> = ({ holoMode = false, customUnits, terrainType = 'Mountainous / Rough' }) => {
  const { t } = useLanguage();
  const [units, setUnits] = useState<Unit[]>(customUnits || INITIAL_UNITS);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [scanLine, setScanLine] = useState(0);
  
  // Layer States
  const [showGrid, setShowGrid] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [showRanges, setShowRanges] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Sync with prop changes
  useEffect(() => {
      if (customUnits) {
          setUnits(customUnits);
      }
  }, [customUnits]);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Simulate unit movement occasionally (Only if NOT controlled externally)
  useEffect(() => {
    if (customUnits) return; // Don't self-animate if controlled by parent (Wargaming View)

    const moveInterval = setInterval(() => {
      setUnits(prev => prev.map(u => {
        if (u.status === 'moving' || u.category === 'air') {
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            // Basic telemetry drift simulation
            let newHeading = u.heading;
            if (u.heading !== undefined) {
                newHeading = (u.heading + (Math.random() - 0.5) * 10 + 360) % 360;
            }
            
            return { 
                ...u, 
                x: Math.max(5, Math.min(95, u.x + dx)), 
                y: Math.max(5, Math.min(95, u.y + dy)),
                heading: newHeading,
                speed: u.speed !== undefined ? Math.max(0, u.speed + (Math.random() - 0.5) * 5) : u.speed
            };
        }
        return u;
      }));
    }, 1000);
    return () => clearInterval(moveInterval);
  }, [customUnits]);

  const getUnitColor = (type: string) => {
    if (holoMode) {
        switch (type) {
            case 'friendly': return '#06b6d4'; // Cyan
            case 'hostile': return '#f43f5e'; // Rose
            default: return '#fbbf24'; // Amber
        }
    }
    switch (type) {
        case 'friendly': return '#3b82f6'; // Blue
        case 'hostile': return '#ef4444'; // Red
        default: return '#fbbf24'; // Amber
    }
  };

  const UnitIcon = ({ category, size = 16 }: { category: string, size?: number }) => {
      switch(category) {
          case 'armor': return <Shield size={size} />;
          case 'air': return <Plane size={size} />;
          case 'infantry': return <User size={size} />;
          case 'recon': return <Crosshair size={size} />;
          default: return <HelpCircle size={size} />;
      }
  };

  const getTerrainVisuals = () => {
      const baseColor = holoMode ? '#083344' : '#1e293b';
      const strokeColor = holoMode ? '#06b6d4' : '#475569';
      
      if (terrainType.includes('Desert')) {
          return (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <path d="M0 100 Q 50 80 100 100" fill="none" stroke={strokeColor} strokeWidth="0.5" />
                  <path d="M0 20 Q 50 40 100 20" fill="none" stroke={strokeColor} strokeWidth="0.5" />
                  <rect width="100%" height="100%" fill="url(#sandPattern)" />
                  <defs>
                      <pattern id="sandPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="0.5" fill={strokeColor} opacity="0.5"/>
                          <circle cx="12" cy="12" r="0.5" fill={strokeColor} opacity="0.5"/>
                      </pattern>
                  </defs>
              </svg>
          );
      } else if (terrainType.includes('Urban')) {
          return (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <defs>
                      <pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={strokeColor} strokeWidth="1"/>
                          <rect x="5" y="5" width="10" height="10" fill={baseColor} stroke={strokeColor} />
                          <rect x="25" y="25" width="10" height="10" fill={baseColor} stroke={strokeColor} />
                          <rect x="5" y="25" width="10" height="10" fill={baseColor} stroke={strokeColor} />
                      </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#urbanGrid)" />
              </svg>
          );
      } else {
          // Mountainous (Highlands)
          return (
            <svg className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${holoMode ? 'opacity-40 text-cyan-500 fill-current' : 'opacity-20'}`}>
                {/* Contour Lines Simulation */}
                <path d="M0 100 C 20 80, 50 90, 80 85 S 100 95, 100 100" fill="none" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                <path d="M0 90 C 30 70, 60 80, 90 75" fill="none" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                <path d="M10 80 C 40 60, 70 70, 100 65" fill="none" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                
                {/* Elevation Peaks */}
                <path d="M0 100 Q 30 80 50 90 T 100 85 V 100 H 0 Z" fill={baseColor} stroke={holoMode ? '#06b6d4' : 'none'} strokeWidth={holoMode ? 0.5 : 0} />
                <path d="M60 0 Q 70 30 90 20 T 100 10 V 0 H 60 Z" fill={baseColor} stroke={holoMode ? '#06b6d4' : 'none'} strokeWidth={holoMode ? 0.5 : 0} />
            </svg>
          );
      }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none group transition-all duration-700 ${holoMode ? 'bg-black perspective-[1000px]' : 'bg-[#0b1120]'}`}>
        
        {/* Holographic Container Transform */}
        <div className={`w-full h-full relative transition-transform duration-75 ${holoMode ? 'rotate-x-12 scale-95 opacity-90' : ''}`} style={holoMode ? { transformStyle: 'preserve-3d', transform: 'rotateX(20deg) scale(0.9)' } : {}}>
            
            {/* Terrain Visuals */}
            {getTerrainVisuals()}

            {/* Heatmap Overlay (Elevation/Activity) */}
            {showHeatmap && (
                <div className="absolute inset-0 opacity-30" style={{
                    background: 'radial-gradient(circle at 30% 40%, rgba(255,0,0,0.4), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,165,0,0.3), transparent 30%)'
                }}></div>
            )}

            {/* Grid Background */}
            {showGrid && (
                <div className="absolute inset-0" style={{ 
                    backgroundImage: `linear-gradient(${holoMode ? '#06b6d4' : '#1e293b'} 1px, transparent 1px), linear-gradient(90deg, ${holoMode ? '#06b6d4' : '#1e293b'} 1px, transparent 1px)`, 
                    backgroundSize: '40px 40px',
                    opacity: holoMode ? 0.2 : 0.5
                }}></div>
            )}

            {/* Weather Layer */}
            {showWeather && (
                <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                    <svg width="100%" height="100%">
                        <pattern id="rain" width="10" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 5 0 L 0 40" stroke={holoMode ? "#22d3ee" : "#60a5fa"} strokeWidth="1" opacity="0.5"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#rain)" className="animate-pulse" />
                    </svg>
                </div>
            )}

            {/* Scanner Effect */}
            <div 
                className={`absolute top-0 bottom-0 w-1 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-75 pointer-events-none z-0 ${holoMode ? 'bg-cyan-500/50 shadow-cyan-500/50' : 'bg-green-500/30'}`}
                style={{ left: `${scanLine}%` }}
            ></div>

            {/* Units Layer */}
            {units.map((unit) => (
                <div
                    key={unit.id}
                    className={`absolute -ml-4 -mt-4 cursor-pointer transition-all duration-500 flex items-center justify-center transform hover:scale-125 z-10 ${selectedUnit?.id === unit.id ? 'scale-125 z-20' : ''}`}
                    style={{ 
                        left: `${unit.x}%`, 
                        top: `${unit.y}%`,
                        transform: holoMode ? `translateZ(${unit.category === 'air' ? '40px' : '10px'})` : 'none'
                    }}
                    onClick={() => setSelectedUnit(unit)}
                >
                    {/* Engagement Range Ring */}
                    {showRanges && unit.type === 'hostile' && (
                        <div className={`absolute w-32 h-32 border rounded-full animate-pulse pointer-events-none ${holoMode ? 'border-rose-500/30 bg-rose-500/10' : 'border-red-500/20 bg-red-500/5'}`}></div>
                    )}
                    
                    {/* Selection Ring */}
                    {selectedUnit?.id === unit.id && (
                        <div className="absolute inset-[-8px] border border-white rounded-full animate-ping opacity-50"></div>
                    )}
                    
                    {/* Unit Shape */}
                    <div 
                        className={`p-1.5 rounded-full border-2 flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform duration-500 ${holoMode ? 'shadow-[0_0_10px_currentColor]' : ''}`}
                        style={{ 
                            borderColor: getUnitColor(unit.type), 
                            backgroundColor: `${getUnitColor(unit.type)}33`, // 20% opacity
                            color: getUnitColor(unit.type),
                            transform: `rotate(${unit.heading || 0}deg)`
                        }}
                    >
                        <UnitIcon category={unit.category} size={14} />
                    </div>
                    
                    {/* Label - Floating in Holo Mode (Counter Rotation to stay upright?) */}
                    <span className={`absolute top-full mt-1 text-[10px] font-mono font-bold whitespace-nowrap px-1 rounded pointer-events-none ${holoMode ? 'text-cyan-300 bg-cyan-900/50 border border-cyan-700' : 'text-white bg-black/50'}`}>
                        {unit.name}
                    </span>
                    
                    {/* Holo Stalk (Elevation Line) */}
                    {holoMode && unit.category === 'air' && (
                        <div className="absolute top-1/2 left-1/2 w-[1px] h-[40px] bg-cyan-500/50 origin-top transform rotate-x-90 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                    )}
                </div>
            ))}
        </div>

        {/* Holo Scanlines Overlay */}
        {holoMode && (
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-1 z-30">
            <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded border flex items-center justify-center transition-colors ${showGrid ? 'bg-military-accent text-white border-military-accent' : 'bg-black/50 text-gray-400 border-gray-600'}`}
                title="Toggle Grid"
            >
                <Grid size={14} />
            </button>
            <button 
                onClick={() => setShowWeather(!showWeather)}
                className={`p-1.5 rounded border flex items-center justify-center transition-colors ${showWeather ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/50 text-gray-400 border-gray-600'}`}
                title="Toggle Weather"
            >
                <CloudRain size={14} />
            </button>
             <button 
                onClick={() => setShowRanges(!showRanges)}
                className={`p-1.5 rounded border flex items-center justify-center transition-colors ${showRanges ? 'bg-red-600 text-white border-red-500' : 'bg-black/50 text-gray-400 border-gray-600'}`}
                title="Toggle Threat Ranges"
            >
                <Crosshair size={14} />
            </button>
            <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`p-1.5 rounded border flex items-center justify-center transition-colors ${showHeatmap ? 'bg-orange-600 text-white border-orange-500' : 'bg-black/50 text-gray-400 border-gray-600'}`}
                title="Toggle Elevation Heatmap"
            >
                <Thermometer size={14} />
            </button>
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 pointer-events-none z-30">
            <div className="bg-black/60 backdrop-blur px-3 py-1 rounded border-l-2 border-military-accent">
                <span className="text-[10px] text-gray-400 block">{t('lbl_sector')}</span>
                <span className="text-military-accent font-mono font-bold">ALPHA-9</span>
            </div>
            <div className="bg-black/60 backdrop-blur px-3 py-1 rounded border-l-2 border-green-500">
                <span className="text-[10px] text-gray-400 block">{t('lbl_link')}</span>
                <span className="text-green-500 font-mono font-bold">ONLINE (98%)</span>
            </div>
            <div className="bg-black/60 backdrop-blur px-3 py-1 rounded border-l-2 border-gray-500">
                <span className="text-[10px] text-gray-400 block">TERRAIN</span>
                <span className="text-white font-mono font-bold uppercase">{terrainType.split('/')[0]}</span>
            </div>
        </div>

        {/* Unit Detail Card (Bottom Right) - Enhanced with Telemetry */}
        {selectedUnit && (
            <div className="absolute bottom-4 right-4 w-64 bg-military-900/95 backdrop-blur border border-military-600 rounded-lg p-4 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200 z-40">
                <div className="flex justify-between items-start mb-3 pb-2 border-b border-military-700">
                    <div>
                        <h4 className="font-bold text-white text-sm font-display tracking-wider">{selectedUnit.name}</h4>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            selectedUnit.type === 'friendly' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'
                        }`}>
                            {selectedUnit.type === 'friendly' ? t('status_active') : t('status_engaged')}
                        </span>
                    </div>
                    <button onClick={(e) => {e.stopPropagation(); setSelectedUnit(null);}} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
                        <UnitIcon category={selectedUnit.category} size={14} />
                        <span className="uppercase">{selectedUnit.category}</span>
                    </div>

                    {/* Health & Ammo */}
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Integrity</span>
                            <span>{Math.round(selectedUnit.health)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${selectedUnit.health < 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${selectedUnit.health}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Live Telemetry Data */}
                    <div className="bg-black/40 p-2 rounded border border-military-700 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-gray-500 flex items-center"><Activity size={8} className="mr-1"/> SPEED</span>
                            <span className="text-cyan-400 font-bold">{selectedUnit.speed !== undefined ? Math.round(selectedUnit.speed) : 0} KM/H</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-gray-500 flex items-center"><Navigation size={8} className="mr-1"/> HDG</span>
                            <span className="text-cyan-400 font-bold">{selectedUnit.heading !== undefined ? Math.round(selectedUnit.heading) : 0}°</span>
                        </div>
                        {selectedUnit.category === 'air' && (
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-gray-500 flex items-center"><ArrowUp size={8} className="mr-1"/> ALT</span>
                                <span className="text-cyan-400 font-bold">{selectedUnit.altitude !== undefined ? Math.round(selectedUnit.altitude) : 0} FT</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-gray-500">COORD</span>
                            <span className="text-gray-300">G-{Math.floor(selectedUnit.x)}-{Math.floor(selectedUnit.y)}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button className="bg-military-700 hover:bg-military-600 text-[10px] py-1 rounded text-white border border-military-600">
                            COMMUNICATE
                        </button>
                        <button className="bg-military-700 hover:bg-military-600 text-[10px] py-1 rounded text-white border border-military-600">
                            LOGS
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TacticalMap;

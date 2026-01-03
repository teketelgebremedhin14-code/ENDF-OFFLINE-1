
import React, { useState, useEffect } from 'react';
import { Truck, Warehouse, AlertTriangle, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Convoy {
    id: string;
    route: number; // Index of route
    progress: number; // 0 to 100
    status: 'Normal' | 'Delayed' | 'Critical';
    type: 'Truck' | 'Drone'; // New Type
}

interface LogisticsMapProps {
    onRouteStatusChange?: (routeId: number, isBlocked: boolean) => void;
}

const LogisticsMap: React.FC<LogisticsMapProps> = ({ onRouteStatusChange }) => {
    const { t } = useLanguage();
    const [convoys, setConvoys] = useState<Convoy[]>([
        { id: 'C-Alpha', route: 0, progress: 10, status: 'Normal', type: 'Truck' },
        { id: 'C-Bravo', route: 1, progress: 60, status: 'Delayed', type: 'Truck' },
        { id: 'C-Charlie', route: 2, progress: 30, status: 'Normal', type: 'Truck' },
        { id: 'D-UAV-1', route: 0, progress: 80, status: 'Normal', type: 'Drone' }, // Autonomous Drone
    ]);

    // Track route health locally for visual feedback
    const [routeHealth, setRouteHealth] = useState([true, false, true]); // true = clear, false = blocked

    // Animate Convoys
    useEffect(() => {
        const interval = setInterval(() => {
            setConvoys(prev => prev.map(c => {
                const isRouteBlocked = !routeHealth[c.route];
                // Slow down if blocked, Drones are less affected (fly over)
                let speed = isRouteBlocked ? 0.1 : (c.status === 'Delayed' ? 0.2 : 0.8);
                if (c.type === 'Drone') speed = 1.5; // Drones are faster
                
                let newProgress = c.progress + speed;
                if (newProgress > 100) newProgress = 0;
                
                // Update status based on route health (Drones immune to ground block)
                const newStatus = (isRouteBlocked && c.type !== 'Drone') ? 'Critical' : (c.status === 'Critical' ? 'Delayed' : c.status);

                return { ...c, progress: newProgress, status: newStatus };
            }));
        }, 100);
        return () => clearInterval(interval);
    }, [routeHealth]);

    // SVG Path definitions for routes (simulated over Ethiopia map abstract)
    const routes = [
        { id: 0, path: "M 380 300 Q 300 200 280 150", color: "#3b82f6" }, // Addis to North
        { id: 1, path: "M 380 300 L 520 250", color: "#eab308" }, // Addis to East
        { id: 2, path: "M 380 300 Q 350 450 250 450", color: "#22c55e" }, // Addis to South
    ];

    const handleRouteClick = (index: number) => {
        const newHealth = [...routeHealth];
        newHealth[index] = !newHealth[index];
        setRouteHealth(newHealth);
        if (onRouteStatusChange) {
            onRouteStatusChange(index, !newHealth[index]);
        }
    };

    const getPointOnPath = (pathStr: string, percent: number) => {
        // Simplified point calculation for demo (Bezier/Line approx)
        if (pathStr.includes("Q")) {
             // Quad Bezier Approx
             const parts = pathStr.split(" ");
             const startX = parseInt(parts[1]);
             const startY = parseInt(parts[2]);
             const cpX = parseInt(parts[4]);
             const cpY = parseInt(parts[5]);
             const endX = parseInt(parts[6]);
             const endY = parseInt(parts[7]);
             const t = percent / 100;
             const x = (1-t)*(1-t)*startX + 2*(1-t)*t*cpX + t*t*endX;
             const y = (1-t)*(1-t)*startY + 2*(1-t)*t*cpY + t*t*endY;
             return { x, y };
        } else {
             // Line Approx
             const parts = pathStr.split(" ");
             const startX = parseInt(parts[1]);
             const startY = parseInt(parts[2]);
             const endX = parseInt(parts[4]);
             const endY = parseInt(parts[5]);
             const t = percent / 100;
             const x = startX + (endX - startX) * t;
             const y = startY + (endY - startY) * t;
             return { x, y };
        }
    };

    return (
        <div className="relative w-full h-[400px] bg-[#0f172a] rounded-lg border border-military-700 overflow-hidden shadow-inner group">
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ 
                backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}></div>

            <div className="absolute top-4 left-4 z-10 bg-black/60 px-2 py-1 rounded border border-gray-600">
                <span className="text-[10px] text-gray-300 font-mono">CLICK ROUTE TO TOGGLE STATUS</span>
            </div>

            <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* Routes */}
                {routes.map((route, i) => (
                    <g key={i} onClick={() => handleRouteClick(i)} className="cursor-pointer group/route">
                        {/* Invisible thicker line for easier clicking */}
                        <path d={route.path} fill="none" stroke="transparent" strokeWidth="20" />
                        
                        {/* Visible Route Line */}
                        <path 
                            d={route.path}
                            fill="none"
                            stroke={!routeHealth[i] ? "#ef4444" : route.color}
                            strokeWidth="3"
                            strokeOpacity={!routeHealth[i] ? "0.8" : "0.3"}
                            strokeDasharray={!routeHealth[i] ? "5 5" : "none"}
                            className="transition-all duration-300 group-hover/route:stroke-white group-hover/route:stroke-opacity-50"
                        />
                        {!routeHealth[i] && (
                            <text x={getPointOnPath(route.path, 50).x} y={getPointOnPath(route.path, 50).y} fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace">BLOCKED</text>
                        )}
                    </g>
                ))}
                
                {/* Hubs */}
                <circle cx="380" cy="300" r="8" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                <text x="380" y="325" fill="white" fontSize="10" textAnchor="middle" className="font-mono font-bold">{t('log_map_addis')}</text>

                <rect x="270" y="140" width="20" height="20" fill="#1e293b" stroke="#fff" />
                <text x="280" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{t('log_map_base_n')}</text>

                <rect x="510" y="240" width="20" height="20" fill="#1e293b" stroke="#fff" />
                <text x="520" y="230" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{t('log_map_base_e')}</text>

                <rect x="240" y="440" width="20" height="20" fill="#1e293b" stroke="#fff" />
                <text x="250" y="475" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{t('log_map_base_s')}</text>

                {/* Animated Convoys & Drones */}
                {convoys.map((c, i) => {
                    const pos = getPointOnPath(routes[c.route].path, c.progress);
                    return (
                        <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                            {c.type === 'Drone' ? (
                                <g>
                                    <circle r="4" fill="#06b6d4" className="animate-ping" opacity="0.5"/>
                                    <path d="M-4,-2 L4,-2 L0,4 Z" fill="#06b6d4" />
                                </g>
                            ) : (
                                <g>
                                    <circle r="12" fill={c.status === 'Critical' ? '#ef4444' : c.status === 'Delayed' ? '#eab308' : '#3b82f6'} opacity="0.2" className="animate-ping" />
                                    <circle r="6" fill={c.status === 'Critical' ? '#ef4444' : c.status === 'Delayed' ? '#eab308' : '#3b82f6'} stroke="#fff" strokeWidth="1" />
                                </g>
                            )}
                            
                            {/* Tooltip on Hover */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <rect x="10" y="-30" width="80" height="40" rx="4" fill="rgba(0,0,0,0.8)" />
                                <text x="15" y="-18" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{c.id}</text>
                                <text x="15" y="-6" fill={c.status === 'Critical' ? '#ef4444' : c.status === 'Delayed' ? '#eab308' : '#22c55e'} fontSize="9" fontFamily="monospace">{c.status}</text>
                            </g>
                        </g>
                    );
                })}
            </svg>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded border border-military-600 backdrop-blur pointer-events-none">
                <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase font-display">{t('log_title')} Key</h4>
                <div className="space-y-1">
                    <div className="flex items-center text-[10px] text-gray-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> {t('log_legend_convoy')}
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span> Drone Asset
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> {t('log_legend_delayed')}
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400 font-mono">
                        <span className="w-2 h-2 border border-white bg-military-900 mr-2"></span> {t('log_legend_depot')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsMap;

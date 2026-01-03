
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Fingerprint, Lock, Loader, AlertTriangle, Activity, Hexagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Digital Rain / Matrix Animation with Amharic
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fontSize = 20; // Increased size
      const columns = canvas.width / fontSize;
      const drops: number[] = Array(Math.floor(columns)).fill(1);

      // Matrix characters + Amharic + Numbers
      const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
      const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nums = '0123456789';
      // Amharic Characters
      const amharic = 'ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ';
      
      const alphabet = katakana + latin + nums + amharic;

      let animationFrameId: number;

      const draw = () => {
          // Trail effect: Translucent black background
          ctx.fillStyle = 'rgba(2, 6, 23, 0.05)'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.font = `bold ${fontSize}px monospace`; // Added bold weight

          for (let i = 0; i < drops.length; i++) {
              const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
              
              // Randomly make some characters white (glint), others system color
              const isWhite = Math.random() > 0.95;
              ctx.fillStyle = isWhite ? '#ffffff' : '#0ea5e9'; // Cyan/White mix

              ctx.fillText(text, i * fontSize, drops[i] * fontSize);

              // Randomize drop reset to create varying rain speeds
              if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                  drops[i] = 0;
              }
              drops[i]++;
          }
          animationFrameId = requestAnimationFrame(draw);
      };

      draw();

      const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  const playBootSound = () => {
      try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          // Power up sweep
          osc.type = 'sine';
          osc.frequency.setValueAtTime(100, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
          
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
          console.error("Audio init failed", e);
      }
  };

  const handleAuth = () => {
    playBootSound();
    setLoading(true);
    setStatus(t('login_handshake'));
    
    setTimeout(() => {
        setStatus(t('login_biometric'));
        setTimeout(() => {
             setStatus(t('login_granted'));
             setTimeout(() => {
                 onLogin();
             }, 600);
        }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-gray-200 relative overflow-hidden font-mono selection:bg-military-accent selection:text-black">
       {/* Matrix Background */}
       <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
       
       {/* Vignette Overlay for focus */}
       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,#020617_90%)] z-0"></div>
       
       {/* Very Small, Centered Login Card */}
       <div className="z-10 bg-[#0f172a]/95 backdrop-blur-md p-5 rounded-lg border border-military-600 shadow-[0_0_60px_rgba(14,165,233,0.15)] w-[260px] text-center relative animate-in fade-in zoom-in duration-500 flex flex-col items-center">
           
           {/* Top Decorator */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-military-accent shadow-[0_0_10px_#0ea5e9]"></div>
           
           {/* Logo / Icon */}
           <div className="mb-4 mt-2 relative group cursor-pointer">
               <div className="absolute inset-0 bg-military-accent/20 rounded-full blur-md animate-pulse"></div>
               <div className="relative w-12 h-12 bg-[#020617] rounded-full flex items-center justify-center border border-military-500 shadow-inner">
                   <Hexagon size={24} className="text-military-accent" />
               </div>
           </div>

           <h1 className="text-lg font-bold text-white tracking-widest mb-0.5 font-display">ENDF NEXUS</h1>
           <p className="text-[8px] text-gray-500 mb-4 tracking-[0.3em] uppercase">Secure Terminal</p>

           <div className="w-full space-y-3">
               {/* ID Input (Visual Only) */}
               <div className="bg-black/50 border border-military-700 rounded px-2 py-1.5 flex items-center group focus-within:border-military-accent transition-colors">
                   <Lock size={10} className="text-gray-500 mr-2 group-focus-within:text-military-accent" />
                   <div className="flex-1 text-left">
                       <div className="text-[8px] text-gray-600 font-bold uppercase leading-none mb-0.5">Identity Key</div>
                       <input 
                            type="text" 
                            defaultValue="CMDR-8821-X" 
                            className="bg-transparent border-none p-0 text-[10px] text-gray-300 w-full focus:outline-none font-mono tracking-wider"
                            readOnly
                       />
                   </div>
               </div>

               {/* Auth Button */}
               <button 
                  onClick={handleAuth}
                  disabled={loading}
                  className="w-full bg-military-accent hover:bg-sky-400 text-black font-bold py-2 rounded flex items-center justify-center transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] active:scale-95"
               >
                   {loading ? (
                       <Loader size={12} className="animate-spin" />
                   ) : (
                       <div className="flex items-center text-[10px] tracking-widest uppercase">
                           <Fingerprint size={12} className="mr-1.5" /> 
                           Initialize
                       </div>
                   )}
               </button>
           </div>

           {/* Status Text */}
           <div className="h-4 mt-3 flex items-center justify-center">
               {status ? (
                   <span className="text-[8px] text-military-accent animate-pulse font-mono uppercase tracking-wider">{status}</span>
               ) : (
                   <span className="text-[8px] text-gray-600 font-mono uppercase">System Standby</span>
               )}
           </div>

           {/* Language Toggle */}
           <div className="mt-3 pt-2 border-t border-military-800 w-full flex justify-between items-center px-1">
               <div className="flex items-center text-[8px] text-gray-600">
                   <Activity size={8} className="text-green-500 mr-1" />
                   SECURE
               </div>
               <button 
                    onClick={() => setLanguage(language === 'en' ? 'am' : 'en')} 
                    className="text-[8px] text-gray-500 hover:text-white uppercase font-bold tracking-wider hover:underline"
               >
                    {language === 'en' ? 'አማርኛ' : 'ENG'}
               </button>
           </div>
       </div>
       
       <div className="absolute bottom-4 text-[8px] text-gray-600 font-mono z-10 opacity-50">
           RESTRICTED ACCESS // AUTHORIZED PERSONNEL ONLY
       </div>
    </div>
  );
};

export default LoginScreen;

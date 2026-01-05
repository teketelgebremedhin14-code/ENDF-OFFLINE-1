import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, School, BrainCircuit, Activity, Target, 
  BarChart3, AlertOctagon, GraduationCap, Globe, BookOpen, 
  Cpu, Zap, CheckCircle2, ChevronRight, LayoutDashboard,
  Search, Bell, Settings, FileText, Microscope, Plane, LifeBuoy,
  ChevronDown, Filter, Database, MessageSquare, Award
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, 
  PolarGrid, PolarAngleAxis, Radar, Cell 
} from 'recharts';

// --- AI SERVICE: OLLAMA LLAMA3 INTEGRATION ---
const AI_SERVICE = {
  async getStrategicInsight(context: string) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "llama3",
          prompt: `Role: ENDF Education Command AI. Task: Analyze the following and provide a 2-sentence military strategic directive. Context: ${context}`,
          stream: false
        })
      });
      const data = await response.json();
      return data.response;
    } catch (e) {
      return "Strategic Insight Offline. Llama3 endpoint not detected.";
    }
  }
};

const EducationTrainingSystem = () => {
  // Navigation & UI State
  const [activeDirectorate, setActiveDirectorate] = useState<string | null>('officer');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("Initializing Llama3 Analysis Engine...");
  
  // Ref for scroll-to-top on module change
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AI_SERVICE.getStrategicInsight("Recruitment is up 12% but technical certification at Tolay Academy is lagging by 5%.")
      .then(res => setAiAnalysis(res));
  }, []);

  // --- MOCK DATA ---
  const readinessStats = [
    { name: 'Tactics', value: 85 },
    { name: 'Leadership', value: 92 },
    { name: 'Tech Ops', value: 78 },
    { name: 'Physical', value: 95 },
    { name: 'Ethics', value: 88 },
  ];

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. RESPONSIVE SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ENDF ED-SYS</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Command Hub" active={!activeDirectorate} onClick={() => setActiveDirectorate(null)} />
            <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Directorates</div>
            <SidebarItem icon={Target} label="Officer Training" active={activeDirectorate === 'officer'} onClick={() => setActiveDirectorate('officer')} />
            <SidebarItem icon={Users} label="NCO & Enlisted" active={activeDirectorate === 'nco'} onClick={() => setActiveDirectorate('nco')} />
            <SidebarItem icon={School} label="Higher Education" active={activeDirectorate === 'higher'} onClick={() => setActiveDirectorate('higher')} />
          </nav>

          <div className="mt-auto p-4 bg-slate-800/40 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">OLLAMA-L3: ACTIVE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 flex-shrink-0 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400">
              <Filter size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-200">Education Command Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 items-center gap-3">
              <Search size={16} className="text-slate-500" />
              <input className="bg-transparent border-none text-xs focus:ring-0 w-40" placeholder="Search CID..." />
            </div>
            <Bell size={20} className="text-slate-400 cursor-pointer" />
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10" />
          </div>
        </header>

        {/* 3. SCROLLABLE CONTENT (Fixed scrolling) */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
        >
          {/* AI STRATEGIC OVERLAY */}
          <section className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                <Zap size={32} className="text-white fill-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Llama 3 Predictive Analysis</h3>
                <p className="text-lg md:text-xl font-medium text-white leading-relaxed italic">
                  "{aiAnalysis}"
                </p>
              </div>
            </div>
          </section>

          {/* DYNAMIC VIEW CONTENT */}
          {!activeDirectorate ? (
            <CentralHubView stats={readinessStats} />
          ) : activeDirectorate === 'officer' ? (
            <OfficerDirectorateView />
          ) : activeDirectorate === 'nco' ? (
            <NcoDirectorateView />
          ) : (
            <HigherEducationView />
          )}

          {/* BOTTOM SPACING */}
          <div className="h-10" />
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

// 1. CENTRAL HUB VIEW
const CentralHubView = ({ stats }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Recruitment Flow" value="1,240" change="+12%" icon={Activity} />
      <StatCard label="Ready for Deployment" value="89.2%" change="+3.4%" icon={Target} />
      <StatCard label="Instructor Load" value="1:14" change="Optimal" icon={Users} />
      <StatCard label="SRS Risk Alerts" value="24" change="-2" icon={AlertOctagon} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 p-6 rounded-2xl h-[400px]">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-blue-500" size={20} /> Force Readiness Trajectory
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b'}} />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-6">Pipeline Health</h3>
        <div className="space-y-6">
          <ProgressItem label="Basic Training (Bir Sheleko)" value={88} color="bg-blue-500" />
          <ProgressItem label="Officer Platform (Hurso)" value={72} color="bg-indigo-500" />
          <ProgressItem label="Air Force College" value={94} color="bg-emerald-500" />
          <ProgressItem label="Defense University" value={65} color="bg-purple-500" />
        </div>
      </div>
    </div>
  </div>
);

// 2. OFFICER DIRECTORATE (Fixed Grid Sub-Modules)
const OfficerDirectorateView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">Officer Training Pipeline</h2>
        <p className="text-slate-400">Strategic and Operational Leadership Management</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700 hover:bg-slate-700">
          <FileText size={16} /> Reports
        </button>
      </div>
    </div>

    {/* SUB-MODULE DASHBOARD GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <SubModuleCard 
        title="Senior Officer Systems" 
        icon={Award} 
        items={["Defense Command & Staff College", "Strategic Leadership (Colonels/Generals)", "Joint Ops Exercise Planning", "National Security Studies"]}
        status="8 programs active"
      />
      <SubModuleCard 
        title="Basic Officer Platform" 
        icon={Zap} 
        items={["Hurso Training School (6-12m)", "Eagle Courses Coordination", "Combat Training (Marksmanship)", "Ethics & Military Law"]}
        status="1,400 cadets enrolled"
      />
      <SubModuleCard 
        title="Air Force College" 
        icon={Plane} 
        items={["Pilot Ground School Module", "Flight Simulator Analytics", "Management Student Module", "Technical Maintenance"]}
        status="High Performance"
      />
      <SubModuleCard 
        title="International Training" 
        icon={Globe} 
        items={["Foreign Officer Exchanges", "UK/US/China Academy Sync", "Intl. Certifications Tracking", "Language Program Mgmt"]}
        status="12 Partner Nations"
      />
    </div>
  </div>
);

// 3. HIGHER EDUCATION (AI SRS FOCUS)
const HigherEducationView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 rounded-3xl border border-purple-500/30">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="p-5 bg-purple-600 rounded-3xl shadow-2xl shadow-purple-500/40">
          <School size={48} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">Advanced Military SRS</h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            AI/ML integrated Student Record System. Proactive identification of mastery gaps and 
            automated intervention drafting using ENDF-specific LLM protocols.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">Risk Scoring Active</span>
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">Predictive Enrollment</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">Automated Remediation</span>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* AI Dash - Command View */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <BrainCircuit className="text-purple-500" /> AI Command/Admin Dashboard
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-slate-900 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Cohort Risk Heatmap</div>
              <div className="text-sm font-medium">Anomaly detected: Engineering Cohort B</div>
            </div>
            <ChevronRight size={18} className="text-slate-600 group-hover:text-purple-500" />
          </div>
          <div className="p-4 bg-slate-900 rounded-xl flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Operational Forecast</div>
              <div className="text-sm font-medium">Predicted Graduate Yield: 94.2% (Next Quarter)</div>
            </div>
            <Activity size={18} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Instructor Copilot */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="text-blue-500" /> Instructor AI Copilot
        </h3>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/10 italic text-sm text-slate-400 mb-4">
          "Drafting remediation plan for 12 trainees showing performance decline in Tactical Computing..."
        </div>
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
          Approve AI Drafted Interventions
        </button>
      </div>
    </div>
  </div>
);

// Placeholder for NCO View (Structure similar to Officer)
const NcoDirectorateView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <SubModuleCard 
        title="Leader Development" 
        icon={Users} 
        items={["Tolay Academy Operations", "Sergeant Major Programs", "Technical Skill Certification", "Instructor Certification"]}
        status="IBADM Integrated"
      />
      <SubModuleCard 
        title="Basic Training" 
        icon={Activity} 
        items={["Bir Sheleko Recruit Programs", "Physical Fitness & Drill", "At-Risk Identification (AI)", "Unit Assignment Sync"]}
        status="Intake: 2,500"
      />
      <SubModuleCard 
        title="Specialist Training" 
        icon={Cpu} 
        items={["Communications & Signal", "Medical Education", "Engineering Specialist", "Advanced Tactical Roles"]}
        status="42% Certified"
      />
    </div>
  </div>
);

// --- ATOMIC UI HELPERS ---

const StatCard = ({ label, value, change, icon: Icon }: any) => (
  <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl hover:border-blue-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
        <Icon size={20} className="text-blue-400 group-hover:text-white" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${change.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{label}</div>
  </div>
);

const SubModuleCard = ({ title, icon: Icon, items, status }: any) => (
  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-900/10 transition-all border-b-4 border-b-blue-600/20">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-slate-200 uppercase text-xs tracking-widest">{title}</h3>
    </div>
    <ul className="space-y-3 mb-6">
      {items.map((item: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-sm text-slate-400 group cursor-pointer hover:text-white transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors" />
          {item}
        </li>
      ))}
    </ul>
    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
      <span className="text-[10px] font-mono text-slate-500">{status}</span>
      <button className="text-[10px] font-bold text-blue-500 hover:underline">ENTER DASHBOARD</button>
    </div>
  </div>
);

const ProgressItem = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-400">{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default EducationTrainingSystem;
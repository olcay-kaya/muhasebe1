
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { LegislationList, NoteWidget, Timeboard } from '../components/DashboardWidgets';
import Assistant from '../components/Assistant';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-black text-blue-600 leading-none">NOTA</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">MUHASEBE ASİSTANI</p>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<HomeIcon />} label="Ana Sayfa" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<LegalIcon />} label="Mevzuat Takibi" active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} />
          <NavItem icon={<TimeIcon />} label="Timeboard" active={activeTab === 'time'} onClick={() => setActiveTab('time')} />
          <NavItem icon={<NoteIcon />} label="Notlarım" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Hoş Geldiniz 👋</h2>
            <p className="text-slate-500">Günün özeti ve en son mali gelişmeler burada.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800">Bugün:</p>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <LegislationList title="Güncel Mevzuat & Kararlar" priority={true} />
              </div>
              <div className="h-[400px]">
                <LegislationList title="Günlük Özelgeler" />
              </div>
            </div>
            {/* Middle Row */}
            <div className="h-[500px]">
              <Timeboard />
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-[450px]">
              <NoteWidget />
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
               <h3 className="text-xl font-bold mb-3">AI Önerisi 💡</h3>
               <p className="text-blue-100 text-sm leading-relaxed">
                 Mart ayı enflasyon muhasebesi işlemleri için son hazırlıklarınızı yapmayı unutmayın! Nota AI, yeni tebliğler konusunda size yardımcı olmaya hazır.
               </p>
               <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">DETAYLARI GÖR</button>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Hızlı Erişim</h3>
               <div className="grid grid-cols-2 gap-3">
                 <QuickLink label="GİB" />
                 <QuickLink label="SGK" />
                 <QuickLink label="E-Devlet" />
                 <QuickLink label="Resmi Gazete" />
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <Assistant />
    </div>
  );
};

const NavItem: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

const QuickLink: React.FC<{ label: string }> = ({ label }) => (
  <button className="p-3 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all text-center">
    {label}
  </button>
);

const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LegalIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TimeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const NoteIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

export default Dashboard;

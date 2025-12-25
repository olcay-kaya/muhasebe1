
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { generateTimeboardPlan } from '../geminiService';

export const LegislationList: React.FC<{ title: string, priority?: boolean }> = ({ title, priority }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for legislations - in real app fetch from DB or external API
    const mockData = [
      { id: 1, title: "7524 Sayılı Vergi Kanunları Değişikliği", category: "Maliye", date: "2024-03-15" },
      { id: 2, title: "Enflasyon Muhasebesi Uygulama Tebliği", category: "Muhasebe", date: "2024-03-10" },
      { id: 3, title: "KDV Oran Artışları Hakkında Karar", category: "Maliye", date: "2024-03-05" },
      { id: 4, title: "İş Kanunu Yeni Düzenlemeleri", category: "Genel", date: "2024-03-01" },
    ];
    setItems(priority ? mockData.filter(i => i.category !== 'Genel') : mockData);
  }, [priority]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-full overflow-hidden flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        {title}
      </h3>
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {items.map(item => (
          <div key={item.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                item.category === 'Muhasebe' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.category}
              </span>
              <span className="text-[10px] text-slate-500">{item.date}</span>
            </div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NoteWidget: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{ content: newNote, user_id: user.id }])
      .select();

    if (!error && data) {
      setNotes([data[0], ...notes]);
      setNewNote('');
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      if (data) setNotes(data);
    };
    fetchNotes();
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
        Notlarım
      </h3>
      <div className="mb-4 flex gap-2">
        <input 
          type="text" 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Hızlı not ekle..."
          className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />
        <button onClick={addNote} className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 transition-all">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {notes.length === 0 && <p className="text-sm text-slate-400 italic text-center py-10">Henüz not eklenmemiş.</p>}
        {notes.map(n => (
          <div key={n.id} className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400 shadow-sm text-sm text-slate-700">
            {n.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Timeboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    const plan = await generateTimeboardPlan(topic);
    setEvents([...plan, ...events]);
    setTopic('');
    setIsGenerating(false);
  };

  const addToGoogleCalendar = (event: any) => {
    const start = event.date.replace(/-/g, '') + 'T090000Z';
    const end = event.date.replace(/-/g, '') + 'T100000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
          Timeboard (Mesleki Planlama)
        </h3>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
        <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase">Yapay Zeka ile Plan Oluştur</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Konu girin (örn: Dönem sonu işlemleri)"
            className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button 
            onClick={handleAIGenerate} 
            disabled={isGenerating}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? 'Oluşturuluyor...' : <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM14 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Oluştur</>}
          </button>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {events.map((e, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100"></div>
              <div className="w-0.5 h-full bg-slate-100"></div>
            </div>
            <div className="flex-1 pb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-transparent group-hover:border-purple-200 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-purple-600">{e.date}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    e.type === 'Seminar' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {e.type}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{e.title}</p>
                <p className="text-xs text-slate-500 mb-3">{e.description}</p>
                <button 
                  onClick={() => addToGoogleCalendar(e)}
                  className="text-[10px] font-bold text-slate-600 flex items-center gap-1 hover:text-purple-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                  GOOGLE TAKVİME EKLE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

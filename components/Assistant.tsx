
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse } from '../geminiService';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sevimli kedi avatarı URL'i - şirin bir kedi illüstrasyonu
  const catAvatarUrl = "https://img.freepik.com/free-vector/cute-cat-sitting-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4148.jpg";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await getAIAssistantResponse(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hata oluştu, lütfen tekrar dene.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl w-80 md:w-96 mb-6 flex flex-col border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300 origin-bottom-right">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-inner">
                 <img src={catAvatarUrl} alt="Nota Kedi" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span className="font-bold block text-sm">Nota Asistan</span>
                <span className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Şu an çevrimiçi
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                <img src={catAvatarUrl} className="w-20 h-20 opacity-80" alt="cat" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Merhaba! Ben Nota</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Mevzuat, vergi veya muhasebe ile ilgili her şeyi bana sorabilirsin. Sana yardım etmek için buradayım!</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Bir şeyler sor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button onClick={handleSend} className="bg-blue-600 text-white p-2.5 rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sevimli Kedi Butonu */}
      <div className="relative">
        {/* Arka plan parlama efekti */}
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden border-4 border-white flex items-center justify-center ${isOpen ? 'rotate-12' : 'hover:-rotate-6'}`}
        >
          {/* Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
          
          {/* Gerçek Kedi İllüstrasyonu */}
          <img 
            src={catAvatarUrl} 
            alt="Sevimli Nota Kedisi" 
            className="w-14 h-14 object-contain z-10 drop-shadow-md transition-transform group-hover:scale-110" 
          />
          
          {/* Rozet */}
          <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 py-0.5 text-center z-20">
            <span className="text-[7px] font-black text-white uppercase tracking-tighter">NOTA AI</span>
          </div>
        </button>

        {/* Küçük Bildirim Balonu (Opsiyonel süs) */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce z-30">
             <span className="text-[10px] text-white font-bold">!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;

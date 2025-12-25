
import React, { useState } from 'react';
import { supabase } from '../supabase';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
            }
          }
        });
        if (signUpError) throw signUpError;
        alert("Kayıt başarılı! Lütfen e-postanızı doğrulayın.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD700] via-[#FFD700] to-[#E30A17]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#E30A17] p-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">NOTA</h1>
          <p className="text-[#FFD700] font-bold text-sm tracking-widest mt-1 uppercase">MUHASEBE ASİSTANI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
          
          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-600 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">İSİM</label>
                <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#E30A17] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SOYİSİM</label>
                <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#E30A17] outline-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-POSTA</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#E30A17] outline-none" />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TELEFON</label>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#E30A17] outline-none" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ŞİFRE</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#E30A17] outline-none" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E30A17] text-[#FFD700] py-3 rounded-xl font-black text-lg shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? 'Lütfen Bekleyin...' : (isRegistering ? 'KAYIT OL' : 'GİRİŞ YAP')}
          </button>

          <div className="text-center mt-6">
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-semibold text-[#E30A17] hover:underline"
            >
              {isRegistering ? 'Zaten hesabınız var mı? Giriş yapın' : 'İlk defa mı geliyorsunuz? Kayıt olun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

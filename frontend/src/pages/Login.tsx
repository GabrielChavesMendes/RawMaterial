import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Função para Entrar
  const lidarComLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setMensagem('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErro('Falha no login. Verifique o seu e-mail e palavra-passe.');
    }
    setCarregando(false);
  };

  // Função para Criar Conta
  const lidarComRegisto = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setMensagem('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErro(error.message);
    } else {
      setMensagem('Conta criada com sucesso! Pode iniciar sessão.');
    }
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-2xl">
        
        {/* Logótipo */}
        <div className="flex items-center justify-center gap-3 mb-8">
        <img src="/logo.png" alt="RawMaterial Logo" className="h-15 w-auto rounded-lg" />
        <span className="text-white font-bold text-xl tracking-tight">Raw<span className="text-slate-400">Material</span></span>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-6">Aceda à plataforma</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">E-mail corporativo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="exemplo@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {erro && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">{erro}</div>}
          {mensagem && <div className="text-emerald-500 text-sm text-center bg-emerald-500/10 p-2 rounded-md">{mensagem}</div>}

          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={lidarComLogin}
              disabled={carregando}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50"
            >
              {carregando ? 'A aguardar...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={lidarComRegisto}
              disabled={carregando}
              className="flex-1 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
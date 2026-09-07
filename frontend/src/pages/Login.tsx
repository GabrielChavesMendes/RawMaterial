import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LISTA_INTERESSES = [
  'Petróleo (WTI)', 'Lítio', 'Ouro', 'Cobre', 'Urânio', 
  'Soja', 'Milho', 'Café', 'Logística Global', 'Tech B2B'
];

export function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const modoInicial = searchParams.get('modo') === 'cadastro' ? false : true;
  const [isLogin, setIsLogin] = useState(modoInicial);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  
  const [tipoConta, setTipoConta] = useState<'pessoal' | 'empresarial'>('pessoal');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [setor, setSetor] = useState('Agricultura');
  
  // NOVO: Estado para armazenar as tags/filtros selecionados
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(searchParams.get('modo') !== 'cadastro');
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    setTagsSelecionadas(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setMensagem(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/'); 
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome_completo: nome,
              tipo_conta: tipoConta,
              empresa: tipoConta === 'empresarial' ? nomeEmpresa : null,
              setor: tipoConta === 'empresarial' ? setor : null,
              tags: tagsSelecionadas, // Salvando os filtros no banco
              receber_alertas: true   // Padrão ativado ao criar conta
            }
          }
        });
        
        if (error) throw error;
        setMensagem('Conta criada com sucesso! Pode fazer login agora.');
        setIsLogin(true);
      }
    } catch (error: any) {
      setErro(error.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-y-auto text-slate-300 font-sans py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937] rounded-3xl shadow-2xl overflow-hidden z-10">
        
        <div className="p-8 pb-6 text-center border-b border-[#1F2937]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="RawMaterial Logo" className="h-10 w-auto rounded-lg" />
            <span className="text-white font-bold text-2xl tracking-tight">Raw<span className="text-red-500">Material</span></span>
          </div>
          <div className="flex bg-[#1F2937] p-1 rounded-xl">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400'}`}>Entrar</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400'}`}>Criar Conta</button>
          </div>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-5">
          {erro && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">{erro}</div>}
          {mensagem && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg text-center">{mensagem}</div>}

          {!isLogin && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div onClick={() => setTipoConta('pessoal')} className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${tipoConta === 'pessoal' ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-800/50'}`}>Uso Pessoal</div>
                <div onClick={() => setTipoConta('empresarial')} className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${tipoConta === 'empresarial' ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-800/50'}`}>Para Empresas</div>
              </div>

              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:border-red-500" placeholder="Nome Completo" />

              {tipoConta === 'empresarial' && (
                <div className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <input type="text" required value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3" placeholder="Nome da Empresa" />
                  <select value={setor} onChange={(e) => setSetor(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3">
                    <option value="Agricultura">Agricultura e Alimentos</option>
                    <option value="Mineração">Mineração e Metais</option>
                    <option value="Energia">Energia e Combustíveis</option>
                    <option value="Logística">Logística e Portos</option>
                  </select>
                </div>
              )}

              {/* Seção de Filtros/Tags */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Selecione seus focos de monitoramento:</label>
                <div className="flex flex-wrap gap-2">
                  {LISTA_INTERESSES.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        tagsSelecionadas.includes(tag) 
                          ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                          : 'bg-[#1F2937] text-slate-400 border-[#374151] hover:border-slate-500'
                      }`}
                    >
                      {tagsSelecionadas.includes(tag) ? '✓ ' : ''}{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:border-red-500" placeholder="Email" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:border-red-500" placeholder="Senha" />

          <button type="submit" disabled={carregando} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 mt-4 text-lg">
            {carregando ? 'A processar...' : isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
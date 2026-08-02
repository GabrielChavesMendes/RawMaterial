import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Lê o URL para saber se deve abrir no modo Login ou Cadastro
  const modoInicial = searchParams.get('modo') === 'cadastro' ? false : true;
  const [isLogin, setIsLogin] = useState(modoInicial);
  
  // Estados do Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  
  // NOVO: Estados para o Cadastro (Pessoal vs Empresarial)
  const [tipoConta, setTipoConta] = useState<'pessoal' | 'empresarial'>('pessoal');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [setor, setSetor] = useState('Agricultura'); // Valor padrão
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(searchParams.get('modo') !== 'cadastro');
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setMensagem(null);

    try {
      if (isLogin) {
        // --- FLUXO DE LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Se der sucesso, o App.tsx deteta a sessão e muda o ecrã sozinho
        navigate('/'); 

      } else {
        // --- FLUXO DE CADASTRO ---
        // Aqui guardamos os dados extras dentro dos "metadados" do utilizador no Supabase
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome_completo: nome,
              tipo_conta: tipoConta,
              empresa: tipoConta === 'empresarial' ? nomeEmpresa : null,
              setor: tipoConta === 'empresarial' ? setor : null,
            }
          }
        });
        
        if (error) throw error;
        setMensagem('Conta criada com sucesso! Pode fazer login agora.');
        setIsLogin(true); // Volta para a aba de login
      }
    } catch (error: any) {
      setErro(error.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden text-slate-300 font-sans">
      
      {/* Efeitos de Luz no Fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937] rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in">
        
        {/* Cabeçalho do Card */}
        <div className="p-8 pb-6 text-center border-b border-[#1F2937]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="RawMaterial Logo" className="h-10 w-auto rounded-lg" />
            <span className="text-white font-bold text-2xl tracking-tight">Raw<span className="text-red-500">Material</span></span>
          </div>
          
          <div className="flex bg-[#1F2937] p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isLogin ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleAuth} className="p-8 space-y-5">
          
          {erro && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
              {erro}
            </div>
          )}
          
          {mensagem && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg text-center">
              {mensagem}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-4 animate-fade-in">
              <label className="block text-sm font-medium text-slate-400 mb-2">Qual é o seu objetivo?</label>
              
              {/* Seleção de Tipo de Conta */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div 
                  onClick={() => setTipoConta('pessoal')}
                  className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                    tipoConta === 'pessoal' ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span className="text-sm font-medium">Uso Pessoal</span>
                </div>
                
                <div 
                  onClick={() => setTipoConta('empresarial')}
                  className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                    tipoConta === 'empresarial' ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <span className="text-sm font-medium">Para Empresas</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              {/* Campos exclusivos para Conta Empresarial */}
              {tipoConta === 'empresarial' && (
                <div className="space-y-4 animate-fade-in bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Nome da Empresa</label>
                    <input
                      type="text"
                      required
                      value={nomeEmpresa}
                      onChange={(e) => setNomeEmpresa(e.target.value)}
                      className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Ex: Logística Global S.A."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Setor de Atuação</label>
                    <select
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="Agricultura">Agricultura e Alimentos</option>
                      <option value="Mineração">Mineração e Metais</option>
                      <option value="Energia">Energia e Combustíveis</option>
                      <option value="Construção">Construção Civil</option>
                      <option value="Manufatura">Manufatura e Indústria</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 mt-4 text-lg"
          >
            {carregando ? 'A processar...' : isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function Equipe() {
  const [usuario, setUsuario] = useState<any>(null);
  const [emailConvite, setEmailConvite] = useState('');
  
  // Simulamos os membros atuais da equipa (Na V2.0 isto virá do banco de dados)
  const [membros, setMembros] = useState([
    { id: '1', nome: 'A carregar...', email: '', role: 'Líder (Você)', status: 'ativo' }
  ]);

  // Controlo do Modal de Upgrade (Paywall)
  const [mostrarPaywall, setMostrarPaywall] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsuario(user);
        // Atualizamos o primeiro membro para ser o utilizador logado
        setMembros([
          { 
            id: user.id, 
            nome: user.user_metadata?.nome_completo || 'Utilizador', 
            email: user.email || '', 
            role: 'Líder (Você)', 
            status: 'ativo' 
          }
        ]);
      }
    };
    carregarUsuario();
  }, []);

  const handleConvidar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // O Gatilho de Venda: Se já tiver 3 membros (Líder + 2 convidados), barra a ação.
    // Para teste rápido, vamos barrar se tentar adicionar a 3ª pessoa.
    if (membros.length >= 3) {
      setMostrarPaywall(true);
      return;
    }

    // Se tiver espaço, adiciona o membro fictício
    const novoMembro = {
      id: Math.random().toString(),
      nome: 'Convite Pendente',
      email: emailConvite,
      role: 'Analista',
      status: 'pendente'
    };

    setMembros([...membros, novoMembro]);
    setEmailConvite('');
  };

  const limiteAtingido = membros.length >= 3;
  const vagasRestantes = 3 - membros.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Minha Equipe</h1>
          <p className="text-sm text-slate-400 mt-1">
            Espaço de trabalho: <span className="font-bold text-slate-300">{usuario?.user_metadata?.empresa || 'Empresa'}</span>
          </p>
        </div>
        
        {/* Indicador de Limite do Plano */}
        <div className="flex items-center gap-3 bg-[#111827] border border-[#1F2937] px-4 py-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plano Gratuito</span>
            <span className="text-sm font-medium text-slate-300">{vagasRestantes} vagas disponíveis</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#1F2937] flex items-center justify-center text-xs font-bold text-slate-400">
            {membros.length}/3
          </div>
        </div>
      </header>

      {/* Área de Convite */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Convidar novos membros</h2>
        <form onSubmit={handleConvidar} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            value={emailConvite}
            onChange={(e) => setEmailConvite(e.target.value)}
            placeholder="email@empresa.com"
            className="flex-1 bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              limiteAtingido 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Enviar Convite
          </button>
        </form>
      </div>

      {/* Lista de Membros */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#1F2937]">
          <h2 className="text-lg font-bold text-white">Membros Atuais</h2>
        </div>
        <div className="divide-y divide-[#1F2937]">
          {membros.map((membro) => (
            <div key={membro.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1F2937]/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                  membro.status === 'pendente' 
                    ? 'bg-slate-800 border-slate-700 text-slate-500' 
                    : 'bg-slate-700 border-slate-600 text-white'
                }`}>
                  {membro.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-bold ${membro.status === 'pendente' ? 'text-slate-400' : 'text-slate-200'}`}>
                    {membro.nome}
                  </p>
                  <p className="text-sm text-slate-500">{membro.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  membro.role.includes('Líder') ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-[#1F2937] text-slate-300 border-slate-600'
                }`}>
                  {membro.role}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  membro.status === 'pendente' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {membro.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* MODAL PAYWALL (Abre quando atinge o limite)        */}
      {/* ================================================== */}
      {mostrarPaywall && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            
            {/* Efeito de luz no modal */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <button 
              onClick={() => setMostrarPaywall(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-white">Limite Atingido</h3>
              <p className="text-slate-400">
                O seu plano gratuito permite um máximo de <span className="font-bold text-white">3 membros</span> (Você + 2). Para adicionar mais analistas à sua equipa, faça o upgrade.
              </p>
              
              <div className="pt-6">
                <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 hover:scale-105 mb-3">
                  Fazer Upgrade para o Pro
                </button>
                <button 
                  onClick={() => setMostrarPaywall(false)}
                  className="w-full py-3 bg-transparent text-slate-400 hover:text-white font-medium rounded-xl transition-colors"
                >
                  Continuar no plano gratuito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
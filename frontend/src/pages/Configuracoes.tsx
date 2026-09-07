import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

type AbaConfig = 'conta' | 'interface' | 'sobre';

export function Configuracoes() {
  const [usuario, setUsuario] = useState<any>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaConfig>('conta');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);

  // Estados dos formulários
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [tema, setTema] = useState('raw-red');

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsuario(user);
        setNome(user.user_metadata?.nome_completo || '');
        setEmpresa(user.user_metadata?.empresa || '');
        setMoeda(user.user_metadata?.moeda || 'BRL');
        setTema(user.user_metadata?.tema || 'raw-red');
      }
    };
    carregarUsuario();
  }, []);

  const handleSalvarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { nome_completo: nome, empresa: empresa }
      });
      if (error) throw error;
      setMensagem({ texto: 'Dados da conta atualizados com sucesso!', tipo: 'sucesso' });
    } catch (error: any) {
      setMensagem({ texto: error.message || 'Erro ao atualizar dados.', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarInterface = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { moeda: moeda, tema: tema }
      });
      if (error) throw error;
      setMensagem({ texto: 'Preferências de interface guardadas!', tipo: 'sucesso' });
      
      // Recarrega a página após 1 segundo para aplicar o novo tema visualmente
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      setMensagem({ texto: error.message || 'Erro ao salvar preferências.', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  };

  if (!usuario) return <div className="p-8 text-slate-400">A carregar configurações...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-sm text-slate-400 mt-1">Gira as definições da sua conta, interface e preferências do sistema.</p>
      </header>

      {mensagem && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${mensagem.tipo === 'sucesso' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Menu Lateral de Abas */}
        <nav className="w-full md:w-64 flex md:flex-col gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setAbaAtiva('conta')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${abaAtiva === 'conta' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Dados da Conta
          </button>
          <button 
            onClick={() => setAbaAtiva('interface')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${abaAtiva === 'interface' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Interface e Moeda
          </button>
          <button 
            onClick={() => setAbaAtiva('sobre')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${abaAtiva === 'sobre' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Sobre o Sistema
          </button>
        </nav>

        {/* Área de Conteúdo */}
        <div className="flex-1 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl p-6 md:p-8">
          
          {/* CONTEÚDO: CONTA */}
          {abaAtiva === 'conta' && (
            <form onSubmit={handleSalvarConta} className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3 mb-6">Informações Pessoais</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">E-mail de Acesso <span className="text-xs text-slate-500">(Não alterável)</span></label>
                <input type="email" disabled value={usuario.email} className="w-full bg-[#1F2937]/50 border border-[#374151]/50 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed" />
              </div>

              {usuario.user_metadata?.tipo_conta === 'empresarial' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Empresa</label>
                  <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                </div>
              )}

              <div className="pt-4 border-t border-[#1F2937] flex justify-end">
                <button type="submit" disabled={carregando} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50">
                  {carregando ? 'A guardar...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}

          {/* CONTEÚDO: INTERFACE */}
          {abaAtiva === 'interface' && (
            <form onSubmit={handleSalvarInterface} className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3 mb-6">Personalização Visual e Regional</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Moeda Padrão para Relatórios</label>
                <select value={moeda} onChange={(e) => setMoeda(e.target.value)} className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors cursor-pointer">
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano (US$)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Esta moeda será aplicada nos cálculos de Inteligência Artificial e nos PDFs exportados.</p>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-slate-400 mb-3">Tema de Destaque</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => setTema('raw-red')} className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${tema === 'raw-red' ? 'border-red-500 bg-red-500/10' : 'border-[#374151] bg-[#0B1120] hover:border-slate-500'}`}>
                    <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="text-sm font-bold text-white">Raw Red (Padrão)</span>
                  </div>
                  
                  <div onClick={() => setTema('dark-bege')} className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${tema === 'dark-bege' ? 'border-[#D4B895] bg-[#D4B895]/10' : 'border-[#374151] bg-[#0B1120] hover:border-slate-500'}`}>
                    <div className="w-6 h-6 rounded-full bg-[#D4B895] shadow-lg shadow-[#D4B895]/50"></div>
                    <span className="text-sm font-bold text-white">Dark & Bege</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#1F2937] flex justify-end">
                <button type="submit" disabled={carregando} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50">
                  {carregando ? 'A guardar...' : 'Aplicar Preferências'}
                </button>
              </div>
            </form>
          )}

          {/* CONTEÚDO: SOBRE */}
          {abaAtiva === 'sobre' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col items-center justify-center py-8 text-center border-b border-[#1F2937]">
                <img src="/logo.png" alt="RawMaterial Logo" className="h-16 w-auto rounded-xl mb-4 shadow-xl" />
                <h2 className="text-2xl font-black text-white tracking-tight">Raw<span className="text-red-500">Material</span> OS</h2>
                <span className="mt-2 px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">Versão 2.0.0 (Build 491)</span>
                <p className="text-sm text-slate-400 mt-4 max-w-md">Plataforma de inteligência de mercado alimentada por IA para monitoramento de cadeia de suprimentos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="#" className="p-4 bg-[#0B1120] border border-[#374151] rounded-xl hover:border-slate-500 transition-colors flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">Termos de Serviço</span>
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
                <a href="#" className="p-4 bg-[#0B1120] border border-[#374151] rounded-xl hover:border-slate-500 transition-colors flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">Política de Privacidade</span>
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>

              <div className="pt-6">
                <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  Falar com Suporte Técnico
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
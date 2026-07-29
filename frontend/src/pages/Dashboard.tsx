import { useState } from 'react';
import { GlobalForecast } from '../components/GlobalForecast';
import { TopMovers } from '../components/TopMovers';
import { RoiSimulator } from '../components/RoiSimulator';
import { SupplierRanking } from '../components/SupplierRanking';
import { AIInsights } from '../components/AIInsights';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [materialGlobal, setMaterialGlobal] = useState('Madeira');
  
  // Estados para as novas funcionalidades do Header
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  // Função para encerrar a sessão
  const lidarComLogout = async () => {
    await supabase.auth.signOut();
  };

  const materiaisDisponiveis = ["Madeira", "Petróleo (WTI)", "Gás Natural", "Trigo", "Minério de Ferro", "Calcário",
     "Aço Inoxidável", "Cobre", "Alumínio", "Lítio", "Soja", "Algodão", "Ouro"
    ];

  // Função para executar a pesquisa ao pressionar Enter
  const lidarComPesquisa = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const materialEncontrado = materiaisDisponiveis.find(m => 
        m.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
      if (materialEncontrado) {
        setMaterialGlobal(materialEncontrado);
        setTermoPesquisa(''); // Limpa a barra
      } else {
        alert("Commodity não encontrada no banco de dados.");
      }
    }
  };

  return (
    <>
      {/* HEADER ATUALIZADO */}
      <header className="flex justify-between items-center mb-8 relative">
        {/* Barra de Pesquisa */}
        <div className="w-96 relative">
          <div className="bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2 flex items-center gap-2 focus-within:border-red-500 transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Buscar (ex: Trigo, Gás) e pressione Enter..." 
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              onKeyDown={lidarComPesquisa}
              className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder-slate-500" 
            />
          </div>
        </div>

        {/* Ícones da Direita */}
        <div className="flex items-center gap-5 text-slate-400">
          
          {/* Botão de Notificações (Sino) com Pop-up */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotificacoesAbertas(!notificacoesAbertas);
                setMenuAberto(false); // Fecha o menu de perfil se estiver aberto
              }} 
              className="hover:text-white relative transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* O Pop-up de Notificações */}
            {notificacoesAbertas && (
              <div className="absolute right-0 mt-3 w-80 bg-[#1F2937] border border-[#374151] rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-[#374151] flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white">Notificações</h3>
                  <button className="text-xs text-red-400 hover:text-red-300">Marcar como lidas</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-[#374151] transition-colors cursor-pointer border-b border-[#374151]/50">
                    <p className="text-xs font-bold text-orange-500 mb-1">Risco Logístico</p>
                    <p className="text-sm text-slate-300">Congestionamento severo no Porto de Xangai.</p>
                    <p className="text-xs text-slate-500 mt-1">Há 10 minutos</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#374151] transition-colors cursor-pointer border-b border-[#374151]/50">
                    <p className="text-xs font-bold text-emerald-500 mb-1">Mercado em Alta</p>
                    <p className="text-sm text-slate-300">Ouro ultrapassou a marca de $2.300.</p>
                    <p className="text-xs text-slate-500 mt-1">Há 2 horas</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#374151] transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-blue-500 mb-1">Sistema</p>
                    <p className="text-sm text-slate-300">O seu relatório semanal (PDF) está pronto.</p>
                    <p className="text-xs text-slate-500 mt-1">Ontem</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Configurações (Engrenagem) */}
          <Link to="/configuracoes" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </Link>
          
          {/* Menu de Perfil com Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setMenuAberto(!menuAberto);
                setNotificacoesAbertas(false); // Fecha as notificações se estiverem abertas
              }}
              className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-sm border-2 border-transparent hover:border-red-500 flex items-center justify-center transition-all focus:outline-none"
            >
              GM
            </button>
            
            {menuAberto && (
              <div className="absolute right-0 mt-3 w-52 bg-[#1F2937] border border-[#374151] rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-[#374151] mb-1">
                  <p className="text-sm font-bold text-white">Gabriel Mendes</p>
                  <p className="text-xs text-slate-400 mt-0.5">Admin</p>
                </div>
                {/* Usando Link em vez de botão para navegação real */}
                <Link 
                  to="/perfil" 
                  className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#374151] hover:text-white transition-colors"
                >
                  Meu Perfil
                </Link>
                <button 
                  onClick={lidarComLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#374151] hover:text-red-300 transition-colors mt-1"
                >
                  Sair (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* GRELHA DO DASHBOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="h-[26rem]">
            <GlobalForecast material={materialGlobal} />
          </div>
          <TopMovers />
          <SupplierRanking />
        </div>
        <div className="space-y-6">
          <RoiSimulator material={materialGlobal} setMaterial={setMaterialGlobal} />
          <AIInsights material={materialGlobal} />
        </div>
      </div>
    </>
  );
}
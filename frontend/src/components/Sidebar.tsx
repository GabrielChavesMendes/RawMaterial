import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// 1. Criamos a Interface para os dados do utilizador (resolve o erro do "any")
interface UsuarioMetadata {
  nome_completo?: string;
  tipo_conta?: 'pessoal' | 'empresarial';
  empresa?: string;
  setor?: string;
  avatar_url?: string;
}

// 2. Criamos o NavLink DO LADO DE FORA (resolve o erro de "componentes durante o render")
interface NavLinkProps {
  to: string;
  icone: React.ReactNode;
  label: string;
}

function NavLink({ to, icone, label }: NavLinkProps) {
  const location = useLocation();
  const isAtivo = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isAtivo
          ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]'
      }`}
    >
      {icone}
      {label}
    </Link>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  
  // Usamos a nossa nova Interface em vez de <any>
  const [usuario, setUsuario] = useState<UsuarioMetadata | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata) {
        setUsuario(user.user_metadata as UsuarioMetadata);
      }
    };
    
    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside className="w-64 h-full bg-[#111827] border-r border-[#1F2937] flex flex-col shadow-2xl">
      
      <div className="hidden md:flex items-center gap-2 p-6 border-b border-[#1F2937]">
        <img src="/logo.png" alt="RawMaterial Logo" className="h-8 w-auto rounded-lg border border-slate-700 p-0.5" />
        <span className="text-white font-bold text-xl tracking-tight">Raw<span className="text-red-500">Material</span></span>
      </div>

      {usuario && (
        <div className="p-3 mx-4 mt-6 mb-2 bg-[#1F2937]/40 border border-[#374151] rounded-xl flex items-center gap-3 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0 shadow-md overflow-hidden border border-slate-600">
            {usuario.avatar_url ? (
              <img src={usuario.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              usuario.nome_completo ? usuario.nome_completo.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{usuario.nome_completo}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                usuario.tipo_conta === 'empresarial' 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' 
                  : 'bg-slate-600/50 text-slate-300 border border-slate-600'
              }`}>
                {usuario.tipo_conta === 'empresarial' ? 'Empresarial' : 'Pessoal'}
              </span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <NavLink 
          to="/" 
          label="Dashboard" 
          icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>} 
        />
        <NavLink 
          to="/tendencias" 
          label="Análise Preditiva" 
          icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>} 
        />
        <NavLink 
          to="/cadeia" 
          label="Cadeia de Suprimentos" 
          icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
        />
        <NavLink 
          to="/relatorios" 
          label="Relatórios" 
          icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} 
        />
        
        <NavLink 
          to="/noticias" 
          label="Radar de Notícias" 
          icone={<svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>} 
        />

        {usuario?.tipo_conta === 'empresarial' && (
          <div className="pt-6 animate-fade-in">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Workspace: {usuario.empresa || 'Gestão'}
            </p>
            <NavLink 
              to="/equipe" 
              label="Minha Equipe" 
              icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} 
            />
          </div>
        )}

        {usuario?.tipo_conta === 'pessoal' && (
          <div className="mt-8 mx-2 p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl relative overflow-hidden animate-fade-in group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Plano Pro
            </h4>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Liberte filtros corporativos e convide até 2 pessoas para a sua equipa.</p>
            <button className="w-full py-2 bg-slate-800 hover:bg-red-500 text-white text-xs font-bold rounded-lg border border-slate-700 hover:border-red-500 transition-all shadow-lg">
              Fazer Upgrade
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-[#1F2937]">
        <NavLink 
          to="/configuracoes" 
          label="Configurações" 
          icone={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>} 
        />
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}
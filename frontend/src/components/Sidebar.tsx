import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  // Função para verificar se o link está ativo e devolver as cores corretas
  const getEstiloAtivo = (caminho: string) => {
    return location.pathname === caminho 
      ? 'bg-red-500/10 text-red-500' 
      : 'text-slate-400 hover:bg-[#1F2937] hover:text-white';
  };

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1F2937] p-6 flex flex-col h-screen sticky top-0">
      
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Raw<span className="text-slate-400">Material</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${getEstiloAtivo('/')}`}>
          <span className="font-medium text-sm">Dashboard</span>
        </Link>
        <Link to="/tendencias" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${getEstiloAtivo('/tendencias')}`}>
          <span className="font-medium text-sm">Tendências de Mercado</span>
        </Link>
        <Link to="/cadeia" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${getEstiloAtivo('/cadeia')}`}>
          <span className="font-medium text-sm">Cadeia de Suprimentos</span>
        </Link>
        <Link to="/analise" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${getEstiloAtivo('/analise')}`}>
          <span className="font-medium text-sm">Análise Preditiva</span>
        </Link>
        <Link to="/relatorios" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${getEstiloAtivo('/relatorios')}`}>
          <span className="font-medium text-sm">Relatórios</span>
        </Link>
      </nav> 

    </aside>
  );
}
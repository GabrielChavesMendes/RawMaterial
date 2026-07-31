import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const getEstiloAtivo = (caminho: string) => {
    return location.pathname === caminho 
      ? 'bg-red-500/10 text-red-500' 
      : 'text-slate-400 hover:bg-[#1F2937] hover:text-white';
  };

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1F2937] p-6 flex flex-col h-screen sticky top-0">
      
      <div className="flex items-center gap-3 mb-10">
        <img src="/logo.png" alt="RawMaterial Logo" className="h-10 w-auto rounded-lg" />
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
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-red-500/30">
      
      {/* Navbar Superior */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="RawMaterial Logo" className="h-10 w-auto rounded-lg" />
          <span className="text-white font-bold text-2xl tracking-tight">Raw<span className="text-red-500">Material</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
            Já tenho conta
          </Link>
          <Link to="/login?modo=cadastro" className="text-sm font-bold bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full transition-all shadow-lg shadow-red-500/20 hover:scale-105">
            Começar Grátis
          </Link>
        </div>
      </nav>

      {/* Hero Section (Área Principal) */}
      <main className="container mx-auto px-6 pt-16 pb-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Coluna da Esquerda: Textos e Botões */}
        <div className="flex-1 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Nova versão 2.0 disponível
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Inteligência de Mercado para a sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Cadeia de Suprimentos.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-2xl">
            Antecipe flutuações de preços, monitorize fornecedores globais em tempo real e tome decisões estratégicas baseadas em dados financeiros reais e Inteligência Artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link to="/login?modo=cadastro" className="w-full sm:w-auto text-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-red-500/20 text-lg">
              Criar Perfil Empresarial
            </Link>
            <Link to="/login" className="w-full sm:w-auto text-center px-8 py-4 bg-[#1F2937] hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 text-lg">
              Fazer Login
            </Link>
          </div>
        </div>

        {/* Coluna da Direita: Imagem Ilustrativa (Mockup) */}
        <div className="flex-1 w-full relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/50 bg-[#111827] aspect-[4/3] flex flex-col group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50"></div>
            
            {/* Simulação de um cabeçalho de App */}
            <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-2 bg-[#0B1120]">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>

            {/* Simulação do Gráfico Central */}
            <div className="flex-1 flex items-center justify-center relative p-8">
              <svg className="w-48 h-48 text-slate-800 group-hover:text-slate-700 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              
              {/* Card Flutuante simulando um insight da IA */}
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Alerta da IA</span>
                 </div>
                 <p className="text-sm font-medium text-slate-200">"O mercado de Petróleo (WTI) apresenta uma forte tendência de alta no curto prazo. Sugerimos antecipar as compras."</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
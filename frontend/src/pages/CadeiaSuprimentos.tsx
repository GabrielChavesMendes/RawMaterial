import { useState, useEffect } from 'react';

// Tipagem para o Diretório Expandido
interface FornecedorExpandido {
  id: string;
  nome: string;
  commodity: string;
  localizacao: string;
  leadTime: string;
  status: 'Operacional' | 'Atrasos Leves' | 'Risco Crítico';
  site: string;
}

export function CadeiaSuprimentos() {
  const [fornecedores, setFornecedores] = useState<FornecedorExpandido[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Simulando a busca de um banco de dados mais completo
  useEffect(() => {
    // Usamos um setTimeout para simular o tempo de resposta da API
    setTimeout(() => {
      setFornecedores([
        { id: "1", nome: "Global Timber Corp", commodity: "Madeira", localizacao: "Vancouver, CA", leadTime: "14 dias", status: "Operacional", site: "https://klabin.com.br" },
        { id: "2", nome: "PetroLogistics", commodity: "Petróleo (WTI)", localizacao: "Texas, EUA", leadTime: "5 dias", status: "Operacional", site: "https://petrobras.com.br" },
        { id: "3", nome: "AgroGlobal LCC", commodity: "Trigo", localizacao: "Mato Grosso, BR", leadTime: "8 dias", status: "Atrasos Leves", site: "https://bunge.com.br" },
        { id: "4", nome: "MinasCalcário S.A.", commodity: "Calcário", localizacao: "Minas Gerais, BR", leadTime: "3 dias", status: "Operacional", site: "https://votorantimcimentos.com.br" },
        { id: "5", nome: "IronOre Brasil", commodity: "Minério de Ferro", localizacao: "Pará, BR", leadTime: "12 dias", status: "Operacional", site: "https://vale.com" },
        { id: "7", nome: "SinoSteel Export", commodity: "Aço Inoxidável", localizacao: "Xangai, CN", leadTime: "35 dias", status: "Risco Crítico", site: "https://google.com" },
        { id: "8", nome: "Andes Copper", commodity: "Cobre", localizacao: "Antofagasta, CL", leadTime: "18 dias", status: "Operacional", site: "https://google.com" },
      ]);
      setCarregando(false);
    }, 800);
  }, []);

  const alertas = [
    { id: 1, tipo: "Crítico", texto: "Congestionamento severo no Porto de Xangai afeta envios de Aço e Alumínio (+12 dias de atraso)." },
    { id: 2, tipo: "Aviso", texto: "Fortes chuvas no Centro-Oeste brasileiro podem impactar o escoamento de Soja e Trigo nesta semana." },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabeçalho */}
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Cadeia de Suprimentos</h1>
        <p className="text-sm text-slate-400 mt-1">Gestão de fornecedores, rotas logísticas e monitoramento de riscos.</p>
      </header>

      {/* KPIs Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Hubs Ativos</p>
            <p className="text-xl font-bold text-white">24</p>
          </div>
        </div>
        
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Lead Time Médio</p>
            <p className="text-xl font-bold text-white">14 Dias</p>
          </div>
        </div>

        <div className="bg-[#111827] border border-red-500/20 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Nível de Risco Global</p>
            <p className="text-xl font-bold text-red-500">Elevado</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Diretório de Fornecedores (Ocupa 2 colunas) */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Diretório Global de Fornecedores</h3>
            <div className="bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-1.5 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Filtrar..." className="bg-transparent border-none focus:outline-none text-xs w-24 text-white" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1F2937]">
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Empresa / Hub</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Material</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Lead Time</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/50">
                {carregando ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500 animate-pulse">Carregando malha logística...</td></tr>
                ) : (
                  fornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id} className="group hover:bg-[#1F2937]/30 transition-colors">
                      <td className="py-4">
                        <div className="text-sm font-medium text-slate-200">{fornecedor.nome}</div>
                        <div className="text-xs text-slate-500">{fornecedor.localizacao}</div>
                      </td>
                      <td className="py-4 text-sm text-slate-400">{fornecedor.commodity}</td>
                      <td className="py-4 text-sm text-slate-400">{fornecedor.leadTime}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          fornecedor.status === 'Operacional' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          fornecedor.status === 'Atrasos Leves' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            fornecedor.status === 'Operacional' ? 'bg-emerald-500' :
                            fornecedor.status === 'Atrasos Leves' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></span>
                          {fornecedor.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <a 
                          href={fornecedor.site} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-slate-300 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors"
                        >
                          Cotar Frete
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel de Alertas de Risco Logístico */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h3 className="text-lg font-bold text-white tracking-tight">Radar de Riscos</h3>
          </div>

          <div className="space-y-4 flex-1">
            {alertas.map(alerta => (
              <div key={alerta.id} className="bg-[#1F2937] rounded-xl p-4 border border-[#374151] hover:border-orange-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${alerta.tipo === 'Crítico' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {alerta.tipo}
                  </span>
                  <span className="text-xs text-slate-500">Hoje</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {alerta.texto}
                </p>
              </div>
            ))}
            
            {/* Espaço reservado para mapa interativo futuro */}
            <div className="mt-4 h-32 rounded-xl bg-[#1F2937]/50 border border-[#374151] border-dashed flex flex-col items-center justify-center text-slate-500">
              <svg className="w-6 h-6 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-xs font-medium">Integração GPS (Em Breve)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
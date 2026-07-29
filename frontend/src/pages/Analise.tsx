import { useState } from 'react';
import { GlobalForecast } from '../components/GlobalForecast';
import { AIInsights } from '../components/AIInsights';

export function Analise() {
  const [material, setMaterial] = useState('Petróleo (WTI)');

  const materiaisDisponiveis = [
    "Madeira", "Petróleo (WTI)", "Gás Natural", "Trigo", "Minério de Ferro", "Calcário",
    "Aço Inoxidável", "Cobre", "Alumínio", "Lítio", "Soja", "Algodão", "Ouro"
  ];

  // Simulação de métricas de precisão do modelo matemático para a interface
  const metricasModelo = [
    { nome: "Confiança do Modelo (R²)", valor: "94.2%", status: "excelente" },
    { nome: "Margem de Erro (MAPE)", valor: "3.8%", status: "bom" },
    { nome: "Volatilidade Histórica", valor: "Média-Alta", status: "alerta" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Cabeçalho com Seletor Global */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Análise Preditiva Profunda</h1>
          <p className="text-sm text-slate-400 mt-1">Modelagem matemática avançada e diagnósticos do algoritmo Prophet em tempo real.</p>
        </div>
        
        <div className="w-full md:w-72">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Foco da Análise (Ativo)</label>
          <div className="relative">
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
            >
              {materiaisDisponiveis.map(mat => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Bloco Principal: Gráfico Expandido e Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Gráfico Gigante (Ocupa 2 colunas) */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col h-[36rem]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Projeção da Curva de Preço</h3>
            <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Live Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Linha do tempo interativa mostrando a previsão superior (otimista) e inferior (pessimista).</p>
          
          <div className="flex-1 w-full relative">
            <GlobalForecast material={material} />
          </div>
        </div>

        {/* Coluna Lateral: Insights e Diagnóstico */}
        <div className="space-y-6">
          <AIInsights material={material} />

          {/* Card de Diagnóstico do Algoritmo */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              <h3 className="text-lg font-bold text-white tracking-tight">Diagnóstico do Modelo</h3>
            </div>
            
            <div className="space-y-4">
              {metricasModelo.map((metrica, idx) => (
                <div key={idx} className="bg-[#1F2937] rounded-xl p-4 border border-[#374151]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-400">{metrica.nome}</span>
                    {metrica.status === 'excelente' && <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    {metrica.status === 'bom' && <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    {metrica.status === 'alerta' && <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                  </div>
                  <div className="text-xl font-bold text-white">{metrica.valor}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1F2937]">
              <p className="text-xs text-slate-500 leading-relaxed">
                *O algoritmo utiliza os últimos 365 dias de histórico para calcular sazonalidade e tendências. Eventos de cisne negro (imprevisíveis) não estão refletidos nestas margens.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
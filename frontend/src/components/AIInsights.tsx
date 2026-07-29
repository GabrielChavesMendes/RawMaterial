import { useEffect, useState } from 'react';

// Contrato TypeScript para o retorno da API
interface InsightsData {
  resumo: string;
  alerta: string;
}

// 1. Definindo que este componente aceita o 'material' do App.tsx
interface Props {
  material: string;
}

export function AIInsights({ material }: Props) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarInsights = async () => {
      setCarregando(true);
      setErro(''); // Limpa erros passados ao trocar de material
      try {
        // 2. A URL usa a variável do App.tsx
        const resposta = await fetch(`https://rawmaterial-api.onrender.com/api/insights/${material}`);
        if (!resposta.ok) throw new Error('Erro ao aceder à API');
        
        const dadosJson = await resposta.json();
        setInsights(dadosJson);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setErro('Serviço de IA indisponível no momento.');
      } finally {
        setCarregando(false);
      }
    };

    buscarInsights();
  }, [material]); // 3. Dispara a re-renderização sempre que o material mudar

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col">
      
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">IA Insights</h3>
          {/* O subtítulo informa a análise atual */}
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Análise para {material}
          </p>
        </div>
        {carregando && (
          <span className="flex w-3 h-3 relative mt-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-3 h-3 bg-blue-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-6">
        
        {erro ? (
          <div className="text-sm text-red-500 text-center py-4">{erro}</div>
        ) : !insights ? (
          <div className="text-sm text-slate-500 text-center py-4 animate-pulse">
            A processar heurísticas de mercado para {material}...
          </div>
        ) : (
          <>
            {/* Bloco 1: Resumo Executivo (Azul) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-500 mb-1">Resumo Executivo</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {insights.resumo}
                </p>
              </div>
            </div>

            <div className="border-t border-[#1F2937]"></div>

            {/* Bloco 2: Alertas de Risco (Vermelho) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-500 mb-1">Alertas de Risco</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {insights.alerta}
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
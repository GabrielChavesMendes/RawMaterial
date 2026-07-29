import { useEffect, useState } from 'react';

// Contratos de tipagem do TypeScript
interface Ativo {
  nome: string;
  preco: string;
  variacao: string;
}

interface DadosMovers {
  altas: Ativo[];
  quedas: Ativo[];
}

export function TopMovers() {
  // Estados para gerenciar a chamada à API
  const [dados, setDados] = useState<DadosMovers>({ altas: [], quedas: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Chamada à API da nossa máquina Python
  useEffect(() => {
    const buscarMovimentacoes = async () => {
      try {
        const resposta = await fetch('http://localhost:8000/api/top-movers');
        if (!resposta.ok) throw new Error('Erro ao aceder à API');
        
        const dadosJson = await resposta.json();
        setDados(dadosJson);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setErro('Indisponível no momento');
      } finally {
        setCarregando(false);
      }
    };

    buscarMovimentacoes();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Card Maiores Altas */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          <h3 className="text-lg font-bold text-white tracking-tight">Maiores Altas (30d)</h3>
        </div>
        
        <div className="space-y-4 min-h-[96px]">
          {carregando ? (
            <p className="text-sm text-slate-500 animate-pulse">Calculando variações...</p>
          ) : erro ? (
            <p className="text-sm text-red-500">{erro}</p>
          ) : dados.altas.length === 0 ? (
            <p className="text-sm text-slate-500">Sem dados suficientes.</p>
          ) : (
            dados.altas.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-300">{item.nome}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.preco}</p>
                </div>
                <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  {item.variacao}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Card Maiores Quedas */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
          </svg>
          <h3 className="text-lg font-bold text-white tracking-tight">Maiores Quedas (30d)</h3>
        </div>
        
        <div className="space-y-4 min-h-[96px]">
          {carregando ? (
            <p className="text-sm text-slate-500 animate-pulse">Calculando variações...</p>
          ) : erro ? (
            <p className="text-sm text-red-500">{erro}</p>
          ) : dados.quedas.length === 0 ? (
            <p className="text-sm text-slate-500">Sem dados suficientes.</p>
          ) : (
            dados.quedas.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-300">{item.nome}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.preco}</p>
                </div>
                <span className="text-sm font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                  {item.variacao}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
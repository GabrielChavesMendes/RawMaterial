import { useEffect, useState } from 'react';

// Tipagem para os dados vindos da API
interface TopMover {
  nome: string;
  preco: string;
  variacao: string;
}

export function Tendencias() {
  const [altas, setAltas] = useState<TopMover[]>([]);
  const [quedas, setQuedas] = useState<TopMover[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os dados reais da sua API FastAPI
  useEffect(() => {
    const buscarMovimentacoes = async () => {
      try {
        const resposta = await fetch('https://rawmaterial-api.onrender.com/api/top-movers');
        if (resposta.ok) {
          const dados = await resposta.json();
          setAltas(dados.altas || []);
          setQuedas(dados.quedas || []);
        }
      } catch (erro) {
        console.error("Erro ao buscar top movers:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarMovimentacoes();
  }, []);

  // Dados simulados para os setores (para deixar a interface rica)
  const setores = [
    { nome: 'Energia', commodities: ['Petróleo (WTI)', 'Gás Natural'], tendencia: 'Alta', valor: '+3.2%' },
    { nome: 'Metais Industriais', commodities: ['Cobre', 'Alumínio', 'Minério de Ferro', 'Aço Inox'], tendencia: 'Baixa', valor: '-1.5%' },
    { nome: 'Agricultura', commodities: ['Trigo', 'Soja', 'Algodão', 'Madeira'], tendencia: 'Estável', valor: '+0.4%' },
    { nome: 'Metais Preciosos', commodities: ['Ouro', 'Lítio'], tendencia: 'Alta', valor: '+5.1%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabeçalho da Página */}
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tendências de Mercado</h1>
        <p className="text-sm text-slate-400 mt-1">Visão macroeconómica e movimentações globais dos últimos 30 dias.</p>
      </header>

      {/* Secção 1: Maiores Movimentações (Ligado à API) */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Maiores Movimentações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card de Altas */}
          <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Maiores Altas</h3>
            </div>
            {carregando ? (
              <div className="text-slate-500 text-sm animate-pulse">A analisar o mercado...</div>
            ) : (
              <div className="space-y-4">
                {altas.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-[#1F2937] pb-3 last:border-0 last:pb-0">
                    <span className="text-white font-medium">{item.nome}</span>
                    <div className="text-right">
                      <div className="text-sm text-slate-300">{item.preco}</div>
                      <div className="text-xs font-bold text-emerald-500">{item.variacao}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card de Quedas */}
          <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Maiores Quedas</h3>
            </div>
            {carregando ? (
              <div className="text-slate-500 text-sm animate-pulse">A analisar o mercado...</div>
            ) : (
              <div className="space-y-4">
                {quedas.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-[#1F2937] pb-3 last:border-0 last:pb-0">
                    <span className="text-white font-medium">{item.nome}</span>
                    <div className="text-right">
                      <div className="text-sm text-slate-300">{item.preco}</div>
                      <div className="text-xs font-bold text-red-500">{item.variacao}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Secção 2: Desempenho por Setor */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Análise Setorial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {setores.map((setor, index) => (
            <div key={index} className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 hover:border-slate-600 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-slate-300 font-semibold text-sm">{setor.nome}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  setor.tendencia === 'Alta' ? 'bg-emerald-500/10 text-emerald-500' :
                  setor.tendencia === 'Baixa' ? 'bg-red-500/10 text-red-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {setor.valor}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {setor.commodities.join(', ')}
              </p>
              <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    setor.tendencia === 'Alta' ? 'bg-emerald-500 w-3/4' :
                    setor.tendencia === 'Baixa' ? 'bg-red-500 w-1/4' :
                    'bg-blue-500 w-1/2'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
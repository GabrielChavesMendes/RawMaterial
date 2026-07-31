import { useState, useEffect } from 'react';

interface Fornecedor {
  id: string;
  nome: string;
  commodity: string;
  rating: number;
}

interface Alerta {
  id: string;
  texto: string;
  tipo: string;
  data: string;
}

export function CadeiaSuprimentos() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregandoLogistica, setCarregandoLogistica] = useState(true);
  
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregandoAlertas, setCarregandoAlertas] = useState(true);

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const resposta = await fetch('https://rawmaterial-api.onrender.com/api/fornecedores');
        const dados = await resposta.json();
        setFornecedores(dados);
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
      } finally {
        setCarregandoLogistica(false);
      }
    };

    const buscarNoticias = async () => {
      try {
        const resposta = await fetch('https://rawmaterial-api.onrender.com/api/noticias');
        const dados = await resposta.json();
        setAlertas(dados);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
        setAlertas([{ id: "1", texto: "Erro ao conectar com o Radar Global.", tipo: "critico", data: "Agora" }]);
      } finally {
        setCarregandoAlertas(false);
      }
    };

    buscarFornecedores();
    buscarNoticias();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Cadeia de Suprimentos</h1>
        <p className="text-sm text-slate-400 mt-1">Monitorize fornecedores globais e riscos logísticos em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Diretório Global de Fornecedores */}
        <section className="xl:col-span-2 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Diretório Global de Fornecedores</h2>
            <button className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              + Adicionar Fornecedor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Empresa</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Material Principal</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fiabilidade</th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {carregandoLogistica ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs font-medium animate-pulse">A carregar malha logística...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  fornecedores.map((forn) => (
                    <tr key={forn.id} className="border-b border-[#1F2937] hover:bg-[#1F2937]/50 transition-colors group">
                      <td className="py-4 font-medium text-slate-200">{forn.nome}</td>
                      <td className="py-4 text-slate-400">{forn.commodity}</td>
                      <td className="py-4">
                        <div className="flex text-yellow-500 text-xs">
                          {Array.from({ length: forn.rating }).map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-red-400 hover:text-red-300 font-medium text-xs border border-red-500/30 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                          Cotar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Radar de Riscos (Agora com IA Real) */}
        <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h2 className="text-lg font-bold text-white">Radar Global (News)</h2>
          </div>

          <div className="flex-1 space-y-4">
            {carregandoAlertas ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                <svg className="animate-spin h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="text-xs animate-pulse">A procurar riscos logísticos globais...</span>
              </div>
            ) : (
              alertas.map((alerta) => (
                <div key={alerta.id} className="p-4 rounded-xl border border-[#374151] bg-[#1F2937] hover:border-slate-500 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-red-500 animate-pulse"></span>
                    <div>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">{alerta.texto}</p>
                      <p className="text-xs text-slate-500 mt-2 font-mono">{alerta.data} • Fonte: Google News</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
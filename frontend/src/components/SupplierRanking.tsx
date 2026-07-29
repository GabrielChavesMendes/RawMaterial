import { useEffect, useState } from 'react';

interface Fornecedor {
  id: string;
  nome: string;
  commodity: string;
  rating: number;
  site: string; // <-- NOVA PROPRIEDADE
}

export function SupplierRanking() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Como ainda não atualizámos o Python com os sites, vamos simular os links temporariamente aqui no Front-end
  const linksSimulados: Record<string, string> = {
    "1": "https://www.klabin.com.br", // Exemplo real
    "2": "https://petrobras.com.br",
    "3": "https://www.bunge.com.br",
    "4": "https://www.votorantimcimentos.com.br",
    "5": "https://www.vale.com",
    "6": "https://www.shell.com"
  };

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const resposta = await fetch('https://rawmaterial-api.onrender.com/api/fornecedores');
        const dadosJson = await resposta.json();
        
        // Injetamos os links nos dados que vieram da API
        const dadosComLinks = dadosJson.map((f: Fornecedor) => ({
          ...f,
          site: linksSimulados[f.id] || "https://google.com"
        }));
        
        setFornecedores(dadosComLinks);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };
    buscarFornecedores();
  }, []);

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Top Fornecedores Avaliados</h3>
        <button 
          onClick={() => alert("Abrindo painel completo de fornecedores...")}
          className="text-sm font-medium text-[#ef4444] hover:text-red-400 transition-colors"
        >
          Ver todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1F2937]">
              <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fornecedor</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Commodity</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Confiabilidade</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]/50">
            {carregando ? (
              <tr><td colSpan={4} className="py-4 text-center text-slate-500 animate-pulse">A carregar...</td></tr>
            ) : (
              fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id} className="group hover:bg-[#1F2937]/30 transition-colors">
                  <td className="py-4 text-sm font-medium text-slate-200">{fornecedor.nome}</td>
                  <td className="py-4 text-sm text-slate-400">{fornecedor.commodity}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg key={index} className={`w-4 h-4 ${index < fornecedor.rating ? 'text-yellow-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    {/* O BOTÃO AGORA É UM LINK REAL */}
                    <a 
                      href={fornecedor.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-slate-300 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors"
                    >
                      Cotar Site
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
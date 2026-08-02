import { useState, useEffect } from 'react';

interface Noticia {
  id: string;
  texto: string;
  data: string;
  link: string;
}

export function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarNoticias = async () => {
      try {
        const resposta = await fetch('https://rawmaterial-api.onrender.com/api/noticias');
        const dados = await resposta.json();
        setNoticias(dados);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarNoticias();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            Radar Global de Notícias
          </h1>
          <p className="text-sm text-slate-400 mt-1">Acompanhe as últimas atualizações sobre logística, portos e commodities globais.</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium bg-[#1F2937] px-3 py-1.5 rounded-lg border border-[#374151]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-slate-300">Atualizado em Tempo Real (Google News)</span>
        </div>
      </header>

      {carregando ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-400 font-medium animate-pulse">A varrer a internet à procura de informações...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <a 
              key={noticia.id} 
              href={noticia.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#111827] border border-[#1F2937] rounded-2xl p-6 hover:border-slate-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                    Mercado Global
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{noticia.data}</span>
                </div>
                <h3 className="text-slate-200 font-medium leading-relaxed group-hover:text-red-400 transition-colors">
                  {noticia.texto}
                </h3>
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-[#1F2937] pt-4">
                <span className="text-xs text-slate-500">Fonte Oficial</span>
                <div className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center group-hover:bg-red-500 group-hover:text-white text-slate-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
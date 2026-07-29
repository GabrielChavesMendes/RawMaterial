import { useState } from 'react';

export function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState('previsao');
  const [periodo, setPeriodo] = useState('30d');
  
  // Estados para simular o "Loading" dos botões de exportação
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [gerandoExcel, setGerandoExcel] = useState(false);

  const simularExportacao = (formato: 'pdf' | 'excel') => {
    if (formato === 'pdf') {
      setGerandoPdf(true);
      setTimeout(() => {
        setGerandoPdf(false);
        alert("Sucesso! O relatório em PDF (relatorio_rawmaterial.pdf) foi baixado para o seu computador.");
      }, 1500); // Finge que demorou 1.5 segundos a compilar o PDF
    } else {
      setGerandoExcel(true);
      setTimeout(() => {
        setGerandoExcel(false);
        alert("Sucesso! A planilha Excel (dados_exportados.xlsx) foi baixada para o seu computador.");
      }, 1500);
    }
  };

  // Histórico de relatórios fictício (usando datas recentes)
  const historicoRelatorios = [
    { id: 1, nome: "Análise Preditiva - Metais (Q3)", data: "27 Jul 2026", tamanho: "2.4 MB", formato: "PDF" },
    { id: 2, nome: "Exportação Bruta - Prophet (1 Ano)", data: "25 Jul 2026", tamanho: "512 KB", formato: "Excel" },
    { id: 3, nome: "Avaliação de Risco Logístico", data: "20 Jul 2026", tamanho: "1.1 MB", formato: "PDF" },
    { id: 4, nome: "Consolidado de ROI (Madeira)", data: "15 Jul 2026", tamanho: "890 KB", formato: "PDF" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabeçalho */}
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Central de Relatórios</h1>
        <p className="text-sm text-slate-400 mt-1">Gere, exporte e partilhe análises detalhadas com a sua equipa.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Painel Gerador de Novos Relatórios */}
        <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h2 className="text-lg font-bold text-white">Gerar Novo Relatório</h2>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Documento</label>
              <select
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="previsao">Análise Preditiva e Preços Futuros</option>
                <option value="movimentacao">Histórico de Movimentações (Top Movers)</option>
                <option value="cadeia">Avaliação de Fornecedores e Riscos Logísticos</option>
                <option value="roi">Simulações de Retorno (ROI)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Período de Análise</label>
              <div className="grid grid-cols-3 gap-3">
                {['30d', '90d', '1a'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPeriodo(opt)}
                    className={`py-2 text-sm font-medium rounded-lg transition-colors border ${
                      periodo === opt 
                        ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                        : 'bg-[#1F2937] text-slate-400 border-transparent hover:bg-[#374151]'
                    }`}
                  >
                    {opt === '30d' ? '30 Dias' : opt === '90d' ? '3 Meses' : '1 Ano'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-[#1F2937] my-6" />

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => simularExportacao('pdf')}
              disabled={gerandoPdf || gerandoExcel}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {gerandoPdf ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              )}
              <span>{gerandoPdf ? 'A processar...' : 'Exportar PDF'}</span>
            </button>
            
            <button
              onClick={() => simularExportacao('excel')}
              disabled={gerandoPdf || gerandoExcel}
              className="w-full flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {gerandoExcel ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              )}
              <span>{gerandoExcel ? 'A compilar...' : 'Exportar Excel'}</span>
            </button>
          </div>
        </section>

        {/* Histórico de Relatórios */}
        <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Arquivos Recentes</h3>
          
          <div className="space-y-4">
            {historicoRelatorios.map((relatorio) => (
              <div key={relatorio.id} className="group flex items-center justify-between p-4 bg-[#1F2937] border border-[#374151] rounded-xl hover:border-slate-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    relatorio.formato === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    <span className="text-xs font-bold">{relatorio.formato}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{relatorio.nome}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{relatorio.data}</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <span>{relatorio.tamanho}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => alert(`A transferir documento arquivado: ${relatorio.nome}`)}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors text-center">
            Ver todo o histórico
          </button>
        </section>

      </div>
    </div>
  );
}
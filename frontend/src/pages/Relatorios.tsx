import { useState } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState('previsao');
  const [periodo, setPeriodo] = useState('30d');
  
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [gerandoExcel, setGerandoExcel] = useState(false);

  // Dados reais que vão para o Excel
  const dadosExportacao = [
    { Material: "Petróleo (WTI)", Preco_Atual: 82.50, Moeda: "USD", Variacao: "+2.1%", Tendencia: "Alta" },
    { Material: "Ouro", Preco_Atual: 2340.10, Moeda: "USD", Variacao: "+5.0%", Tendencia: "Alta" },
    { Material: "Trigo", Preco_Atual: 650.00, Moeda: "USD", Variacao: "-1.2%", Tendencia: "Baixa" },
    { Material: "Madeira", Preco_Atual: 420.00, Moeda: "USD", Variacao: "0.0%", Tendencia: "Estável" },
    { Material: "Cobre", Preco_Atual: 4.15, Moeda: "USD", Variacao: "+1.8%", Tendencia: "Alta" },
  ];

  const exportarPDF = () => {
    setGerandoPdf(true);
    
    setTimeout(() => {
      // 1. Cria um novo documento PDF
      const doc = new jsPDF();
      
      // 2. Adiciona textos e formatação
      doc.setFontSize(20);
      doc.setTextColor(220, 38, 38); // Vermelho da sua marca
      doc.text("Relatório RawMaterial", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // Cinza
      doc.text(`Documento gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
      
      doc.setTextColor(0, 0, 0); // Preto
      doc.text(`Tipo de Análise: ${tipoRelatorio.toUpperCase()}`, 20, 45);
      doc.text(`Período Selecionado: ${periodo === '30d' ? '30 Dias' : periodo === '90d' ? '3 Meses' : '1 Ano'}`, 20, 55);
      
      doc.setFontSize(10);
      doc.text("Este é um documento confidencial gerado automaticamente pelo algoritmo preditivo.", 20, 80);
      
      // 3. Força o download do ficheiro
      doc.save(`RawMaterial_Relatorio_${periodo}.pdf`);
      setGerandoPdf(false);
    }, 800); // Pequeno atraso apenas para a UX (mostrar o spinner)
  };

  const exportarExcel = () => {
    setGerandoExcel(true);
    
    setTimeout(() => {
      // 1. Converte o nosso array de dados numa "folha" de cálculo (worksheet)
      const folha = XLSX.utils.json_to_sheet(dadosExportacao);
      
      // 2. Cria um ficheiro Excel vazio (workbook)
      const livro = XLSX.utils.book_new();
      
      // 3. Adiciona a nossa folha dentro do ficheiro
      XLSX.utils.book_append_sheet(livro, folha, "Dados de Mercado");
      
      // 4. Força o download
      XLSX.writeFile(livro, `RawMaterial_Dados_${periodo}.xlsx`);
      setGerandoExcel(false);
    }, 800);
  };

  // Histórico de relatórios
  const historicoRelatorios = [
    { id: 1, nome: "Análise Preditiva - Metais (Q3)", data: "27 Jul 2026", tamanho: "2.4 MB", formato: "PDF" },
    { id: 2, nome: "Exportação Bruta - Prophet (1 Ano)", data: "25 Jul 2026", tamanho: "512 KB", formato: "Excel" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
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
              onClick={exportarPDF}
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
              onClick={exportarExcel}
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

        {/* Histórico Simplificado para a Tela */}
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
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
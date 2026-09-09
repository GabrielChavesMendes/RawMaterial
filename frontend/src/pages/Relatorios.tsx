import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

export function Relatorios() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [materialSelecionado, setMaterialSelecionado] = useState('Petroleo');
  const [carregandoPDF, setCarregandoPDF] = useState(false);
  const [carregandoExcel, setCarregandoExcel] = useState(false);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUsuario(user));
  }, []);

  // Função auxiliar para buscar os dados reais da API
  const buscarDadosPrevisao = async () => {
    // Trocamos o link do Render pelo link do seu servidor local (localhost)
    const resposta = await fetch(`http://127.0.0.1:8000/api/previsao/${materialSelecionado}`);
    
    if (!resposta.ok) throw new Error('Falha ao conectar com o motor de IA local.');
    return await resposta.json();
  };

  const gerarPDF = async () => {
    try {
      setCarregandoPDF(true);
      setMensagem(null);
      const dados = await buscarDadosPrevisao();
      
      const doc = new jsPDF();
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const nomeEmpresa = usuario?.user_metadata?.empresa || 'RawMaterial Insights';

      // Cabeçalho Corporativo
      doc.setFillColor(11, 17, 32); // Cor de fundo escura
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Relatório Executivo de Mercado', 14, 22);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gerado por: ${nomeEmpresa} | Data: ${dataAtual}`, 14, 30);

      // Resumo Analítico (IA)
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Análise Preditiva: ${materialSelecionado.toUpperCase()}`, 14, 55);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const textoAnalise = `Este documento contém a projeção de preços para os próximos 90 dias gerada pelo algoritmo Prophet. Os dados processados baseiam-se no histórico recente capturado via Yahoo Finance, considerando volatilidade de mercado e sazonalidade.`;
      const linhasTexto = doc.splitTextToSize(textoAnalise, 180);
      doc.text(linhasTexto, 14, 62);

      interface PrevisaoProphet {
        ds: string;
        yhat: number;
        yhat_lower: number;
        yhat_upper: number;
      }

      // Configuração da Tabela
      const tableData = dados.map((item: PrevisaoProphet) => [
        item.ds, 
        `R$ ${item.yhat.toFixed(2)}`, 
        `R$ ${item.yhat_lower.toFixed(2)}`, 
        `R$ ${item.yhat_upper.toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Data Prevista', 'Preço Estimado', 'Margem Mínima', 'Margem Máxima']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      // Rodapé
      const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Confidencial - ${nomeEmpresa} - Página ${i} de ${pageCount}`, 14, 290);
      }

      doc.save(`RawMaterial_Relatorio_${materialSelecionado}_${dataAtual.replace(/\//g, '-')}.pdf`);
      setMensagem({ texto: 'PDF executivo gerado com sucesso!', tipo: 'sucesso' });
    }catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar relatório.';
      setMensagem({ texto: errorMessage, tipo: 'erro' });
    } finally {
      setCarregandoPDF(false);
    }
  };

  const gerarExcel = async () => {
    try {
      setCarregandoExcel(true);
      setMensagem(null);
      const dados = await buscarDadosPrevisao();

      // Formatar dados para a planilha
      const dadosFormatados = dados.map((item: Record<string, string | number>) => ({
        'Data Prevista': item.ds,
        'Preço Estimado (Base)': Number(Number(item.yhat).toFixed(2)),
        'Piso (Margem Erro)': Number(Number(item.yhat_lower).toFixed(2)),
        'Teto (Margem Erro)': Number(Number(item.yhat_upper).toFixed(2)),
      }));

      const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
      const workbook = XLSX.utils.book_new();
      
      // Ajuste de largura das colunas
      worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Projeções de Mercado");
      
      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      XLSX.writeFile(workbook, `RawMaterial_Dados_${materialSelecionado}_${dataAtual}.xlsx`);
      
      setMensagem({ texto: 'Planilha Excel exportada com sucesso!', tipo: 'sucesso' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setMensagem({ texto: errorMessage, tipo: 'erro' });
    } finally {
      setCarregandoExcel(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relatórios Executivos</h1>
          <p className="text-sm text-slate-400 mt-1">Gere documentos consolidados com base na análise da Inteligência Artificial.</p>
        </div>
      </header>

      {mensagem && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${mensagem.tipo === 'sucesso' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel de Configuração do Relatório */}
        <div className="lg:col-span-1 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-6 h-fit">
          <h2 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3">Parâmetros</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Selecione o Mercado</label>
            <select 
              value={materialSelecionado} 
              onChange={(e) => setMaterialSelecionado(e.target.value)}
              className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
            >
              <option value="Petroleo">Petróleo (WTI)</option>
              <option value="Cobre">Cobre Global</option>
              <option value="Soja">Soja (Commodity)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Período de Previsão</label>
            <input type="text" disabled value="Próximos 90 Dias" className="w-full bg-[#1F2937]/50 border border-[#374151]/50 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed" />
          </div>
        </div>

        {/* Área de Exportação */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card PDF */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-600 transition-colors shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shrink-0">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Documento Executivo (PDF)</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md">Gera um relatório formatado e timbrado com o sumário da IA, tabelas de projeção e formatação pronta para impressão ou envio à diretoria.</p>
              </div>
            </div>
            <button 
              onClick={gerarPDF} 
              disabled={carregandoPDF || carregandoExcel}
              className="w-full md:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {carregandoPDF ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Baixar PDF'}
            </button>
          </div>

          {/* Card Excel */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-600 transition-colors shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 shrink-0">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Tabela de Dados Brutos (Excel)</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md">Exporta todas as dezenas de linhas de previsão geradas pela IA diretamente para o Excel, ideal para cruzamento de dados e análise profunda.</p>
              </div>
            </div>
            <button 
              onClick={gerarExcel} 
              disabled={carregandoPDF || carregandoExcel}
              className="w-full md:w-auto px-6 py-3 bg-[#1F2937] hover:bg-slate-700 text-white font-bold rounded-xl border border-[#374151] transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {carregandoExcel ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Baixar .XLSX'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
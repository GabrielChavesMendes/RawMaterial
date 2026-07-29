import { useState } from 'react';

export function Configuracoes() {
  const [alertasPreco, setAlertasPreco] = useState(true);
  const [relatorioSemanal, setRelatorioSemanal] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(true);
  const [moeda, setMoeda] = useState('USD');

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
        <p className="text-sm text-slate-400 mt-1">Personalize a sua experiência, notificações e preferências de moeda.</p>
      </header>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-xl space-y-8">
        
       {/* Preferências Globais */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 border-b border-[#1F2937] pb-2">Preferências de Exibição</h2>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Moeda Padrão</p>
                <p className="text-xs text-slate-500">Exibição de preços nos gráficos e tabelas.</p>
              </div>
              <select 
                value={moeda} 
                onChange={(e) => setMoeda(e.target.value)}
                className="bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="USD">Dólar Americano (USD)</option>
                <option value="BRL">Real Brasileiro (BRL)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            {/* ADICIONAMOS O BOTÃO DO MODO ESCURO AQUI PARA RESOLVER O AVISO */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-slate-200">Tema Escuro (Dark Mode)</p>
                <p className="text-xs text-slate-500">Alternar entre a interface clara e escura.</p>
              </div>
              <button 
                onClick={() => setModoEscuro(!modoEscuro)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${modoEscuro ? 'bg-red-500' : 'bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${modoEscuro ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

          </div>
        </section>
        
        {/* Notificações */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 border-b border-[#1F2937] pb-2">Notificações e Alertas</h2>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Alertas de Preço (Volatilidade)</p>
                <p className="text-xs text-slate-500">Receber e-mail quando uma commodity subir ou cair mais de 5% num dia.</p>
              </div>
              <button 
                onClick={() => setAlertasPreco(!alertasPreco)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${alertasPreco ? 'bg-red-500' : 'bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${alertasPreco ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Relatório Semanal</p>
                <p className="text-xs text-slate-500">Receber o resumo preditivo no e-mail todas as segundas-feiras.</p>
              </div>
              <button 
                onClick={() => setRelatorioSemanal(!relatorioSemanal)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${relatorioSemanal ? 'bg-red-500' : 'bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${relatorioSemanal ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
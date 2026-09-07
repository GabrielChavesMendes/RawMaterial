import { useState } from 'react';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const [tipoPlano, setTipoPlano] = useState<'pessoal' | 'empresarial'>('pessoal');

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      {/* Container principal com limite de altura e scroll interno para mobile */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative scrollbar-thin scrollbar-thumb-[#374151] scrollbar-track-transparent">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-500/10 blur-[100px] pointer-events-none rounded-t-3xl"></div>
        
        <div className="p-6 sm:p-8 pb-0 flex flex-col items-center relative z-10">
          <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-500 hover:text-white transition-colors bg-[#1F2937] p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 text-center mt-6 sm:mt-0">
            Desbloqueie o Poder da <span className="text-red-500">Inteligência Preditiva</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 text-center max-w-2xl mb-8">
            Escale suas análises de mercado com algoritmos avançados, relatórios executivos e colaboração em tempo real para a sua organização.
          </p>

          <div className="flex flex-col sm:flex-row bg-[#0B1120] p-1.5 rounded-xl border border-[#1F2937] mb-8 relative z-10 w-full sm:w-auto gap-2 sm:gap-0">
            <button 
              onClick={() => setTipoPlano('pessoal')} 
              className={`px-8 py-3 sm:py-2.5 text-sm font-bold rounded-lg transition-all text-center ${tipoPlano === 'pessoal' ? 'bg-[#1F2937] text-white shadow-md border border-[#374151]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Uso Pessoal
            </button>
            <button 
              onClick={() => setTipoPlano('empresarial')} 
              className={`px-8 py-3 sm:py-2.5 text-sm font-bold rounded-lg transition-all text-center ${tipoPlano === 'empresarial' ? 'bg-[#1F2937] text-white shadow-md border border-[#374151]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Para Organizações (B2B)
            </button>
          </div>
        </div>

        {/* Mudança principal de responsividade: grid-cols-1 em mobile, lg:grid-cols-3 apenas em telas grandes. Gap aumentado para 8 */}
        <div className="p-6 sm:p-8 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {tipoPlano === 'pessoal' && (
            <>
              <div className="bg-[#0B1120] border border-[#1F2937] rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all">
                <h3 className="text-lg font-bold text-slate-300 mb-1">Basic</h3>
                <p className="text-xs text-slate-500 mb-4">Para analistas iniciantes.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">Grátis</span></div>
                <button className="w-full py-3 bg-[#1F2937] text-white font-bold rounded-xl border border-[#374151] mb-6 cursor-default">Plano Atual</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Acompanhar 3 Commodities" />
                  <Feature text="Dashboard de Previsão Simples" />
                  <Feature text="Histórico de dados: 30 dias" />
                  <Feature text="1 Exportação PDF/mês" />
                </div>
              </div>

              {/* Destaque sobe apenas em telas lg (lg:-translate-y-4) para não quebrar no mobile */}
              <div className="bg-[#111827] border-2 border-red-500 rounded-2xl p-6 flex flex-col relative transform lg:-translate-y-4 shadow-2xl shadow-red-500/10 mt-6 lg:mt-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  Mais Popular
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Pro Analyst</h3>
                <p className="text-xs text-slate-400 mb-4">Monitoramento ativo de mercado.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">R$ 49</span><span className="text-slate-500 text-sm">/mês</span></div>
                <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 mb-6">Fazer Upgrade</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Acompanhar 15 Commodities" />
                  <Feature text="IA Prophet Avançada" />
                  <Feature text="Histórico de dados: 1 ano" />
                  <Feature text="Exportação Ilimitada (PDF/Excel)" />
                  <Feature text="Alertas por E-mail" />
                </div>
              </div>

              <div className="bg-[#0B1120] border border-[#1F2937] rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all mt-2 lg:mt-0">
                <h3 className="text-lg font-bold text-[#D4B895] mb-1">Elite</h3>
                <p className="text-xs text-slate-500 mb-4">Investidores e Traders focados.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">R$ 99</span><span className="text-slate-500 text-sm">/mês</span></div>
                <button className="w-full py-3 bg-transparent text-[#D4B895] hover:bg-[#D4B895]/10 font-bold rounded-xl border border-[#D4B895]/30 transition-all mb-6">Fazer Upgrade</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Materiais Ilimitados" />
                  <Feature text="Acesso à API RawMaterial" />
                  <Feature text="Histórico de dados: 5 anos" />
                  <Feature text="Customização de Tema" />
                  <Feature text="Suporte Prioritário" />
                </div>
              </div>
            </>
          )}

          {tipoPlano === 'empresarial' && (
            <>
              <div className="bg-[#0B1120] border border-[#1F2937] rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all">
                <h3 className="text-lg font-bold text-slate-300 mb-1">B2B Starter</h3>
                <p className="text-xs text-slate-500 mb-4">Pequenas equipes de suprimentos.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">R$ 199</span><span className="text-slate-500 text-sm">/mês</span></div>
                <button className="w-full py-3 bg-[#1F2937] hover:bg-slate-700 text-white font-bold rounded-xl border border-[#374151] mb-6 transition-colors">Iniciar Teste Grátis</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Até 2 Workspaces (Equipes)" />
                  <Feature text="3 Assentos (Membros)" />
                  <Feature text="Filtro: 1 Setor Industrial" />
                  <Feature text="Dashboard Compartilhado" />
                </div>
              </div>

              <div className="bg-[#111827] border-2 border-red-500 rounded-2xl p-6 flex flex-col relative transform lg:-translate-y-4 shadow-2xl shadow-red-500/10 mt-6 lg:mt-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  Recomendado
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Corporate</h3>
                <p className="text-xs text-slate-400 mb-4">Gestão de fornecedores em escala.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">R$ 499</span><span className="text-slate-500 text-sm">/mês</span></div>
                <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 mb-6">Fazer Upgrade</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Até 10 Workspaces" />
                  <Feature text="15 Assentos (Membros)" />
                  <Feature text="Todos os Setores (Ilimitado)" />
                  <Feature text="Chat e Kanban Funcional" />
                  <Feature text="Relatórios Executivos B2B" />
                </div>
              </div>

              <div className="bg-[#0B1120] border border-[#1F2937] rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all mt-2 lg:mt-0">
                <h3 className="text-lg font-bold text-[#D4B895] mb-1">Enterprise Scale</h3>
                <p className="text-xs text-slate-500 mb-4">Operações globais de logística.</p>
                <div className="mb-6"><span className="text-3xl font-black text-white">Custom</span></div>
                <button className="w-full py-3 bg-transparent text-[#D4B895] hover:bg-[#D4B895]/10 font-bold rounded-xl border border-[#D4B895]/30 transition-all mb-6">Falar com Vendas</button>
                <div className="space-y-4 flex-1">
                  <Feature text="Workspaces Ilimitados" />
                  <Feature text="Assentos Ilimitados" />
                  <Feature text="PDFs White-label (Seu Logo)" />
                  <Feature text="Integração via API Dedicada" />
                  <Feature text="SLA de 99.9% de Uptime" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <span className="text-sm text-slate-300 leading-snug">{text}</span>
    </div>
  );
}
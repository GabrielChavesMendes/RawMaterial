import { useState, useEffect } from 'react';

interface Props {
  material: string;
  setMaterial: (novoMaterial: string) => void;
}

export function RoiSimulator({ material, setMaterial }: Props) {
  const [volume, setVolume] = useState('100');
  const [prazo, setPrazo] = useState('6');
  
  // 1. NOVO ESTADO: Guarda os resultados apenas quando o utilizador pede
  const [resultado, setResultado] = useState<{custo: number, economia: number, percentual: number} | null>(null);

  const precosBase: Record<string, number> = {
    "Madeira": 90.0,
    "Petróleo (WTI)": 82.0,
    "Gás Natural": 2.4,
    "Trigo": 680.0,
    "Minério de Ferro": 124.0,
    "Calcário": 45.0,
    "Aço Inoxidável": 2100.0,
    "Cobre": 8500.0,
    "Alumínio": 2200.0,
    "Lítio": 13500.0,
    "Soja": 1200.0,
    "Algodão": 85.0,
    "Ouro": 2300.0
  };

  // 2. FUNÇÃO ISOLADA: Só faz a conta quando é chamada
  const simularROI = () => {
    const precoAtual = precosBase[material] || 100;
    const vol = parseFloat(volume) || 0;
    const meses = parseInt(prazo) || 0;

    const custoEstimado = vol * precoAtual;
    const percentualEconomia = Math.min(meses * 0.015, 0.25);
    const economiaReal = custoEstimado * percentualEconomia;

    // Atualiza a tela com os novos valores consolidados
    setResultado({
      custo: custoEstimado,
      economia: economiaReal,
      percentual: percentualEconomia
    });
  };

  // 3. EFEITO INICIAL: Calcula uma primeira vez silenciosamente para não começar com a tela "zerada"
  useEffect(() => {
    simularROI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor);
  };

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col">
      
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <h3 className="text-lg font-bold text-white tracking-tight">Simulador de ROI</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Commodity Alvo</label>
          <div className="relative">
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#ef4444] transition-colors appearance-none cursor-pointer"
            >
              <option value="Madeira">Madeira</option>
              <option value="Petróleo (WTI)">Petróleo (WTI)</option>
              <option value="Gás Natural">Gás Natural</option>
              <option value="Trigo">Trigo</option>
              <option value="Minério de Ferro">Minério de Ferro</option>
              <option value="Calcário">Calcário</option>
              <option value="Aço Inoxidável">Aço Inoxidável</option>
              <option value="Cobre">Cobre</option>
              <option value="Alumínio">Alumínio</option>
              <option value="Lítio">Lítio</option>
              <option value="Soja">Soja</option>
              <option value="Algodão">Algodão</option>
              <option value="Ouro">Ouro</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Volume</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Prazo (Meses)</label>
            <input
              type="number"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>
        </div>

        <hr className="border-[#1F2937] my-2" />

        {/* 4. EXIBIÇÃO: Agora lê do estado 'resultado' em vez de fazer a conta no HTML */}
        <div className="space-y-3 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Custo Estimado</span>
            <span className="text-sm font-bold text-white">
              {resultado ? formatarMoeda(resultado.custo) : '$0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Economia Projetada</span>
            <span className="text-sm font-bold text-emerald-500">
              {resultado ? `${formatarMoeda(resultado.economia)} (${(resultado.percentual * 100).toFixed(1)}%)` : '$0.00 (0%)'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. AÇÃO: O botão agora chama a função simularROI que atualiza o resultado */}
      <button 
        className="w-full bg-[#ef4444] hover:bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        onClick={simularROI}
      >
        Simular Compra
      </button>
    </div>
  );
}
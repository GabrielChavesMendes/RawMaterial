import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Contrato de Dados (TypeScript)
interface DadosPrevisao {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

// 1. Definindo que este componente aceita o 'material' do App.tsx
interface Props {
  material: string;
}

export function GlobalForecast({ material }: Props) {
  const [dados, setDados] = useState<DadosPrevisao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tempoAtivo, setTempoAtivo] = useState('3M'); 

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true);
      setErro('');
      
      // 1. Traduzimos o botão selecionado para dias reais
      const mapaDias: Record<string, number> = {
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1A': 365
      };
      const diasFuturos = mapaDias[tempoAtivo] || 90;

      try {
        // 2. Injetamos a variável dias_futuros dinamicamente na URL
        const resposta = await fetch(`https://rawmaterial-api.onrender.com/api/previsao/${material}?dias_futuros=${diasFuturos}`);
        if (!resposta.ok) throw new Error("Erro ao aceder à API");
        
        const dadosJson = await resposta.json();
        setDados(dadosJson);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setErro("Erro de ligação com a API.");
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [tempoAtivo, material]);

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl h-full flex flex-col">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Previsão de Preços Globais</h2>
          {/* O subtítulo agora mostra o material atual */}
          <p className="text-sm text-slate-500 mt-1">Análise preditiva a curto e médio prazo para <strong className="text-slate-300">{material}</strong>.</p>
        </div>
        
        <div className="flex bg-[#1F2937] rounded-lg p-1 border border-[#374151]">
          {['1M', '3M', '6M', '1A'].map((tempo) => (
            <button
              key={tempo}
              onClick={() => setTempoAtivo(tempo)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                tempoAtivo === tempo 
                  ? 'bg-[#374151] text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tempo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative">
        {carregando ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 animate-pulse">
            Sincronizando com a IA para {material}...
          </div>
        ) : erro ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
            {erro}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              
              <XAxis 
                dataKey="ds" 
                stroke="#4B5563" 
                tick={{fontSize: 11, fill: '#6B7280'}} 
                tickFormatter={(t) => t.split('-').reverse().slice(0, 2).join('/')} 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#4B5563" 
                tick={{fontSize: 11, fill: '#6B7280'}} 
                domain={['dataMin - 2', 'auto']} 
                axisLine={false}
                tickLine={false}
              />
              
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#e53935' }}
                formatter={(value: number | string | readonly (number | string)[] | undefined, name: string | number | undefined) => {
                  const nomeSeguro = String(name || "Valor");
                  const corTexto = nomeSeguro === "Tendência Principal" ? "#ef4444" : "#9ca3af";
                  const valorExibicao = Array.isArray(value) ? value[0] : value;
                  return [<span style={{ color: corTexto }}>R$ {valorExibicao}</span>, nomeSeguro];
                }}
                labelFormatter={(label) => `Data: ${label.split('-').reverse().join('/')}`}
              />
              
              <Line 
                type="monotone" 
                dataKey="yhat" 
                name="Tendência Principal" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#111827', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="yhat_upper" name="Teto" stroke="#374151" strokeDasharray="4 4" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="yhat_lower" name="Piso" stroke="#374151" strokeDasharray="4 4" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 flex items-center gap-6 border-t border-[#1F2937] pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          {/* A legenda agora indica de forma inteligente qual é o ativo a ser exibido */}
          <span className="text-sm font-medium text-slate-300">{material} <span className="text-emerald-400 ml-1">Ativo</span></span>
        </div>
      </div>
      
    </div>
  );
}
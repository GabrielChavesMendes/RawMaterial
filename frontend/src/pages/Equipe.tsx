import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

type AbaEquipe = 'dashboard' | 'comunicacao' | 'kanban' | 'membros';

interface EquipeProps {
  id: string;
  nome: string;
  descricao: string;
  commodities: string[];
}

interface Tarefa {
  id: string;
  titulo: string;
  status: 'pendente' | 'analise' | 'concluido';
  autor: string;
}

export function Equipe() {
  const [usuario, setUsuario] = useState<User | null>(null);
  
  // Estados Globais
  // Carrega as equipes salvas no navegador ao abrir a página
  const [equipes, setEquipes] = useState<EquipeProps[]>(() => {
    const salvas = localStorage.getItem('@rawmaterial-equipes');
    return salvas ? JSON.parse(salvas) : [];
  });

  // Salva automaticamente no navegador sempre que uma equipe for criada
  useEffect(() => {
    localStorage.setItem('@rawmaterial-equipes', JSON.stringify(equipes));
  }, [equipes]);
  const [equipeAtiva, setEquipeAtiva] = useState<EquipeProps | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaEquipe>('dashboard');
  
  // Modais
  const [mostrarModalNovaEquipe, setMostrarModalNovaEquipe] = useState(false);
  const [mostrarPaywall, setMostrarPaywall] = useState(false);
  const [modalGrafico, setModalGrafico] = useState<{ visivel: boolean, ponto: any }>({ visivel: false, ponto: null });

  // Formulário Nova Equipe
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [commoditiesSelecionadas, setCommoditiesSelecionadas] = useState<string[]>([]);
  const opcoesCommodities = ['Petróleo (WTI)', 'Cobre Global', 'Soja', 'Minério de Ferro', 'Milho'];

  // Estados da Equipe Ativa (Chat, Kanban, Membros)
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 't1', titulo: 'Reavaliar contratos devido à alta de Novembro.', status: 'pendente', autor: 'Líder' }
  ]);
  const [novaTarefa, setNovaTarefa] = useState('');

  const [emailConvite, setEmailConvite] = useState('');
  const [membros, setMembros] = useState([
    { id: '1', nome: 'A carregar...', email: '', role: 'Líder (Você)', status: 'ativo' }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUsuario(user);
      if (user) {
        setMembros([{ 
          id: user.id, 
          nome: user.user_metadata?.nome_completo || 'Utilizador', 
          email: user.email || '', 
          role: 'Líder (Você)', 
          status: 'ativo' 
        }]);
      }
    });
  }, []);

  const handleCriarEquipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (equipes.length >= 2) {
      setMostrarModalNovaEquipe(false);
      setMostrarPaywall(true);
      return;
    }
    const nova = {
      id: Math.random().toString(),
      nome: novoNome,
      descricao: novaDescricao,
      commodities: commoditiesSelecionadas
    };
    setEquipes([...equipes, nova]);
    setEquipeAtiva(nova);
    setMostrarModalNovaEquipe(false);
    
    setNovoNome('');
    setNovaDescricao('');
    setCommoditiesSelecionadas([]);
    setMensagens([{ id: 1, autor: 'Sistema', texto: `Workspace '${nova.nome}' inicializado com escopo de ${nova.commodities.length} materiais.`, hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), tipo: 'sistema' }]);
  };

  const handleConvidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (membros.length >= 3) {
      setMostrarPaywall(true);
      return;
    }
    setMembros([...membros, {
      id: Math.random().toString(),
      nome: 'Convite Pendente',
      email: emailConvite,
      role: 'Analista',
      status: 'pendente'
    }]);
    setEmailConvite('');
  };

  const handleRemoverMembro = (id: string) => setMembros(membros.filter(m => m.id !== id));

  // Chat Helpers
  const handleEnviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    adicionarMensagemChat(novaMensagem);
    setNovaMensagem('');
  };

  const adicionarMensagemChat = (texto: string, anexo?: any) => {
    setMensagens(prev => [...prev, {
      id: Date.now(),
      autor: usuario?.user_metadata?.nome_completo || 'Você (Líder)',
      texto,
      anexo,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: 'usuario'
    }]);
  };

  const compartilharPontoNoChat = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = novaMensagem || `Atenção para esta projeção em ${modalGrafico.ponto.data}.`;
    adicionarMensagemChat(texto, modalGrafico.ponto);
    setModalGrafico({ visivel: false, ponto: null });
    setNovaMensagem('');
    setAbaAtiva('comunicacao'); 
  };

  // Kanban Helpers (Drag & Drop)
  const handleCriarTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefa.trim()) return;
    setTarefas([...tarefas, { id: Date.now().toString(), titulo: novaTarefa, status: 'pendente', autor: usuario?.user_metadata?.nome_completo || 'Líder' }]);
    setNovaTarefa('');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('tarefaId', id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, novoStatus: Tarefa['status']) => {
    const id = e.dataTransfer.getData('tarefaId');
    setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));
  };

  // ==========================================
  // VIEW 1: Hub de Equipes
  // ==========================================
  if (!equipeAtiva) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
        <header className="flex items-end justify-between border-b border-[#1F2937] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces da Organização</h1>
            <p className="text-sm text-slate-400 mt-1">Gerencie os times de análise da sua empresa.</p>
          </div>
          <button onClick={() => equipes.length >= 2 ? setMostrarPaywall(true) : setMostrarModalNovaEquipe(true)} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Criar Equipe
          </button>
        </header>

        {equipes.length === 0 ? (
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl">
            <div className="w-20 h-20 bg-[#1F2937] rounded-full flex items-center justify-center mb-6"><svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
            <h2 className="text-xl font-bold text-white mb-2">Nenhum Workspace Ativo</h2>
            <p className="text-slate-400 max-w-md mb-6">Crie a sua primeira equipe para segmentar o acesso a projeções.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipes.map(eq => (
              <div key={eq.id} onClick={() => setEquipeAtiva(eq)} className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 hover:border-red-500/50 cursor-pointer transition-all shadow-xl group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 text-red-500 font-black text-xl">{eq.nome.charAt(0).toUpperCase()}</div>
                  <span className="text-xs font-bold text-slate-500 bg-[#1F2937] px-2.5 py-1 rounded-md">Ativo</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{eq.nome}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{eq.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {/* MODAL CRIAR EQUIPE */}
        {mostrarModalNovaEquipe && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Criar Workspace Estratégico</h2>
                <button onClick={() => setMostrarModalNovaEquipe(false)} className="text-slate-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <form onSubmit={handleCriarEquipe} className="space-y-5">
                <div><label className="block text-sm font-medium text-slate-400 mb-2">Nome da Equipe</label><input type="text" required value={novoNome} onChange={e => setNovoNome(e.target.value)} className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label><input type="text" required value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Limitar Escopo de Materiais</label>
                  <div className="flex flex-wrap gap-2">
                    {opcoesCommodities.map(item => (
                      <button key={item} type="button" onClick={() => setCommoditiesSelecionadas(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${commoditiesSelecionadas.includes(item) ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-[#1F2937] text-slate-400 border-[#374151]'}`}>{item}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={commoditiesSelecionadas.length === 0} className="w-full mt-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50">Inicializar Equipe</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Workspace Ativo
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12 relative">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <button onClick={() => setEquipeAtiva(null)} className="text-xs font-bold text-slate-500 hover:text-white mb-3 flex items-center gap-1 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Voltar ao Hub</button>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center text-sm border border-red-500/30">{equipeAtiva.nome.charAt(0)}</div>
            {equipeAtiva.nome}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{equipeAtiva.descricao}</p>
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-2 border-b border-[#1F2937]">
        <button onClick={() => setAbaAtiva('dashboard')} className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-colors whitespace-nowrap ${abaAtiva === 'dashboard' ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'}`}>Dashboard Público</button>
        <button onClick={() => setAbaAtiva('comunicacao')} className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-colors whitespace-nowrap ${abaAtiva === 'comunicacao' ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'}`}>Comunicação</button>
        <button onClick={() => setAbaAtiva('kanban')} className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-colors whitespace-nowrap ${abaAtiva === 'kanban' ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'}`}>Plano de Ação</button>
        <button onClick={() => setAbaAtiva('membros')} className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-colors whitespace-nowrap ${abaAtiva === 'membros' ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'}`}>Membros ({membros.length})</button>
      </nav>

      {/* DASHBOARD & GRÁFICO */}
      {abaAtiva === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex gap-2 mb-4">
            {equipeAtiva.commodities.map(c => <span key={c} className="px-3 py-1 bg-[#1F2937] text-slate-300 border border-[#374151] rounded-md text-xs font-bold">Filtro: {c}</span>)}
          </div>
          
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-2">Projeção Inteligente Interativa</h2>
            <p className="text-sm text-slate-400 mb-8">Clique em qualquer ponto do gráfico para iniciar um debate.</p>
            
            <div className="h-72 border-l border-b border-[#374151] relative mx-4 mt-8">
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                     <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                   </linearGradient>
                 </defs>
                 {/* Preenchimento do Gráfico (Area Chart) */}
                 <path d="M 0,250 L 0,200 L 150,150 L 300,50 L 450,180 L 600,90 L 600,250 Z" fill="url(#grad1)" />
                 {/* Linha do Gráfico */}
                 <path d="M 0,200 L 150,150 L 300,50 L 450,180 L 600,90" fill="none" stroke="#EF4444" strokeWidth="4" className="drop-shadow-lg" />
               </svg>
               
               <button onClick={() => setModalGrafico({ visivel: true, ponto: { data: '12/Out', valor: 'R$ 84.50', material: equipeAtiva.commodities[0], tendencia: 'Estável' } })} className="absolute top-[200px] left-[0%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg"></button>
               <button onClick={() => setModalGrafico({ visivel: true, ponto: { data: '19/Out', valor: 'R$ 89.20', material: equipeAtiva.commodities[0], tendencia: 'Alta' } })} className="absolute top-[150px] left-[25%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg"></button>
               <button onClick={() => setModalGrafico({ visivel: true, ponto: { data: '26/Out', valor: 'R$ 102.00', material: equipeAtiva.commodities[0], tendencia: 'Pico Crítico' } })} className="absolute top-[50px] left-[50%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 border-4 border-white rounded-full hover:scale-125 transition-transform cursor-pointer animate-pulse shadow-red-500/50 shadow-xl"></button>
               <button onClick={() => setModalGrafico({ visivel: true, ponto: { data: '02/Nov', valor: 'R$ 86.10', material: equipeAtiva.commodities[0], tendencia: 'Queda' } })} className="absolute top-[180px] left-[75%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg"></button>
               <button onClick={() => setModalGrafico({ visivel: true, ponto: { data: '09/Nov', valor: 'R$ 95.80', material: equipeAtiva.commodities[0], tendencia: 'Recuperação' } })} className="absolute top-[90px] left-[100%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg"></button>
            </div>
          </div>
        </div>
      )}

      {/* COMUNICAÇÃO */}
      {abaAtiva === 'comunicacao' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl flex flex-col shadow-xl h-[600px] animate-fade-in">
          <div className="p-4 border-b border-[#1F2937] bg-[#1F2937]/20 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Canal Operacional</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0B1120]/50">
            {mensagens.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.tipo === 'sistema' ? 'items-center' : msg.autor.includes('Você') ? 'items-end' : 'items-start'}`}>
                {msg.tipo === 'sistema' ? (
                  <span className="text-xs text-slate-500 bg-[#1F2937] px-3 py-1 rounded-full">{msg.texto}</span>
                ) : (
                  <div className="max-w-[80%]">
                    <span className="text-[10px] text-slate-500 mb-1 ml-1 block">{msg.autor} • {msg.hora}</span>
                    <div className={`p-4 rounded-2xl text-sm ${msg.autor.includes('Você') ? 'bg-slate-800 text-slate-200 rounded-tr-sm' : 'bg-[#1F2937] text-slate-200 rounded-tl-sm'}`}>
                      {msg.anexo && (
                        <div className="mb-3 bg-[#0B1120] border border-red-500/30 p-3 rounded-xl">
                          <div className="text-red-400 font-bold text-xs mb-1">Alerta: {msg.anexo.material}</div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-[#1F2937] p-2 rounded text-center"><span className="block text-[10px] text-slate-400">Data</span><span className="font-bold text-white text-xs">{msg.anexo.data}</span></div>
                            <div className="bg-[#1F2937] p-2 rounded text-center"><span className="block text-[10px] text-slate-400">Previsão</span><span className="font-bold text-white text-xs">{msg.anexo.valor}</span></div>
                            <div className="bg-red-500/10 p-2 rounded text-center"><span className="block text-[10px] text-red-400">Status</span><span className="font-bold text-red-400 text-xs">{msg.anexo.tendencia}</span></div>
                          </div>
                        </div>
                      )}
                      {msg.texto}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleEnviarMensagem} className="p-4 border-t border-[#1F2937] bg-[#111827] flex gap-3">
            <input type="text" value={novaMensagem} onChange={e => setNovaMensagem(e.target.value)} placeholder="Comunique-se..." className="flex-1 bg-[#1F2937] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" />
            <button type="submit" disabled={!novaMensagem.trim()} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl disabled:opacity-50">Enviar</button>
          </form>
        </div>
      )}

      {/* KANBAN */}
      {abaAtiva === 'kanban' && (
        <div className="animate-fade-in">
          <form onSubmit={handleCriarTarefa} className="mb-6 flex gap-3 bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
            <input type="text" value={novaTarefa} onChange={e => setNovaTarefa(e.target.value)} placeholder="Descreva uma nova tarefa para a equipe..." className="flex-1 bg-[#0B1120] border border-[#374151] text-white rounded-lg px-4 py-2 focus:border-red-500" />
            <button type="submit" disabled={!novaTarefa.trim()} className="px-4 py-2 bg-[#1F2937] text-white text-sm font-bold rounded-lg hover:border-slate-500 border border-[#374151] disabled:opacity-50">+ Nova Tarefa</button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['pendente', 'analise', 'concluido'].map(coluna => (
              <div 
                key={coluna} 
                onDragOver={handleDragOver} 
                onDrop={e => handleDrop(e, coluna as Tarefa['status'])} 
                className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 min-h-[400px] flex flex-col gap-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-bold text-sm uppercase ${coluna === 'pendente' ? 'text-slate-300' : coluna === 'analise' ? 'text-orange-400' : 'text-green-500'}`}>{coluna === 'analise' ? 'Em Análise' : coluna === 'pendente' ? 'Pendente' : 'Concluído'}</h3>
                  <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{tarefas.filter(t => t.status === coluna).length}</span>
                </div>
                {tarefas.filter(t => t.status === coluna).map(tarefa => (
                  <div 
                    key={tarefa.id} 
                    draggable 
                    onDragStart={e => handleDragStart(e, tarefa.id)} 
                    className="bg-[#1F2937] border border-[#374151] p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-red-500 transition-colors shadow-md"
                  >
                    <p className="text-sm text-white font-medium mb-3">{tarefa.titulo}</p>
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-500">{tarefa.autor}</span></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBROS */}
      {abaAtiva === 'membros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-1 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl h-fit space-y-4">
            <h2 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3">Novo Analista</h2>
            <form onSubmit={handleConvidar} className="space-y-4 pt-2">
              <input type="email" required value={emailConvite} onChange={(e) => setEmailConvite(e.target.value)} placeholder="email@empresa.com" className="w-full bg-[#0B1120] border border-[#374151] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" />
              <button type="submit" className={`w-full py-3 rounded-xl font-bold transition-all ${membros.length >= 3 ? 'bg-slate-700 text-slate-400' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'}`}>Enviar Convite</button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#1F2937]"><h2 className="text-lg font-bold text-white">Equipe Atual</h2></div>
            <div className="divide-y divide-[#1F2937]">
              {membros.map((membro) => (
                <div key={membro.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-700 text-white">{membro.nome.charAt(0).toUpperCase()}</div>
                    <div><p className="font-bold text-slate-200">{membro.nome}</p><p className="text-sm text-slate-500">{membro.email}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-[#1F2937] text-slate-300 border border-slate-600">{membro.role}</span>
                    {!membro.role.includes('Líder') && <button onClick={() => handleRemoverMembro(membro.id)} className="text-slate-500 hover:text-red-400">Excluir</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL GRÁFICO */}
      {modalGrafico.visivel && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Compartilhar Projeção</h2>
            <form onSubmit={compartilharPontoNoChat} className="space-y-4">
              <textarea rows={3} value={novaMensagem} onChange={e => setNovaMensagem(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-xl px-4 py-3 resize-none" placeholder="Alerta sobre oscilação..." />
              <div className="flex gap-3">
                <button type="button" onClick={() => setModalGrafico({visivel: false, ponto: null})} className="flex-1 py-3 text-slate-300 font-bold border border-[#374151] rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg">Cast no Chat</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
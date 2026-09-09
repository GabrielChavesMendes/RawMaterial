import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

export function Perfil() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [atualizandoAlertas, setAtualizandoAlertas] = useState(false);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUsuario(user);
    };
    carregarUsuario();
  }, []);

  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setCarregandoImagem(true);
      setMensagem(null);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${usuario?.user_metadata.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      if (updateError) throw updateError;

      setUsuario(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, avatar_url: data.publicUrl } } as User : null);
      setMensagem({ texto: 'Foto atualizada! A sincronizar plataforma...', tipo: 'sucesso' });
      setTimeout(() => window.location.reload(), 1500);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setMensagem({ texto: errorMessage, tipo: 'erro' });
    } finally {
      setCarregandoImagem(false);
    } 
  };

  const handleToggleAlertas = async () => {
    try {
      setAtualizandoAlertas(true);
      const metadataAtual = usuario?.user_metadata.user_metadata;
      const novoStatus = !(metadataAtual.receber_alertas ?? true); // Padrão é true se não existir

      const { error } = await supabase.auth.updateUser({
        data: { receber_alertas: novoStatus }
      });

      if (error) throw error;

      // Atualiza a interface instantaneamente
      setUsuario(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, receber_alertas: !prev.user_metadata?.receber_alertas } } as User : null);      
    } catch (error) {
      console.error("Erro ao atualizar alertas:", error);
    } finally {
      setAtualizandoAlertas(false);
    }
  };

  if (!usuario) return <div className="p-8 text-slate-400">A carregar perfil...</div>;

  const metadata = usuario.user_metadata;
  const tagsSelecionadas = metadata.tags || ['Ainda não definiu preferências'];
  const recebeAlertas = metadata.receber_alertas ?? true;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-slate-400 mt-1">Gira as suas informações pessoais e configurações da conta.</p>
      </header>

      {mensagem && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${mensagem.tipo === 'sucesso' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-[#1F2937]">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-[#1F2937] border-4 border-[#0B1120] shadow-2xl flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden">
              {metadata.avatar_url ? (
                <img src={metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                metadata.nome_completo?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
              <span className="text-white text-xs font-bold flex flex-col items-center gap-1">
                {carregandoImagem ? 'A enviar...' : 'Alterar Foto'}
              </span>
              <input type="file" accept="image/*" onChange={handleUploadFoto} className="hidden" disabled={carregandoImagem} />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{metadata.nome_completo || 'Utilizador'}</h2>
            <p className="text-slate-400 mt-1">{usuario.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-md bg-[#1F2937] border border-[#374151]">
              <span className={`w-2 h-2 rounded-full ${metadata.tipo_conta === 'empresarial' ? 'bg-orange-500' : 'bg-slate-400'}`}></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Conta {metadata.tipo_conta}</span>
            </div>
          </div>
        </div>

        {metadata.tipo_conta === 'empresarial' && (
          <div className="space-y-6 mb-10 pb-10 border-b border-[#1F2937]">
            <h3 className="text-lg font-bold text-white border-l-4 border-orange-500 pl-3">Informações da Organização</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#0B1120] p-6 rounded-xl border border-[#1F2937]">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Empresa</label>
                <p className="text-slate-200 font-medium">{metadata.empresa}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Setor de Atuação</label>
                <p className="text-slate-200 font-medium">{metadata.setor}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3">Preferências de Monitoramento</h3>
          
          <div className="bg-[#0B1120] p-6 rounded-xl border border-[#1F2937] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Notificações e Alertas</h4>
                <p className="text-xs text-slate-500 mt-1">Receba alertas sobre flutuações nas suas commodities favoritas.</p>
              </div>
              <button 
                onClick={handleToggleAlertas}
                disabled={atualizandoAlertas}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${recebeAlertas ? 'bg-red-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${recebeAlertas ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <hr className="border-[#1F2937]" />

            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3">Seus Filtros Ativos</h4>
              <div className="flex flex-wrap gap-2">
                {tagsSelecionadas.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
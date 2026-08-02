import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function Perfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsuario(user);
      }
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
      const fileName = `${usuario.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      // Mostra a mensagem e força uma atualização da página após 1.5 segundos
      // para que a Barra Lateral e o Dashboard leiam a nova foto do banco de dados!
      setUsuario({ ...usuario, user_metadata: { ...usuario.user_metadata, avatar_url: publicUrl } });
      setMensagem({ texto: 'Foto atualizada! A sincronizar plataforma...', tipo: 'sucesso' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      setMensagem({ texto: error.message || 'Erro ao enviar a imagem.', tipo: 'erro' });
      setCarregandoImagem(false);
    } 
  };

  if (!usuario) return <div className="p-8 text-slate-400">A carregar perfil...</div>;

  const metadata = usuario.user_metadata;

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
        
        {/* Seção da Foto de Perfil */}
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
                {carregandoImagem ? (
                   <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Alterar Foto
                  </>
                )}
              </span>
              <input type="file" accept="image/*" onChange={handleUploadFoto} className="hidden" disabled={carregandoImagem} />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{metadata.nome_completo || 'Utilizador'}</h2>
            <p className="text-slate-400 mt-1">{usuario.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-md bg-[#1F2937] border border-[#374151]">
              <span className={`w-2 h-2 rounded-full ${metadata.tipo_conta === 'empresarial' ? 'bg-orange-500' : 'bg-slate-400'}`}></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Conta {metadata.tipo_conta === 'empresarial' ? 'Empresarial' : 'Pessoal'}
              </span>
            </div>
          </div>
        </div>

        {/* Informações da Empresa */}
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

        {/* NOVA SEÇÃO: Preferências e Interesses */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold text-white border-l-4 border-red-500 pl-3">Preferências & Interesses</h3>
          
          <div className="bg-[#0B1120] p-6 rounded-xl border border-[#1F2937] space-y-6">
            
            {/* Toggle Notificações */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Notificações de Mercado e Alertas</h4>
                <p className="text-xs text-slate-500 mt-1">Receba alertas importantes sobre flutuações e análise de algoritmos.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <hr className="border-[#1F2937]" />

            {/* Tags de Tecnologias */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3">Stack Tecnológico Principal</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Figma', 'PostgreSQL'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[#1F2937] text-slate-300 text-xs font-medium rounded-full border border-[#374151] hover:border-slate-500 cursor-default transition-colors">
                    {tech}
                  </span>
                ))}
                <button className="px-3 py-1 bg-transparent text-red-400 border border-dashed border-red-500/50 text-xs font-medium rounded-full hover:bg-red-500/10 transition-colors">
                  + Adicionar
                </button>
              </div>
            </div>

            {/* Tags de Interesses */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3">Áreas de Foco & Interesses</h4>
              <div className="flex flex-wrap gap-2">
                {['Full-Stack', 'UI/UX Design', 'Análise de Dados', 'Esportes'].map(interesse => (
                  <span key={interesse} className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20 cursor-default">
                    {interesse}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
        {/* Fim da Nova Seção */}

      </div>
    </div>
  );
}
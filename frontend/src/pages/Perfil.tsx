import { useState } from 'react';

export function Perfil() {
  const [nome, setNome] = useState('Gabriel Mendes');
  const [email, setEmail] = useState('admin@rawmaterial.com');
  const [empresa, setEmpresa] = useState('Tech Logistics S.A.');
  const [cargo, setCargo] = useState('Diretor de Compras (Admin)');

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-slate-400 mt-1">Gerencie suas informações pessoais e credenciais de acesso corporativo.</p>
      </header>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-slate-700 border-4 border-[#1F2937] overflow-hidden flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              GM
            </div>
            <button className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              Alterar Fotografia
            </button>
          </div>

          {/* Formulário de Dados */}
          <div className="flex-1 w-full space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">E-mail de Acesso</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled className="w-full bg-[#1F2937]/50 border border-[#374151] text-slate-500 rounded-lg px-4 py-2.5 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Empresa</label>
                <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Cargo / Função</label>
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
            </div>

            <hr className="border-[#1F2937] my-6" />

            {/* Credenciais de API para o SaaS */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Credenciais de Desenvolvedor</h3>
              <div className="bg-[#1F2937] border border-[#374151] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Chave de API (Produção)</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">rm_live_98x7f6...a1b2c3</p>
                </div>
                <button className="bg-[#111827] hover:bg-[#374151] text-slate-300 text-xs font-bold py-2 px-4 rounded-md border border-[#374151] transition-colors">
                  Copiar Chave
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
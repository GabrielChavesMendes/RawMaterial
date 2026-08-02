import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Analise } from './pages/Analise';
import { Login } from './pages/Login';
import { Tendencias } from './pages/Tendencias';
import { CadeiaSuprimentos } from './pages/CadeiaSuprimentos';
import { Relatorios } from './pages/Relatorios';
import { Perfil } from './pages/Perfil';
import { Configuracoes } from './pages/Configuracoes';
import { Landing } from './pages/Landing';
import { Noticias } from './pages/Noticias';

export default function App() {
  const [sessao, setSessao] = useState<any>(null);
  const [carregandoIncial, setCarregandoInicial] = useState(true);
  
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setCarregandoInicial(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (carregandoIncial) {
    return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">A carregar plataforma...</div>;
  }

  if (!sessao) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#0B1120] text-slate-300 font-sans overflow-hidden">
        
        {menuMobileAberto && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setMenuMobileAberto(false)}
          ></div>
        )}

        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          menuMobileAberto ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          <div className="md:hidden bg-[#0B1120] border-b border-slate-800 p-4 flex items-center justify-between shrink-0 z-30">
            <button 
              onClick={() => setMenuMobileAberto(true)}
              className="text-slate-300 hover:text-white focus:outline-none p-1"
            >
              {/* O ÍCONE SVG FOI COLOCADO DE VOLTA AQUI DENTRO */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Agrupei a logo e o texto para ficarem alinhados no centro */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="RawMaterial Logo" className="h-10 w-auto rounded-lg" />
              <span className="text-white font-bold text-xl tracking-tight">Raw<span className="text-slate-400">Material</span></span>
            </div>
            
            <div className="w-6"></div> 
          </div>

          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
             <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analise" element={<Analise />} />
                <Route path="/tendencias" element={<Tendencias />} />
                <Route path="/cadeia" element={<CadeiaSuprimentos />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/noticias" element={<Noticias />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
             </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

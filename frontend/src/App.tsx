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

export default function App() {
  const [sessao, setSessao] = useState<any>(null);
  const [carregandoIncial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    // Verifica se já existe uma sessão guardada ao abrir a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setCarregandoInicial(false);
    });

    // Fica à escuta de mudanças (ex: quando o utilizador faz login ou logout)
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

  // Se NÃO houver sessão, mostramos apenas o ecrã de Login
  if (!sessao) {
    return <Login />;
  }

  // Se houver sessão, mostramos a aplicação completa (SPA)
  return (
    <Router>
      <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
           <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analise" element={<Analise />} />
              <Route path="/tendencias" element={<Tendencias />} />
              <Route path="/cadeia" element={<CadeiaSuprimentos />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
           </Routes>
        </main>
      </div>
    </Router>
  );
}
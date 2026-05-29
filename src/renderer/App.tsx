import { Routes, Route } from 'react-router-dom';
import { useLogStore } from '../store/logStore';
import { Titlebar } from './components/layout/Titlebar';
import { Sidebar } from './components/layout/Sidebar';
import { LogPanel } from './components/ui/LogPanel';
import { ToastContainer } from './components/ui/Toast';
import { ToastProvider } from './context/ToastContext';
import { AllGames } from './pages/AllGames';
import { Recents } from './pages/Recents';
import { Favourites } from './pages/Favourites';
import { Active } from './pages/Active';
import { useProcessMonitor } from './hooks/useProcessMonitor';

function AppContent() {
  const logVisible = useLogStore((s) => s.visible);
  useProcessMonitor();

  return (
    <div className="flex flex-col h-screen bg-[#111114] overflow-hidden">
      <Titlebar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<AllGames />} />
            <Route path="/active" element={<Active />} />
            <Route path="/recents" element={<Recents />} />
            <Route path="/favourites" element={<Favourites />} />
          </Routes>
        </main>
      </div>
      {logVisible && (
        <div className="h-[120px] border-t border-white/5 bg-[#1a1a1f] flex-shrink-0">
          <LogPanel />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

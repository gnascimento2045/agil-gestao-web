import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.tsx';
import Login from './pages/Login.tsx';
import Painel from './pages/Painel.tsx';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="*"       element={<Landing />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

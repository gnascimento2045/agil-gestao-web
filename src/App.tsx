import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.tsx';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

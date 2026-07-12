import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Environmental from './pages/Enviromental';
import Social from './pages/Social';
import Governance from './pages/Governance';
import Gamification from './pages/Gamification';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="environmental" element={<Environmental />} />
          <Route path="social" element={<Social />} />
          <Route path="governance" element={<Governance />} />
          <Route path="gamification" element={<Gamification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

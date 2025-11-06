import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReportsPage from './pages/ReportsPage';
import SummaryPage from './pages/SummaryPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Route>
    </Routes>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import './index.css';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
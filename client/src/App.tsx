import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BankDetailsPage } from './pages/BankDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { AdminDashboard } from './pages/AdminDashboard';
import ChangelogPage from './pages/ChangelogPage';
import { Header } from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bank/:id" element={<BankDetailsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
     <Footer/>
    </Router>
  );
}

export default App;
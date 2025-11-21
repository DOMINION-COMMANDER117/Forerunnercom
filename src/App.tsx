import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { AdminProvider } from './contexts/AdminContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ExplorePage } from './components/ExplorePage';
import { StatusPage } from './components/StatusPage';
import { LegalPage } from './components/LegalPage';
import { RulesPage } from './components/RulesPage';
import { SocialsPage } from './components/SocialsPage';
import { ContactPage } from './components/ContactPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminPanel } from './components/AdminPanel';
import { LaunchCountdown } from './components/LaunchCountdown';
import { KayoDrivePage } from './components/KayoDrivePage';
import { DogsDrivePage } from './components/DogsDrivePage';
import { EvecitaDrivePage } from './components/EvecitaDrivePage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="relative min-h-screen">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Launch Countdown Timer */}
      <LaunchCountdown />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'explore' && <ExplorePage onNavigate={setCurrentPage} />}
      {currentPage === 'kayo-drive' && <KayoDrivePage onNavigate={setCurrentPage} />}
      {currentPage === 'dogs-drive' && <DogsDrivePage onNavigate={setCurrentPage} />}
      {currentPage === 'evecita-drive' && <EvecitaDrivePage onNavigate={setCurrentPage} />}
      {currentPage === 'status' && <StatusPage />}
      {currentPage === 'admin-login' && <AdminLoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'legal' && <LegalPage />}
      {currentPage === 'rules' && <RulesPage />}
      {currentPage === 'socials' && <SocialsPage />}
      {currentPage === 'contact' && <ContactPage />}
      
      <Footer onNavigate={setCurrentPage} currentPage={currentPage} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </ErrorBoundary>
  );
}

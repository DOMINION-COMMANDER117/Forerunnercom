import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { UserProvider } from './contexts/UserContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ExplorePage } from './components/ExplorePage';
import { StatusPage } from './components/StatusPage';
import { ProfilePage } from './components/ProfilePage';
import { EnhancedProfilePage } from './components/EnhancedProfilePage';
import { AuthPage } from './components/AuthPage';
import { SettingsPage } from './components/SettingsPage';
import { MessagesPage } from './components/MessagesPage';
import { LegalPage } from './components/LegalPage';
import { RulesPage } from './components/RulesPage';
import { SocialsPage } from './components/SocialsPage';
import { ContactPage } from './components/ContactPage';
import { AuthErrorOverlay } from './components/AuthErrorOverlay';
import { AdminPanel } from './components/AdminPanel';
import { LaunchCountdown } from './components/LaunchCountdown';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthError, setShowAuthError] = useState(false);

  const handleAuthError = () => {
    setShowAuthError(true);
    setCurrentPage('home');
  };

  const handleAuthErrorComplete = () => {
    setShowAuthError(false);
  };

  return (
    <UserProvider>
      <div className="relative min-h-screen">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        {/* Launch Countdown Timer */}
        <LaunchCountdown />
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'explore' && <ExplorePage />}
        {currentPage === 'status' && <StatusPage />}
        {currentPage === 'profile' && <EnhancedProfilePage />}
        {currentPage === 'upload' && <ProfilePage />}
        {currentPage === 'auth' && <AuthPage onNavigate={setCurrentPage} onAuthError={handleAuthError} />}
        {currentPage === 'settings' && <SettingsPage onNavigate={setCurrentPage} />}
        {currentPage === 'messages' && <MessagesPage />}
        {currentPage === 'legal' && <LegalPage />}
        {currentPage === 'rules' && <RulesPage />}
        {currentPage === 'socials' && <SocialsPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && <AdminPanel />}
        
        <Footer onNavigate={setCurrentPage} />
        <Toaster />
        
        {/* Auth Error Overlay */}
        <AuthErrorOverlay show={showAuthError} onComplete={handleAuthErrorComplete} />
      </div>
    </UserProvider>
  );
}

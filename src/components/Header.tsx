import { motion } from 'motion/react';
import { Home, Info, Compass, User, Activity, LogIn, Settings, MessageSquare, Upload } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { currentUser } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%)',
          filter: 'blur(1.5px)',
        }} />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
        
        <div className="relative z-10 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                currentPage === 'home' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Home</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('about')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                currentPage === 'about' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">About Us</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('explore')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                currentPage === 'explore' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Compass className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Explore</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('status')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                currentPage === 'status' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Status</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('messages')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                currentPage === 'messages' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Messages</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <motion.button
                  onClick={() => onNavigate('upload')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === 'upload' ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Upload</span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate('settings')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === 'settings' ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Settings</span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === 'profile' ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">My Profile</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => onNavigate('auth')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === 'auth' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
}

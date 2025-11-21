import { motion } from 'motion/react';
import { Scale, Shield, Share2, Mail, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function Footer({ onNavigate, currentPage }: FooterProps) {
  const isSettingsPage = currentPage === 'settings';
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isSettingsPage ? 0 : 1, 
            y: isSettingsPage ? 20 : 0 
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="relative rounded-2xl overflow-hidden pointer-events-auto"
        >
          <div className="absolute inset-0 backdrop-blur-3xl rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2))',
            filter: 'blur(1px)',
          }} />
          <div className="absolute inset-0 rounded-2xl border border-white/20" />
          
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 px-8 py-4">
            <motion.button
              onClick={() => onNavigate('legal')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Scale className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Legal</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('rules')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Rules</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('socials')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Socials</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('contact')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Contact</span>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShieldAlert className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">Admin (Test)</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

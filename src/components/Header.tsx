import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Home, Info, Compass, Activity, Shield } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Fade out when scrolling down, fade back in near top
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100, 150],
    [1, 0, 0]
  );
  
  const headerY = useTransform(
    scrollY,
    [0, 100],
    [0, -20]
  );
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-6 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          opacity: isScrolled ? headerOpacity : 1,
          y: isScrolled ? headerY : 0,
        }}
        transition={{ duration: 0.3 }}
        className="relative max-w-7xl mx-auto pointer-events-auto"
      >
        {/* Main glass container with rounded edges */}
        <div className="relative overflow-hidden rounded-[32px]">
          {/* Backdrop blur for distortion effect */}
          <div 
            className="absolute inset-0" 
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          />
          
          {/* Semi-transparent background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
            }}
          />

          {/* Refractive glass edge highlights - Top & Left */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.15) 100%)',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Strong edge reflection - creates the water-like refraction */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              boxShadow: `
                inset 1px 1px 1px rgba(255, 255, 255, 0.5),
                inset -1px -1px 1px rgba(255, 255, 255, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.2)
              `,
            }}
          />

          {/* Subtle inner glow for depth */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />

          {/* Bottom border highlight */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-between px-8 py-4 w-full">
            {/* Left side - Main navigation */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === 'home' 
                    ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'hover:bg-white/10'
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
                  currentPage === 'about' 
                    ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]\">About Us</span>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('explore')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === 'explore' 
                    ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Compass className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]\">Explore</span>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('status')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === 'status' 
                    ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Activity className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]\">Status</span>
              </motion.button>
            </div>

            {/* Right side - Admin button */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => onNavigate('admin-login')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === 'admin-login' || currentPage === 'admin' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_25px_rgba(239,68,68,0.5)]' 
                    : 'bg-white/10 hover:bg-white/15'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]\">Admin</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

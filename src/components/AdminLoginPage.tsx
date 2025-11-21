import { useState } from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { toast } from 'sonner@2.0.3';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const { loginAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = loginAdmin(password);
    
    if (success) {
      toast.success('Welcome, Administrator');
      onNavigate('admin');
    } else {
      // Shake animation and redirect to home
      setIsShaking(true);
      toast.error('❌ Wrong password!');
      setPassword('');
      
      // After shake animation, redirect to home
      setTimeout(() => {
        setIsShaking(false);
        toast('Redirecting to home...', { duration: 1500 });
        setTimeout(() => {
          onNavigate('home');
        }, 1500);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-indigo-950 to-black">
      {/* Red flash overlay on wrong password */}
      {isShaking && (
        <motion.div
          className="absolute inset-0 bg-red-600 z-50 pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Login form */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8"
        animate={isShaking ? {
          x: [0, -20, 20, -20, 20, -10, 10, -5, 5, 0],
          rotate: [0, -2, 2, -2, 2, -1, 1, 0]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0
          }}
          transition={{ 
            opacity: { duration: 0.8 },
            y: { duration: 0.8 }
          }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-white text-5xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] italic"
              animate={{
                textShadow: [
                  '0 0 20px rgba(239,68,68,0.5)',
                  '0 0 30px rgba(251,146,60,0.8)',
                  '0 0 20px rgba(239,68,68,0.5)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ADMIN ACCESS
            </motion.h1>
            <p className="text-white/60 text-sm">
              Authorized personnel only
            </p>
          </div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              borderColor: isShaking ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.3)'
            }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              borderColor: { duration: 0.2 }
            }}
            className="bg-black/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  Access Code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isShaking}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              <motion.button
                type="submit"
                disabled={isShaking}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isShaking ? { scale: 1.02 } : {}}
                whileTap={!isShaking ? { scale: 0.98 } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {isShaking ? 'ACCESS DENIED...' : 'ACCESS ADMIN PANEL'}
                </span>
              </motion.button>
            </form>

            {/* Warning */}
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs text-center">
                ⚠️ Warning: Incorrect password will redirect you to home
              </p>
            </div>
          </motion.div>

          {/* Back to home button */}
          <motion.button
            onClick={() => onNavigate('home')}
            className="mt-6 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

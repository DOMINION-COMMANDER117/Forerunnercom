import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export function StatusPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center p-8 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-4xl"
        >
          <motion.h1
            className="text-white mb-8"
            style={{
              fontSize: '3.5rem',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
            }}
          >
            System Status
          </motion.h1>
          <p className="text-white/90 text-lg">
            Real-time status and uptime monitoring for all FORERUNNER services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-6xl h-[75vh] rounded-3xl overflow-hidden"
        >
          <iframe
            src="https://stormloungestatuspage.statuspage.io/"
            title="Storm Lounge Status Page"
            className="w-full h-full border-0 rounded-3xl"
            allowFullScreen
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex gap-4"
        >
          <a
            href="https://stormloungestatuspage.statuspage.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-8 py-4 rounded-full overflow-hidden group"
          >
            <div className="absolute inset-0 backdrop-blur-3xl rounded-full" />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.3), transparent)',
              filter: 'blur(1px)',
            }} />
            <div className="absolute inset-0 rounded-full border-2 border-white/25" />
            <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Open in New Tab
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

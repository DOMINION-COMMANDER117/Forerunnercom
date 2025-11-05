import { motion } from 'motion/react';

export function LegalPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
            Legal
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl w-full space-y-12"
        >
          <div>
            <h2 className="text-white text-2xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Terms of Service
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Welcome to FORERUNNER. By accessing and using our services, you agree to be bound by these terms and conditions.
              Please read them carefully before using our platform.
            </p>
            <p className="text-white/80 leading-relaxed">
              Our services are provided "as is" and we make no warranties, expressed or implied, regarding the operation or availability
              of our services. You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </div>

          <div>
            <h2 className="text-white text-2xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Privacy Policy
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
              We are committed to ensuring that your privacy is protected.
            </p>
            <p className="text-white/80 leading-relaxed">
              We collect information that you provide directly to us, including when you create an account, use our services,
              or contact us for support. We use this information to provide, maintain, and improve our services.
            </p>
          </div>

          <div>
            <h2 className="text-white text-2xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Copyright Notice
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              All content, features, and functionality on FORERUNNER are owned by us and are protected by international copyright,
              trademark, and other intellectual property laws.
            </p>
            <p className="text-white/80 leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
            </p>
          </div>

          <div>
            <h2 className="text-white text-2xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Limitation of Liability
            </h2>
            <p className="text-white/80 leading-relaxed">
              In no event shall FORERUNNER be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use the service.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

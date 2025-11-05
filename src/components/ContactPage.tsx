import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"
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
            Get In Touch
          </motion.h1>
          <p className="text-white/90 text-lg">
            We'd love to hear from you. Reach out to us through any of these channels.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-start gap-4 p-6"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-indigo-500/20">
              <Mail className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <h3 className="text-white text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                Email
              </h3>
              <p className="text-white/80">support@forerunner.com</p>
              <p className="text-white/80">business@forerunner.com</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-start gap-4 p-6"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-500/20">
              <MessageSquare className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <h3 className="text-white text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                Live Chat
              </h3>
              <p className="text-white/80">Available 24/7</p>
              <p className="text-white/80">Average response: 2 minutes</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-start gap-4 p-6"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-500/20">
              <Phone className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <h3 className="text-white text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                Phone
              </h3>
              <p className="text-white/80">+1 (555) 123-4567</p>
              <p className="text-white/80">Mon-Fri, 9am-6pm EST</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-start gap-4 p-6"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-cyan-500/20">
              <MapPin className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <h3 className="text-white text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                Location
              </h3>
              <p className="text-white/80">123 Innovation Drive</p>
              <p className="text-white/80">San Francisco, CA 94105</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl w-full"
        >
          <h2 className="text-white text-2xl mb-6 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Send us a Message
          </h2>
          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <div>
              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
              />
            </div>
            <motion.button
              type="submit"
              className="relative w-full px-8 py-4 rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 backdrop-blur-3xl rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: 'linear-gradient(to bottom right, rgba(255,255,255,0.3), transparent)',
                filter: 'blur(1px)',
              }} />
              <div className="absolute inset-0 rounded-2xl border-2 border-white/25" />
              <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Send Message</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

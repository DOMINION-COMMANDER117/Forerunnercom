import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export function RulesPage() {
  const rules = [
    {
      title: "Respect Others",
      description: "Treat all members with respect and kindness. Harassment, hate speech, and discrimination are strictly prohibited."
    },
    {
      title: "No Spam or Self-Promotion",
      description: "Do not post spam, advertisements, or excessive self-promotional content. Keep discussions relevant and valuable."
    },
    {
      title: "Protect Privacy",
      description: "Do not share personal information of others without consent. Respect everyone's privacy and confidentiality."
    },
    {
      title: "Follow Content Guidelines",
      description: "All content must be appropriate and legal. No explicit, violent, or otherwise inappropriate material."
    },
    {
      title: "No Cheating or Exploitation",
      description: "Do not use cheats, exploits, or unauthorized third-party tools. Play fair and maintain the integrity of the platform."
    },
    {
      title: "Report Issues Responsibly",
      description: "If you encounter bugs, security issues, or rule violations, report them through proper channels."
    },
    {
      title: "Use English in Public Channels",
      description: "Keep public communications in English to ensure everyone can participate. Private channels may use other languages."
    },
    {
      title: "No Impersonation",
      description: "Do not impersonate staff members, other users, or public figures. Maintain your authentic identity."
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10"
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
            Community Rules
          </motion.h1>
          <p className="text-white/90 text-lg">
            Follow these rules to ensure a positive experience for everyone in the FORERUNNER community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl w-full space-y-6"
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-6 h-6 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
              </div>
              <div>
                <h3 className="text-white text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  {rule.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 max-w-4xl w-full text-center"
        >
          <p className="text-white/70 leading-relaxed">
            Violations of these rules may result in warnings, temporary suspension, or permanent ban from the platform.
            We reserve the right to take appropriate action at our discretion.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

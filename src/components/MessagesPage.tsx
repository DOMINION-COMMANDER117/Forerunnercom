import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Lock, AlertTriangle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

// Profanity and unsafe content filter
const BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'bastard',
  'dick', 'pussy', 'cock', 'whore', 'slut', 'nigger', 'nigga', 'fag',
  'retard', 'kill yourself', 'kys', 'suicide', 'die', 'idiot', 'stupid',
  'dumb', 'hate', 'racist', 'rape', 'sex', 'porn', 'nude', 'naked'
];

const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
};

export function MessagesPage() {
  const { currentUser, users, isAccountLocked } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [blink, setBlink] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const locked = isAccountLocked();
  const isDarkMode = currentUser?.settings.darkMode || false;
  const COOLDOWN_SECONDS = 5;

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('forerunner_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('forerunner_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Blink effect for lock
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(cooldownRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const handleSendMessage = () => {
    if (!currentUser) {
      toast.error('Please log in to send messages');
      return;
    }

    if (locked) {
      toast.error('Messages are locked for 24 hours for new accounts');
      return;
    }

    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // Check cooldown
    const now = Date.now();
    const timeSinceLastMessage = (now - lastMessageTime) / 1000;
    if (timeSinceLastMessage < COOLDOWN_SECONDS) {
      const remaining = Math.ceil(COOLDOWN_SECONDS - timeSinceLastMessage);
      setCooldownRemaining(remaining);
      toast.error(`Please wait ${remaining} seconds before sending another message`);
      return;
    }

    // Check for profanity
    if (containsProfanity(messageText)) {
      toast.error('Your message contains inappropriate content and cannot be sent');
      return;
    }

    // Check message length
    if (messageText.length > 500) {
      toast.error('Message is too long (max 500 characters)');
      return;
    }

    // Create and send message
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      username: currentUser.username,
      text: messageText.trim(),
      timestamp: now,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setLastMessageTime(now);
    setCooldownRemaining(COOLDOWN_SECONDS);
    toast.success('Message sent!');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-white' : 'bg-black'}`}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-blue-950/20" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col h-full px-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <MessageSquare className={`w-10 h-10 ${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(147,51,234,0.9)]`} />
            <h1 className={`${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}>
              Global Messages
            </h1>
          </div>

          {/* Account Locked Overlay */}
          {currentUser && locked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 rounded-2xl backdrop-blur-xl bg-red-950/30 border-2 border-red-500/50 flex-shrink-0"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-6 h-6 text-red-500" />
                <div>
                  <div className="text-red-500 mb-1" style={{ 
                    opacity: blink ? 1 : 0.3,
                    borderBottom: blink ? '2px dotted #ef4444' : '2px dotted transparent',
                    display: 'inline-block',
                    paddingBottom: '2px'
                  }}>
                    LOCKED
                  </div>
                  <div className="text-red-400 text-sm">24HRs</div>
                  <p className="text-white/70 text-xs mt-1">
                    Messages are locked for 24 hours for new accounts
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Not Logged In Warning */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 rounded-2xl backdrop-blur-xl bg-red-950/30 border-2 border-red-500/50 flex-shrink-0"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-white mb-1">Login Required</h3>
                  <p className="text-white/70 text-sm">
                    You must be logged in to send messages. You can view messages without logging in.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages Container - Full Screen */}
          <div className={`flex-1 rounded-3xl backdrop-blur-xl ${
            isDarkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'
          } overflow-hidden flex flex-col`}>
            {/* Messages List - Takes full available height */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className={`w-20 h-20 ${isDarkMode ? 'text-black/30' : 'text-white/30'} mx-auto mb-4`} />
                    <p className={`text-lg ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                      No messages yet. Be the first to say hello!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = currentUser?.id === message.userId;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-2xl rounded-2xl p-5 ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-400/30'
                          : isDarkMode
                          ? 'bg-black/20 border border-black/30'
                          : 'bg-white/10 border border-white/20'
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isOwnMessage 
                              ? 'bg-purple-500/40' 
                              : isDarkMode 
                              ? 'bg-black/30' 
                              : 'bg-white/20'
                          }`}>
                            <span className={`${
                              isOwnMessage ? 'text-purple-200' : isDarkMode ? 'text-black' : 'text-white'
                            }`}>
                              {message.username[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${
                              isOwnMessage ? 'text-purple-300' : isDarkMode ? 'text-black' : 'text-white'
                            }`}>
                              @{message.username}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-lg ${isOwnMessage ? 'text-white' : isDarkMode ? 'text-black/90' : 'text-white/90'} break-words`}>
                          {message.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at bottom */}
            {currentUser && !locked && (
              <div className={`p-6 border-t ${isDarkMode ? 'border-black/20' : 'border-white/10'} flex-shrink-0`}>
                <div className="flex items-center gap-4 mb-3">
                  <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-orange-600' : 'text-orange-400'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                    No profanity, hate speech, or inappropriate content. Be respectful to others.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                    maxLength={500}
                    rows={3}
                    className={`flex-1 resize-none text-base ${
                      isDarkMode
                        ? 'bg-black/10 border-black/30 text-black placeholder-black/50'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={cooldownRemaining > 0}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-2 border-purple-400/40 h-auto px-6"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Send'}
                  </Button>
                </div>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>
                  {messageText.length}/500 characters {cooldownRemaining > 0 && `• Cooldown: ${cooldownRemaining}s`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

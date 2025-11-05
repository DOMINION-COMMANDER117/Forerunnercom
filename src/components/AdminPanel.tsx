import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Plus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export function AdminPanel() {
  const { currentUser, addWarning } = useUser();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'warning' | 'report' | 'timeout' | 'rule_break'>('warning');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [expiryDays, setExpiryDays] = useState('30');

  const isDarkMode = currentUser?.settings.darkMode || false;

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Please log in to access admin panel
          </h2>
        </div>
      </div>
    );
  }

  const handleAddWarning = () => {
    if (!reason.trim()) {
      toast.error('Please enter a reason');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const days = parseInt(expiryDays);
    const expiresAt = days > 0 ? Date.now() + (days * 24 * 60 * 60 * 1000) : undefined;

    addWarning({
      type,
      reason,
      description,
      severity,
      expiresAt,
      active: true,
    });

    toast.success('Warning added successfully!');
    setReason('');
    setDescription('');
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-white via-gray-100 to-white' 
        : 'bg-gradient-to-br from-black via-gray-900 to-black'
    }`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-0 left-0 w-96 h-96 ${
            isDarkMode ? 'bg-red-300' : 'bg-red-600'
          } rounded-full mix-blend-screen filter blur-3xl opacity-20`}
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
      </div>

      <div className="relative z-10 container mx-auto p-8 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Shield className={`w-10 h-10 ${isDarkMode ? 'text-red-600' : 'text-red-500'} drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]`} />
            <h1 className={`${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}>
              Admin Panel - Testing Only
            </h1>
          </div>

          <div className={`p-8 rounded-3xl backdrop-blur-xl ${
            isDarkMode 
              ? 'bg-black/10 border-2 border-black/30' 
              : 'bg-white/5 border-2 border-white/10'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <p className={`${isDarkMode ? 'text-black/80' : 'text-white/80'}`}>
                This panel allows you to add test warnings to your own account to see how they appear in the profile.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                  Warning Type
                </label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger className={`${
                    isDarkMode
                      ? 'bg-black/10 border-black/30 text-black'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="timeout">Timeout</SelectItem>
                    <SelectItem value="rule_break">Rule Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                  Severity
                </label>
                <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                  <SelectTrigger className={`${
                    isDarkMode
                      ? 'bg-black/10 border-black/30 text-black'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                  Reason
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Spam in Messages"
                  className={`${
                    isDarkMode
                      ? 'bg-black/10 border-black/30 text-black placeholder-black/50'
                      : 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the violation..."
                  rows={4}
                  className={`${
                    isDarkMode
                      ? 'bg-black/10 border-black/30 text-black placeholder-black/50'
                      : 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                  Expires In (Days)
                </label>
                <Input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  placeholder="30"
                  min="0"
                  className={`${
                    isDarkMode
                      ? 'bg-black/10 border-black/30 text-black placeholder-black/50'
                      : 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  }`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>
                  Set to 0 for permanent warning
                </p>
              </div>

              <Button
                onClick={handleAddWarning}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-2 border-red-400/40"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Test Warning
              </Button>
            </div>

            <div className={`mt-6 p-4 rounded-2xl ${
              isDarkMode ? 'bg-black/5' : 'bg-white/5'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                💡 <strong>Tip:</strong> After adding warnings, visit "My Profile" and click the "Warnings & Reports" tab to see them displayed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

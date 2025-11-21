import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Edit, Camera, AlertTriangle, Shield, Clock, 
  FileText, Image as ImageIcon, CheckCircle, XCircle,
  MessageSquare, Crown, BadgeCheck, Upload, X, Trash2, Settings
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { PostEditDialog } from './PostEditDialog';
import { Post } from '../contexts/UserContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function EnhancedProfilePage() {
  const {
    currentUser,
    getUserPosts,
    updateDisplayName,
    updateProfilePicture,
    updateProfileBanner,
    updatePost,
    deletePost,
    updateStatus,
    updateBio,
    addPartner,
    removePartner,
    addFavoriteGame,
    removeFavoriteGame,
    canEditProfilePicture,
    getLevelProgress,
    getRankIcon,
    getDaysUntilProfilePictureEdit,
    getUserWithMostPosts,
    getUserWithMostFollowers,
  } = useUser();

  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [showDisplayNameWarning, setShowDisplayNameWarning] = useState(false);
  const [showProfilePicWarning, setShowProfilePicWarning] = useState(false);
  const [showBannerWarning, setShowBannerWarning] = useState(false);
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'warnings' | 'settings'>('posts');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  // Profile customization states
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [newGame, setNewGame] = useState('');
  
  // File upload states
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isDarkMode = currentUser?.settings.darkMode || false;

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const userPosts = getUserPosts(currentUser.id);
  const activeWarnings = currentUser.warnings.filter(w => w.active);
  const daysUntilPicEdit = getDaysUntilProfilePictureEdit();
  const canEditPic = canEditProfilePicture();
  
  // Check if current user has most posts or most followers
  const topPostUser = getUserWithMostPosts();
  const topFollowerUser = getUserWithMostFollowers();
  const hasMostPosts = topPostUser?.id === currentUser.id;
  const hasMostFollowers = topFollowerUser?.id === currentUser.id;

  const getDiscordAvatarUrl = () => {
    if (currentUser.profilePicture) return currentUser.profilePicture;
    if (currentUser.discordAvatar && currentUser.discordId) {
      return `https://cdn.discordapp.com/avatars/${currentUser.discordId}/${currentUser.discordAvatar}.png?size=256`;
    }
    // Fallback to UI Avatars
    if (currentUser.discordUsername || currentUser.username) {
      const name = encodeURIComponent(currentUser.discordUsername || currentUser.username);
      return `https://ui-avatars.com/api/?name=${name}&size=256&background=5865F2&color=fff&bold=true`;
    }
    return null;
  };

  const getBannerUrl = () => {
    if (currentUser.profileBanner) return currentUser.profileBanner;
    // Default gradient banner
    return null;
  };

  // Handle file selection for profile picture
  const handleProfilePicFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be smaller than 5MB');
        return;
      }
      
      setProfilePicFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file selection for banner
  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image must be smaller than 10MB');
        return;
      }
      
      setBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDisplayNameEdit = () => {
    if (currentUser.displayNameEdited) {
      toast.error('Display name can only be edited once');
      return;
    }
    setShowDisplayNameWarning(true);
  };

  const confirmDisplayNameEdit = () => {
    if (!newDisplayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }

    if (updateDisplayName(newDisplayName)) {
      toast.success('Display name updated successfully!');
      setEditingDisplayName(false);
      setNewDisplayName('');
      setShowDisplayNameWarning(false);
    } else {
      toast.error('Failed to update display name');
    }
  };

  const handleProfilePicEdit = () => {
    if (!canEditPic) {
      toast.error(`You can edit your profile picture in ${daysUntilPicEdit} days`);
      return;
    }
    setShowProfilePicWarning(true);
  };

  const confirmProfilePicEdit = () => {
    let imageUrl = newProfilePicUrl.trim();
    
    // If a file was selected, use the preview (base64)
    if (profilePicPreview) {
      imageUrl = profilePicPreview;
    }
    
    if (!imageUrl) {
      toast.error('Please upload an image or enter an image URL');
      return;
    }

    if (updateProfilePicture(imageUrl)) {
      toast.success('Profile picture updated successfully!');
      setNewProfilePicUrl('');
      setProfilePicFile(null);
      setProfilePicPreview(null);
      setShowProfilePicWarning(false);
    } else {
      toast.error('Failed to update profile picture');
    }
  };

  const handleBannerEdit = () => {
    setShowBannerWarning(true);
  };

  const confirmBannerEdit = () => {
    let imageUrl = newBannerUrl.trim();
    
    // If a file was selected, use the preview (base64)
    if (bannerPreview) {
      imageUrl = bannerPreview;
    }
    
    if (!imageUrl) {
      toast.error('Please upload an image or enter an image URL');
      return;
    }

    if (updateProfileBanner(imageUrl)) {
      toast.success('Banner updated successfully!');
      setNewBannerUrl('');
      setBannerFile(null);
      setBannerPreview(null);
      setShowBannerWarning(false);
    } else {
      toast.error('Failed to update banner');
    }
  };

  const handleEditPost = (updates: Partial<Post>) => {
    if (editingPost) {
      updatePost(editingPost.id, updates);
    }
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      toast.success('Post deleted successfully');
    }
  };

  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'online':
        return <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]" />;
      case 'invisible':
        return <div className="w-4 h-4 bg-transparent rounded-full border-2 border-gray-400" />;
      case 'dnd':
        return <motion.div 
          className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />;
      case 'sleeping':
        return <motion.div 
          className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />;
      case 'busy':
        return <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />;
      case 'away':
        return <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]" />;
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white" />;
    }
  };

  const getRankProgressColor = (progress: number) => {
    if (progress < 20) return 'from-gray-400 to-gray-500'; // Grey
    if (progress < 40) return 'from-green-400 to-green-600'; // Green
    if (progress < 60) return 'from-blue-400 to-blue-600'; // Blue
    if (progress < 80) return 'from-purple-400 to-purple-600'; // Purple
    if (progress < 95) return 'from-red-400 to-red-600'; // Red
    return 'from-yellow-300 via-yellow-500 to-yellow-600'; // Gold gradient
  };

  const isNewUser = () => {
    if (!currentUser) return false;
    const daysSinceCreation = (Date.now() - currentUser.createdAt) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 17;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-400 border-yellow-400/40';
      case 'medium': return 'text-orange-400 border-orange-400/40';
      case 'high': return 'text-red-400 border-red-400/40';
      case 'critical': return 'text-red-600 border-red-600/60';
      default: return 'text-gray-400 border-gray-400/40';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'timeout': return Clock;
      case 'report': return Shield;
      case 'rule_break': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-white via-gray-100 to-white' 
        : 'bg-gradient-to-br from-black via-gray-900 to-black'
    }`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-0 left-0 w-96 h-96 ${
            isDarkMode ? 'bg-purple-300' : 'bg-purple-600'
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
        <motion.div
          className={`absolute bottom-0 right-0 w-96 h-96 ${
            isDarkMode ? 'bg-blue-300' : 'bg-blue-600'
          } rounded-full mix-blend-screen filter blur-3xl opacity-20`}
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
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Profile Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Banner Image */}
          <div className="relative h-64 rounded-3xl overflow-hidden backdrop-blur-3xl border border-white/20">
            {getBannerUrl() ? (
              <img 
                src={getBannerUrl()!} 
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-red-600/30 backdrop-blur-xl" />
            )}
            
            {/* Edit Banner Button */}
            <motion.button
              onClick={handleBannerEdit}
              className="absolute top-4 right-4 p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className={`w-5 h-5 ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
            </motion.button>
          </div>

          {/* Profile Picture - overlapping banner */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {/* Flame Effect for New Users */}
              {isNewUser() && (
                <motion.div
                  className="absolute -inset-2 rounded-3xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px 4px rgba(255,100,0,0.6), 0 0 40px 8px rgba(255,200,0,0.4)',
                      '0 0 30px 6px rgba(255,150,0,0.8), 0 0 50px 10px rgba(255,200,0,0.6)',
                      '0 0 20px 4px rgba(255,100,0,0.6), 0 0 40px 8px rgba(255,200,0,0.4)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
              
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-3xl overflow-hidden backdrop-blur-3xl border-4 border-white/30 bg-white/10 relative z-10">
                {getDiscordAvatarUrl() ? (
                  <img 
                    src={getDiscordAvatarUrl()!} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 z-20">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="relative"
                >
                  {getStatusIndicator(currentUser.status || 'online')}
                </button>
                
                {/* Status Menu */}
                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-full right-0 mb-2 p-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 min-w-[160px]"
                  >
                    {[
                      { status: 'online', label: 'Online', color: 'bg-green-500' },
                      { status: 'away', label: 'Away', color: 'bg-yellow-500' },
                      { status: 'busy', label: 'Busy', color: 'bg-orange-500' },
                      { status: 'dnd', label: 'Do Not Disturb', color: 'bg-red-500' },
                      { status: 'sleeping', label: 'Sleeping', color: 'bg-yellow-400' },
                      { status: 'invisible', label: 'Invisible', color: 'bg-gray-400' },
                    ].map((item) => (
                      <button
                        key={item.status}
                        onClick={() => {
                          updateStatus(item.status as any);
                          setShowStatusMenu(false);
                          toast.success(`Status set to ${item.label}`);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                      >
                        <div className={`w-3 h-3 ${item.color} rounded-full`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Edit Profile Picture Button */}
              <motion.button
                onClick={handleProfilePicEdit}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className={`w-4 h-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <div className="mt-20 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className={`text-4xl ${
              isDarkMode ? 'text-gray-900' : 'text-white'
            } drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-3`}>
              {currentUser.displayName || currentUser.discordUsername || currentUser.username}
              {hasMostPosts && (
                <span title="Most Posts">
                  <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                </span>
              )}
              {hasMostFollowers && (
                <span title="Most Followers">
                  <BadgeCheck className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                </span>
              )}
            </h1>
            
            {!currentUser.displayNameEdited && (
              <motion.button
                onClick={handleDisplayNameEdit}
                className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className={`w-4 h-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
              </motion.button>
            )}
          </div>
          
          {currentUser.discordUsername && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <p className={`${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>
                @{currentUser.discordUsername}
                {currentUser.discordDiscriminator && currentUser.discordDiscriminator !== '0' && 
                  `#${currentUser.discordDiscriminator}`}
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <FileText className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-purple-600' : 'text-purple-400'}`} />
            <p className={`text-3xl mb-1 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>{userPosts.length}</p>
            <p className={`${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>Posts</p>
          </motion.div>

          <motion.div
            className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <User className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-blue-600' : 'text-blue-400'}`} />
            <p className={`text-3xl mb-1 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>{currentUser.followers.length}</p>
            <p className={`${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>Followers</p>
          </motion.div>

          <motion.div
            className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <MessageSquare className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-pink-600' : 'text-pink-400'}`} />
            <p className={`text-3xl mb-1 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>{currentUser.following.length}</p>
            <p className={`${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>Following</p>
          </motion.div>
        </div>

        {/* Rank Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getRankIcon(currentUser.rank)}</span>
              <div>
                <h3 className={`text-xl ${isDarkMode ? 'text-gray-900' : 'text-white'} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                  Rank: {currentUser.rank}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>
                  Level {Math.floor(currentUser.level)} / 7000
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                {getLevelProgress().toFixed(2)}%
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-white/60'}`}>
                Progress to Elite
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-8 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className={`h-full bg-gradient-to-r ${getRankProgressColor(getLevelProgress())} rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${getLevelProgress()}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </div>
          
          {/* Rank Milestones */}
          <div className="flex justify-between mt-4 text-xs">
            <div className={`flex items-center gap-1 ${currentUser.rank === 'Silver' ? (isDarkMode ? 'text-gray-900' : 'text-white') : (isDarkMode ? 'text-gray-500' : 'text-white/40')}`}>
              <span>⭐</span>
              <span>Silver (0)</span>
            </div>
            <div className={`flex items-center gap-1 ${currentUser.level >= 1000 ? (isDarkMode ? 'text-gray-900' : 'text-white') : (isDarkMode ? 'text-gray-500' : 'text-white/40')}`}>
              <span>👑</span>
              <span>Gold (1000)</span>
            </div>
            <div className={`flex items-center gap-1 ${currentUser.level >= 3000 ? (isDarkMode ? 'text-gray-900' : 'text-white') : (isDarkMode ? 'text-gray-500' : 'text-white/40')}`}>
              <span>⚡</span>
              <span>Platinum (3000)</span>
            </div>
            <div className={`flex items-center gap-1 ${currentUser.level >= 5000 ? (isDarkMode ? 'text-gray-900' : 'text-white') : (isDarkMode ? 'text-gray-500' : 'text-white/40')}`}>
              <span>💎</span>
              <span>Diamond (5000)</span>
            </div>
            <div className={`flex items-center gap-1 ${currentUser.level >= 7000 ? (isDarkMode ? 'text-gray-900' : 'text-white') : (isDarkMode ? 'text-gray-500' : 'text-white/40')}`}>
              <span>💀</span>
              <span>Elite (7000)</span>
            </div>
          </div>
          
          <p className={`mt-4 text-xs ${isDarkMode ? 'text-gray-600' : 'text-white/60'} text-center`}>
            You earn 3.5 points per day (0.05% of 7000). Keep using the platform to reach Elite rank! 🚀
          </p>
        </motion.div>

        {/* Active Warnings Alert */}
        {activeWarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl backdrop-blur-3xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-red-400">Active Warnings ({activeWarnings.length})</h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-700' : 'text-white/80'}`}>
              You have {activeWarnings.length} active warning{activeWarnings.length > 1 ? 's' : ''} on your account.
              Click the "Warnings" tab below to view details.
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <motion.button
            onClick={() => setSelectedTab('posts')}
            className={`px-6 py-3 rounded-2xl backdrop-blur-xl border transition-colors ${
              selectedTab === 'posts'
                ? 'bg-white/20 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={isDarkMode ? 'text-gray-900' : 'text-white'}>
              Posts ({userPosts.length})
            </span>
          </motion.button>

          <motion.button
            onClick={() => setSelectedTab('warnings')}
            className={`px-6 py-3 rounded-2xl backdrop-blur-xl border transition-colors ${
              selectedTab === 'warnings'
                ? 'bg-white/20 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={isDarkMode ? 'text-gray-900' : 'text-white'}>
              Warnings ({currentUser.warnings.length})
            </span>
          </motion.button>

          <motion.button
            onClick={() => setSelectedTab('settings')}
            className={`px-6 py-3 rounded-2xl backdrop-blur-xl border transition-colors ${
              selectedTab === 'settings'
                ? 'bg-white/20 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={isDarkMode ? 'text-gray-900' : 'text-white'}>
              Settings
            </span>
          </motion.button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {userPosts.length === 0 ? (
                <div className="p-12 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10 text-center">
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-white/40'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-600' : 'text-white/70'}>
                    No posts yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className={`mb-2 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                        {post.title}
                      </h3>
                      <p className={`mb-4 ${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-white/50'}`}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          post.privacy === 'public' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : post.privacy === 'followers'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {post.privacy}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === 'warnings' && (
            <motion.div
              key="warnings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {currentUser.warnings.length === 0 ? (
                <div className="p-12 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10 text-center">
                  <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? 'text-green-600' : 'text-green-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-600' : 'text-white/70'}>
                    No warnings on your account
                  </p>
                </div>
              ) : (
                currentUser.warnings.map((warning) => {
                  const TypeIcon = getTypeIcon(warning.type);
                  return (
                    <motion.div
                      key={warning.id}
                      className={`p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border ${getSeverityColor(warning.severity)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-start gap-4">
                        <TypeIcon className={`w-6 h-6 flex-shrink-0 ${getSeverityColor(warning.severity).split(' ')[0]}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={isDarkMode ? 'text-gray-900' : 'text-white'}>
                              {warning.reason}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              warning.active 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {warning.active ? 'Active' : 'Expired'}
                            </span>
                          </div>
                          <p className={`mb-3 ${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>
                            {warning.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={isDarkMode ? 'text-gray-500' : 'text-white/50'}>
                              Issued: {new Date(warning.issuedAt).toLocaleDateString()}
                            </span>
                            {warning.expiresAt && (
                              <span className={isDarkMode ? 'text-gray-500' : 'text-white/50'}>
                                Expires: {new Date(warning.expiresAt).toLocaleDateString()}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full uppercase ${getSeverityColor(warning.severity)}`}>
                              {warning.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Bio Section */}
              <div className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10">
                <h3 className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                  <Edit className="w-5 h-5" />
                  Bio
                </h3>
                {editingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateBio(bioText);
                          setEditingBio(false);
                          toast.success('Bio updated!');
                        }}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 rounded-xl text-green-400 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setBioText(currentUser.bio || '');
                          setEditingBio(false);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className={`mb-3 ${isDarkMode ? 'text-gray-600' : 'text-white/70'}`}>
                      {currentUser.bio || 'No bio yet. Click edit to add one!'}
                    </p>
                    <button
                      onClick={() => {
                        setBioText(currentUser.bio || '');
                        setEditingBio(true);
                      }}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 rounded-xl text-blue-400 transition-all"
                    >
                      Edit Bio
                    </button>
                  </div>
                )}
              </div>

              {/* Partners Section */}
              <div className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10">
                <h3 className={`mb-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                  Partners
                </h3>
                <div className="space-y-3">
                  {(currentUser.partners || []).map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className={isDarkMode ? 'text-gray-600' : 'text-white/80'}>{partner}</span>
                      <button
                        onClick={() => {
                          removePartner(partner);
                          toast.success('Partner removed');
                        }}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPartner}
                      onChange={(e) => setNewPartner(e.target.value)}
                      placeholder="Add partner..."
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (newPartner.trim()) {
                          addPartner(newPartner.trim());
                          setNewPartner('');
                          toast.success('Partner added!');
                        }
                      }}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 rounded-xl text-green-400 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Favorite Games Section */}
              <div className="p-6 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10">
                <h3 className={`mb-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>
                  Favorite Games
                </h3>
                <div className="space-y-3">
                  {(currentUser.favoriteGames || []).map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className={isDarkMode ? 'text-gray-600' : 'text-white/80'}>{game}</span>
                      <button
                        onClick={() => {
                          removeFavoriteGame(game);
                          toast.success('Game removed');
                        }}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGame}
                      onChange={(e) => setNewGame(e.target.value)}
                      placeholder="Add favorite game..."
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (newGame.trim()) {
                          addFavoriteGame(newGame.trim());
                          setNewGame('');
                          toast.success('Game added!');
                        }
                      }}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 rounded-xl text-green-400 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Display Name Edit Dialog */}
      <AlertDialog open={showDisplayNameWarning} onOpenChange={setShowDisplayNameWarning}>
        <AlertDialogContent className="backdrop-blur-3xl bg-black/90 border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Edit Display Name</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              You can only edit your display name once. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="Enter new display name"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisplayNameEdit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Picture Edit Dialog */}
      <AlertDialog open={showProfilePicWarning} onOpenChange={setShowProfilePicWarning}>
        <AlertDialogContent className="backdrop-blur-3xl bg-black/90 border border-white/20 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Edit Profile Picture</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              You can edit your profile picture once every 7 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-4">
            {/* File Upload */}
            <div>
              <label className="text-white mb-2 block">Upload Image</label>
              <input
                ref={profilePicInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePicFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => profilePicInputRef.current?.click()}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              {profilePicFile && (
                <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white/70 text-sm">{profilePicFile.name}</span>
                  <button
                    onClick={() => {
                      setProfilePicFile(null);
                      setProfilePicPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview */}
            {profilePicPreview && (
              <div className="flex justify-center">
                <img
                  src={profilePicPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                />
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/90 text-white/70">OR</span>
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="text-white mb-2 block">Image URL</label>
              <Input
                value={newProfilePicUrl}
                onChange={(e) => setNewProfilePicUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmProfilePicEdit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            >
              Update Picture
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Banner Edit Dialog */}
      <AlertDialog open={showBannerWarning} onOpenChange={setShowBannerWarning}>
        <AlertDialogContent className="backdrop-blur-3xl bg-black/90 border border-white/20 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Edit Profile Banner</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Customize your profile banner with your own image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-4">
            {/* File Upload */}
            <div>
              <label className="text-white mb-2 block">Upload Banner Image</label>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => bannerInputRef.current?.click()}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              {bannerFile && (
                <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white/70 text-sm">{bannerFile.name}</span>
                  <button
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview */}
            {bannerPreview && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/90 text-white/70">OR</span>
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="text-white mb-2 block">Image URL</label>
              <Input
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBannerEdit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            >
              Update Banner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

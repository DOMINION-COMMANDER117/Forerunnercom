import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Lock, Users, Eye, Download, Trash2, Edit } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';

export function ProfilePage() {
  const { currentUser, getUserPosts, createPost, updatePost, deletePost } = useUser();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [downloadable, setDownloadable] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const isDarkMode = currentUser?.settings.darkMode || false;

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white text-3xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const userPosts = getUserPosts(currentUser.id);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    // Use FileReader to convert to base64 for client-side storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      
      createPost({
        title: title.trim(),
        description: description.trim(),
        fileUrl,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        privacy,
        downloadable,
      });

      toast.success('Post uploaded successfully!');
      setShowUpload(false);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setPrivacy('public');
      setDownloadable(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpdatePrivacy = (postId: string, newPrivacy: 'public' | 'followers' | 'private') => {
    updatePost(postId, { privacy: newPrivacy });
    toast.success('Privacy settings updated');
  };

  const handleToggleDownloadable = (postId: string, currentDownloadable: boolean) => {
    updatePost(postId, { downloadable: !currentDownloadable });
    toast.success(`Downloads ${!currentDownloadable ? 'enabled' : 'disabled'}`);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      toast.success('Post deleted');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-white' : 'bg-gradient-to-br from-black via-purple-950 to-black'}`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
      <div className="relative z-10 min-h-screen flex flex-col items-center p-8 pt-32 pb-32">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-4xl w-full"
        >
          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-3xl">{currentUser.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <h1 className="text-white text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            {currentUser.username}
          </h1>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-white text-3xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {userPosts.length}
              </div>
              <div className="text-white/70">Uploads</div>
            </div>
            <div className="text-center">
              <div className="text-white text-3xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {currentUser.followers.length}
              </div>
              <div className="text-white/70">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-white text-3xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {currentUser.following.length}
              </div>
              <div className="text-white/70">Following</div>
            </div>
          </div>
        </motion.div>

        {/* Upload Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => setShowUpload(!showUpload)}
          className="relative px-8 py-4 rounded-full overflow-hidden mb-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 backdrop-blur-3xl rounded-full" />
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            background: 'linear-gradient(to bottom right, rgba(168,85,247,0.4), transparent)',
            filter: 'blur(1px)',
          }} />
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40" />
          <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {showUpload ? 'Cancel Upload' : 'Upload New Post'}
          </span>
        </motion.button>

        {/* Upload Form */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl mb-12"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/40 transition-colors"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/40 transition-colors resize-none"
              />
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-500/20 file:text-white hover:file:bg-purple-500/30"
              />
              
              <div className="flex gap-4 items-center">
                <label className="text-white/90">Privacy:</label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white focus:outline-none focus:border-purple-400/40"
                >
                  <option value="public" className="bg-gray-900">Public</option>
                  <option value="followers" className="bg-gray-900">Followers Only</option>
                  <option value="private" className="bg-gray-900">Private</option>
                </select>

                <label className="flex items-center gap-2 text-white/90 ml-4">
                  <input
                    type="checkbox"
                    checked={downloadable}
                    onChange={(e) => setDownloadable(e.target.checked)}
                    className="w-5 h-5"
                  />
                  Downloadable
                </label>
              </div>

              <button
                onClick={handleUpload}
                className="relative w-full px-8 py-4 rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 backdrop-blur-3xl rounded-2xl" />
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                  background: 'linear-gradient(to bottom right, rgba(168,85,247,0.4), transparent)',
                  filter: 'blur(1px)',
                }} />
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/40" />
                <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  Upload Post
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <div className="w-full max-w-6xl">
          <h2 className="text-white text-2xl mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Your Posts ({userPosts.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <div className="mb-4">
                  <h3 className="text-white text-lg mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-white/70 text-sm mb-2">{post.description}</p>
                  )}
                  <p className="text-white/50 text-xs">{post.fileName} • {formatFileSize(post.fileSize)}</p>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <select
                    value={post.privacy}
                    onChange={(e) => handleUpdatePrivacy(post.id, e.target.value as any)}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-xs focus:outline-none"
                  >
                    <option value="public" className="bg-gray-900">Public</option>
                    <option value="followers" className="bg-gray-900">Followers</option>
                    <option value="private" className="bg-gray-900">Private</option>
                  </select>

                  <button
                    onClick={() => handleToggleDownloadable(post.id, post.downloadable)}
                    className={`p-2 rounded-full ${post.downloadable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    title={post.downloadable ? 'Downloads enabled' : 'Downloads disabled'}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-white/50 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>

          {userPosts.length === 0 && (
            <div className="text-center text-white/50 py-12">
              No posts yet. Upload your first post above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

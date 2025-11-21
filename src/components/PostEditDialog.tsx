import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Lock, Eye, Users, Globe } from 'lucide-react';
import { Post } from '../contexts/UserContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PostEditDialogProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Post>) => void;
}

export function PostEditDialog({ post, isOpen, onClose, onSave }: PostEditDialogProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [privacy, setPrivacy] = useState(post.privacy);
  const [downloadable, setDownloadable] = useState(post.downloadable);
  const [locked, setLocked] = useState(post.locked);
  const [previewImage, setPreviewImage] = useState(post.fileUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      tags,
      privacy,
      downloadable,
      locked,
      fileUrl: previewImage,
    });

    toast.success('Post updated successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Dialog content */}
          <div className="relative backdrop-blur-3xl bg-white/10 rounded-3xl border-2 border-white/20 p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-white text-2xl mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Edit Post
            </h2>

            <div className="space-y-6">
              {/* Preview Image */}
              <div>
                <label className="block text-white/80 mb-2">Preview Image</label>
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-2xl border-2 border-white/20"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Change Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/80 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors resize-none"
                  placeholder="Enter description..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/80 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/40 transition-colors"
                    placeholder="Add a tag..."
                  />
                  <Button
                    onClick={addTag}
                    className="px-6 bg-blue-500/20 border-2 border-blue-400/40 text-white hover:bg-blue-500/30"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-white text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-white/80 mb-2">Privacy</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPrivacy('public')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      privacy === 'public'
                        ? 'bg-green-500/20 border-green-400/40 text-white'
                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Globe className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Public</div>
                  </button>
                  <button
                    onClick={() => setPrivacy('followers')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      privacy === 'followers'
                        ? 'bg-blue-500/20 border-blue-400/40 text-white'
                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Followers</div>
                  </button>
                  <button
                    onClick={() => setPrivacy('private')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      privacy === 'private'
                        ? 'bg-red-500/20 border-red-400/40 text-white'
                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Eye className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Private</div>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white/5 border-2 border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <span className="text-white">Downloadable</span>
                  <input
                    type="checkbox"
                    checked={downloadable}
                    onChange={(e) => setDownloadable(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 border-2 border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    <span className="text-white">Lock Post</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={locked}
                    onChange={(e) => setLocked(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 border-2 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-blue-500/20 border-2 border-blue-400/40 text-white hover:bg-blue-500/30"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

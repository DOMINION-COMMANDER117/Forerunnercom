import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { toast } from 'sonner@2.0.3';
import { Trash2, Plus, X, Upload, Calendar } from 'lucide-react';

export function AdminPanel() {
  const { isAdmin, logoutAdmin, posts, deletePost, addPost, drives, updateDrive, getDrive } = useAdmin();
  const [activeTab, setActiveTab] = useState<'posts' | 'kayo' | 'dogs' | 'evecita'>('posts');
  const [activeDriveId, setActiveDriveId] = useState<'kayo' | 'dogs' | 'evecita'>('kayo');

  // Post form state
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState('');

  // Drive form states for each drive
  const [kayoTitle, setKayoTitle] = useState('');
  const [kayoDescription, setKayoDescription] = useState('');
  const [kayoBio, setKayoBio] = useState('');
  const [kayoLink, setKayoLink] = useState('');
  const [kayoImages, setKayoImages] = useState<string[]>([]);
  const [kayoComparisonBefore, setKayoComparisonBefore] = useState('');
  const [kayoComparisonAfter, setKayoComparisonAfter] = useState('');
  const [kayoIsPublished, setKayoIsPublished] = useState(false);
  const [kayoNextUpdate, setKayoNextUpdate] = useState('');
  const [kayoWhatsNew, setKayoWhatsNew] = useState<string[]>([]);

  const [dogsTitle, setDogsTitle] = useState('');
  const [dogsDescription, setDogsDescription] = useState('');
  const [dogsBio, setDogsBio] = useState('');
  const [dogsLink, setDogsLink] = useState('');
  const [dogsImages, setDogsImages] = useState<string[]>([]);
  const [dogsComparisonBefore, setDogsComparisonBefore] = useState('');
  const [dogsComparisonAfter, setDogsComparisonAfter] = useState('');
  const [dogsIsPublished, setDogsIsPublished] = useState(false);
  const [dogsNextUpdate, setDogsNextUpdate] = useState('');
  const [dogsWhatsNew, setDogsWhatsNew] = useState<string[]>([]);

  const [evecitaTitle, setEvecitaTitle] = useState('');
  const [evecitaDescription, setEvecitaDescription] = useState('');
  const [evecitaBio, setEvecitaBio] = useState('');
  const [evecitaLink, setEvecitaLink] = useState('');
  const [evecitaImages, setEvecitaImages] = useState<string[]>([]);
  const [evecitaComparisonBefore, setEvecitaComparisonBefore] = useState('');
  const [evecitaComparisonAfter, setEvecitaComparisonAfter] = useState('');
  const [evecitaIsPublished, setEvecitaIsPublished] = useState(false);
  const [evecitaNextUpdate, setEvecitaNextUpdate] = useState('');
  const [evecitaWhatsNew, setEvecitaWhatsNew] = useState<string[]>([]);
  
  const fileInputRefs = {
    kayo: useRef<HTMLInputElement>(null),
    dogs: useRef<HTMLInputElement>(null),
    evecita: useRef<HTMLInputElement>(null),
  };

  const comparisonBeforeRefs = {
    kayo: useRef<HTMLInputElement>(null),
    dogs: useRef<HTMLInputElement>(null),
    evecita: useRef<HTMLInputElement>(null),
  };

  const comparisonAfterRefs = {
    kayo: useRef<HTMLInputElement>(null),
    dogs: useRef<HTMLInputElement>(null),
    evecita: useRef<HTMLInputElement>(null),
  };

  // Load drive data on mount
  useEffect(() => {
    const kayoDrive = getDrive('kayo');
    const dogsDrive = getDrive('dogs');
    const evecitaDrive = getDrive('evecita');

    if (kayoDrive) {
      setKayoTitle(kayoDrive.title);
      setKayoDescription(kayoDrive.description);
      setKayoBio(kayoDrive.bio);
      setKayoLink(kayoDrive.link);
      setKayoImages(kayoDrive.images);
      setKayoComparisonBefore(kayoDrive.comparisonImageBefore || '');
      setKayoComparisonAfter(kayoDrive.comparisonImageAfter || '');
      setKayoIsPublished(kayoDrive.isPublished);
      setKayoNextUpdate(kayoDrive.nextUpdate || '');
      setKayoWhatsNew(kayoDrive.whatsNewBullets || []);
    }

    if (dogsDrive) {
      setDogsTitle(dogsDrive.title);
      setDogsDescription(dogsDrive.description);
      setDogsBio(dogsDrive.bio);
      setDogsLink(dogsDrive.link);
      setDogsImages(dogsDrive.images);
      setDogsComparisonBefore(dogsDrive.comparisonImageBefore || '');
      setDogsComparisonAfter(dogsDrive.comparisonImageAfter || '');
      setDogsIsPublished(dogsDrive.isPublished);
      setDogsNextUpdate(dogsDrive.nextUpdate || '');
      setDogsWhatsNew(dogsDrive.whatsNewBullets || []);
    }

    if (evecitaDrive) {
      setEvecitaTitle(evecitaDrive.title);
      setEvecitaDescription(evecitaDrive.description);
      setEvecitaBio(evecitaDrive.bio);
      setEvecitaLink(evecitaDrive.link);
      setEvecitaImages(evecitaDrive.images);
      setEvecitaComparisonBefore(evecitaDrive.comparisonImageBefore || '');
      setEvecitaComparisonAfter(evecitaDrive.comparisonImageAfter || '');
      setEvecitaIsPublished(evecitaDrive.isPublished);
      setEvecitaNextUpdate(evecitaDrive.nextUpdate || '');
      setEvecitaWhatsNew(evecitaDrive.whatsNewBullets || []);
    }
  }, [getDrive]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl text-red-500 mb-4">Access Denied</h1>
          <p className="text-white/70">You must be logged in as admin to view this page.</p>
        </div>
      </div>
    );
  }

  // Get current drive state based on active tab
  const getCurrentDriveState = (driveId: 'kayo' | 'dogs' | 'evecita') => {
    switch (driveId) {
      case 'kayo':
        return {
          title: kayoTitle,
          description: kayoDescription,
          bio: kayoBio,
          link: kayoLink,
          images: kayoImages,
          comparisonBefore: kayoComparisonBefore,
          comparisonAfter: kayoComparisonAfter,
          isPublished: kayoIsPublished,
          nextUpdate: kayoNextUpdate,
          whatsNew: kayoWhatsNew,
          setTitle: setKayoTitle,
          setDescription: setKayoDescription,
          setBio: setKayoBio,
          setLink: setKayoLink,
          setImages: setKayoImages,
          setComparisonBefore: setKayoComparisonBefore,
          setComparisonAfter: setKayoComparisonAfter,
          setIsPublished: setKayoIsPublished,
          setNextUpdate: setKayoNextUpdate,
          setWhatsNew: setKayoWhatsNew,
        };
      case 'dogs':
        return {
          title: dogsTitle,
          description: dogsDescription,
          bio: dogsBio,
          link: dogsLink,
          images: dogsImages,
          comparisonBefore: dogsComparisonBefore,
          comparisonAfter: dogsComparisonAfter,
          isPublished: dogsIsPublished,
          nextUpdate: dogsNextUpdate,
          whatsNew: dogsWhatsNew,
          setTitle: setDogsTitle,
          setDescription: setDogsDescription,
          setBio: setDogsBio,
          setLink: setDogsLink,
          setImages: setDogsImages,
          setComparisonBefore: setDogsComparisonBefore,
          setComparisonAfter: setDogsComparisonAfter,
          setIsPublished: setDogsIsPublished,
          setNextUpdate: setDogsNextUpdate,
          setWhatsNew: setDogsWhatsNew,
        };
      case 'evecita':
        return {
          title: evecitaTitle,
          description: evecitaDescription,
          bio: evecitaBio,
          link: evecitaLink,
          images: evecitaImages,
          comparisonBefore: evecitaComparisonBefore,
          comparisonAfter: evecitaComparisonAfter,
          isPublished: evecitaIsPublished,
          nextUpdate: evecitaNextUpdate,
          whatsNew: evecitaWhatsNew,
          setTitle: setEvecitaTitle,
          setDescription: setEvecitaDescription,
          setBio: setEvecitaBio,
          setLink: setEvecitaLink,
          setImages: setEvecitaImages,
          setComparisonBefore: setEvecitaComparisonBefore,
          setComparisonAfter: setEvecitaComparisonAfter,
          setIsPublished: setEvecitaIsPublished,
          setNextUpdate: setEvecitaNextUpdate,
          setWhatsNew: setEvecitaWhatsNew,
        };
    }
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postTitle || !postDescription || !postImage) {
      toast.error('Please fill in all fields');
      return;
    }

    addPost({
      title: postTitle,
      description: postDescription,
      imageUrl: postImage,
    });

    setPostTitle('');
    setPostDescription('');
    setPostImage('');
    toast.success('Post added successfully!');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      toast.success('Post deleted');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, driveId: 'kayo' | 'dogs' | 'evecita') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const driveState = getCurrentDriveState(driveId);
    const fileArray = Array.from(files);
    let validFilesProcessed = 0;

    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          driveState.setImages(prev => [...prev, base64]);
          validFilesProcessed++;
          if (validFilesProcessed === fileArray.length) {
            toast.success(`${validFilesProcessed} image(s) uploaded!`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleComparisonUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    driveId: 'kayo' | 'dogs' | 'evecita',
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const driveState = getCurrentDriveState(driveId);

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Max 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        if (type === 'before') {
          driveState.setComparisonBefore(base64);
        } else {
          driveState.setComparisonAfter(base64);
        }
        toast.success(`${type === 'before' ? 'Before' : 'After'} image uploaded!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number, driveId: 'kayo' | 'dogs' | 'evecita') => {
    const driveState = getCurrentDriveState(driveId);
    driveState.setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const handleSaveDrive = (driveId: 'kayo' | 'dogs' | 'evecita') => {
    const driveState = getCurrentDriveState(driveId);
    const drive = getDrive(driveId);

    if (!drive) return;

    updateDrive(driveId, {
      owner: drive.owner,
      title: driveState.title,
      description: driveState.description,
      bio: driveState.bio,
      link: driveState.link,
      images: driveState.images,
      comparisonImageBefore: driveState.comparisonBefore,
      comparisonImageAfter: driveState.comparisonAfter,
      isPublished: driveState.isPublished,
      nextUpdate: driveState.nextUpdate,
      whatsNewBullets: driveState.whatsNew,
      theme: drive.theme,
    });

    toast.success(`${drive.owner}'s Drive updated successfully!`);
  };

  const renderDriveForm = (driveId: 'kayo' | 'dogs' | 'evecita') => {
    const driveState = getCurrentDriveState(driveId);
    const drive = getDrive(driveId);
    if (!drive) return null;

    return (
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white mb-2">Drive Title</label>
          <input
            type="text"
            value={driveState.title}
            onChange={(e) => driveState.setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            placeholder="Enter drive title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white mb-2">Short Description</label>
          <input
            type="text"
            value={driveState.description}
            onChange={(e) => driveState.setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            placeholder="Short description for the card"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-white mb-2">Full Bio/Description</label>
          <textarea
            value={driveState.bio}
            onChange={(e) => driveState.setBio(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white min-h-32"
            placeholder="Full description shown on drive page"
          />
        </div>

        {/* Drive Link */}
        <div>
          <label className="block text-white mb-2">Download Link</label>
          <input
            type="url"
            value={driveState.link}
            onChange={(e) => driveState.setLink(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            placeholder="https://..."
          />
        </div>

        {/* Slideshow Images */}
        <div>
          <label className="block text-white mb-2">Slideshow Images</label>
          <button
            onClick={() => fileInputRefs[driveId].current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </button>
          <input
            ref={fileInputRefs[driveId]}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e, driveId)}
            className="hidden"
          />
          
          {driveState.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {driveState.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Slideshow ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx, driveId)}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Images */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Before Image</label>
            <button
              onClick={() => comparisonBeforeRefs[driveId].current?.click()}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              {driveState.comparisonBefore ? 'Change Before' : 'Upload Before'}
            </button>
            <input
              ref={comparisonBeforeRefs[driveId]}
              type="file"
              accept="image/*"
              onChange={(e) => handleComparisonUpload(e, driveId, 'before')}
              className="hidden"
            />
            {driveState.comparisonBefore && (
              <img
                src={driveState.comparisonBefore}
                alt="Before"
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-white mb-2">After Image</label>
            <button
              onClick={() => comparisonAfterRefs[driveId].current?.click()}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              {driveState.comparisonAfter ? 'Change After' : 'Upload After'}
            </button>
            <input
              ref={comparisonAfterRefs[driveId]}
              type="file"
              accept="image/*"
              onChange={(e) => handleComparisonUpload(e, driveId, 'after')}
              className="hidden"
            />
            {driveState.comparisonAfter && (
              <img
                src={driveState.comparisonAfter}
                alt="After"
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* What's New Bullet Points */}
        <div>
          <label className="block text-white mb-2">What's New This Update (Bullet Points)</label>
          <div className="space-y-2">
            {driveState.whatsNew.map((bullet, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = [...driveState.whatsNew];
                    newBullets[idx] = e.target.value;
                    driveState.setWhatsNew(newBullets);
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="Enter bullet point..."
                />
                <button
                  onClick={() => {
                    driveState.setWhatsNew(driveState.whatsNew.filter((_, i) => i !== idx));
                    toast.success('Bullet removed');
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                driveState.setWhatsNew([...driveState.whatsNew, '']);
                toast.success('Bullet added');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Bullet Point
            </button>
          </div>
        </div>

        {/* Next Update Date */}
        <div>
          <label className="block text-white mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Next Update Date (Optional)
          </label>
          <input
            type="date"
            value={driveState.nextUpdate}
            onChange={(e) => driveState.setNextUpdate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={`published-${driveId}`}
            checked={driveState.isPublished}
            onChange={(e) => driveState.setIsPublished(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor={`published-${driveId}`} className="text-white">
            Published (Visible on Explore page)
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={() => handleSaveDrive(driveId)}
          className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors uppercase tracking-wider"
          style={{ fontWeight: 700 }}
        >
          Save {drive.owner}'s Drive
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl text-white mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            ADMIN PANEL
          </h1>
          <button
            onClick={logoutAdmin}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Logout
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('kayo')}
            className={`px-6 py-3 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'kayo'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            KAYO's Drive
          </button>
          <button
            onClick={() => setActiveTab('dogs')}
            className={`px-6 py-3 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'dogs'
                ? 'bg-gray-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            DOGS Drive
          </button>
          <button
            onClick={() => setActiveTab('evecita')}
            className={`px-6 py-3 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'evecita'
                ? 'bg-pink-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            EVECITA's Drive
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-[32px] p-8"
        >
          {activeTab === 'posts' && (
            <div className="space-y-8">
              {/* Add Post Form */}
              <div>
                <h2 className="text-2xl text-white mb-4">Add New Post</h2>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Post Title"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
                  />
                  <textarea
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Post Description"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white min-h-24"
                  />
                  <input
                    type="url"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="Image URL"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Post
                  </button>
                </form>
              </div>

              {/* Posts List */}
              <div>
                <h2 className="text-2xl text-white mb-4">All Posts ({posts.length})</h2>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white mb-1">{post.title}</h3>
                        <p className="text-white/60 text-sm">{post.description}</p>
                        <p className="text-white/40 text-xs mt-2">
                          {post.likes} likes • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors h-fit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-white/60 text-center py-8">No posts yet. Add your first post!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kayo' && renderDriveForm('kayo')}
          {activeTab === 'dogs' && renderDriveForm('dogs')}
          {activeTab === 'evecita' && renderDriveForm('evecita')}
        </motion.div>
      </div>
    </div>
  );
}

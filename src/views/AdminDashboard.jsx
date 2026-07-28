// src/views/AdminDashboard.jsx
import React, { useState } from 'react';

const STORES = {
  SERMONS: 'Sermons',
  GALLERY: 'Gallery',
  EVENTS: 'Events',
  LEADERSHIP: 'Leadership',
};

const AdminDashboard = ({ 
  mediaItems = [], 
  noticeItems = [], 
  galleryItems = [], 
  leaders = [],
  onSaveMedia, 
  onSaveNotice, 
  onSaveGallery, 
  onSaveLeader,
  onDeleteMedia,
  onDeleteNotice,
  onDeleteGallery,
  onDeleteLeader
}) => {
  const [activeTab, setActiveTab] = useState(STORES.SERMONS);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [profile, setProfile] = useState(''); // Leadership profile bio
  const [mediaType, setMediaType] = useState('audio');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const convertToEmbedIfNeeded = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title || item.name || '');
    setSubtitle(item.subtitle || item.role || item.speaker || item.description || item.category || '');
    setProfile(item.profile || item.bio || '');
    setMediaType(item.type || item.mediaType || 'audio');
    setMediaUrl(item.src || item.url || item.image || item.imageUrl || '');
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setProfile('');
    setMediaUrl('');
    setSelectedFile(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (activeTab === STORES.LEADERSHIP && onDeleteLeader) onDeleteLeader(id);
    if (activeTab === STORES.SERMONS && onDeleteMedia) onDeleteMedia(id);
    if (activeTab === STORES.GALLERY && onDeleteGallery) onDeleteGallery(id);
    if (activeTab === STORES.EVENTS && onDeleteNotice) onDeleteNotice(id);

    if (editingId === id) handleCancelEdit();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Please enter a title/name.");

    setIsSaving(true);
    try {
      let filePayload = mediaUrl;
      if (selectedFile) {
        filePayload = await fileToDataURL(selectedFile);
      } else {
        filePayload = convertToEmbedIfNeeded(mediaUrl);
      }

      const id = editingId || Date.now();
      const date = new Date().toISOString().split('T')[0];

      if (activeTab === STORES.LEADERSHIP) {
        const item = {
          id,
          name: title,
          title,
          role: subtitle || 'Church Leader',
          subtitle: subtitle || 'Church Leader',
          profile: profile || '',
          bio: profile || '',
          image: filePayload || 'https://via.placeholder.com/150',
          photo: filePayload || 'https://via.placeholder.com/150',
          date,
        };
        if (onSaveLeader) onSaveLeader(item);
      } else if (activeTab === STORES.SERMONS) {
        const item = {
          id,
          title,
          name: title,
          speaker: subtitle || 'FWC Ministry',
          preacher: subtitle || 'FWC Ministry',
          subtitle,
          type: mediaType,
          mediaType,
          src: filePayload,
          url: filePayload,
          audioUrl: filePayload,
          videoUrl: filePayload,
          date,
        };
        if (onSaveMedia) onSaveMedia(item);
      } else if (activeTab === STORES.GALLERY) {
        const item = {
          id,
          title,
          name: title,
          category: subtitle || 'Church Life',
          subtitle: subtitle || 'Church Life',
          image: filePayload || 'https://via.placeholder.com/400x300',
          imageUrl: filePayload || 'https://via.placeholder.com/400x300',
          src: filePayload,
          url: filePayload,
          date,
        };
        if (onSaveGallery) onSaveGallery(item);
      } else if (activeTab === STORES.EVENTS) {
        const item = {
          id,
          title,
          name: title,
          description: subtitle || '',
          details: subtitle || '',
          subtitle: subtitle || '',
          content: subtitle || '',
          date,
          image: filePayload,
          imageUrl: filePayload,
          src: filePayload,
        };
        if (onSaveNotice) onSaveNotice(item);
      }

      alert(editingId ? "Item updated successfully!" : "Item created successfully!");
      handleCancelEdit();
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving item. Try using a direct link or smaller file.");
    } finally {
      setIsSaving(false);
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case STORES.LEADERSHIP: return leaders;
      case STORES.SERMONS: return mediaItems;
      case STORES.GALLERY: return galleryItems;
      case STORES.EVENTS: return noticeItems;
      default: return [];
    }
  };

  const currentItems = getActiveList();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">FWC Control Panel</h1>
          <p className="text-xs text-gray-500 font-medium">Manage and edit your website content in real time.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.values(STORES).map((tabName) => (
            <button
              key={tabName}
              type="button"
              onClick={() => {
                setActiveTab(tabName);
                handleCancelEdit();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tabName
                  ? 'bg-[#7E57C2] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </header>

      {/* Form Input Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? `Edit ${activeTab} Item` : `Add To ${activeTab}`}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-red-500 hover:underline font-semibold cursor-pointer"
            >
              ✕ Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {activeTab === STORES.LEADERSHIP ? 'Leader Name' : 'Title / Heading'}
            </label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={activeTab === STORES.LEADERSHIP ? "e.g. Rev. Nath" : "e.g. Sunday Service"}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {activeTab === STORES.LEADERSHIP ? 'Role / Position' : activeTab === STORES.SERMONS ? 'Speaker Name' : 'Subtitle / Description'}
            </label>
            <input 
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={activeTab === STORES.LEADERSHIP ? "e.g. Senior Pastor" : "e.g. Pastor Felix"}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
            />
          </div>

          {activeTab === STORES.LEADERSHIP && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Profile Description / Biography
              </label>
              <textarea 
                rows="4"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                placeholder="Enter leader's profile description, ministry background, or bio details..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
              />
            </div>
          )}

          {activeTab === STORES.SERMONS && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Media Format</label>
              <select 
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
              >
                <option value="audio">Audio (.mp3, .wav)</option>
                <option value="video">Video (.mp4, YouTube link)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Photo / Media File</label>
            <input 
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7E57C2] cursor-pointer"
            />
          </div>

          <div className="text-center text-xs text-gray-400 font-bold">OR</div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Direct Image/Video URL</label>
            <input 
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#7E57C2] hover:bg-[#6c48ab] text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : editingId ? `Update ${activeTab} Item` : `Upload to ${activeTab}`}
          </button>
        </form>
      </div>

      {/* Item List */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto space-y-4">
        <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">
          Manage Uploaded {activeTab} ({currentItems.length})
        </h3>

        {currentItems.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center italic">No items uploaded in this section yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentItems.map((item) => {
              const displayTitle = item.title || item.name;
              const displaySub = item.subtitle || item.role || item.speaker || item.description || item.category;

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#00A8E8] flex items-center justify-center font-bold text-xs shrink-0">
                      {activeTab === STORES.SERMONS ? (item.type === 'video' ? '🎬' : '🎧') : '📌'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{displayTitle}</h4>
                      <p className="text-xs text-gray-500">{displaySub}</p>
                      {(item.profile || item.bio) && (
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.profile || item.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="bg-sky-50 hover:bg-sky-100 text-[#00A8E8] font-bold text-xs px-3 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
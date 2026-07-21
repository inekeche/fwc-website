// src/views/MediaArchive.jsx
import React, { useState, useEffect } from 'react';

const defaultMediaList = [
  {
    id: 1,
    title: "Walking in Divine Purpose",
    speaker: "Rev. Dr. Felix Ineke",
    date: "2026-07-12",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }
];

const DB_NAME = 'FWC_Media_DB';
const STORE_NAME = 'sermons';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const getMediaFromDB = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("IndexedDB read error:", err);
    return [];
  }
};

const saveMediaItemToDB = async (item) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

const deleteMediaItemFromDB = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MediaArchive = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [mediaType, setMediaType] = useState('audio');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      const items = await getMediaFromDB();
      if (items && items.length > 0) {
        setMediaItems(items);
      } else {
        setMediaItems(defaultMediaList);
        for (const item of defaultMediaList) {
          await saveMediaItemToDB(item);
        }
      }
      setIsLoading(false);
    };

    loadMedia();
  }, []);

  const handleOpenAddModal = () => {
    setEditingMedia(null);
    setTitle('');
    setSpeaker('');
    setMediaType('audio');
    setMediaUrl('');
    setMediaFile(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingMedia(item);
    setTitle(item.title);
    setSpeaker(item.speaker);
    setMediaType(item.type);
    setMediaUrl(item.url.startsWith('data:') ? '' : item.url);
    setMediaFile(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter a title for the media sermon.");
      return;
    }

    let finalUrl = mediaUrl;
    setIsSaving(true);

    try {
      if (mediaFile) {
        finalUrl = await convertFileToBase64(mediaFile);
      }

      if (!finalUrl && editingMedia) {
        finalUrl = editingMedia.url;
      }

      if (!finalUrl) {
        alert("Please select an audio/video file or enter a valid media URL.");
        setIsSaving(false);
        return;
      }

      const itemToSave = {
        id: editingMedia ? editingMedia.id : Date.now(),
        title,
        speaker: speaker || "Guest Speaker",
        date: editingMedia ? editingMedia.date : new Date().toISOString().split('T')[0],
        type: mediaType,
        url: finalUrl
      };

      await saveMediaItemToDB(itemToSave);

      if (editingMedia) {
        setMediaItems((prev) => prev.map((m) => (m.id === editingMedia.id ? itemToSave : m)));
      } else {
        setMediaItems((prev) => [itemToSave, ...prev]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Save media failed:", error);
      alert("Failed to save media file.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm("Remove this media sermon from archive?")) {
      try {
        await deleteMediaItemFromDB(id);
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const filteredMedia = activeTab === 'all' 
    ? mediaItems 
    : mediaItems.filter((item) => item.type === activeTab);

  return (
    <section id="media" className="py-20 px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[#7E57C2] font-bold text-sm tracking-widest uppercase">Word & Sermons</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Sermon Media Archive</h2>
          <div className="w-16 h-1 bg-[#00A8E8] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {['all', 'audio', 'video'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#7E57C2] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'All Sermons' : `${tab} Sermons`}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-[#7E57C2] hover:bg-[#6c48ab] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🎙️</span> Upload Audio / Video
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-semibold text-sm">
            Loading media archive...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMedia.map((item) => (
              <div key={item.id} className="bg-sky-50/50 p-6 rounded-3xl border border-sky-100 relative group flex flex-col justify-between">
                
                {/* Action Buttons: Edit & Delete */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="bg-white hover:bg-gray-100 text-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-sm"
                    title="Edit Sermon Media"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="bg-red-600/80 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-sm"
                    title="Remove Media"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                      item.type === 'video' ? 'bg-[#00A8E8]' : 'bg-[#7E57C2]'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 pr-16">{item.title}</h4>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Speaker: {item.speaker}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-sky-100">
                  {item.type === 'video' ? (
                    <video controls className="w-full rounded-2xl max-h-56 bg-black">
                      <source src={item.url} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <audio controls className="w-full">
                      <source src={item.url} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {editingMedia ? "Edit Sermon Media" : "Add Sermon Media"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sermon Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Walking in Grace"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Speaker Name</label>
                <input 
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Rev. Dr. Felix Ineke"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Media Format</label>
                <select 
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
                >
                  <option value="audio">Audio (.mp3, .wav, .m4a)</option>
                  <option value="video">Video (.mp4, .webm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Replace Media File</label>
                <input 
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'audio/*'}
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7E57C2] cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-gray-400 font-bold">OR</div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Direct Media URL</label>
                <input 
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/sermon.mp3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#7E57C2] hover:bg-[#6c48ab] text-white py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSaving ? 'Processing & Saving...' : editingMedia ? 'Save Changes' : 'Save Sermon Media'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaArchive;
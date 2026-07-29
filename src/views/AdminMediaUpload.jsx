// src/admin/AdminMediaUpload.jsx
import React, { useState } from 'react';
import { saveToDB, deleteFromDB, fileToDataURL, STORES } from '../utils/indexedDB';

// 1. Centralized codebase media mapping pointing to public/ directory
export const DEFAULT_MODULE_MEDIA = {
  [STORES.SERMONS]: {
    id: 'default-sermon-1',
    title: 'Divine Guidance & Help',
    speaker: 'Rev. Dr. Felix Ineke',
    role: 'Lead Pastor',
    type: 'video',
    url: '/media/help.mp4', // Relative path from public/
    image: '/media/help.mp4',
    date: new Date().toISOString().split('T')[0],
    isDefault: true
  },
  [STORES.GALLERY]: {
    id: 'default-gallery-1',
    title: 'Choir Worship Session',
    speaker: 'Worship Team',
    name: 'Choir Worship Session',
    role: 'Worship Team',
    type: 'image',
    url: '/gallery/choir.jpg', // Relative path from public/
    image: '/gallery/choir.jpg',
    date: new Date().toISOString().split('T')[0],
    isDefault: true
  },
  [STORES.EVENTS]: {
    id: 'default-event-1',
    title: 'Annual Church Conference',
    speaker: 'Church Board',
    name: 'Annual Church Conference',
    role: 'Main Auditorium',
    type: 'image',
    url: '/events/conference.jpg', // Relative path from public/
    image: '/events/conference.jpg',
    date: new Date().toISOString().split('T')[0],
    isDefault: true
  },
  [STORES.LEADERSHIP]: {
    id: 'default-leader-1',
    title: 'Rev. Dr. Felix Ineke',
    speaker: 'Lead Pastor',
    name: 'Rev. Dr. Felix Ineke',
    role: 'Lead Pastor',
    type: 'image',
    url: '/leadership/pastor.jpg', // Relative path from public/
    image: '/leadership/pastor.jpg',
    date: new Date().toISOString().split('T')[0],
    isDefault: true
  }
};

const AdminMediaUpload = () => {
  const [targetStore, setTargetStore] = useState(STORES.SERMONS);
  const [title, setTitle] = useState('');
  const [speakerOrRole, setSpeakerOrRole] = useState('');
  const [mediaType, setMediaType] = useState('audio');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Automatically seed all codebase URLs into IndexedDB
  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const storesToSeed = [STORES.SERMONS, STORES.GALLERY, STORES.EVENTS, STORES.LEADERSHIP];
      for (const storeKey of storesToSeed) {
        await saveToDB(storeKey, DEFAULT_MODULE_MEDIA[storeKey]);
      }
      alert("All default codebase media paths (Sermons, Gallery, Events, Leadership) synced successfully!");
    } catch (err) {
      console.error("Failed to seed default media:", err);
      alert("Error initializing default media files.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fallback to codebase default relative path for selected target store if mediaUrl is blank
    const fallbackPath = DEFAULT_MODULE_MEDIA[targetStore]?.url || '';
    let finalUrl = mediaUrl || fallbackPath;

    setIsSaving(true);
    try {
      if (mediaFile) {
        finalUrl = await fileToDataURL(mediaFile);
      }

      if (!finalUrl) {
        alert("Please upload a file or specify a media URL.");
        setIsSaving(false);
        return;
      }

      const itemToSave = {
        id: Date.now(),
        title: title || DEFAULT_MODULE_MEDIA[targetStore]?.title,
        speaker: speakerOrRole || DEFAULT_MODULE_MEDIA[targetStore]?.speaker,
        name: title || DEFAULT_MODULE_MEDIA[targetStore]?.name,
        role: speakerOrRole || DEFAULT_MODULE_MEDIA[targetStore]?.role,
        type: mediaType,
        url: finalUrl,
        image: finalUrl,
        date: new Date().toISOString().split('T')[0],
        isDefault: false
      };

      // Save new uploaded item
      await saveToDB(targetStore, itemToSave);

      // Clean default demo item if present
      await deleteFromDB(targetStore, 'default-sermon-1');
      await deleteFromDB(targetStore, 'default-gallery-1');
      await deleteFromDB(targetStore, 'default-event-1');
      await deleteFromDB(targetStore, 'default-leader-1');

      alert(`Successfully added to ${targetStore.toUpperCase()}!`);

      // Reset form
      setTitle('');
      setSpeakerOrRole('');
      setMediaUrl('');
      setMediaFile(null);
    } catch (err) {
      console.error("Admin upload failed:", err);
      alert("Failed to upload. Large files may exceed browser storage memory limits.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md max-w-xl mx-auto my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Admin Media Uploader</h3>
        <button
          type="button"
          onClick={handleSeedDefaults}
          disabled={isSeeding}
          className="text-xs bg-purple-50 text-[#7E57C2] font-semibold px-3 py-1.5 rounded-xl border border-purple-100 hover:bg-purple-100 cursor-pointer disabled:opacity-50"
        >
          {isSeeding ? 'Syncing...' : 'Sync All Default Media'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Module</label>
          <select 
            value={targetStore}
            onChange={(e) => {
              const selectedStore = e.target.value;
              setTargetStore(selectedStore);
              setMediaUrl(DEFAULT_MODULE_MEDIA[selectedStore]?.url || '');
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
          >
            <option value={STORES.SERMONS}>Sermons / Word Archive</option>
            <option value={STORES.GALLERY}>Gallery</option>
            <option value={STORES.EVENTS}>Events & Notices</option>
            <option value={STORES.LEADERSHIP}>Leadership</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title / Name</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={DEFAULT_MODULE_MEDIA[targetStore]?.title || "e.g. Divine Favor Sermon"}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Speaker / Subtitle / Role</label>
          <input 
            type="text"
            value={speakerOrRole}
            onChange={(e) => setSpeakerOrRole(e.target.value)}
            placeholder={DEFAULT_MODULE_MEDIA[targetStore]?.speaker || "e.g. Rev. Dr. Felix Ineke"}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
          />
        </div>

        {targetStore === STORES.SERMONS && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Media Format</label>
            <select 
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
            >
              <option value="audio">Audio (.mp3, .wav)</option>
              <option value="video">Video (.mp4, .webm)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload File</label>
          <input 
            type="file"
            onChange={(e) => setMediaFile(e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7E57C2] cursor-pointer"
          />
        </div>

        <div className="text-center text-xs text-gray-400 font-bold">OR</div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Direct Media / Image Relative Path</label>
          <input 
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={DEFAULT_MODULE_MEDIA[targetStore]?.url || "/media/help.mp4"}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-[#7E57C2] hover:bg-[#6c48ab] text-white py-3 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Uploading & Saving...' : 'Publish to App'}
        </button>
      </form>
    </div>
  );
};

export default AdminMediaUpload;
// src/admin/AdminMediaUpload.jsx
import React, { useState } from 'react';
import { saveToDB, deleteFromDB, fileToDataURL, STORES } from '../utils/indexedDB';

const AdminMediaUpload = () => {
  const [targetStore, setTargetStore] = useState(STORES.SERMONS);
  const [title, setTitle] = useState('');
  const [speakerOrRole, setSpeakerOrRole] = useState('');
  const [mediaType, setMediaType] = useState('audio');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Please provide a title or name.");

    setIsSaving(true);
    try {
      let finalUrl = mediaUrl;

      if (mediaFile) {
        finalUrl = await fileToDataURL(mediaFile);
      }

      if (!finalUrl) {
        alert("Please upload a file or enter a valid URL.");
        setIsSaving(false);
        return;
      }

      const itemToSave = {
        id: Date.now(), // Unique ID
        title,
        speaker: speakerOrRole, // Fits Sermons/Leadership
        name: title,            // Generic backup for Leadership/Gallery
        role: speakerOrRole,
        type: mediaType,
        url: finalUrl,
        image: finalUrl,        // Backup field for Gallery/Leadership
        date: new Date().toISOString().split('T')[0],
        isDefault: false
      };

      // Save to IndexedDB using target store
      await saveToDB(targetStore, itemToSave);

      // Clean up local defaults if present
      await deleteFromDB(targetStore, 1);

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
      <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Media Uploader</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Module</label>
          <select 
            value={targetStore}
            onChange={(e) => setTargetStore(e.target.value)}
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
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Divine Favor Sermon / Annual Conference"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Speaker / Subtitle / Role</label>
          <input 
            type="text"
            value={speakerOrRole}
            onChange={(e) => setSpeakerOrRole(e.target.value)}
            placeholder="e.g. Rev. Dr. Felix Ineke"
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
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Direct Media / Image URL</label>
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
          className="w-full bg-[#7E57C2] hover:bg-[#6c48ab] text-white py-3 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Uploading & Saving...' : 'Publish to App'}
        </button>
      </form>
    </div>
  );
};

export default AdminMediaUpload;
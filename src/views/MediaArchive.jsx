// src/views/MediaArchive.jsx
import React, { useState } from 'react';

// Hardcoded default sermon video from public/media/help.mp4
const FALLBACK_SERMONS = [
  {
    id: 'local-help-video',
    title: 'Divine Help & Restoration',
    speaker: 'Rev. Dr. Felix Ineke',
    type: 'video',
    url: '/media/help.mp4',
    date: '2026-07-29'
  }
];

const MediaArchive = ({ media = [], sermons = [] }) => {
  const [filter, setFilter] = useState('all');

  // Priority: 1. Passed media prop -> 2. Passed sermons prop -> 3. Local public video
  const combinedList = media.length > 0 ? media : sermons.length > 0 ? sermons : FALLBACK_SERMONS;

  const filteredList = combinedList.filter((item) => {
    if (filter === 'all') return true;
    const itemType = (item.type || (item.url?.endsWith('.mp4') ? 'video' : 'audio')).toLowerCase();
    return itemType === filter;
  });

  return (
    <section id="media" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
          <div>
            <span className="text-[#7E57C2] font-extrabold text-xs tracking-wider uppercase">
              Sermons & Media
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Sermon Archive
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit">
            {['all', 'audio', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item, idx) => {
            // Check all common URL property names safely
            const mediaUrl = item.url || item.src || item.mediaUrl || item.videoUrl || '/media/help.mp4';
            const isVideo = item.type === 'video' || mediaUrl.includes('.mp4');

            return (
              <div
                key={item.id || idx}
                className="bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block bg-purple-100 text-[#7E57C2] text-[10px] font-bold px-2.5 py-1 rounded-md mb-3 uppercase">
                    {isVideo ? 'Video Message' : 'Audio Message'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {item.title || 'Divine Help & Restoration'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.speaker || item.role || 'Rev. Dr. Felix Ineke'}
                  </p>
                </div>

                <div className="mt-4">
                  {isVideo ? (
                    <video
                      controls
                      preload="metadata"
                      src={mediaUrl}
                      className="w-full h-52 object-cover rounded-xl bg-black shadow-inner"
                    >
                      Your browser does not support playing HTML5 video.
                    </video>
                  ) : (
                    <audio controls src={mediaUrl} className="w-full mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MediaArchive;
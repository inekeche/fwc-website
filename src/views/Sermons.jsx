// src/views/Sermons.jsx
import React, { useState } from 'react';

const Sermons = ({ sermons = [], items = [], media = [] }) => {
  const [filter, setFilter] = useState('all');

  // Combine passed properties into one list
  const combinedProps = [...sermons, ...items, ...media];

  // Filter out duplicates and invalid items
  const rawList = combinedProps.filter((item, index, self) => {
    const hasUrl = item && (item.url || item.mediaUrl || item.src);
    const isFirstOccurence = self.findIndex(i => (i.id && i.id === item.id) || (i.url && i.url === item.url)) === index;
    return hasUrl && isFirstOccurence;
  });

  // Filter items by type (all, audio, video)
  const filteredList = rawList.filter((item) => {
    if (filter === 'all') return true;
    const mediaUrl = (item.url || item.mediaUrl || item.src || '').toLowerCase();
    const itemType = (item.type || (mediaUrl.includes('.mp4') ? 'video' : 'audio')).toLowerCase();
    return itemType === filter;
  });

  return (
    <section id="media" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
          <div>
            <span className="text-[#7E57C2] font-extrabold text-xs tracking-wider uppercase">
              Sermons & Media
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Sermon Archive
            </h2>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit">
            {['all', 'audio', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
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

        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm font-medium">
              No media sermons available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item, idx) => {
              const mediaUrl = item.url || item.mediaUrl || item.src;
              const isVideo = item.type === 'video' || (mediaUrl && mediaUrl.toLowerCase().includes('.mp4'));

              return (
                <div
                  key={item.id || idx}
                  className="bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <span className="inline-block bg-purple-100 text-[#7E57C2] text-[10px] font-bold px-2.5 py-1 rounded-md mb-3 uppercase">
                      {isVideo ? 'Video Message' : 'Audio Message'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                      {item.title || 'Divine Help & Restoration'}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.speaker || 'Rev. Dr. Felix Ineke'}
                    </p>
                  </div>

                  <div className="mt-4">
                    {isVideo ? (
                      <video
                        controls
                        preload="metadata"
                        src={mediaUrl}
                        className="w-full h-48 object-cover rounded-xl bg-black shadow-inner"
                      >
                        Your browser does not support playing this video.
                      </video>
                    ) : (
                      <audio controls src={mediaUrl} className="w-full mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Sermons;
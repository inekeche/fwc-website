// src/views/MediaArchive.jsx
import React, { useState } from 'react';

const MediaArchive = ({ media = [], sermons = [] }) => {
  const combinedMedia = media.length > 0 ? media : sermons;
  const [filter, setFilter] = useState('all');

  // Helper function to extract or convert YouTube URLs into embeddable format
  const getEmbedUrl = (url = '') => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    // Handle standard youtube.com/watch?v=ID or youtu.be/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const filteredItems = combinedMedia.filter((item) => {
    const itemType = (item.type || item.mediaType || 'audio').toLowerCase();
    if (filter === 'audio') return itemType === 'audio';
    if (filter === 'video') return itemType === 'video';
    return true;
  });

  return (
    <section id="media" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
          <div>
            <span className="text-[#00A8E8] font-extrabold text-xs tracking-wider uppercase">Sermons & Media</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Sermon Archive</h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('audio')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'audio' ? 'bg-[#7E57C2] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'video' ? 'bg-[#00A8E8] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Video
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic">
            No media sermons uploaded yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const type = (item.type || item.mediaType || 'audio').toLowerCase();
              const mediaSource = item.src || item.url || item.videoUrl || item.audioUrl || '';
              const isYouTube = mediaSource.includes('youtube.com') || mediaSource.includes('youtu.be');

              return (
                <div key={item.id} className="bg-sky-50/50 rounded-2xl border border-sky-100/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md ${
                        type === 'video' ? 'bg-sky-100 text-[#00A8E8]' : 'bg-purple-100 text-[#7E57C2]'
                      }`}>
                        {type === 'video' ? '🎬 Video Sermon' : '🎧 Audio Sermon'}
                      </span>
                      {item.date && <span className="text-[11px] text-gray-400 font-medium">{item.date}</span>}
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg leading-snug">{item.title || item.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Speaker: {item.speaker || item.preacher || 'FWC Ministry'}</p>
                    {item.subtitle && <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>}
                  </div>

                  {/* Player Rendering */}
                  <div className="mt-5 pt-4 border-t border-sky-100">
                    {type === 'video' ? (
                      isYouTube ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                          <iframe
                            src={getEmbedUrl(mediaSource)}
                            title={item.title || 'Video player'}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <video controls className="w-full rounded-xl bg-black max-h-48">
                          <source src={mediaSource} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <audio controls className="w-full rounded-xl">
                        <source src={mediaSource} />
                        Your browser does not support the audio tag.
                      </audio>
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

export default MediaArchive;
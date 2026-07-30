// src/views/NoticeBoard.jsx
import React from 'react';

// Codebase static fallback if props are empty
const STATIC_EVENT_FALLBACK = [
  {
    id: 'default-event-1',
    title: 'Sunday Worship Service',
    date: 'Every Sunday | 8:30 AM',
    details: 'Join us for our flagship weekly service filled with powerful worship, prayer, and the Word.',
    image: ''
  }
];

const NoticeBoard = ({ notices = [], events = [] }) => {
  // 1. Prioritize notices or events passed down via props from App.jsx
  const activeItems = notices.length > 0 
    ? notices 
    : events.length > 0 
      ? events 
      : STATIC_EVENT_FALLBACK;

  return (
    <section id="events" className="py-16 px-6 bg-sky-50/50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-[#00A8E8] font-extrabold text-xs tracking-wider uppercase">Stay Updated</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Notice Board & Events</h2>
        </div>

        {activeItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic">
            No notices or upcoming events at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item, idx) => {
              const mediaSource = item.image || item.url;
              return (
                <div 
                  key={item.id || idx} 
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {item.date && (
                      <span className="inline-block bg-sky-100 text-[#00A8E8] text-[10px] font-bold px-2.5 py-1 rounded-md mb-3">
                        📅 {item.date}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                      {item.title || item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {item.description || item.details || item.subtitle || item.content || item.speaker || item.role}
                    </p>
                  </div>

                  {mediaSource && (
                    <img 
                      src={mediaSource} 
                      alt={item.title || item.name || 'Event Notice'} 
                      className="mt-4 w-full h-40 object-cover rounded-xl border border-gray-100" 
                      onError={(e) => {
                        console.error(`Failed to load notice image: ${mediaSource}`);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticeBoard;
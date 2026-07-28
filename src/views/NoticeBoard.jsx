// src/views/NoticeBoard.jsx
import React from 'react';

const NoticeBoard = ({ notices = [], events = [] }) => {
  const displayItems = notices.length > 0 ? notices : events;

  return (
    <section id="events" className="py-16 px-6 bg-sky-50/50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-[#00A8E8] font-extrabold text-xs tracking-wider uppercase">Stay Updated</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Notice Board & Events</h2>
        </div>

        {displayItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic">
            No notices or upcoming events at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {item.date && (
                    <span className="inline-block bg-sky-100 text-[#00A8E8] text-[10px] font-bold px-2.5 py-1 rounded-md mb-3">
                      📅 {item.date}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{item.title || item.name}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {item.description || item.details || item.subtitle || item.content}
                  </p>
                </div>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="mt-4 w-full h-40 object-cover rounded-xl border border-gray-100" 
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticeBoard;
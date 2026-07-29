// src/views/Gallery.jsx (or src/components/Gallery.jsx)
import React from 'react';

// Static fallback array for Gallery module
const FALLBACK_GALLERY = [
  {
    id: 'static-1',
    title: 'Worship Service',
    image: '/gallery/worship.jpg',
    url: '/gallery/worship.jpg',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'static-2',
    title: 'Sunday Celebration',
    image: '/gallery/choir.jpg',
    url: '/gallery/choir.jpg',
    date: new Date().toISOString().split('T')[0]
  }
];

const Gallery = ({ items = [], gallery = [], images = [] }) => {
  // 1. Prioritize props passed down from App.jsx, otherwise fallback
  const passedItems = items.length > 0 ? items : gallery.length > 0 ? gallery : images;
  const activeItems = passedItems.length > 0 ? passedItems : FALLBACK_GALLERY;

  return (
    <section id="gallery" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-[#00A8E8] font-extrabold text-xs tracking-wider uppercase">Photo Highlights</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Church Gallery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeItems.map((item, idx) => {
            const imageSrc = item.image || item.url;
            return (
              <div 
                key={item.id || idx} 
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={item.title || 'Gallery image'} 
                    className="w-full h-48 object-cover rounded-xl border border-gray-100"
                    onError={(e) => {
                      console.error("Image failed to load:", imageSrc);
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs italic">
                    No image available
                  </div>
                )}
                {item.title && (
                  <h4 className="mt-3 font-bold text-gray-800 text-base">{item.title}</h4>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
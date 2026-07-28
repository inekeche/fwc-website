// src/views/Gallery.jsx
import React from 'react';

const Gallery = ({ items = [], gallery = [], images = [] }) => {
  const displayGallery = items.length > 0 ? items : gallery.length > 0 ? gallery : images;

  return (
    <section id="gallery" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-[#7E57C2] font-extrabold text-xs tracking-wider uppercase">Our Community</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Photo Gallery</h2>
        </div>

        {displayGallery.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic">
            No gallery photos uploaded yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGallery.map((item) => {
              const imgSrc = item.image || item.imageUrl || item.src || item.url;
              return (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  {imgSrc ? (
                    <img 
                      src={imgSrc} 
                      alt={item.title || item.name || 'Gallery item'} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                    <h4 className="font-bold text-sm">{item.title || item.name}</h4>
                    {item.subtitle && <p className="text-xs text-gray-200">{item.subtitle}</p>}
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

export default Gallery;
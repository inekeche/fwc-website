// src/components/Lightbox.jsx
import React from 'react';

const Lightbox = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-all duration-300">
      {/* Close button overlay area */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Content Container */}
      <div className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-church-sky text-3xl font-bold transition-colors focus:outline-none"
        >
          ✕
        </button>
        
        {/* Expanded Image */}
        <img 
          src={image.src} 
          alt={image.caption} 
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
        />
        
        {/* Soft Accent Caption */}
        <div className="mt-4 text-center max-w-xl">
          <span className="bg-church-sky/20 text-church-sky text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {image.category}
          </span>
          <p className="text-white text-lg font-medium mt-2">
            {image.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
// src/views/Gallery.jsx
import React, { useState, useEffect } from 'react';

const defaultPhotos = [
  {
    id: 1,
    title: "Sunday Worship Service",
    category: "Worship",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Youth Fellowship Gathering",
    category: "Youth",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
  }
];

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Gallery = () => {
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('fwc_gallery_photos');
    return saved ? JSON.parse(saved) : defaultPhotos;
  });

  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Worship');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('fwc_gallery_photos', JSON.stringify(photos));
  }, [photos]);

  const handleOpenAddModal = () => {
    setEditingPhoto(null);
    setTitle('');
    setCategory('Worship');
    setImageUrl('');
    setImageFile(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (photo) => {
    setEditingPhoto(photo);
    setTitle(photo.title);
    setCategory(photo.category);
    setImageUrl(photo.image.startsWith('data:') ? '' : photo.image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let finalImage = imageUrl;

    if (imageFile) {
      try {
        finalImage = await convertFileToBase64(imageFile);
      } catch (err) {
        console.error("Image conversion failed", err);
        alert("Failed to process photo file.");
        return;
      }
    }

    if (!finalImage && editingPhoto) {
      finalImage = editingPhoto.image;
    } else if (!finalImage) {
      finalImage = "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600";
    }

    if (editingPhoto) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editingPhoto.id
            ? { ...p, title: title || "FWC Event Photo", category, image: finalImage }
            : p
        )
      );
    } else {
      const newPhoto = {
        id: Date.now(),
        title: title || "FWC Event Photo",
        category,
        image: finalImage
      };
      setPhotos((prev) => [newPhoto, ...prev]);
    }

    setShowModal(false);
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm("Delete this photo from the gallery?")) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const categories = ['All', 'Worship', 'Youth', 'Outreach', 'Events'];

  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="gallery" className="py-20 px-6 bg-sky-50/50">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[#00A8E8] font-bold text-sm tracking-widest uppercase">Moments & Memories</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Photo Gallery</h2>
          <div className="w-16 h-1 bg-[#7E57C2] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#00A8E8] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-[#00A8E8] hover:bg-[#0091c7] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>📷</span> Upload Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64">
              <img 
                src={photo.image} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A8E8] bg-white/90 px-2 py-0.5 rounded-md w-fit mb-1">
                  {photo.category}
                </span>
                <h4 className="text-white font-bold text-sm">{photo.title}</h4>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleOpenEditModal(photo)}
                  className="bg-white/90 hover:bg-white text-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-sm"
                  title="Edit Photo"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="bg-red-600/90 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-sm"
                  title="Remove Photo"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {editingPhoto ? "Edit Gallery Photo" : "Upload Gallery Photo"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunday Worship Highlights"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                >
                  <option value="Worship">Worship</option>
                  <option value="Youth">Youth</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Replace Photo File</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-[#00A8E8] cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-gray-400 font-bold">OR</div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Photo URL</label>
                <input 
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A8E8] hover:bg-[#0091c7] text-white py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer mt-2"
              >
                {editingPhoto ? "Save Changes" : "Save Photo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
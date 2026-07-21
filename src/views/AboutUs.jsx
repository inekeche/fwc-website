// src/views/AboutUs.jsx
import React, { useState, useEffect } from 'react';

const defaultPastors = [
  {
    id: 1,
    name: "Rev. Dr. Felix Ineke",
    role: "Senior Pastor",
    bio: "Leading Family Worship Center with a passion for spiritual growth, divine wisdom, and community transformation.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
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

const AboutUs = () => {
  const [pastors, setPastors] = useState(() => {
    const saved = localStorage.getItem('fwc_pastors_data');
    return saved ? JSON.parse(saved) : defaultPastors;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingPastor, setEditingPastor] = useState(null); // Tracks item being edited

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('fwc_pastors_data', JSON.stringify(pastors));
  }, [pastors]);

  // Open modal for NEW pastor
  const handleOpenAddModal = () => {
    setEditingPastor(null);
    setName('');
    setRole('');
    setBio('');
    setImageUrl('');
    setImageFile(null);
    setShowModal(true);
  };

  // Open modal for EDITING pastor
  const handleOpenEditModal = (pastor) => {
    setEditingPastor(pastor);
    setName(pastor.name);
    setRole(pastor.role);
    setBio(pastor.bio || '');
    setImageUrl(pastor.image.startsWith('data:') ? '' : pastor.image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name || !role) {
      alert("Please fill in both Name and Role.");
      return;
    }

    let finalImage = imageUrl;

    if (imageFile) {
      try {
        finalImage = await convertFileToBase64(imageFile);
      } catch (err) {
        console.error("Image conversion failed", err);
        alert("Failed to process image file.");
        return;
      }
    }

    // Retain existing image if editing and no new image/URL provided
    if (!finalImage && editingPastor) {
      finalImage = editingPastor.image;
    } else if (!finalImage) {
      finalImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
    }

    if (editingPastor) {
      // Update existing
      setPastors((prev) =>
        prev.map((p) =>
          p.id === editingPastor.id
            ? { ...p, name, role, bio, image: finalImage }
            : p
        )
      );
    } else {
      // Add new
      const newPastor = {
        id: Date.now(),
        name,
        role,
        bio,
        image: finalImage
      };
      setPastors((prev) => [newPastor, ...prev]);
    }

    setShowModal(false);
  };

  const handleDeletePastor = (id) => {
    if (window.confirm("Are you sure you want to remove this pastor profile?")) {
      setPastors((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <section id="about" className="py-20 px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[#7E57C2] font-bold text-sm tracking-widest uppercase">About FWC</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Who We Are</h2>
          <div className="w-16 h-1 bg-[#00A8E8] mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 mt-4 leading-relaxed text-sm md:text-base">
            Family Worship Center, Church of God Mission International (Creation Palace) is a vibrant home built on faith, fellowship, and relentless pursuit of spiritual excellence.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-sky-50/60 p-8 rounded-3xl border border-sky-100 shadow-sm">
            <div className="w-12 h-12 bg-[#00A8E8] text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To raise a purpose-driven generation aimed at greatness, rooted in God's Word, and equipped to influence every sector of society with divine grace.
            </p>
          </div>

          <div className="bg-purple-50/60 p-8 rounded-3xl border border-purple-100 shadow-sm">
            <div className="w-12 h-12 bg-[#7E57C2] text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fostering deep spiritual worship, genuine community fellowship, and systematic teaching of the Word to empower believers in their daily walk.
            </p>
          </div>
        </div>

        {/* Pastoral Leadership */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-xs font-bold text-[#00A8E8] uppercase tracking-wider">Leadership</span>
              <h3 className="text-2xl font-bold text-gray-900">Our Pastoral Team</h3>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-[#7E57C2] hover:bg-[#6c48ab] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>➕</span> Add Pastor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor) => (
              <div key={pastor.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                
                {/* Action Buttons: Edit & Delete */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => handleOpenEditModal(pastor)}
                    title="Edit Pastor Profile"
                    className="bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeletePastor(pastor.id)}
                    title="Remove Pastor"
                    className="bg-red-600/90 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={pastor.image} 
                    alt={pastor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A8E8]">{pastor.role}</span>
                    <h4 className="text-lg font-bold text-gray-900">{pastor.name}</h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{pastor.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal (Handles Add and Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#7E57C2]">Leadership</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {editingPastor ? "Edit Pastor Profile" : "Add Pastoral Leader"}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rev. Dr. Felix Ineke"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role / Position</label>
                <input 
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Resident Pastor"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                />
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
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input 
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Biography</label>
                <textarea 
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter a brief background or bio..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A8E8] hover:bg-[#0091c7] text-white py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer mt-2"
              >
                {editingPastor ? "Save Changes" : "Save Pastor Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;
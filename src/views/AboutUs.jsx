// src/views/AboutUs.jsx
import React from 'react';

const AboutUs = ({ leaders = [] }) => {
  return (
    <section id="about" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl border-b border-gray-100 pb-6">
          <span className="text-[#7E57C2] font-extrabold text-xs tracking-wider uppercase">Who We Are</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">About Family Worship Center</h2>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            Family Worship Center is a vibrant branch of Church of God Mission International (Creation Palace). We are committed to building a loving community driven by unwavering faith, divine worship, and holistic spiritual growth.
          </p>
        </div>

        {/* Leadership Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Our Leadership</h3>
          {leaders.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No leadership profiles uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => {
                const photo = leader.image || leader.photo || 'https://via.placeholder.com/300';
                const profileDesc = leader.profile || leader.bio;

                return (
                  <div key={leader.id} className="bg-sky-50/40 rounded-2xl p-6 border border-sky-100 flex flex-col items-center text-center shadow-sm">
                    <img 
                      src={photo} 
                      alt={leader.name || leader.title} 
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-4"
                    />
                    <h4 className="font-bold text-lg text-gray-900">{leader.name || leader.title}</h4>
                    <span className="text-xs font-bold text-[#00A8E8] uppercase tracking-wider mt-0.5">{leader.role || leader.subtitle}</span>
                    
                    {profileDesc && (
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed border-t border-sky-100/80 pt-3">
                        {profileDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
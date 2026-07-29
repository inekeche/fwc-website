// src/views/AboutUs.jsx
import React from 'react';

// Static fallback data from codebase
const STATIC_LEADERSHIP_FALLBACK = [
  {
    id: 'default-leader-1',
    name: 'Rev. Dr. Felix Ineke',
    role: 'Lead Pastor',
    profile: 'Leading Family Worship Center with faith, vision, and a dedication to spiritual growth.',
    image: '/leadership/pastor.jpg'
  }
];

const AboutUs = ({ leaders: propsLeaders = [] }) => {
  // 1. Prioritize props if passed directly, otherwise fallback to static data
  const leadersList = propsLeaders && propsLeaders.length > 0 
    ? propsLeaders 
    : STATIC_LEADERSHIP_FALLBACK;

  return (
    <section id="about" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Who We Are Header */}
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

          {leadersList.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No leadership profiles uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadersList.map((leader, idx) => {
                const photo = leader.image || leader.url || leader.photo || '/leadership/pastor.jpg';
                const profileDesc = leader.profile || leader.bio || leader.details || leader.description;
                const leaderName = leader.name || leader.title;
                const leaderRole = leader.role || leader.speaker || leader.subtitle;

                return (
                  <div 
                    key={leader.id || idx} 
                    className="bg-sky-50/40 rounded-2xl p-6 border border-sky-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Bolder & Larger Image Container */}
                    <img 
                      src={photo} 
                      alt={leaderName} 
                      className="w-40 h-40 md:w-44 md:h-44 rounded-full object-cover border-8 border-white shadow-lg mb-4 ring-1 ring-sky-100"
                      onError={(e) => {
                        console.error(`Failed to load leader image path: ${photo}`);
                      }}
                    />
                    <h4 className="font-bold text-xl text-gray-900">{leaderName}</h4>
                    <span className="text-xs font-extrabold text-[#00A8E8] uppercase tracking-wider mt-1">
                      {leaderRole}
                    </span>
                    
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
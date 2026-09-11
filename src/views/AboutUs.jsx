// src/views/AboutUs.jsx
import React, { useState } from 'react';

const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (baseUrl !== '/' && path.startsWith(baseUrl)) {
    return path;
  }
  
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
};

const STATIC_LEADERSHIP_FALLBACK = [
  {
    id: 'default-leader-1',
    name: 'Rev. Nath McAbraham-Inajoh',
    role: 'PRESIDING PASTOR',
    profile: 'Leading Family Worship Center with passion and vision.',
    image: 'leadership/pastor.jpg'
  },
  {
    id: 'default-leader-2',
    name: 'Rev. Dorothy McAbraham-Inajoh',
    role: 'ASSOCIATE PASTOR ADMIN',
    profile: 'Serving and supporting the spiritual growth and ministry of Family Worship Center.',
    image: 'leadership/ccd.jpg'
  },
  {
    id: 'default-leader-3',
    name: 'Rev. Patrick Ogbu',
    role: 'ASSOCIATE PASTOR GROUPS',
    profile: 'Serving and supporting the spiritual growth and ministry of Family Worship Center.',
    image: 'leadership/pastor2.jpg'
  }
];

const AboutUs = ({ leaders: propsLeaders = [] }) => {
  const leadersList = propsLeaders && propsLeaders.length > 0 
    ? propsLeaders 
    : STATIC_LEADERSHIP_FALLBACK;

  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="about" className="py-16 px-6 bg-white">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl border-b border-gray-100 pb-6">
          <span className="text-[#7E57C2] font-extrabold text-xs tracking-wider uppercase">Who We Are</span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">About Family Worship Center</h2>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            Family Worship Center is a vibrant branch of Church of God Mission International (Creation Palace). We are committed to building a loving community driven by unwavering faith, divine worship, and holistic spiritual growth.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Our Leadership</h3>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              💡 Click any card to flip and view details
            </span>
          </div>

          {leadersList.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No leadership profiles uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadersList.map((leader, idx) => {
                const rawPhoto = leader.image || leader.url || leader.photo || 'leadership/pastor.jpg';
                const photo = resolveAssetUrl(rawPhoto);
                const profileDesc = leader.profile || leader.bio || leader.details || leader.description;
                const leaderName = leader.name || leader.title;
                const leaderRole = leader.role || leader.speaker || leader.subtitle;
                const isFlipped = !!flippedCards[idx];

                return (
                  <div
                    key={leader.id || idx}
                    className="perspective-1000 h-[380px] w-full cursor-pointer"
                    onClick={() => toggleFlip(idx)}
                  >
                    <div
                      className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* FRONT CARD */}
                      <div className="absolute inset-0 w-full h-full bg-sky-50/40 rounded-2xl p-6 border border-sky-100 flex flex-col items-center text-center shadow-sm hover:shadow-md backface-hidden">
                        <img
                          src={photo}
                          alt={leaderName}
                          className="w-40 h-40 md:w-44 md:h-44 rounded-full object-cover object-top border-8 border-white shadow-lg mb-4 ring-1 ring-sky-100"
                          onError={(e) => {
                            console.error(`Failed to load leader image path: ${photo}`);
                          }}
                        />
                        <h4 className="font-bold text-xl text-gray-900">{leaderName}</h4>
                        <span className="text-xs font-extrabold text-[#00A8E8] uppercase tracking-wider mt-1">
                          {leaderRole}
                        </span>
                        {profileDesc && (
                          <p className="text-xs text-gray-600 mt-3 leading-relaxed border-t border-sky-100/80 pt-3 line-clamp-2">
                            {profileDesc}
                          </p>
                        )}
                      </div>

                      {/* BACK CARD */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 via-sky-600 to-blue-700 text-white rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-md rotate-y-180 backface-hidden">
                        <div className="w-full">
                          <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full inline-block mt-2">
                            LEADERSHIP PROFILE
                          </span>
                          <h4 className="font-bold text-xl mt-4">{leaderName}</h4>
                          <p className="text-xs text-sky-100 mt-4 leading-relaxed px-2">
                            {profileDesc || 'Dedicated to spiritual leadership, community mentorship, and gospel transformation.'}
                          </p>
                        </div>
                        <span className="text-[10px] text-sky-200 font-semibold tracking-wider">
                          Click to flip back 🔄
                        </span>
                      </div>
                    </div>
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
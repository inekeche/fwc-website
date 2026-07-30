// src/App.jsx
import React, { useState, useEffect } from 'react';
import NoticeBoard from './views/NoticeBoard';
import Gallery from './views/Gallery';
import Sermons from './views/Sermons';
import Contact from './views/Contact';
import AboutUs from './views/AboutUs';
import AdminDashboard from './views/AdminDashboard';
import GiveModal from './components/GiveModal';
import Navbar from './components/Navbar';

const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';

// Dynamically resolve base URL for GitHub Pages deployment
const BASE = import.meta.env.BASE_URL;

// Bump version to v1.0.4 to force-refresh local storage with exact file paths
const APP_VERSION = 'v1.0.4';

// Helper function to resolve paths cleanly across base URLs
const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${cleanPath}`;
};

// Default Media Items
const DEFAULT_MEDIA = [
  {
    id: 'sermon-help-mp4',
    title: 'What will you do with Marvelous Help?',
    speaker: 'Rev. Dr. Nath Mc-Abraham Inajoh',
    type: 'video',
    url: resolveAssetUrl('media/help.mp4'),
    date: '2026-07-29'
  }
];

// Default Gallery Items (Matching your public/gallery folder)
const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    title: 'Sunday Worship Experience',
    category: 'Services',
    url: resolveAssetUrl('gallery/worship.jpg'),
    date: '2026-07-29'
  },
  {
    id: 'gal-2',
    title: 'Choir Ministration',
    category: 'Music',
    url: resolveAssetUrl('gallery/choir.jpg'),
    date: '2026-07-29'
  },
  {
    id: 'gal-3',
    title: 'FWC Community',
    category: 'Events',
    url: resolveAssetUrl('gallery/fwc.jpg'),
    date: '2026-07-29'
  }
];

// Default Leadership Items (Matching public/leadership/pastor.jpg)
const DEFAULT_LEADERS = [
  {
    id: 'lead-1',
    name: 'Rev. Dr. Nath Mc-Abraham Inajoh',
    role: 'Presiding Pastor',
    image: resolveAssetUrl('leadership/pastor.jpg'),
    bio: 'Leading Family Worship Center with passion and vision.'
  },

  {
    id: 'lead-2',
    name: 'Rev. Dorathy Inajoh',
    role: 'Associate Pastor',
    image: resolveAssetUrl('leadership/ccd.jpg'),
    bio: 'Serving and supporting the spiritual growth and ministry of Family Worship Center.'
  }
];


function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-clear stale LocalStorage whenever APP_VERSION changes
  useEffect(() => {
    const savedVersion = localStorage.getItem('fwc_app_version');
    if (savedVersion !== APP_VERSION) {
      localStorage.removeItem('fwc_media');
      localStorage.removeItem('fwc_notices');
      localStorage.removeItem('fwc_gallery');
      localStorage.removeItem('fwc_leaders');
      localStorage.setItem('fwc_app_version', APP_VERSION);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (!ENABLE_ADMIN) return;
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('Admin') || params.get('admin');
    if (adminParam === 'true') {
      setIsAdminView(true);
    }
  }, []);

  // Safe LocalStorage Initializer with dynamic fallback defaults
  const [mediaItems, setMediaItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fwc_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_MEDIA;
    } catch (e) {
      return DEFAULT_MEDIA;
    }
  });

  const [noticeItems, setNoticeItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fwc_notices');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fwc_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_GALLERY;
    } catch (e) {
      return DEFAULT_GALLERY;
    }
  });

  const [leaders, setLeaders] = useState(() => {
    try {
      const saved = localStorage.getItem('fwc_leaders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_LEADERS;
    } catch (e) {
      return DEFAULT_LEADERS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fwc_media', JSON.stringify(mediaItems));
    } catch (e) {
      console.warn("Storage limit reached for media.");
    }
  }, [mediaItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fwc_notices', JSON.stringify(noticeItems));
    } catch (e) {
      console.warn("Storage limit reached for notices.");
    }
  }, [noticeItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fwc_gallery', JSON.stringify(galleryItems));
    } catch (e) {
      console.warn("Storage limit reached for gallery.");
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fwc_leaders', JSON.stringify(leaders));
    } catch (e) {
      console.warn("Storage limit reached for leaders.");
    }
  }, [leaders]);

  // Dynamic Header Phrases
  const dynamicPhrases = [
    { sky: "Aimed @Greatness,", purple: "Deeper Spiritual Word & Worship" },
    { sky: "Built on Love,", purple: "Unwavering Faith & Fellowship" },
    { sky: "Driven by Grace,", purple: "Transforming Lives Daily" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActivePhraseIndex((prev) => (prev + 1) % dynamicPhrases.length);
        setIsTransitioning(false);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [dynamicPhrases.length]);

  useEffect(() => {
    if (!ENABLE_ADMIN) return;
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminView((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSaveMedia = (item) => {
    setMediaItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
  };

  const handleSaveNotice = (item) => {
    setNoticeItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
  };

  const handleSaveGallery = (item) => {
    setGalleryItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
  };

  const handleSaveLeader = (item) => {
    setLeaders((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
  };

  const handleDeleteMedia = (id) => setMediaItems((prev) => prev.filter((i) => i.id !== id));
  const handleDeleteNotice = (id) => setNoticeItems((prev) => prev.filter((i) => i.id !== id));
  const handleDeleteGallery = (id) => setGalleryItems((prev) => prev.filter((i) => i.id !== id));
  const handleDeleteLeader = (id) => setLeaders((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-gray-800 antialiased scroll-smooth">
      <Navbar 
        onOpenGiveModal={() => setIsGiveModalOpen(true)} 
        isAdminView={isAdminView}
        onToggleAdmin={ENABLE_ADMIN ? () => setIsAdminView((prev) => !prev) : undefined}
        showAdminToggle={ENABLE_ADMIN}
      />

      {ENABLE_ADMIN && isAdminView ? (
        <main className="flex-grow p-4 md:p-8 bg-gray-100">
          <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">FWC Admin Portal</h1>
              <p className="text-xs text-gray-500">Manage notices, media, leadership, and gallery items</p>
            </div>
            <button
              onClick={() => setIsAdminView(false)}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              ← View Public Site
            </button>
          </div>
          <AdminDashboard 
            mediaItems={mediaItems}
            noticeItems={noticeItems}
            galleryItems={galleryItems}
            leaders={leaders}
            onSaveMedia={handleSaveMedia}
            onSaveNotice={handleSaveNotice}
            onSaveGallery={handleSaveGallery}
            onSaveLeader={handleSaveLeader}
            onDeleteMedia={handleDeleteMedia}
            onDeleteNotice={handleDeleteNotice}
            onDeleteGallery={handleDeleteGallery}
            onDeleteLeader={handleDeleteLeader}
          />
        </main>
      ) : (
        <main className="flex-grow">
          <section id="home" className="py-20 px-6 text-center overflow-hidden">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block bg-white/80 text-[#7E57C2] text-sm font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/40 shadow-sm animate-pulse">
                ✨ Welcome to Family Worship Center, Church of God Mission Int'l
              </span>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 tracking-tight leading-tight min-h-[140px] md:min-h-[120px]">
                <span className="block mb-2 text-gray-900">Creation Palace,</span>
                <span className={`inline-block transition-all duration-300 transform ${
                  isTransitioning ? 'opacity-0 scale-95 translate-y-2 blur-sm' : 'opacity-100 scale-100 translate-y-0'
                }`}>
                  <span className="text-[#00A8E8] block md:inline md:mr-2">
                    {dynamicPhrases[activePhraseIndex].sky}
                  </span>
                  <span className="text-[#7E57C2] block md:inline">
                    {dynamicPhrases[activePhraseIndex].purple}
                  </span>
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 mt-4 max-w-xl mx-auto">
                Join us this Sunday as we grow together in faith, community, and purpose.
              </p>
              
              <div className="mt-8 flex justify-center gap-4">
                <a href="#media" className="inline-block bg-[#00A8E8] hover:bg-[#0086ba] text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md">
                  Watch Services
                </a>
                <button onClick={() => setIsGiveModalOpen(true)} className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-full shadow-sm border border-gray-200 transition-all cursor-pointer">
                  Give / Partner (₦)
                </button>
              </div>
            </div>
          </section>

          <AboutUs leaders={leaders} />
          <NoticeBoard notices={noticeItems} events={noticeItems} />
          <Gallery items={galleryItems} gallery={galleryItems} images={galleryItems} />
          <Sermons sermons={mediaItems} media={mediaItems} />
          <Contact />
        </main>
      )}

      <footer id="connect" className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-800">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00A8E8] text-white rounded-full flex items-center justify-center font-bold">†</div>
              <span className="font-bold text-xl text-white tracking-tight">FWC Church</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Family Worship Center, Church of God Mission International. Join us in worship as we aim for greatness through faith and divine community.
            </p>
            <p className="text-sm text-gray-400 max-w-sm">
              14, Alhaji Lookman Atogbajeun, Chivita Link Rd, Ajao-Estate, Lagos State, Nigeria.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold tracking-wider text-sm uppercase">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#home" className="hover:text-[#00A8E8]">Home</a>
              <a href="#about" className="hover:text-[#00A8E8]">About Us</a>
              <a href="#media" className="hover:text-[#00A8E8]">Sermon Media</a>
              <a href="#events" className="hover:text-[#00A8E8]">Upcoming Events</a>
              <a href="#contact" className="hover:text-[#00A8E8]">Get in Touch</a>
              <button onClick={() => setIsGiveModalOpen(true)} className="text-left hover:text-[#00A8E8] cursor-pointer">Give (₦)</button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold tracking-wider text-sm uppercase">Connect With Us</h4>
            <div className="flex items-center space-x-4 pt-1">
              <a href="https://www.facebook.com/familyworshipcenterng" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#1877F2] text-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://www.instagram.com/familyworshipcentreng/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#ee2a7b] text-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@cgm-familyworshipcentre" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#FF0000] text-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163s-.233-1.64-.946-2.363c-.902-.947-1.914-.952-2.378-1.007C16.862 2.5 12 2.5 12 2.5s-4.862 0-8.174.293c-.464.055-1.476.06-2.378 1.007-.713.723-.946 2.363-.946 2.363S.22 8.127.22 10.091v1.818c0 1.964.282 3.928.282 3.928s.233 1.64.946 2.363c.902.947 2.083.917 2.61.1.815.11 8.162.29 8.162.29s4.87-.003 8.183-.296c.464-.055 1.476-.06 2.378-1.007.713-.723.946-2.363.946-2.363s.282-1.964.282-3.928V10.09c0-1.964-.282-3.928-.282-3.928zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://wa.me/2348137036660" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#25D366] text-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.125.952 11.999.951c-5.441 0-9.866 4.372-9.87 9.802 0 1.714.462 3.393 1.337 4.888l-1.03 3.766 3.868-1.001c1.424.811 2.919 1.24 4.503 1.241z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-gray-500">
          <p>FWC-CopyRight@2026, WebApp by inekeonubifelix@gmail.com (Presidoo)</p>
        </div>
      </footer>

      <GiveModal isOpen={isGiveModalOpen} onClose={() => setIsGiveModalOpen(false)} />
    </div>
  );
}

export default App;
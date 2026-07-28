// src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = ({ onOpenGiveModal, isAdminView, onToggleAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#home" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#00A8E8] text-white rounded-full flex items-center justify-center font-extrabold text-xl shadow-sm">
            †
          </div>
          <div>
            <span className="font-extrabold text-lg text-gray-900 tracking-tight block leading-none">
              FWC Church
            </span>
            <span className="text-[10px] text-[#7E57C2] font-bold tracking-wider uppercase">
              CGMi Creation Palace
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-700">
          <a href="#home" className="hover:text-[#00A8E8] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#00A8E8] transition-colors">About Us</a>
          <a href="#events" className="hover:text-[#00A8E8] transition-colors">Notices</a>
          <a href="#gallery" className="hover:text-[#00A8E8] transition-colors">Gallery</a>
          <a href="#media" className="hover:text-[#00A8E8] transition-colors">Sermons</a>
          <a href="#contact" className="hover:text-[#00A8E8] transition-colors">Contact</a>
        </nav>

        {/* Action Buttons & Admin Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Admin Switch Button */}
          <button
            onClick={onToggleAdmin}
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border ${
              isAdminView
                ? 'bg-purple-100 text-[#7E57C2] border-purple-300 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
            title="Toggle Admin Mode (or press Ctrl + Shift + A)"
          >
            {isAdminView ? '🌐 View Public Site' : '🔒 Admin Portal'}
          </button>

          {/* Give Button */}
          <button
            onClick={onOpenGiveModal}
            className="bg-[#7E57C2] hover:bg-[#6c48ab] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            Give / Partner (₦)
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onToggleAdmin}
            className="text-xs font-bold px-2 py-1.5 rounded-lg bg-gray-100 text-gray-700"
          >
            {isAdminView ? 'Site' : 'Admin'}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 font-bold text-sm text-gray-700">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">Home</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">About Us</a>
          <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">Notices</a>
          <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">Gallery</a>
          <a href="#media" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">Sermons</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-[#00A8E8]">Contact</a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenGiveModal();
            }}
            className="w-full text-left text-[#7E57C2]"
          >
            Give / Partner (₦)
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
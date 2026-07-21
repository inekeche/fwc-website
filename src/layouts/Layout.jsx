// src/layouts/Layout.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-church-bg text-gray-800 antialiased">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>© 2026 FWC Church. Built with 🤍</p>
      </footer>
    </div>
  );
};

export default Layout;
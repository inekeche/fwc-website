// src/views/Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  // Newsletter State
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Prayer & Testimony Form State
  const [prayerForm, setPrayerForm] = useState({
    fullName: '',
    phoneOrEmail: '',
    type: 'Prayer Request', // Default choice
    message: ''
  });
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (prayerForm.fullName && prayerForm.message) {
      setPrayerSubmitted(true);
      setPrayerForm({ fullName: '', phoneOrEmail: '', type: 'Prayer Request', message: '' });
      setTimeout(() => setPrayerSubmitted(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-sky-50/60 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#7E57C2] font-bold text-sm tracking-widest uppercase">Connect & Visit</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Get in Touch</h2>
          <div className="w-16 h-1 bg-[#00A8E8] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* 1. Location Box */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#00A8E8] uppercase tracking-wider">Our Location</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Family of Greatness</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Family Worship Center, Church of God Mission International.<br />
                  14, Alhaji Lookman Atogbajeun, Chivita Link Rd, Ajao-Estate.<br />
                  Lagos State, Nigeria.<br />
                  We invite you to join our vibrant family for service.
                </p>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone & WhatsApp</span>
                  <a href="tel:08137036660" className="text-base font-bold text-[#00A8E8] hover:underline">
                    08137036660
                  </a>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-semibold text-gray-800">
                    info@fwcchurch.org
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Prayers and Testimonies Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-[#7E57C2] uppercase tracking-wider">Reach Out To Us</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">For Prayers and Testimonies</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Share your prayer requests or glorify God with your testimony. Our team is standing by to pray with you.
              </p>

              {prayerSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-700 text-sm font-bold">
                  🙏 Amen! Your request/testimony has been received. God bless you!
                </div>
              ) : (
                <form onSubmit={handlePrayerSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={prayerForm.fullName}
                      onChange={(e) => setPrayerForm({ ...prayerForm, fullName: e.target.value })}
                      placeholder="e.g. Felix Ineke"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm"
                    />
                  </div>

                  {/* Phone / Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number or Email</label>
                    <input 
                      type="text"
                      required
                      value={prayerForm.phoneOrEmail}
                      onChange={(e) => setPrayerForm({ ...prayerForm, phoneOrEmail: e.target.value })}
                      placeholder="e.g. 08137036660 or name@domain.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm"
                    />
                  </div>

                  {/* Type Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subject</label>
                    <select
                      value={prayerForm.type}
                      onChange={(e) => setPrayerForm({ ...prayerForm, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm text-gray-800"
                    >
                      <option value="Prayer Request">Prayer Request</option>
                      <option value="Testimony">Testimony</option>
                      <option value="Counseling">Pastoral Counseling</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Message / Prayer Request</label>
                    <textarea 
                      required
                      rows="3"
                      value={prayerForm.message}
                      onChange={(e) => setPrayerForm({ ...prayerForm, message: e.target.value })}
                      placeholder="Write your prayer request or testimony here..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#7E57C2] hover:bg-[#6c48ab] text-white py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer"
                  >
                    Send Request / Testimony
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* 1. Worship Experience Schedule */}
            <div className="bg-[#7E57C2] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-200">Weekly Services</span>
                <h3 className="text-2xl font-bold mt-1">Worship Experience</h3>
                
                <ul className="mt-6 space-y-4 text-sm">
                  <li className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span className="font-semibold">Sunday Service (Celebration Service)</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">8:30 AM</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span className="font-semibold">Wednesday Mid-Week Service</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">6:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-semibold">Monday / Prayer Meeting</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">6:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. Subscribe to Newsletter */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-[#7E57C2] uppercase tracking-wider">Stay Connected</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Subscribe to Newsletter</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Receive weekly sermon notes, prayer requests, and event updates directly to your inbox.
              </p>

              {subscribed ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-700 text-sm font-bold">
                  🎉 Thank you for subscribing to FWC Updates!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#00A8E8] hover:bg-[#0091c7] text-white py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
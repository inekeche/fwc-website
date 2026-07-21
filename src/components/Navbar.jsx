// src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("card"); // "card" or "transfer"
  const [selectedCategory, setSelectedCategory] = useState("Tithe");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Dynamic logo path for GitHub Pages subpath compatibility
  const logoPath = `${import.meta.env.BASE_URL}fwc.jpg`;

  // Paystack Configuration
  const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"; // 👈 Insert your Paystack Public Key here
  const PAYSTACK_PAGE_URL = "https://paystack.com/pay/cgmajao"; // 👈 Or paste your Paystack Page link here

  const zenithBankDetails = {
    bank: "Zenith Bank",
    accountName: "Church of God Mission, Ajao, Estate",
    accountNumber: "1012726786",
  };

  const givingTypes = [
    "Tithe",
    "Sunday Offering",
    "Building Fund",
    "Welfare & Benevolence",
    "Special Seed",
    "First Fruit",
    "Media & Tech Support"
  ];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(zenithBankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Paystack Inline Popup Handler
  const handlePaystackPayment = (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Check if Paystack JS script is loaded
    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email || "member@cgmajao.org",
        amount: Number(amount) * 100, // Amount in kobo
        currency: "NGN",
        metadata: {
          custom_fields: [
            {
              display_name: "Giving Category",
              variable_name: "giving_category",
              value: selectedCategory
            }
          ]
        },
        callback: function (response) {
          alert(`Thank you! Payment successful. Reference: ${response.reference}`);
          setIsGiveModalOpen(false);
        },
        onClose: function () {
          alert("Transaction cancelled.");
        }
      });
      handler.openIframe();
    } else {
      // Fallback to Paystack Custom Link if Inline JS isn't initialized
      window.open(PAYSTACK_PAGE_URL, "_blank");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src={logoPath} 
              alt="Family Worship Center Logo" 
              className="h-12 w-12 object-contain rounded-xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg text-gray-900 leading-tight group-hover:text-[#00A8E8] transition-colors">
                Family Worship Center
              </span>
              <span className="text-[10px] font-bold text-[#7E57C2] tracking-wider uppercase">
                Creation Palace
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <a href="#about" className="hover:text-[#00A8E8] transition-colors">About Us</a>
            <a href="#media" className="hover:text-[#00A8E8] transition-colors">Sermons & Media</a>
            <a href="#gallery" className="hover:text-[#00A8E8] transition-colors">Photo Gallery</a>
            <a href="#contact" className="hover:text-[#00A8E8] transition-colors">Contact</a>
            
            {/* Single Give Menu Button */}
            <button 
              onClick={() => setIsGiveModalOpen(true)} 
              className="hover:text-[#00A8E8] transition-colors font-bold text-[#7E57C2] flex items-center gap-1 cursor-pointer"
            >
              Give 🎁
            </button>
          </div>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="#contact"
              className="bg-[#00A8E8] hover:bg-[#0091c7] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all inline-block"
            >
              Join Us This Sunday
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none text-2xl"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3">
            <a 
              href="#about" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-[#00A8E8]"
            >
              About Us
            </a>
            <a 
              href="#media" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-[#00A8E8]"
            >
              Sermons & Media
            </a>
            <a 
              href="#gallery" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-[#00A8E8]"
            >
              Photo Gallery
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-[#00A8E8]"
            >
              Contact
            </a>
            <button 
              onClick={() => { setIsMenuOpen(false); setIsGiveModalOpen(true); }}
              className="block w-full text-left text-sm font-bold text-[#7E57C2] py-1"
            >
              Give & Tithes 🎁
            </button>
            <a 
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center bg-[#00A8E8] text-white text-xs font-bold py-2.5 rounded-xl shadow-md mt-2"
            >
              Join Us This Sunday
            </a>
          </div>
        )}
      </nav>

      {/* Give Modal */}
      {isGiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Giving & Tithes</h3>
                <p className="text-xs text-[#7E57C2] font-semibold">Support Kingdom Ministry</p>
              </div>
              <button 
                onClick={() => setIsGiveModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Giving Category Selector */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Giving Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-[#7E57C2] focus:outline-none font-semibold"
              >
                {givingTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Tabs: Online vs Bank Transfer */}
            <div className="flex bg-gray-100 p-1 rounded-xl mt-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab("card")}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === "card"
                    ? "bg-white text-[#00A8E8] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                💳 Pay Online (ATM / Paystack)
              </button>
              <button
                onClick={() => setActiveTab("transfer")}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === "transfer"
                    ? "bg-white text-[#7E57C2] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                🏛️ Bank Transfer
              </button>
            </div>

            {/* Tab 1: Paystack / Card Payment */}
            {activeTab === "card" && (
              <form onSubmit={handlePaystackPayment} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm font-extrabold text-gray-900 focus:ring-2 focus:ring-[#00A8E8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address (Optional for receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#00A8E8] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00C3F7] hover:bg-[#00b0df] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
                >
                  🔒 Pay ₦{amount ? Number(amount).toLocaleString() : "0"} with Paystack
                </button>
                
                <p className="text-[10px] text-center text-gray-400">
                  Supports ATM Debit Cards, USSD, Apple Pay & Bank Transfer
                </p>
              </form>
            )}

            {/* Tab 2: Bank Transfer Details */}
            {activeTab === "transfer" && (
              <div className="mt-4 space-y-3">
                <div className="bg-gradient-to-br from-purple-50 to-sky-50 border border-purple-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-[#7E57C2] tracking-wider">
                      Official Account Details
                    </span>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      {zenithBankDetails.bank}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Account Name</div>
                  <div className="text-sm font-extrabold text-gray-900 mb-2">
                    {zenithBankDetails.accountName}
                  </div>

                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Account Number</div>
                  <div className="flex justify-between items-center bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-sm mt-1">
                    <span className="font-mono text-xl font-extrabold text-gray-900 tracking-wider">
                      {zenithBankDetails.accountNumber}
                    </span>
                    <button 
                      onClick={handleCopyAccount}
                      className="text-xs font-bold bg-[#7E57C2] hover:bg-[#6a46a8] text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {copied ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900">
                  <span className="font-bold">💡 Transfer Remark:</span> Mention <span className="font-bold underline">"{selectedCategory}"</span> in your bank app memo.
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsGiveModalOpen(false)}
                className="bg-gray-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
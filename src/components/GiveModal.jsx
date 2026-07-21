import React, { useState, useEffect } from 'react';

const GiveModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [givingType, setGivingType] = useState('Offering');
  const [description, setDescription] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Church Direct Account Details
  const bankDetails = {
    bank: "Zenith Bank",
    accountNo: "1012726786",
    accountName: "Church of God Mission Ajao Estate"
  };

  // ⚠️ REPLACE WITH YOUR PAYSTACK PUBLIC KEY FROM YOUR PAYSTACK DASHBOARD
  const paystackPublicKey = "pk_test_your_actual_public_key_here"; 

  useEffect(() => {
    if (isOpen && !window.PaystackPop) {
      const script = document.createElement('script');
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.PaystackPop) {
      setScriptLoaded(true);
    }
  }, [isOpen]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !email || !name || !givingType) {
      alert("Please fill in all required fields to proceed.");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid monetary amount.");
      return;
    }

    if (!scriptLoaded || !window.PaystackPop) {
      alert("Payment gateway is loading, please try again in a moment.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: email,
      amount: parseFloat(amount) * 100, // Converts Naira to Kobo
      currency: "NGN",
      ref: `FWC-${new Date().getTime()}-${Math.floor(Math.random() * 1000000)}`,
      metadata: {
        custom_fields: [
          { display_name: "Donor Name", variable_name: "donor_name", value: name },
          { display_name: "Giving Type", variable_name: "giving_type", value: givingType },
          { display_name: "Payment Description", variable_name: "payment_description", value: description || "No specific description provided" }
        ]
      },
      callback: (response) => {
        alert(`Thank you for your seed! Transaction Reference: ${response.reference}`);
        setAmount('');
        setEmail('');
        setName('');
        setGivingType('Offering');
        setDescription('');
        onClose();
      },
      onClose: () => {
        alert("Transaction cancelled.");
      }
    });

    handler.openIframe();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#7E57C2]">Sowing a Seed</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">Giving & Partnership</h3>
          <p className="text-xs text-gray-500 mt-1">Choose direct bank transfer or instant online card payment</p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DIRECT BANK TRANSFER DETAILS BOX                     */}
        {/* ---------------------------------------------------- */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A8E8] flex items-center gap-1.5">
              <span>🏛️</span> Direct Bank Transfer
            </span>
            {copied && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                Copied to Clipboard!
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-gray-700">
            <p className="flex justify-between">
              <span className="font-semibold text-gray-500">Bank Name:</span>
              <span className="font-bold text-gray-900">{bankDetails.bank}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-gray-500">Account Name:</span>
              <span className="font-bold text-gray-900 text-right">{bankDetails.accountName}</span>
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-sky-200/60 mt-2">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Account Number</span>
                <span className="text-lg font-black text-gray-900 tracking-wider">{bankDetails.accountNo}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="bg-[#00A8E8] hover:bg-[#0091c7] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <span>📋</span> {copied ? "Copied!" : "Copy No."}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase">OR PAY ONLINE WITH PAYSTACK</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* ONLINE PAYMENT FORM                                 */}
        {/* ---------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Felix Ineke"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. example@domain.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Type of Giving</label>
            <select
              value={givingType}
              onChange={(e) => setGivingType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm text-gray-800"
            >
              <option value="Tithes">Tithes</option>
              <option value="Offering">Offering</option>
              <option value="Project">Project / Special Funds</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {givingType === 'Project' ? 'Specify Project Name' : 'Payment Description / Prayer Request'}
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={givingType === 'Project' ? "e.g. Building Fund, Youth Instrument Purchase..." : "e.g. Prayer requests, special thanksgiving message (Optional)"}
              rows="2"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Amount (₦)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
              <input 
                type="number"
                required
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (Min ₦100)"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-sm font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3ecf8e] hover:bg-[#37b87d] text-white py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4"
          >
            <span>Complete Seed Giving</span>
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1 mt-5 text-gray-400 text-[10px]">
          <span>🔒 Secured via</span>
          <span className="font-bold text-gray-500">paystack</span>
        </div>
      </div>
    </div>
  );
};

export default GiveModal;
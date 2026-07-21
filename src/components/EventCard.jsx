// src/components/EventCard.jsx
import React from 'react';

const EventCard = ({ date, month, title, description, onRegister }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      
      {/* Card Body */}
      <div className="p-6 flex-grow">
        
        {/* Sky Blue Date Badge */}
        <div className="inline-flex flex-col items-center justify-center bg-church-skyLight text-church-sky w-14 h-14 rounded-xl font-bold mb-4">
          <span className="text-xs uppercase tracking-wider -mb-1">{month}</span>
          <span className="text-xl">{date}</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-church-sky transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Card Actions Footer */}
      <div className="p-6 pt-0 border-t border-gray-50 flex gap-3 mt-auto">
        {/* Add to Calendar Button */}
        <button className="flex-1 text-center py-2 px-3 border border-gray-200 hover:border-church-sky hover:text-church-sky rounded-lg text-xs font-semibold text-gray-700 transition-colors">
          Add to Calendar
        </button>
        
        {/* Register Button in Light Purple */}
        <button 
          onClick={onRegister}
          className="flex-1 bg-church-purpleLight hover:bg-church-purple text-white text-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default EventCard;
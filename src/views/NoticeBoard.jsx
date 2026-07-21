// src/views/NoticeBoard.jsx
import React from 'react';
import EventCard from '../components/EventCard';

const NoticeBoard = () => {
  // Cleaned up upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      date: '9',
      month: ' Sept',
      title: 'September of Special Services 2026',
      description: 'All Fellowship Groups ministering in turns throughout the month.'
    },
    {
      id: 2,
      date: '29',
      month: 'Nov',
      title: 'Annual Thanksgiving Service',
      description: 'Join us to celebrate God who strengthens us throughout the year.'
    },
    {
      id: 3,
      date: '31',
      month: 'Dec',
      title: 'Cross-Over Night Service',
      description: 'A defining moment to pray and launch into the New Year, 2027.'
    }
  ];

  const handleRegister = (title) => {
    alert(`Registration system coming soon for: ${title}`);
  };

  return (
    <section id="events" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[#7E57C2] font-bold text-sm tracking-widest uppercase">
          Stay Connected
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
          Upcoming Events & Notice Board
        </h2>
        <div className="w-16 h-1 bg-[#00A8E8] mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Responsive 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {upcomingEvents.map((event) => (
          <EventCard
            key={event.id}
            date={event.date}
            month={event.month}
            title={event.title}
            description={event.description}
            onRegister={() => handleRegister(event.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default NoticeBoard;
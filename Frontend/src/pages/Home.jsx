import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  Calendar,
  MapPin,
  Search,
  Clock,
  Ticket,
  Shield,
  Loader,
} from "lucide-react";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400); // 400ms debounce
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/events`, {
        params: { search },
      });

      // Handle different backend response structures safely
      setEvents(
        Array.isArray(data)
          ? data
          : Array.isArray(data.events)
            ? data.events
            : [],
      );
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white rounded-2xl overflow-hidden mb-12 shadow-2xl mx-4 mt-6">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="bg-slate-800/80 backdrop-blur-md text-slate-200 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-slate-700">
            Welcome to Eventora
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
            Find Your Next <br />
            <span className="text-blue-400">Unforgettable</span> Experience
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the best tech conferences, late-night music festivals, and
            hands-on workshops happening directly in your area. Secure your spot
            today.
          </p>

          <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
            <Search className="absolute left-6 text-slate-400 w-5 h-5 group-focus-within:text-slate-600 transition-colors" />
            <input
              type="text"
              placeholder="Search events by title, location or category......"
              className="w-full pl-16 pr-6 py-4 rounded-xl text-lg text-slate-900 bg-slate-100 border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-500 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us / Features row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Fast Booking</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Secure your tickets instantly with our fast streamlined booking
            infrastructure built for speed.
          </p>
        </div>
        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Seamless Access</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Download tickets instantly or manage them right from your personal
            dashboard with easily.
          </p>
        </div>
        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Secure Platform</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            All transactions and registrations are bounded by cutting-edge
            security and 2FA OTP tech.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-4 border-b border-slate-700 pb-4">
        <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
        <div className="text-slate-400 font-medium">
          {events.length} results found
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-semibold">
            Loading events...
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">
            No events found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition flex flex-col border border-slate-700"
            >
              <div className="h-48 bg-slate-700 overflow-hidden relative">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-300 font-bold text-2xl">
                    {event.category || "Event"}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg border border-slate-600">
                  {event.ticketPrice === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    <span className="text-blue-400">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>
              <div className="p-6 grow flex flex-col">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                  {event.category}
                </div>
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {event.title}
                </h2>
                <div className="flex flex-col gap-3 mb-4 text-slate-300 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    {event.availableSeats} of {event.totalSeats} seats remaining
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-auto pt-16 pb-8 border-t border-slate-700 text-center px-4">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Ticket className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold text-white">Eventora</span>
        </div>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          The simplest, most dynamic way to manage, discover, and host
          world-class events in your local city. Let's make memories together.
        </p>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Eventora Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;

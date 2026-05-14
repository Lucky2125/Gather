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

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date(),
  );

  const expiredEvents = events.filter(
    (event) => new Date(event.date) < new Date(),
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/events`, { params: { search } });

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
      <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden mb-16 shadow-2xl mx-4 mt-6">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/80 to-slate-900"></div>

        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="inline-block bg-white/10 backdrop-blur-md text-blue-400 px-5 py-2 rounded-full text-sm font-semibold tracking-widest mb-6 border border-white/20">
            WELCOME TO Gather Grid
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter">
            Discover Unforgettable <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-500">
              Experiences
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Find the best events happening around you — from tech conferences to
            music festivals.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title, location, or category..."
              className="w-full pl-16 pr-6 py-4 rounded-2xl text-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 border border-slate-300 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ====================== FEATURES SECTION ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4 max-w-7xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl hover:border-blue-500/30 transition-all group">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Lightning Fast Booking
          </h3>
          <p className="text-slate-400">
            Instant ticket booking with seamless experience and real-time
            availability.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl hover:border-indigo-500/30 transition-all group">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Easy Access
          </h3>
          <p className="text-slate-400">
            Digital tickets, QR codes, and complete event management in one
            dashboard.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl hover:border-purple-500/30 transition-all group">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Secure & Trusted
          </h3>
          <p className="text-slate-400">
            Protected payments, 2FA security, and verified organizers.
          </p>
        </div>
      </div>

      {/* ====================== UPCOMING EVENTS ====================== */}
      <div className="px-4 mb-8 flex items-end justify-between">
        <h2 className="text-4xl font-bold text-white"><span className="text-blue-500">Upcoming</span> Events</h2>
        <p className="text-slate-400 font-medium">
          {upcomingEvents.length} Events
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading amazing events...</p>
        </div>
      ) : upcomingEvents.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No upcoming events found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-12">
          {upcomingEvents.map((event) => (
            <div
              key={event._id}
              className="group bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <span className="text-4xl text-slate-600 font-bold">
                      {event.category?.slice(0, 1)}
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-black/70 px-4 py-1.5 rounded-2xl text-sm font-semibold backdrop-blur-md">
                  {event.ticketPrice === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    <span className="text-blue-400">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="uppercase text-blue-400 text-xs font-semibold tracking-wider mb-2">
                  {event.category}
                </div>
                <h3 className="text-xl font-semibold text-white line-clamp-2 mb-4 group-hover:text-blue-300 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2.5 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-500 py-3.5 rounded-2xl font-semibold text-white transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================== EXPIRED EVENTS ====================== */}
      {expiredEvents.length > 0 && (
        <>
          <div className="px-4 mb-8 flex items-end justify-between mt-16">
            <h2 className="text-4xl font-bold text-white">
              <span className="text-red-500">Past</span> Events
            </h2>
            <p className="text-slate-400 font-medium">
              {expiredEvents.length} Events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-12">
            {expiredEvents.map((event) => (
              <div
                key={event._id}
                className="group bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 flex flex-col "
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-red-400 text-xs font-semibold tracking-wider mb-2">
                    {event.category}
                  </div>

                  <h3 className="text-lg font-semibold text-white line-clamp-2 mb-4 group-hover:text-white transition-colors">
                    {event.title}
                  </h3>

                  <div className="text-xs text-slate-400 space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ====================== FOOTER ====================== */}
      <footer className="mt-auto border-t border-slate-800 py-16 px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Ticket className="w-8 h-8 text-blue-400" />
          <span className="text-3xl font-bold text-white">Gather Grid</span>
        </div>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Connecting people with unforgettable experiences. Discover • Book •
          Celebrate.
        </p>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Gather Grid. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;

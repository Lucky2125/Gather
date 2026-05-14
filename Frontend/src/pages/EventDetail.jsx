import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg("OTP has been sent to your registered email.");
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking confirmed successfully!");
        setShowOTP(false);
        setEvent((prev) => ({
          ...prev,
          availableSeats: prev.availableSeats - 1,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-400 text-xl">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Event Not Found
          </h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Events
          </button>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-40 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          {/* Hero Image Section */}
          <div className="relative h-105 md:h-125">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl font-black text-slate-700 tracking-widest">
                    {event.category}
                  </span>
                </div>
              </div>
            )}

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold text-white mb-4 border border-white/20">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                {event.title}
              </h1>
            </div>

            {/* Price Badge */}
            <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl text-2xl font-bold shadow-xl border border-white/10">
              {event.ticketPrice === 0 ? (
                <span className="text-emerald-400">FREE</span>
              ) : (
                <span className="text-white">₹{event.ticketPrice}</span>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Event Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                  <div className="flex gap-5 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-slate-400 mb-1">
                        Date
                      </p>
                      <p className="text-white font-semibold text-lg">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-slate-400 mb-1">
                        Location
                      </p>
                      <p className="text-white font-semibold text-lg">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 sticky top-8">
                  <h3 className="text-2xl font-bold text-white mb-8">
                    Book Your Spot
                  </h3>

                  <div className="space-y-6">
                    {/* Availability */}
                    <div className="flex items-center justify-between bg-slate-900 rounded-2xl p-5">
                      <div className="flex items-center gap-4">
                        <Users className="w-6 h-6 text-purple-400" />
                        <div>
                          <p className="text-sm text-slate-400">Seats Left</p>
                          <p className="text-2xl font-bold text-white">
                            {event.availableSeats}{" "}
                            <span className="text-slate-500 text-base">
                              / {event.totalSeats}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold px-4 py-2 rounded-xl ${
                          isSoldOut
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {isSoldOut ? "Sold Out" : "Available"}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isSoldOut
                              ? "bg-red-500"
                              : "bg-linear-to-r from-blue-500 to-indigo-500"
                          }`}
                          style={{
                            width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* OTP Section */}
                    {showOTP && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                          Enter Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          className="w-full text-center text-3xl text-white tracking-[8px] font-mono bg-slate-900 border border-slate-600 focus:border-blue-500 rounded-2xl py-5 focus:outline-none"
                          placeholder="••••••"
                        />
                      </div>
                    )}

                    {/* Messages */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm flex gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        {successMsg}
                      </div>
                    )}

                    {/* Action Button */}
                    {user?.role !== "admin" ? (
                      <button
                        onClick={handleBooking}
                        disabled={
                          isSoldOut ||
                          bookingLoading ||
                          (showOTP && otp.length !== 6)
                        }
                        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg ${
                          isSoldOut
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.985]"
                        }`}
                      >
                        {bookingLoading ? (
                          <span className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : showOTP ? (
                          "Verify OTP & Confirm Booking"
                        ) : isSoldOut ? (
                          "Sold Out"
                        ) : (
                          "Confirm Booking"
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 py-4 rounded-2xl text-sm font-medium">
                        Admins cannot book events
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

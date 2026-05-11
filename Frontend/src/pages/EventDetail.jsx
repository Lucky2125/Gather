import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
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
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm booking.",
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);
        // Update local seats count dynamically after booking
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-slate-400 text-lg font-medium">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-xl font-semibold mb-6">
            {error || "Event not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        {/* Main Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Image */}
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black text-slate-700 uppercase tracking-widest mb-4">
                  {event.category}
                </div>
                <p className="text-slate-600">Event Image</p>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Event Details */}
              <div className="lg:col-span-2">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {event.category}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {event.title}
                </h1>

                {/* Description */}
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  {event.description}
                </p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Date & Time
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Location
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Panel */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Booking Details
                  </h3>

                  {/* Booking Details Items */}
                  <div className="space-y-4 mb-8">
                    {/* Ticket Price */}
                    <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                          Ticket Price
                        </p>
                        <p className="font-bold text-white text-lg">
                          {event.ticketPrice === 0 ? (
                            <span className="text-green-400">Free</span>
                          ) : (
                            `₹${event.ticketPrice}`
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                          Availability
                        </p>
                        <p className="font-bold text-white">
                          <span
                            className={
                              event.availableSeats < 10 &&
                              event.availableSeats > 0
                                ? "text-orange-400"
                                : event.availableSeats === 0
                                  ? "text-red-400"
                                  : "text-green-400"
                            }
                          >
                            {event.availableSeats}
                          </span>
                          <span className="text-slate-400">
                            {" "}
                            / {event.totalSeats}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Seats Progress Bar */}
                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            event.availableSeats <= 0
                              ? "bg-red-500"
                              : event.availableSeats < 10
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                          style={{
                            width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400">
                        {event.availableSeats} seats remaining
                      </p>
                    </div>
                  </div>

                  {/* OTP Input */}
                  {showOTP && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-200 mb-3">
                        Enter OTP to Confirm
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="000000"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold tracking-widest text-center text-lg"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setOtp(value.slice(0, 6));
                        }}
                        maxLength="6"
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {successMsg && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <p className="text-green-400 text-sm">{successMsg}</p>
                    </div>
                  )}

                  {/* Booking Button */}
                  {user.role !== "admin" ? (
                    <button
                      onClick={handleBooking}
                      disabled={
                        isSoldOut || bookingLoading || (showOTP && !otp)
                      }
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${
                        isSoldOut || (successMsg && !showOTP)
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {bookingLoading ? (
                        <>
                          <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : showOTP ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Verify OTP & Confirm
                        </>
                      ) : successMsg && !showOTP ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Request Sent
                        </>
                      ) : isSoldOut ? (
                        "Sold Out"
                      ) : (
                        "Confirm Registration"
                      )}
                    </button>
                  ) : (
                    <h1 className="flex text-center w-fll text-yellow-500 font-semibold bg-yellow-700/20 px-5 py-2 rounded-xl border-yellow-700 border text-sm">
                      As an Admin, you are not allowed to book events.
                    </h1>
                  )}
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

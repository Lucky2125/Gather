import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit2,
  Ticket,
  X,
  Calendar,
  DollarSign,
  Clock,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const UserDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setUpdatedName(user?.name || "");
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.put("/user/update", { name: updatedName });

      if (data.success) {
        const updatedUser = { ...user, name: updatedName };
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess("Name updated successfully!");
        setIsEditingName(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating user");
    } finally {
      setUpdating(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
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
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid"
      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
      : "bg-slate-700 text-slate-300 border border-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-950 relative pb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-6 py-6">
        {/* ==================== USER PROFILE CARD ==================== */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-8 mb-8">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm">
              <Check className="w-5 h-5" />
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-bold text-white shadow-inner shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Information */}
            <div className="flex-1 w-full text-center lg:text-left">
              <div className="mb-4">
                {isEditingName ? (
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <div className="flex gap-3 justify-center lg:justify-start">
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-2xl text-white font-semibold text-sm transition active:scale-95 disabled:opacity-70"
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingName(false);
                          setUpdatedName(user?.name || "");
                        }}
                        className="bg-slate-700 hover:bg-slate-600 px-6 py-2.5 rounded-2xl text-white font-medium text-sm transition active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                      Welcome, {user?.name?.split(" ")[0]}!
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-blue-400 transition p-2"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center lg:items-start gap-2 text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span>{user?.email}</span>
                </div>
                <p className="text-sm">
                  Role:{" "}
                  <span className="text-slate-300 font-medium capitalize">
                    {user?.role || "User"}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Stats - Responsive */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-5 sm:p-6 w-full lg:w-auto lg:min-w-60 mt-4 lg:mt-0">
              <div className="grid grid-cols-2 gap-6 text-center lg:text-left">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {bookings.filter((b) => b.eventId).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Confirmed
                  </p>
                  <p className="text-3xl font-bold text-emerald-400 mt-1">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BOOKINGS SECTION ==================== */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Ticket className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              My Bookings
            </h2>
          </div>

          {/* Rest of your bookings code remains same */}
          {bookings.length === 0 ? (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-xl text-slate-400 mb-6">
                You haven't booked any events yet.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-8 rounded-2xl transition"
              >
                Browse Events <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings
                .filter((booking) => booking.eventId)
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-5">
                        <h3 className="font-bold text-white text-lg leading-tight pr-3">
                          {booking.eventId.title}
                        </h3>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-4 py-1 text-xs font-bold rounded-2xl uppercase tracking-wider ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                          {booking.status !== "cancelled" && (
                            <span
                              className={`px-4 py-1 text-xs font-bold rounded-2xl uppercase tracking-wider ${getPaymentStatusColor(booking.paymentStatus)}`}
                            >
                              {booking.paymentStatus.replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-slate-400">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>
                            {new Date(booking.eventId.date).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span>
                            {booking.amount === 0
                              ? "Free"
                              : `₹${booking.amount}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>
                            Booked:{" "}
                            {new Date(booking.bookedAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border-t border-slate-700 bg-slate-800/50 flex justify-between items-center">
                      {booking.status !== "cancelled" ? (
                        <>
                          <Link
                            to={`/events/${booking.eventId._id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5 text-sm"
                          >
                            View Event <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 text-sm"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      ) : (
                        <p className="text-slate-500 text-sm w-full text-center">
                          Booking Cancelled
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

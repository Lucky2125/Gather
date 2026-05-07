import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit,
  Plus,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    id: null,
    type: null,
  });

  const [showEventForm, setShowEventForm] = useState(false);
  const [updateEventId, setUpdateEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events/my-events"),
        api.get("/bookings/admin-bookings"),
      ]);
      setEvents(eventsRes.data);
      setBookings(
        bookingsRes.data.sort(
          (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt),
        ),
      );
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updateEventId) {
        await api.put(`/events/${updateEventId}`, formData);
        alert("Event updated successfully");
      } else {
        await api.post(`/events`, formData);
        alert("New Event created successfully");
      }
      setShowEventForm(false);
      setUpdateEventId(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });
      fetchData();
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
      alert(error.response?.data?.message || "Error in saving event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchData();
      } catch (error) {
        alert("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      setActionLoading({ id, type: paymentStatus });
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user's booking request?")) {
      try {
        setActionLoading({ id, type: "reject" });
        await api.delete(`/bookings/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      } finally {
        setActionLoading({ id: null, type: null });
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-12 h-12 text-blue-500 animate-spin"
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
          <p className="text-slate-400 font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 pb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {user?.name}'s Admin Panel
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Manage events and manually confirm bookings.
              </p>
            </div>

            <button
              onClick={() => {
                if (showEventForm) {
                  setUpdateEventId(null);
                  setFormData({
                    title: "",
                    description: "",
                    date: "",
                    location: "",
                    category: "",
                    totalSeats: "",
                    ticketPrice: "",
                    image: "",
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setShowEventForm(!showEventForm);
              }}
              className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {!showEventForm ? (
                <>
                  <Plus className="w-5 h-5" /> Create New Event
                </>
              ) : (
                "Cancel"
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-black text-green-400 mt-2">
                  ₹
                  {bookings.reduce(
                    (sum, b) =>
                      b.paymentStatus === "paid" && b.status === "confirmed"
                        ? sum + b.amount
                        : sum,
                    0,
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Paid Clients
                </p>
                <h3 className="text-3xl font-black text-blue-400 mt-2">
                  {
                    new Set(
                      bookings
                        .filter(
                          (b) =>
                            b.paymentStatus === "paid" &&
                            b.status === "confirmed",
                        )
                        .map((b) => b.userId?._id),
                    ).size
                  }
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Pending
                </p>
                <h3 className="text-3xl font-black text-amber-400 mt-2">
                  {bookings.filter((b) => b.status === "pending").length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {showEventForm && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {updateEventId ? "Update Event" : "Create New Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Event Title"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="Category"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                <input
                  required
                  type="date"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="Location"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="number"
                  placeholder="Total Seats"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                  value={formData.totalSeats}
                  onChange={(e) =>
                    setFormData({ ...formData, totalSeats: e.target.value })
                  }
                />
                <input
                  required
                  type="number"
                  placeholder="Ticket Price"
                  className="bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                  value={formData.ticketPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketPrice: e.target.value })
                  }
                />
              </div>

              <input
                type="text"
                placeholder="Image URL (Direct link)"
                className="w-full bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />

              <textarea
                required
                placeholder="Event Description"
                rows={4}
                className="w-full bg-slate-800/70 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-slate-500 resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
              >
                {updateEventId ? "Update Event" : "Publish Event"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Events Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                {events.length}
              </span>
              All Events
            </h2>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <ul className="divide-y divide-slate-800 max-h-130 overflow-y-auto">
                {events.length === 0 ? (
                  <li className="p-8 text-center text-slate-400">
                    No events created yet.
                  </li>
                ) : (
                  events.map((event) => (
                    <li
                      key={event._id}
                      className="p-5 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-2">
                            {event.title}
                          </h4>
                          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              {event.availableSeats}/{event.totalSeats}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowEventForm(true);
                              setUpdateEventId(event._id);
                              setFormData({
                                title: event.title,
                                description: event.description,
                                date: event.date.split("T")[0],
                                location: event.location,
                                category: event.category,
                                totalSeats: event.totalSeats,
                                ticketPrice: event.ticketPrice,
                                image: event.image,
                              });
                            }}
                            className="p-3 text-amber-400 hover:bg-amber-500/10 rounded-xl transition"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Bookings Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                {bookings.length}
              </span>
              Booking Requests
            </h2>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <ul className="divide-y divide-slate-800 max-h-130 overflow-y-auto">
                {bookings.length === 0 ? (
                  <li className="p-8 text-center text-slate-400">
                    No bookings yet.
                  </li>
                ) : (
                  bookings.map((booking) => (
                    <li
                      key={booking._id}
                      className={`p-5 border-l-4 ${
                        booking.status === "pending"
                          ? "border-l-amber-400"
                          : booking.status === "confirmed"
                            ? "border-l-green-400"
                            : "border-l-red-400"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-[17px] leading-tight flex-1 pr-3">
                            {booking.eventId?.title || (
                              <span className="text-red-400 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Deleted Event
                              </span>
                            )}
                          </h4>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                                booking.status === "confirmed"
                                  ? "bg-green-500/20 text-green-400"
                                  : booking.status === "cancelled"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-amber-500/20 text-amber-400"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-xl p-4 text-sm text-gray-300 space-y-2 border border-slate-700">
                          <p>
                            <span className="text-gray-500 w-16 inline-block">
                              User:
                            </span>{" "}
                            {booking.userId?.name}{" "}
                            <span className="text-gray-500">
                              ({booking.userId?.email})
                            </span>
                          </p>
                          <p>
                            <span className="text-slate-500 w-16 inline-block">
                              Amount:
                            </span>{" "}
                            {booking.amount === 0
                              ? "Free"
                              : `₹${booking.amount}`}
                          </p>
                          <p>
                            <span className="text-slate-500 w-16 inline-block">
                              Date:
                            </span>{" "}
                            {new Date(booking.bookedAt).toLocaleString()}
                          </p>
                        </div>

                        {booking.status === "pending" && (
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            <button
                              disabled={actionLoading.id === booking._id}
                              onClick={() =>
                                handleConfirmBooking(booking._id, "paid")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                            >
                              {actionLoading.id === booking._id &&
                              actionLoading.type === "paid" ? (
                                "..."
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" /> Paid
                                </>
                              )}
                            </button>

                            <button
                              disabled={actionLoading.id === booking._id}
                              onClick={() =>
                                handleConfirmBooking(booking._id, "not_paid")
                              }
                              className="bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl text-sm font-semibold transition active:scale-95"
                            >
                              {actionLoading.id === booking._id &&
                              actionLoading.type === "not_paid"
                                ? "..."
                                : "Hold"}
                            </button>

                            <button
                              disabled={actionLoading.id === booking._id}
                              onClick={() => handleCancelBooking(booking._id)}
                              className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                            >
                              {actionLoading.id === booking._id &&
                              actionLoading.type === "reject" ? (
                                "..."
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" /> Reject
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

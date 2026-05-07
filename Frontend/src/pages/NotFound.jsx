import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-red-500 to-orange-600 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: "2s" }}>
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Overlapping 404 Text */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-slate-800 leading-none tracking-tighter">
            404
          </h1>
          <h2 className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-lg mt-12 max-w-md mx-auto leading-relaxed mb-2">
          Oops! It looks like you've wandered into uncharted territory.
        </p>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Events
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <p className="text-slate-600 text-sm">
            Need help? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
        {/* Subtle Full-Screen Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-150 h-150 bg-blue-500/5 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-52 w-175 h-175 bg-indigo-500/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Main App Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          {/* Full Screen Main Content */}
          <main className="flex-1 bg-slate-950 overflow-auto">
            <div className="h-full w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';
import { Menu, X, LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-slate-800 shadow-2xl sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200"
                        onClick={handleNavClick}
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <FaTicketAlt className="w-6 h-6" />
                        </div>
                        <span className="hidden sm:inline">Eventora</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            to="/" 
                            className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                        >
                            Events
                        </Link>
                        
                        {user ? (
                            <>
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </Link>
                                
                                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                                    <div className="flex flex-col">
                                        <p className="text-slate-200 text-sm font-semibold">{user.name || user.email}</p>
                                        <p className="text-slate-500 text-xs capitalize">{user.role}</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/login" 
                                    className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-slate-300 hover:text-blue-400 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <Link 
                            to="/" 
                            className="block px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200 font-medium"
                            onClick={handleNavClick}
                        >
                            Events
                        </Link>
                        
                        {user ? (
                            <>
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200 font-medium"
                                    onClick={handleNavClick}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </Link>
                                
                                <div className="px-4 py-3 border-t border-slate-700 mt-3">
                                    <p className="text-slate-200 text-sm font-semibold mb-1">{user.name || user.email}</p>
                                    <p className="text-slate-500 text-xs capitalize mb-3">{user.role}</p>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3 px-4 py-3 border-t border-slate-700 mt-3">
                                <Link 
                                    to="/login" 
                                    className="flex items-center justify-center gap-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-200 font-medium w-full"
                                    onClick={handleNavClick}
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 w-full"
                                    onClick={handleNavClick}
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

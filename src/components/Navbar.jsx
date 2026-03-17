import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out successfully.");
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed.");
        }
    };

    return (
        <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4 lg:px-10 sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
            <div className="flex items-center gap-3 text-text-main">
                <div className="size-8 text-primary">
                    <span className="material-symbols-outlined text-[32px]">directions_car</span>
                </div>
                <Link to="/" className="text-xl font-bold leading-tight tracking-tight hover:text-primary transition-colors">Wheels Live</Link>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-8">
                <Link to="/" className="text-sm font-medium text-text-main hover:text-primary transition-colors">Home</Link>
                <Link to="/search" className="text-sm font-medium text-text-main hover:text-primary transition-colors">Vehicles</Link>
                <a className="text-sm font-medium text-text-main hover:text-primary transition-colors" href="#">Destinations</a>
                <a className="text-sm font-medium text-text-main hover:text-primary transition-colors" href="#">About</a>
                <a className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1" href="/#first-aid">
                    <span className="material-symbols-outlined text-[18px]">medical_services</span>
                    First Aid
                </a>
            </nav>
            <div className="flex items-center gap-4">
                {!currentUser ? (
                    <>
                        <Link to="/signin" className="hidden sm:flex text-sm font-semibold text-text-main hover:text-primary px-4 py-2">
                            Login
                        </Link>
                        <Link to="/signup" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-md shadow-blue-200">
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
                            Hi, {userData?.firstName || 'User'}
                        </span>
                        <div className="relative group cursor-pointer inline-block">
                            <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold shadow-sm border border-blue-200">
                                {userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                            </div>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <div className="p-2 flex flex-col gap-1">
                                    <Link to={userData?.role === 'admin' ? '/admin' : userData?.role === 'vendor' ? '/vendor/dashboard' : '/settings'} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-lg">
                                            {userData?.role === 'admin' || userData?.role === 'vendor' ? 'dashboard' : 'person'}
                                        </span>
                                        {userData?.role === 'admin' ? 'Admin Dashboard' : userData?.role === 'vendor' ? 'Vendor Dashboard' : 'My Account'}
                                    </Link>
                                    <Link to="/dev-tools" className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-lg">code</span>
                                        Developer Tools
                                    </Link>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-lg">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

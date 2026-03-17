import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

export default function AdminDashboard() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Dashboard Data State
    const [stats, setStats] = useState({
        revenue: 0,
        activeBookings: 0,
        totalVendors: 0,
        pendingApprovals: 0
    });
    const [vehicleAvailability, setVehicleAvailability] = useState({
        Sedan: 0,
        SUV: 0,
        Other: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                let vendorsCount = 0;
                let vendorSnap = [];
                // 1. Count Vendors
                try {
                    const vendorQ = query(collection(db, "users"), where("role", "==", "vendor"));
                    vendorSnap = await getDocs(vendorQ);
                    vendorsCount = vendorSnap.size;
                } catch (e) {
                    console.error("Users query failed:", e);
                    toast.error("Access denied to 'users' collection. Please check Firestore security rules.");
                }

                let totalRevenue = 0;
                let activeCount = 0;
                const bookingsList = [];
                
                // 2. Fetch Bookings
                try {
                    const bookingSnap = await getDocs(collection(db, "bookings"));
                    bookingSnap.forEach(docSnap => {
                        const bData = { id: docSnap.id, ...docSnap.data() };
                        bookingsList.push(bData);
                        
                        if (bData.status === 'confirmed' || bData.status === 'active') {
                            activeCount++;
                        }
                        if (bData.totalPrice) {
                            totalRevenue += Number(bData.totalPrice);
                        }
                    });
                } catch (e) {
                    console.error("Bookings query failed:", e);
                    toast.error("Access denied to 'bookings' collection. Please check Firestore security rules.");
                }

                // 3. Fetch Vehicles
                try {
                    const vehicleSnap = await getDocs(collection(db, "vehicles"));
                    let totalVehicles = vehicleSnap.size;
                    let vehicleCounts = { Sedan: 0, SUV: 0, Other: 0 };
                    
                    vehicleSnap.forEach(vDoc => {
                        const vData = vDoc.data();
                        const category = vData.category || 'Other';
                        if (vehicleCounts[category] !== undefined) {
                            vehicleCounts[category]++;
                        } else {
                            vehicleCounts.Other++;
                        }
                    });

                    const totalForPct = totalVehicles > 0 ? totalVehicles : 1;
                    setVehicleAvailability({
                        Sedan: Math.round((vehicleCounts.Sedan / totalForPct) * 100),
                        SUV: Math.round((vehicleCounts.SUV / totalForPct) * 100),
                        Other: Math.round((vehicleCounts.Other / totalForPct) * 100)
                    });
                } catch (e) {
                    console.error("Vehicles query failed:", e);
                    toast.error("Access denied to 'vehicles' collection. Please check Firestore security rules.");
                }

                // Filter pending approvals client-side from vendorSnap to avoid index errors
                let pendingCount = 0;
                if (vendorSnap.forEach) {
                    vendorSnap.forEach(doc => {
                        const uData = doc.data();
                        if (uData.status === 'pending' || uData.status === 'Pending') {
                            pendingCount++;
                        }
                    });
                }

                setStats({
                    revenue: totalRevenue,
                    activeBookings: activeCount,
                    totalVendors: vendorsCount,
                    pendingApprovals: pendingCount
                });

                // Sort and limit recent bookings
                const sortedRecent = bookingsList
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                    .slice(0, 5);
                
                setRecentBookings(sortedRecent);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard metrics: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased min-h-screen">
            <div className="relative flex min-h-screen w-full flex-row overflow-x-hidden">
                {/* Mobile Menu Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                {/* Sidebar Navigation */}
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-3xl">local_taxi</span>
                            <span className="text-slate-900 dark:text-white text-lg font-bold">Wheels Live</span>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                            <span className="material-symbols-outlined">dashboard</span>
                            Dashboard
                        </Link>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                            <span className="material-symbols-outlined">directions_car</span>
                            Fleet Management
                        </a>
                        <Link to="/admin/vendors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                            <span className="material-symbols-outlined">storefront</span>
                            Vendor Management
                        </Link>
                        <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                            <span className="material-symbols-outlined">calendar_month</span>
                            Bookings
                        </Link>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                            <span className="material-symbols-outlined">group</span>
                            User Management
                        </a>
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Reports</p>
                            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                                <span className="material-symbols-outlined">analytics</span>
                                Analytics
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                                <span className="material-symbols-outlined">receipt_long</span>
                                Transactions
                            </a>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                            <span className="material-symbols-outlined">logout</span>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark w-full">
                    {/* Top Header */}
                    <header className="h-16 bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-700 p-1">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">Wheels Live</span>
                        </div>
                        <div className="hidden lg:flex items-center text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1a2632]"></span>
                            </button>

                            <div className="relative group cursor-pointer inline-block">
                                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{userData?.fullName || 'Admin User'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                                        {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A')}
                                    </div>
                                </div>
                                {/* Dropdown menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="p-2 flex flex-col gap-1">
                                        <Link to="/settings" className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg flex items-center gap-2 transition-colors">
                                            <span className="material-symbols-outlined text-lg">person</span>
                                            My Profile
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
                    </header>

                    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Dashboard Overview</h1>
                                <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening with your fleet today.</p>
                            </div>
                            <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-primary/30">
                                <span className="material-symbols-outlined text-xl">add</span>
                                New Booking
                            </button>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                            {/* Card 1 */}
                            <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Live
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {loading ? "..." : `$${stats.revenue.toLocaleString()}`}
                                    </h3>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                        <span className="material-symbols-outlined">directions_car</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Live
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Bookings</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {loading ? "..." : stats.activeBookings}
                                    </h3>
                                </div>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                                        <span className="material-symbols-outlined">storefront</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Live
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Vendors</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {loading ? "..." : stats.totalVendors}
                                    </h3>
                                </div>
                            </div>
                            {/* Card 4 */}
                            <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-600">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400 px-2 py-1 rounded-full">
                                        Status
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pending Approvals</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {loading ? "..." : stats.pendingApprovals}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid: Chart & Secondary Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Chart Section */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard Monitoring</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Status is updated real-time from Firestore.</p>
                                </div>
                            </div>
                                {/* Custom CSS Bar Chart visualization */}
                                <div className="h-64 flex items-end justify-between gap-2 md:gap-6 pt-4 px-2">
                                    {/* Jan */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary/10 group-hover:bg-primary/20 rounded-t-sm relative h-[45%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">320</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Jan</span>
                                    </div>
                                    {/* Feb */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary/30 rounded-t-sm relative h-[60%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">450</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Feb</span>
                                    </div>
                                    {/* Mar */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary/40 group-hover:bg-primary/50 rounded-t-sm relative h-[35%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">280</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mar</span>
                                    </div>
                                    {/* Apr */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary/60 group-hover:bg-primary/70 rounded-t-sm relative h-[75%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">610</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Apr</span>
                                    </div>
                                    {/* May */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary/80 group-hover:bg-primary/90 rounded-t-sm relative h-[55%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">420</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">May</span>
                                    </div>
                                    {/* Jun */}
                                    <div className="group flex flex-col items-center flex-1 h-full justify-end gap-2">
                                        <div className="w-full max-w-[40px] bg-primary group-hover:bg-blue-600 rounded-t-sm relative h-[85%] transition-all duration-300">
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">760</div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Jun</span>
                                    </div>
                                </div>
                            </div>

                            {/* Side Stats / Quick Actions */}
                            <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed Trips</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">845</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upcoming Trips</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">128</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cancellations</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">14</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Vehicle Availability</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-slate-600 dark:text-slate-400">Sedans</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{loading ? '...' : `${vehicleAvailability.Sedan}%`}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: `${vehicleAvailability.Sedan}%` }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mb-1 mt-2">
                                            <span className="text-slate-600 dark:text-slate-400">SUVs</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{loading ? '...' : `${vehicleAvailability.SUV}%`}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${vehicleAvailability.SUV}%` }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mb-1 mt-2">
                                            <span className="text-slate-600 dark:text-slate-400">Other Fleet</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{loading ? '...' : `${vehicleAvailability.Other}%`}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${vehicleAvailability.Other}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64 dark:text-white" placeholder="Search booking ID..." type="text" />
                                    </div>
                                    <button className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                                        <span className="material-symbols-outlined text-xl">filter_list</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold" scope="col">Booking ID</th>
                                            <th className="px-6 py-4 font-semibold" scope="col">Customer</th>
                                            <th className="px-6 py-4 font-semibold" scope="col">Vehicle</th>
                                            <th className="px-6 py-4 font-semibold" scope="col">Route</th>
                                            <th className="px-6 py-4 font-semibold" scope="col">Date</th>
                                            <th className="px-6 py-4 font-semibold" scope="col">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right" scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-text-sub">Loading activities...</td>
                                            </tr>
                                        ) : recentBookings.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-text-sub">No recent bookings found.</td>
                                            </tr>
                                        ) : (
                                            recentBookings.map((booking) => (
                                                <tr key={booking.id} className="bg-white dark:bg-[#1a2632] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#{booking.id?.substring(0, 8).toUpperCase() || 'N/A'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                                {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900 dark:text-white">{booking.customerName || booking.userId || 'User'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{booking.vehicleName || 'Vehicle'}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{booking.totalPrice ? `$${Number(booking.totalPrice).toLocaleString()}` : '$0'}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        {booking.createdAt?.seconds ? new Date(booking.createdAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' : booking.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                                            {booking.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Showing 4 of 24 results</span>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 transition-colors">Prev</button>
                                    <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">Next</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

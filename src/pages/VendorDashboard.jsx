import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VendorDashboard() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [stats, setStats] = useState({ earnings: 0, upcomingRentals: 0 });
    const [loading, setLoading] = useState(true);

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

    const handleDeleteVehicle = async (vehicleId) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await deleteDoc(doc(db, 'vehicles', vehicleId));
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
            toast.success("Vehicle deleted successfully.");
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            toast.error("Failed to delete the vehicle.");
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;
            try {
                // 1. Fetch vendor's vehicles
                const q = query(collection(db, 'vehicles'), where('vendorId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const vehicleList = [];
                const vehicleIds = [];
                querySnapshot.forEach((doc) => {
                    vehicleList.push({ id: doc.id, ...doc.data() });
                    vehicleIds.push(doc.id);
                });
                setVehicles(vehicleList);

                // 2. Fetch all bookings and match with vendor's vehicles
                const bookingSnap = await getDocs(collection(db, 'bookings'));
                let totalEarnings = 0;
                let upcomingCount = 0;
                const today = new Date();

                bookingSnap.forEach(docSnap => {
                    const bData = docSnap.data();
                    
                    // Check if book vehicleId belongs to this vendor
                    if (vehicleIds.includes(bData.vehicleId)) {
                        if (bData.status === 'confirmed' || bData.status === 'completed') {
                            totalEarnings += Number(bData.totalPrice || 0);
                        }

                        if (bData.status === 'confirmed') {
                            const startDate = bData.startDate ? new Date(bData.startDate) : null;
                            if (startDate && startDate >= today) {
                                upcomingCount++;
                            } else if (!startDate) {
                                // Fallback
                                upcomingCount++;
                            }
                        }
                    }
                });

                setStats({
                    earnings: totalEarnings,
                    upcomingRentals: upcomingCount
                });

            } catch (error) {
                console.error("Error fetching vendor dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display antialiased">
            {/* Main Layout */}
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Centered Content Wrapper */}
                    <div className="px-4 md:px-12 lg:px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                            {/* Header */}
                            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-4 py-3 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined text-2xl">local_taxi</span>
                                    </div>
                                    <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Wheels Live</h2>
                                </div>
                                <div className="flex flex-1 justify-end gap-8">
                                    <nav className="hidden md:flex items-center gap-9">
                                        <Link to="/vendor" className="text-primary text-sm font-medium leading-normal">Dashboard</Link>
                                        <Link to="/vendor" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium leading-normal">Fleet</Link>
                                        <Link to="/vendor/bookings" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium leading-normal">Bookings</Link>
                                        <a className="text-slate-600 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#earnings">Earnings</a>
                                        <Link to="/settings" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium leading-normal">Settings</Link>
                                    </nav>
                                    <div className="relative group cursor-pointer inline-block">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 flex items-center justify-center text-primary font-bold bg-white" title={userData?.fullName || 'Vendor'}>
                                            {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'V')}
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

                            {/* Page Title & Primary Action */}
                            <div className="flex flex-wrap justify-between items-end gap-4 px-4 pb-6">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">My Fleet</h1>
                                    <p className="text-slate-500 text-base font-normal leading-normal">Manage your vehicles, pricing, and real-time availability</p>
                                </div>
                                <Link to="/vendor/add-vehicle" className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-bold leading-normal tracking-[0.015em] shadow-sm shadow-primary/20">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    <span className="truncate">Add New Vehicle</span>
                                </Link>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-6">
                                <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-500 text-sm font-medium leading-normal">Vehicles Active</p>
                                        <span className="material-symbols-outlined text-primary">directions_car</span>
                                    </div>
                                    <p className="text-slate-900 tracking-tight text-3xl font-bold leading-tight mt-2">{loading ? "..." : vehicles.length}</p>
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span>Up to date</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-500 text-sm font-medium leading-normal">Total Earnings</p>
                                        <span className="material-symbols-outlined text-primary">payments</span>
                                    </div>
                                    <p className="text-slate-900 tracking-tight text-3xl font-bold leading-tight mt-2">{loading ? "..." : `$${stats.earnings}`}</p>
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        <span>Live</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-500 text-sm font-medium leading-normal">Upcoming Rentals</p>
                                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    </div>
                                    <p className="text-slate-900 tracking-tight text-3xl font-bold leading-tight mt-2">{loading ? "..." : stats.upcomingRentals}</p>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mt-1">
                                        <span>Next 7 days</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filter */}
                            <div className="px-4 py-3 mb-2">
                                <label className="flex flex-col md:flex-row gap-3 w-full">
                                    <div className="flex w-full md:max-w-md items-center rounded-lg h-12 border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden">
                                        <div className="text-slate-400 flex items-center justify-center pl-4">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none text-slate-900 focus:outline-0 focus:ring-0 h-full placeholder:text-slate-400 px-4 text-base font-normal leading-normal outline-none" placeholder="Search by vehicle name, plate number, or type" defaultValue="" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 h-12 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                            <span className="material-symbols-outlined">filter_list</span>
                                            <span>Filter</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 h-12 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                            <span className="material-symbols-outlined">sort</span>
                                            <span>Sort</span>
                                        </button>
                                    </div>
                                </label>
                            </div>

                            {/* Data Table */}
                            <div className="px-4 py-3">
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px]">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Vehicle Details</th>
                                                    <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Daily Rate</th>
                                                    <th className="px-6 py-4 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                            Loading fleet...
                                                        </td>
                                                    </tr>
                                                ) : vehicles.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                            No vehicles found. Click "Add New Vehicle" to get started.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    vehicles.map((vehicle) => (
                                                        <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-16 h-10 rounded bg-slate-100 overflow-hidden flex-shrink-0 relative">
                                                                        <img
                                                                            alt={vehicle.vehicleName}
                                                                            className="w-full h-full object-cover"
                                                                            src={vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuBfYfPSYxglIbcm0vlL4EpYiqARWzXhisZVKTTq835Lz52Fqthz1KKdrPIGRQ--2jngPbB2HeenFKDldEHVbcr4whDD0KkQDKX3KBi0Z6I8osWMnTbLABm8JRVci-ui9QQA2PcrjFi7v5-S1CY1XpAcZaMrh7uXDP0fm_MUG8Ylbn1gvQOo-1fYw4ZSj1NzytmeoQBQ-z8nwu90P1NUub_Xq1xgfdAQWQ7Xca7Q3SfMx4psuXQ7GPx2pdsh9t9KNYX8E4rRxIv0kNA"}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-slate-900 text-sm font-semibold">{vehicle.vehicleName}</p>
                                                                        <p className="text-slate-500 text-xs">{vehicle.brand}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                                                                    <span className="material-symbols-outlined text-[14px]">
                                                                        {vehicle.vehicleType === 'bus' ? 'directions_bus' : vehicle.vehicleType === 'van' ? 'airport_shuttle' : 'directions_car'}
                                                                    </span>
                                                                    {vehicle.vehicleType}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                    Available
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-slate-900 text-sm font-medium">${vehicle.dailyRate}<span className="text-slate-500 font-normal">/day</span></p>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button className="p-2 rounded text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                                    </button>
                                                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="p-2 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination */}
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                                        <div className="text-sm text-slate-500">
                                            Showing <span className="font-medium text-slate-900">{vehicles.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-900">{vehicles.length}</span> of <span className="font-medium text-slate-900">{vehicles.length}</span> results
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                                            <button className="px-3 py-1 rounded border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

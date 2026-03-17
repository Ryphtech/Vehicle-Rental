import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VendorBookings() {
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

    // For now, these are static as in the design. We will link them to Firestore later if needed.
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState({});
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch vendor's vehicles
                const vQuery = query(collection(db, 'vehicles'), where('vendorId', '==', currentUser.uid));
                const vSnapshot = await getDocs(vQuery);
                const vehiclesMap = {};
                vSnapshot.forEach(doc => {
                    vehiclesMap[doc.id] = doc.data();
                });
                setVehicles(vehiclesMap);

                // Fetch vendor's bookings
                const bQuery = query(collection(db, 'bookings'), where('vendorId', '==', currentUser.uid));
                const bSnapshot = await getDocs(bQuery);
                const bookingsData = [];
                bSnapshot.forEach(doc => {
                    bookingsData.push({ id: doc.id, ...doc.data() });
                });
                // Sort by createdAt descending
                bookingsData.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return b.createdAt.toMillis() - a.createdAt.toMillis();
                });
                setBookings(bookingsData);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load bookings");
            }
            setLoading(false);
        };
        fetchData();
    }, [currentUser]);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            toast.success(`Booking ${newStatus}!`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        }
    };

    return (
        <div className="bg-background-light text-slate-900 font-display antialiased min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-slate-900">
                        <div className="size-8 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                            <span className="material-symbols-outlined text-2xl">commute</span>
                        </div>
                        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Wheels Live</h2>
                    </div>
                    <div className="hidden lg:flex items-center gap-9">
                        <Link className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/vendor">Dashboard</Link>
                        <Link className="text-primary text-sm font-bold leading-normal" to="/vendor/bookings">Bookings</Link>
                        <Link className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/vendor">Vehicles</Link>
                        <a className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#reports">Reports</a>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <div className="text-slate-500 flex border-none bg-slate-50 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-0 border-none bg-slate-50 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal outline-none" placeholder="Search bookings..." defaultValue="" />
                        </div>
                    </label>
                    <div className="flex items-center gap-4">
                        <button className="relative text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">notifications</span>
                            <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="relative group cursor-pointer inline-block">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="bg-center bg-no-repeat bg-cover flex items-center justify-center rounded-full size-9 ring-2 ring-primary/20 bg-blue-50 text-primary font-bold shadow-sm">
                                    {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'V')}
                                </div>
                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                            </div>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 top-full mt-4 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
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
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-6 gap-6">
                {/* Left Column: Calendar & Overview */}
                <div className="flex flex-col flex-[2] gap-6">
                    <div className="flex flex-col gap-2 mb-2">
                        <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-[-0.033em]">Booking Requests</h1>
                        <p className="text-slate-500 text-base font-normal leading-normal">Manage your vehicle availability and upcoming schedule.</p>
                    </div>

                    {/* Calendar Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-slate-900 text-lg font-bold">Booking Calendar</h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-50 rounded-full text-slate-600 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">Today</button>
                                <button className="p-2 hover:bg-slate-50 rounded-full text-slate-600 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-8">
                            {/* Month 1 */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-900 text-base font-bold">October 2023</span>
                                </div>
                                <div className="grid grid-cols-7 text-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Su</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Mo</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Tu</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">We</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Th</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Fr</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Sa</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-sm">
                                    {/* Empty cells */}
                                    <span></span><span></span><span></span>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">1</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">2</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">3</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">4</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-primary text-white font-semibold shadow-md shadow-primary/30 cursor-pointer transition-colors">5</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">6</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-medium cursor-pointer transition-colors border border-orange-200">7</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-medium cursor-pointer transition-colors border border-orange-200">8</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">9</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">10</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">11</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">12</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-green-100 text-green-700 font-medium cursor-pointer transition-colors border border-green-200">13</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-green-100 text-green-700 font-medium cursor-pointer transition-colors border border-green-200">14</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-green-100 text-green-700 font-medium cursor-pointer transition-colors border border-green-200">15</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">16</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">17</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">18</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">19</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">20</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">21</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">22</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">23</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">24</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">25</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">26</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">27</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-medium cursor-pointer transition-colors border border-blue-200">28</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-medium cursor-pointer transition-colors border border-blue-200">29</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-medium cursor-pointer transition-colors border border-blue-200">30</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-medium cursor-pointer transition-colors border border-blue-200">31</button>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="hidden xl:block w-[1px] bg-slate-100 self-stretch"></div>
                            {/* Month 2 */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-900 text-base font-bold">November 2023</span>
                                </div>
                                <div className="grid grid-cols-7 text-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Su</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Mo</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Tu</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">We</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Th</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Fr</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">Sa</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-sm">
                                    {/* Empty cells */}
                                    <span></span><span></span><span></span>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">1</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">2</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">3</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">4</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">5</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">6</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">7</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">8</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">9</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">10</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">11</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">12</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-medium cursor-pointer transition-colors border border-purple-200">13</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-medium cursor-pointer transition-colors border border-purple-200">14</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-medium cursor-pointer transition-colors border border-purple-200">15</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-medium cursor-pointer transition-colors border border-purple-200">16</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">17</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">18</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">19</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">20</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">21</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">22</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">23</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">24</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">25</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">26</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">27</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">28</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">29</button>
                                    <button className="aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors">30</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-orange-100 border border-orange-200"></span>
                                <span className="text-slate-500">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-green-100 border border-green-200"></span>
                                <span className="text-slate-500">Confirmed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-blue-100 border border-blue-200"></span>
                                <span className="text-slate-500">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-purple-100 border border-purple-200"></span>
                                <span className="text-slate-500">Maintenance</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Overview Mini Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors cursor-pointer">
                            <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">directions_car</span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Sedans Listed</p>
                                <p className="text-2xl font-bold text-slate-900">{Object.values(vehicles).filter(v => (v.type || '').toLowerCase() === 'sedan').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors cursor-pointer">
                            <div className="size-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">airport_shuttle</span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Vans Listed</p>
                                <p className="text-2xl font-bold text-slate-900">{Object.values(vehicles).filter(v => (v.type || '').toLowerCase() === 'van').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors cursor-pointer">
                            <div className="size-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">directions_bus</span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Buses Listed</p>
                                <p className="text-2xl font-bold text-slate-900">{Object.values(vehicles).filter(v => (v.type || '').toLowerCase() === 'bus').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pending Requests */}
                <div className="flex flex-col flex-1 gap-6 min-w-[350px]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-900 text-xl font-bold leading-tight">Pending Requests</h2>
                        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <p className="text-slate-500">Loading requests...</p>
                        ) : bookings.filter(b => b.status === 'pending').length === 0 ? (
                            <p className="text-slate-500">No pending requests.</p>
                        ) : (
                            bookings.filter(b => b.status === 'pending').map(booking => {
                                const vehicle = vehicles[booking.vehicleId] || {};
                                const firstName = booking.driverDetails?.firstName || 'Unknown';
                                const lastName = booking.driverDetails?.lastName || '';
                                const customerName = `${firstName} ${lastName}`.trim();

                                const pDate = new Date(booking.dates?.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                const dDate = new Date(booking.dates?.dropoffDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                                return (
                                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            <div className="size-16 rounded-lg bg-cover bg-center shrink-0 bg-slate-200" style={{ backgroundImage: vehicle.images?.length > 0 ? `url("${vehicle.images[0]}")` : 'none' }}></div>
                                            <div className="flex flex-col justify-center gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">{vehicle.name || 'Unknown Vehicle'}</h4>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">{vehicle.type || 'Standard'}</span>
                                                </div>
                                                <p className="text-sm text-slate-500">Requested by <span className="text-slate-900 font-medium">{customerName}</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                            <span className="material-symbols-outlined text-lg text-slate-400">calendar_month</span>
                                            <span className="font-medium">{pDate} - {dDate}</span>
                                            <span className="mx-1 text-slate-300">•</span>
                                            <span>{booking.pricing?.days || 1} days</span>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:text-red-600 transition-colors">
                                                <span className="material-symbols-outlined text-lg">close</span>
                                                Decline
                                            </button>
                                            <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-primary">
                                                <span className="material-symbols-outlined text-lg">check</span>
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Quick Stats/Alert Box */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-2 shadow-sm">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                            <div>
                                <h4 className="text-blue-900 font-bold text-sm">High Demand Alert</h4>
                                <p className="text-blue-700 text-sm mt-1 leading-relaxed">Upcoming holiday season (Dec 20-31) has 80% bookings. Review requests carefully.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

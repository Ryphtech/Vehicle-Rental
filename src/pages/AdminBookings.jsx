import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminBookings() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Bookings Data State
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

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

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const bookingSnap = await getDocs(query(collection(db, "bookings")));
                const bookingsList = [];
                
                bookingSnap.forEach(docSnap => {
                    bookingsList.push({ id: docSnap.id, ...docSnap.data() });
                });

                // Sort by date descending (assuming startDate or createdAt exists)
                bookingsList.sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                });

                setBookings(bookingsList);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Failed to load bookings data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            toast.success(`Booking marked as ${newStatus}!`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        }
    };

    const filteredBookings = bookings.filter(booking => 
        statusFilter === 'all' || booking.status === statusFilter
    );

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
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
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
                        <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                            <span className="material-symbols-outlined">calendar_month</span>
                            Bookings
                        </Link>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
                            <span className="material-symbols-outlined">group</span>
                            User Management
                        </a>
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
                            <span className="text-slate-900 dark:text-white font-medium">Bookings</span>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bookings Management</h1>
                            <div className="flex gap-2">
                                {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                                            statusFilter === status 
                                                ? 'bg-primary text-white shadow-sm' 
                                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">No bookings found with status "{statusFilter}"</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Booking ID</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Vehicle ID</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Price</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white text-sm">#{booking.id.slice(0, 8)}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{booking.userName || booking.userId || 'Guest'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{booking.vehicleId?.slice(0, 8) || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                                        ${booking.pricing?.totalPrice || booking.amountPaid || 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                                            booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                            booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {booking.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm flex gap-2">
                                                        {booking.status !== 'confirmed' && (
                                                            <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs">Confirm</button>
                                                        )}
                                                        {booking.status !== 'cancelled' && (
                                                            <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Cancel</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

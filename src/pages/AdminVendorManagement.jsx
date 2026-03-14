import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminVendorManagement() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased min-h-screen">
            <div className="flex min-h-screen w-full flex-row overflow-hidden">
                {/* Mobile Menu Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                {/* Sidebar Navigation */}
                <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border-light bg-surface-light dark:bg-surface-dark dark:border-border-dark transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shrink-0`}>
                    <div className="flex h-16 items-center px-6 border-b border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">directions_car</span>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-text-main dark:text-white">RideAdmin</h2>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
                        <nav className="flex flex-col gap-2">
                            <Link to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-sub hover:bg-primary-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">grid_view</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-sub hover:bg-primary-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">calendar_month</span>
                                <span className="text-sm font-medium">Bookings</span>
                            </a>
                            <Link to="/admin/vendors" className="flex items-center gap-3 rounded-lg bg-primary-light px-3 py-2 text-primary">
                                <span className="material-symbols-outlined fill-1">group</span>
                                <span className="text-sm font-medium">Vendors</span>
                            </Link>
                            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-sub hover:bg-primary-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">directions_bus</span>
                                <span className="text-sm font-medium">Vehicles</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-sub hover:bg-primary-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">payments</span>
                                <span className="text-sm font-medium">Finance</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-sub hover:bg-primary-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </a>
                        </nav>

                        <div className="mt-4 flex flex-col gap-2">
                            <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                            <div className="flex items-center gap-3 rounded-xl bg-background-light p-3 dark:bg-background-dark/50">
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A')}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="truncate text-sm font-bold text-text-main dark:text-white">{userData?.fullName || 'Admin User'}</p>
                                    <p className="truncate text-xs text-text-sub">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex flex-1 flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
                    {/* Top Header */}
                    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-light bg-surface-light px-6 dark:bg-surface-dark dark:border-border-dark">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-text-sub hover:text-primary">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <h1 className="text-xl font-bold text-text-main dark:text-white">Vendor Management</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-[20px]">search</span>
                                <input className="h-10 w-64 rounded-lg border-none bg-background-light pl-10 text-sm text-text-main focus:ring-2 focus:ring-primary dark:bg-surface-dark dark:text-white placeholder:text-text-sub outline-none" placeholder="Search vendors..." type="text" />
                            </div>
                            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-background-light text-text-sub hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-surface-dark"></span>
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-background-light text-text-sub hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">help</span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            {/* Action Bar & Filters */}
                            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">All Vendors</h2>
                                    <p className="text-sm text-text-sub mt-1">Manage and monitor vehicle partners across all regions</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <button className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm font-medium text-text-main hover:bg-background-light transition-colors dark:bg-surface-dark dark:border-border-dark dark:text-white">
                                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                        Filter
                                    </button>
                                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark transition-colors shadow-sm shadow-primary/30">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        Add Vendor
                                    </button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="mb-6 flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                                <button className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                                    All
                                </button>
                                <button className="flex shrink-0 items-center gap-2 rounded-full bg-surface-light px-4 py-1.5 text-sm font-medium text-text-sub hover:bg-background-light border border-border-light dark:bg-surface-dark dark:border-border-dark transition-colors">
                                    Verified
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background-light text-xs font-bold text-text-sub dark:bg-background-dark">12</span>
                                </button>
                                <button className="flex shrink-0 items-center gap-2 rounded-full bg-surface-light px-4 py-1.5 text-sm font-medium text-text-sub hover:bg-background-light border border-border-light dark:bg-surface-dark dark:border-border-dark transition-colors">
                                    Pending Review
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">4</span>
                                </button>
                                <button className="flex shrink-0 items-center gap-2 rounded-full bg-surface-light px-4 py-1.5 text-sm font-medium text-text-sub hover:bg-background-light border border-border-light dark:bg-surface-dark dark:border-border-dark transition-colors">
                                    Suspended
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">1</span>
                                </button>
                            </div>

                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {/* Card 1 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <img alt="Apex Rentals Logo" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-t0Gd5tB73fs8DORfeZQnY9jlCvvq2WmVvJW4W7D3pulUp8PeX2FN0047q1hkODwYauei_X6yHPhHec0tH-XruyDP77vYVPeZueCywa3brbyQF8Qv3cixNpCVeGjzrDF-1sQLYfB9_XUxOPrQSAD2aH0dzt873sHlUdFBTGzyFpusrmOd5urbGZNl-uYqUa4rl5p7vfyiM8GYH6lYzoeCXB8Rw7bDgyxFAbXNMPxVShCnLXPkmECZH4qvOlTHbmqmzokS2ACv-OM" />
                                            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">Apex Rentals</h3>
                                        <p className="text-sm text-text-sub">North America</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">Verified</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">124</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">4.8</span>
                                                <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                                        View Profile
                                    </button>
                                </div>

                                {/* Card 2 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <img alt="Urban Mobility Logo" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtbU6wlMmAnoCDJ-mkt1dRI1dRvotJ32Fevy8u4UK4Red29OSATIAbGTeZc5HUTas7Rp1Fk8qLaP-ElwwDqUpcbIuwMopJI-wMfVhNrrDy2CBhvTK0LEn0xeEh1kT8q6p8ndNO5_vqDAkUunZQuAmOlKn-a02sxqJVe2Ei4gVbTB8XI1NCgzj4I75VC2WkiKgDWWaWy5qFTFMUd670xy4F8qczeP5w6ljKDl3lzvCgW6n_7poxWSTtVZVOXD156evsoCZV1PXXs8o" />
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">Urban Mobility</h3>
                                        <p className="text-sm text-text-sub">Europe</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400">Pending Review</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">45</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">-</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                                        Review App
                                    </button>
                                </div>

                                {/* Card 3 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <img alt="BlueWave Tours Logo" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjIA8Dfe2u3Y3HWmjaGXQAZobIuz0HsNU-oSmQ39HSVorj99sGJZV1o9Gd8qWQRbPkqS95BE3ZmdqSfrFapsSue_SoecReCKDx0xAQPeMNcjUjEH6XaJcBvSfgDYdD-id2krYsoy3AKecYcjS7zdpFbvWjSN28-Dos0A2ZVb-Ty_Pizm5kAZBo7muTOuLSUD2pC3XgMt067ce-Avy4VwHAO0ljGJQUiIKPRVnS0rF3IpwsSaXfME-SrNTvuOK5OANp6cpJ_FdDcYI" />
                                            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">BlueWave Tours</h3>
                                        <p className="text-sm text-text-sub">Asia Pacific</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">Verified</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">89</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">4.9</span>
                                                <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                                        View Profile
                                    </button>
                                </div>

                                {/* Card 4 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">SR</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">Swift Rides</h3>
                                        <p className="text-sm text-text-sub">South America</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/30 dark:text-red-400">Suspended</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">12</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">3.2</span>
                                                <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
                                        Review Issue
                                    </button>
                                </div>

                                {/* Card 5 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <img alt="EcoTravel Logo" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRuJHzh5jPcfXRrxM44wxZOOPpfwi3mR4MUhFLc6SCzajv90Nj8_b7faN6p4eOUuRxp9rTvIFxYM4yepIDJHlRghb2KE6FdFIl1vVleHpOgDSjZ8AAMuM0BSs89u_4neMoGtcnKr7h-cs-y6Yp87HQOC97iQEx-YHdnNWG8DzTLC_IyARu3iZEsh7pNY_1JKl0KY6NkEAH2FQNfe8FxAZNYKLqvA5koRrJbEZERSNtyeJ9Rc90pFKhVcP17PSOryRVacobuCsAZA0" />
                                            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">EcoTravel</h3>
                                        <p className="text-sm text-text-sub">Europe</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">Verified</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">204</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">4.7</span>
                                                <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                                        View Profile
                                    </button>
                                </div>

                                {/* Card 6 */}
                                <div className="group relative flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                                    <div className="absolute right-4 top-4">
                                        <button className="text-text-sub hover:text-primary">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-background-light dark:border-background-dark">
                                            <img alt="QuickVans Logo" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCubYyrEGGwE0AFyrnkLGm_zPsKYTJ7_eLJ4xwnX7PQ-beF6M76Lub2JfHqX4T1OaF6AxUYKy6Yk1EJ4ipp2FYZRtswIk-2g-tAn6lISr0RwlMG5YIKd97XbDpKQAfVrzRR-hCwjwclNjrKjUzLsp1aJuH2XU3IcA_TQLuz-42FXwvpzpKAErckHx7bfMtVoR3wvpQ_VZsLC4drByy0TlcH8Jc1bQlOquKnYmqtrlA9yz22rnF1Mixq_eRjScSCPopbbdSSCA6PU1Y" />
                                            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">QuickVans</h3>
                                        <p className="text-sm text-text-sub">North America</p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">Verified</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 divide-x divide-border-light border-t border-border-light pt-4 dark:divide-border-dark dark:border-border-dark">
                                        <div className="flex flex-col items-center px-2">
                                            <span className="text-lg font-bold text-text-main dark:text-white">56</span>
                                            <span className="text-xs text-text-sub">Vehicles</span>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-text-main dark:text-white">4.5</span>
                                                <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                            </div>
                                            <span className="text-xs text-text-sub">Rating</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex items-center justify-between border-t border-border-light pt-6 dark:border-border-dark">
                                <button className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light disabled:opacity-50 dark:border-border-dark dark:bg-surface-dark dark:text-text-sub transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Previous
                                </button>
                                <div className="flex items-center gap-2 hidden sm:flex">
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition-colors">1</button>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background-light text-sm font-medium text-text-sub dark:hover:bg-surface-dark transition-colors">2</button>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background-light text-sm font-medium text-text-sub dark:hover:bg-surface-dark transition-colors">3</button>
                                    <span className="text-text-sub">...</span>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background-light text-sm font-medium text-text-sub dark:hover:bg-surface-dark transition-colors">12</button>
                                </div>
                                <button className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light disabled:opacity-50 dark:border-border-dark dark:bg-surface-dark dark:text-text-sub transition-colors">
                                    Next
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';

export default function VehicleDetailPage() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarVehicles, setSimilarVehicles] = useState([]);

    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };
    const getNextDays = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    };

    const [pickupDate, setPickupDate] = useState(getTomorrow());
    const [dropoffDate, setDropoffDate] = useState(getNextDays(4));

    const calculateDays = () => {
        if (!pickupDate || !dropoffDate) return 1;
        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'vehicles', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setVehicle({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
            setLoading(false);
        };

        const fetchSimilar = async () => {
            try {
                const q = query(collection(db, 'vehicles'), limit(5));
                const querySnapshot = await getDocs(q);
                const vehicleList = [];
                querySnapshot.forEach((doc) => {
                    if (doc.id !== id) {
                        vehicleList.push({ id: doc.id, ...doc.data() });
                    }
                });
                setSimilarVehicles(vehicleList.slice(0, 4));
            } catch (error) {
                console.error("Error fetching similar vehicles:", error);
            }
        };

        if (id) {
            fetchVehicle();
            fetchSimilar();
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!vehicle) {
        return <div className="min-h-screen flex items-center justify-center">Vehicle not found.</div>;
    }

    const mainPhoto = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuCnLIOPACe22ZPumUYgM_mwhk5GRhc8GVlmzXsidO-HopzGwoZbyZu6CHwjKrG1yGkUX88RpbiySMrlyCH2d-lfjN88SkqXYAx328hztgzmkSqXAfLlWVwI81P38hhcK9NzVoTJG3aXb_zyYWfNtkDKatX0frxgtx83UJqvVFBHA9d5rbiqOIWWp2I8Y6DWEZZ4-qwx48IG6DufWDcHc714wEXjmAddH8Qv1sGz2SbGnKg0mw5cuBliYkVi1iNrlPYhtAoM7IyVB-A";

    const days = calculateDays();
    const carTotal = (vehicle.dailyRate || 0) * days;
    const taxes = 45;
    const total = carTotal + taxes;

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen flex flex-col font-display">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-4 text-text-primary-light dark:text-text-primary-dark">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-4xl">directions_car</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Voyage Rentals</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-9">
                        <Link to="/" className="text-text-primary-light dark:text-text-primary-dark hover:text-primary text-sm font-medium leading-normal transition-colors">Cars</Link>
                        <Link to="/" className="text-text-primary-light dark:text-text-primary-dark hover:text-primary text-sm font-medium leading-normal transition-colors">Buses</Link>
                        <Link to="/search" className="text-text-primary-light dark:text-text-primary-dark hover:text-primary text-sm font-medium leading-normal transition-colors">Vans</Link>
                        <a className="text-text-primary-light dark:text-text-primary-dark hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Deals</a>
                        <a className="text-text-primary-light dark:text-text-primary-dark hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Support</a>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
                    <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full relative">
                            <div className="text-text-secondary-light absolute left-3 top-2.5">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-slate-100 dark:bg-slate-800 h-full placeholder:text-text-secondary-light px-4 pl-10 text-base font-normal leading-normal" placeholder="Search vehicles..." />
                        </div>
                    </label>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-hover transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Sign In</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <Link to="/" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary font-medium">Home</Link>
                    <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">/</span>
                    <Link to="/search" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary font-medium capitalize">{vehicle.vehicleType || "Vehicle"}</Link>
                    <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">/</span>
                    <span className="text-text-primary-light dark:text-text-primary-dark font-medium">{vehicle.vehicleName}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <div className="w-full h-[400px] rounded-xl overflow-hidden relative group">
                                <img alt={vehicle.vehicleName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={mainPhoto} />
                                <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors text-text-primary-light dark:text-white">
                                    <span className="material-symbols-outlined text-lg">grid_view</span>
                                    Show all photos
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {vehicle.photos && vehicle.photos.map((photo, index) => (
                                    <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                        <img className="w-full h-full object-cover" src={photo} alt={`${vehicle.vehicleName} photo ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Title & Basic Info */}
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{vehicle.vehicleName}</h1>
                                    <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide capitalize">{vehicle.vehicleType}</span>
                                        <span>•</span>
                                        <span>2023 Model</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                            <span className="font-bold text-text-primary-light dark:text-text-primary-dark">4.9</span>
                                            <span className="text-text-secondary-light dark:text-text-secondary-dark font-normal">(12 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Share">
                                        <span className="material-symbols-outlined">ios_share</span>
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Save">
                                        <span className="material-symbols-outlined">favorite_border</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Vehicle Features</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary text-2xl">airline_seat_recline_normal</span>
                                    <div>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Seats</p>
                                        <p className="font-bold">{vehicle.seatCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary text-2xl">local_gas_station</span>
                                    <div>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Fuel Type</p>
                                        <p className="font-bold capitalize">{vehicle.fuelType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary text-2xl">settings</span>
                                    <div>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Transmission</p>
                                        <p className="font-bold capitalize">{vehicle.transmission}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-bold mb-3">About this vehicle</h3>
                            <div className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed space-y-4 whitespace-pre-wrap">
                                <p>{vehicle.description || "No description provided."}</p>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                            <h3 className="text-xl font-bold mb-6">Guest Reviews</h3>
                            <div className="flex flex-col md:flex-row gap-8 mb-8">
                                <div className="flex flex-col gap-2 min-w-[150px]">
                                    <p className="text-5xl font-black leading-tight tracking-[-0.033em] text-text-primary-light dark:text-text-primary-dark">4.9</p>
                                    <div className="flex gap-0.5 text-yellow-400">
                                        <span className="material-symbols-outlined fill-current">star</span>
                                        <span className="material-symbols-outlined fill-current">star</span>
                                        <span className="material-symbols-outlined fill-current">star</span>
                                        <span className="material-symbols-outlined fill-current">star</span>
                                        <span className="material-symbols-outlined fill-current">star</span>
                                    </div>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">Based on 124 reviews</p>
                                </div>

                                <div className="flex-1 grid grid-cols-[30px_1fr_40px] items-center gap-y-2 gap-x-3">
                                    <span className="text-sm font-medium">5</span>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[85%] rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-right">85%</span>

                                    <span className="text-sm font-medium">4</span>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[10%] rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-right">10%</span>

                                    <span className="text-sm font-medium">3</span>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[3%] rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-right">3%</span>

                                    <span className="text-sm font-medium">2</span>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[1%] rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-right">1%</span>

                                    <span className="text-sm font-medium">1</span>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[1%] rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-right">1%</span>
                                </div>
                            </div>

                            {/* Individual Review */}
                            <div className="space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <img alt="User Avatar" className="w-full h-full object-cover" data-alt="portrait of a smiling man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg2I-sUgihwx_vp3xBIxhmb6Wvjqm3J5zmskOOVdWuZJmri6oHZ6okHMkPmHcH9hnkbR3qcJvGJ6SEbDq0J8Me57MVfwbN9mw9HyGsTFtWW5kQ0fVWRqErCDURK12Ljyg3_RdeznJAL1k6Y-yEWTACUY8BURrVlFnCfuS8xm9XXBYKUuhZkzWHs5LkA-dLdsteIxDZxA_mZ5ACE-oYR_55M53wqXvRAOCQ8NUtI-SYylwjPHARmU9SULX0ay9sMou1l-UYUDZV0nY" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Michael Roberts</h4>
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">October 15, 2023</p>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">The van was in excellent condition and perfect for our family reunion trip. Plenty of space for everyone and their bags. The Bluetooth sound system was a great touch for the long drive. Highly recommended!</p>
                                </div>
                                <div className="pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            JS
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">September 22, 2023</p>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">Seamless booking process and pickup. The staff was very helpful in explaining all the features of the Sprinter. Drives like a dream despite its size.</p>
                                </div>
                                <button className="w-full py-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Show all 124 reviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-primary">${vehicle.dailyRate || 0}</span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark">/ day</span>
                                </div>
                                <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded font-medium">
                                    Available Now
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1">Pick-up Date</label>
                                        <div className="relative">
                                            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" type="date" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1">Drop-off Date</label>
                                        <div className="relative">
                                            <input value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" type="date" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1">Pick-up Location</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                                        <option>San Francisco International Airport (SFO)</option>
                                        <option>Downtown San Francisco</option>
                                        <option>Oakland International Airport (OAK)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price Calculation */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                                <div className="flex justify-between text-text-secondary-light dark:text-text-secondary-dark">
                                    <span>${vehicle.dailyRate || 0} x {days} days</span>
                                    <span>${carTotal}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary-light dark:text-text-secondary-dark">
                                    <span>Taxes &amp; Fees</span>
                                    <span>${taxes}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2 flex justify-between font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                                    <span>Estimated Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link to={`/book/${vehicle.id}`} state={{ pickupDate, dropoffDate }} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center">
                                    Book Now
                                </Link>
                                <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">You won't be charged yet</p>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-primary">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Need help booking?</h4>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Call our customer support team 24/7 for assistance with your reservation.</p>
                                    <a className="text-primary text-sm font-bold mt-2 inline-block hover:underline" href="#">+1 (800) 123-4567</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Vehicles */}
                <div className="mt-16 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarVehicles.map((simVehicle) => (
                            <div key={simVehicle.id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
                                <Link to={`/vehicle/${simVehicle.id}`} className="block relative h-48 overflow-hidden">
                                    <img alt={simVehicle.vehicleName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={simVehicle.photos && simVehicle.photos.length > 0 ? simVehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuC5LU9kN60fsu_9Aa06_uGCoEgjs7lhZv7JcGtx8g9Q8J6yNzbnlsu0TNxNgIns0ROovMpU3MIeAHLK79ZQ1IrYW_Oz_lzUVcqvwYaK0twbLO7bbLRLP8gRVpRjTTG4i-0MtKkg2tyd5IUCqRT7sL6t3d9_rjJHIqVU7jdqLykoAKVcGr7ERbglIxe1rUqZzeUSvZcwwug-HvrMbOV3A3xwMKQCWOwnc90vFgN_HOchTxvbq3G4qCkLdAkRmMEy7zp5mq99gmEaT8o"} />
                                    <div className="absolute top-3 right-3 bg-white dark:bg-black/70 rounded-full p-1.5 shadow-sm">
                                        <span className="material-symbols-outlined text-sm block">favorite</span>
                                    </div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-text-primary-light shadow-sm capitalize">
                                        {simVehicle.vehicleType}
                                    </div>
                                </Link>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg truncate pr-2">
                                            <Link to={`/vehicle/${simVehicle.id}`}>{simVehicle.vehicleName}</Link>
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm font-bold">
                                            <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">star</span>
                                            4.7
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3 capitalize">{simVehicle.seatCount} Seats • {simVehicle.transmission} • {simVehicle.fuelType}</p>
                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <div>
                                            <span className="text-lg font-bold text-primary">${simVehicle.dailyRate || 0}</span>
                                            <span className="text-xs text-text-secondary-light">/ day</span>
                                        </div>
                                        <Link to={`/vehicle/${simVehicle.id}`} className="px-3 py-1.5 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary hover:text-white transition-colors">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-12 px-10">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-6 text-primary">
                                <span className="material-symbols-outlined text-2xl">directions_car</span>
                            </div>
                            <h2 className="text-lg font-bold">Voyage Rentals</h2>
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">Making group travel easy, comfortable, and memorable since 2010.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <li><a className="hover:text-primary" href="#">About Us</a></li>
                            <li><a className="hover:text-primary" href="#">Careers</a></li>
                            <li><a className="hover:text-primary" href="#">Blog</a></li>
                            <li><a className="hover:text-primary" href="#">Press</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <li><a className="hover:text-primary" href="#">Help Center</a></li>
                            <li><a className="hover:text-primary" href="#">Terms of Service</a></li>
                            <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary" href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Newsletter</h4>
                        <div className="flex gap-2">
                            <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm flex-1" placeholder="Your email" type="email" />
                            <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-primary-hover">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    © 2023 Voyage Rentals. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

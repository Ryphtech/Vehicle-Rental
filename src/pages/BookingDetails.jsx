import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function BookingDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Dates passed from previous page, default to tomorrow and 3 days later
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

    // Extract passed state or use defaults
    const [pickupDate, setPickupDate] = useState(location.state?.pickupDate || getTomorrow());
    const [dropoffDate, setDropoffDate] = useState(location.state?.dropoffDate || getNextDays(4));

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: currentUser?.email || '',
        phone: '',
        licenseNumber: ''
    });

    const [addons, setAddons] = useState({
        gps: false,
        childSeat: false,
        insurance: false
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'vehicles', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setVehicle({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No vehicle found!");
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
            setLoading(false);
        };
        fetchVehicle();
    }, [id]);

    const calculateDays = () => {
        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddonToggle = (addon) => {
        setAddons(prev => ({ ...prev, [addon]: !prev[addon] }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.licenseNumber) {
            alert("Please fill in all required driver details.");
            return;
        }

        setProcessing(true);
        const days = calculateDays();
        const dailyRate = vehicle?.dailyRate || 0;
        const carTotal = dailyRate * days;
        const taxes = 45;
        const addonTotal = (addons.gps ? 15 * days : 0) + (addons.childSeat ? 10 * days : 0) + (addons.insurance ? 25 * days : 0);
        const totalPrice = carTotal + taxes + addonTotal;

        try {
            const bookingData = {
                vehicleId: id,
                vendorId: vehicle.vendorId || 'unknown',
                userId: currentUser?.uid || 'guest',
                driverDetails: formData,
                addons: addons,
                pricing: {
                    dailyRate,
                    days,
                    carTotal,
                    taxes,
                    addonTotal,
                    totalPrice
                },
                dates: {
                    pickupDate,
                    dropoffDate
                },
                status: 'pending',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            // Navigate to payment page or success
            navigate(`/payment/${docRef.id}`, { state: { bookingRef: docRef.id, totalPrice } });
        } catch (error) {
            console.error("Error creating booking:", error);
            alert(`Failed to create booking. ${error.message}`);
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-display">Loading booking details...</div>;
    }

    if (!vehicle) {
        return <div className="min-h-screen flex items-center justify-center font-display">Vehicle not found.</div>;
    }

    const days = calculateDays();
    const carTotal = (vehicle.dailyRate || 0) * days;
    const addonTotal = (addons.gps ? 15 * days : 0) + (addons.childSeat ? 10 * days : 0) + (addons.insurance ? 25 * days : 0);
    const taxes = 45;
    const total = carTotal + taxes + addonTotal;
    return (
        <div className="bg-background-light font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-4 md:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-slate-900 ">
                    <div className="size-8 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">local_taxi</span>
                    </div>
                    <Link to="/" className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Wheels Live</Link>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-9">
                        <Link to="/" className="text-slate-900 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                        <Link to="/search" className="text-slate-900 text-sm font-medium hover:text-primary transition-colors">Vehicles</Link>
                        <a className="text-slate-900 text-sm font-medium hover:text-primary transition-colors" href="#">Locations</a>
                        <a className="text-slate-900 text-sm font-medium hover:text-primary transition-colors" href="#">Help</a>
                    </nav>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                        <span className="truncate">Log In</span>
                    </button>
                </div>
                <button className="md:hidden text-slate-900 ">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center py-6 px-4 md:px-10">
                <div className="w-full max-w-7xl flex flex-col">
                    {/* Progress Bar */}
                    <div className="w-full mb-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm font-medium text-slate-500 ">
                                <span className="text-primary font-bold">1. Details &amp; Add-ons</span>
                                <span>2. Review &amp; Payment</span>
                                <span>3. Confirmation</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-1/3 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Title Section */}
                            <div className="space-y-2">
                                <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight">Booking Details</h1>
                                <p className="text-slate-500 text-base">Enter your information and select optional add-ons for your trip.</p>
                            </div>

                            {/* Driver Details Form */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 ">
                                <h2 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Driver Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="block">
                                        <span className="text-slate-900 text-sm font-medium mb-2 block">First Name *</span>
                                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="e.g. John" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-slate-900 text-sm font-medium mb-2 block">Last Name *</span>
                                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Doe" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-slate-900 text-sm font-medium mb-2 block">Email Address *</span>
                                        <input name="email" value={formData.email} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="john.doe@example.com" type="email" />
                                    </label>
                                    <label className="block">
                                        <span className="text-slate-900 text-sm font-medium mb-2 block">Phone Number *</span>
                                        <input name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="+1 (555) 000-0000" type="tel" />
                                    </label>
                                    <label className="block md:col-span-2">
                                        <span className="text-slate-900 text-sm font-medium mb-2 block">Driver's License Number *</span>
                                        <input name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="Enter license number" type="text" />
                                    </label>
                                </div>
                            </section>

                            {/* Add-ons Selection */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 ">
                                <h2 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">add_circle</span>
                                    Optional Add-ons
                                </h2>

                                <div className="space-y-4">
                                    {/* GPS Addon */}
                                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined">explore</span>
                                            </div>
                                            <div>
                                                <h3 className="text-slate-900 font-semibold">GPS Navigation System</h3>
                                                <p className="text-slate-500 text-sm">Reliable navigation for your journey.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-900 font-medium">$15 / day</span>
                                            <input checked={addons.gps} onChange={() => handleAddonToggle('gps')} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        </div>
                                    </label>

                                    {/* Child Seat Addon */}
                                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined">child_care</span>
                                            </div>
                                            <div>
                                                <h3 className="text-slate-900 font-semibold">Child Safety Seat</h3>
                                                <p className="text-slate-500 text-sm">Required for children under 5 years.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-900 font-medium">$10 / day</span>
                                            <input checked={addons.childSeat} onChange={() => handleAddonToggle('childSeat')} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        </div>
                                    </label>

                                    {/* Insurance Addon */}
                                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined">health_and_safety</span>
                                            </div>
                                            <div>
                                                <h3 className="text-slate-900 font-semibold">Full Protection Insurance</h3>
                                                <p className="text-slate-500 text-sm">Zero deductible coverage for peace of mind.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-900 font-medium">$25 / day</span>
                                            <input checked={addons.insurance} onChange={() => handleAddonToggle('insurance')} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <button onClick={handleCheckout} disabled={processing} className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                    {processing ? "Processing..." : "Continue to Payment"}
                                    {!processing && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Sticky Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                                {/* Card Header Image */}
                                <div className="h-40 w-full relative">
                                    <img alt={vehicle.vehicleName} className="w-full h-full object-cover" src={vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDSvFWwXHr56PZ8cSlfSvhpjFZeiVgz-o5zjGEe7d0vB1cTnYnUUAl60Q4Fj367Wglw1czF-noqEfY0lbeq0_Y8ezoJt9vDwExVnGQ035airoe7TDtqqlVP7DcwDWL2u5mERw7PADjAJPOfQVPvPZRQvQypa5mDRw0iUZ9PzDgvPAERTLxsJZFalAgd-O1SE7FGeDYUD3aSWT-zi-h-n2ohUbGRKWMRqQohRhtHWFublEwdYb68HLItMOMwKYfrD0UPSkgleTaruc"} />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-900 uppercase tracking-wider">
                                        {vehicle.vehicleType || "Vehicle"}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Vehicle Info */}
                                    <div className="mb-6 pb-6 border-b border-dashed border-slate-200 ">
                                        <h3 className="text-xl font-bold text-slate-900 ">{vehicle.vehicleName}</h3>
                                        <p className="text-slate-500 text-sm mb-3 capitalize">{vehicle.vehicleType || "Car"}</p>
                                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 ">
                                            <span className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">person</span> {vehicle.seatCount || 5} Seats
                                            </span>
                                            <span className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1 capitalize">
                                                <span className="material-symbols-outlined text-sm">settings</span> {vehicle.transmission || "Auto"}
                                            </span>
                                            <span className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1 capitalize">
                                                <span className="material-symbols-outlined text-sm">local_gas_station</span> {vehicle.fuelType || "Petrol"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Trip Details */}
                                    <div className="mb-6 space-y-4">
                                        <div className="flex gap-3">
                                            <div className="mt-1 text-primary">
                                                <span className="material-symbols-outlined text-sm filled">calendar_today</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium uppercase">Dates</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="text-sm font-semibold text-slate-900 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-primary w-32" />
                                                    <span className="text-slate-400">to</span>
                                                    <input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="text-sm font-semibold text-slate-900 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-primary w-32" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="space-y-3 pt-4 border-t border-slate-200 ">
                                        <div className="flex justify-between text-sm text-slate-600 ">
                                            <span>Car Rental ({days} days)</span>
                                            <span className="font-medium">${carTotal.toFixed(2)}</span>
                                        </div>
                                        {addons.gps && (
                                            <div className="flex justify-between text-sm text-slate-600 ">
                                                <span>GPS Add-on</span>
                                                <span className="font-medium">${(15 * days).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {addons.childSeat && (
                                            <div className="flex justify-between text-sm text-slate-600 ">
                                                <span>Child Seat Add-on</span>
                                                <span className="font-medium">${(10 * days).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {addons.insurance && (
                                            <div className="flex justify-between text-sm text-slate-600 ">
                                                <span>Insurance Add-on</span>
                                                <span className="font-medium">${(25 * days).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm text-slate-600 border-t border-slate-100 pt-2">
                                            <span>Taxes &amp; Fees</span>
                                            <span className="font-medium">${taxes.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Total Price</p>
                                            <p className="text-2xl font-black text-slate-900 ">${total.toFixed(2)}</p>
                                        </div>
                                        <Link to={`/vehicle/${id}`} className="text-primary text-sm font-bold hover:underline">View details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2023 Wheels Live Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="text-slate-500 hover:text-primary text-sm transition-colors" href="#">Privacy Policy</a>
                        <a className="text-slate-500 hover:text-primary text-sm transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

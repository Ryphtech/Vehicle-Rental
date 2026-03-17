import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VendorAddVehicle() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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

    const [formData, setFormData] = useState({
        vehicleName: '',
        vehicleType: '',
        brand: '',
        seatCount: 4,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        features: {
            airConditioning: true,
            bluetooth: true,
            gpsNavigation: false,
            childSeat: false,
            wheelchairAccess: false,
            tintedWindows: false,
        },
        dailyRate: 120
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                features: {
                    ...prev.features,
                    [name]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("You must be logged in to add a vehicle.");
            return;
        }

        try {
            setLoading(true);

            // Upload images first
            const uploadedPhotoUrls = [];
            for (const file of imageFiles) {
                const fileRef = ref(storage, `vehicles/${currentUser.uid}/${Date.now()}_${file.name}`);
                await uploadBytes(fileRef, file);
                const url = await getDownloadURL(fileRef);
                uploadedPhotoUrls.push(url);
            }

            // Fallback photos if none uploaded
            const finalPhotos = uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC3LmHwRn6qTAiDe8iQvDoGoOuB9o3GM8YvY3-ly9tBtkCRFzGD5gwiuKUupjJlLSMY7wQUlSNLNSws73S03M2avQUaEgcgJofoGIwpQOGiHO7OXXsy_FXxZU6hQbXbN7mIegEJbj56MoIYmdJQpdqOuhK6H5L4jj1zPgXbwdXIQu7WcVf-lYE4zXZy7QdfD-OxhqTHU3cGOnktNFMkWYyqJtTNd3vMYzrkKxdhO3iAvoq18hSVD5-A4HSgyEEjHsRGIqovMFnzLjc"
            ];

            await addDoc(collection(db, 'vehicles'), {
                ...formData,
                vendorId: currentUser.uid,
                createdAt: new Date().toISOString(),
                photos: finalPhotos
            });
            toast.success("Vehicle successfully listed!");
            navigate('/vendor');
        } catch (error) {
            toast.error("Error adding vehicle: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light text-slate-900 font-display antialiased flex flex-col min-h-screen">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">Vendor Portal</span>
                        </div>
                        {/* Navigation Links */}
                        <nav className="hidden md:flex gap-8">
                            <Link to="/vendor" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/vendor/bookings" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Bookings</Link>
                            <Link to="/vendor" className="text-sm font-medium text-primary font-semibold">My Fleet</Link>
                            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#earnings">Earnings</a>
                        </nav>
                        {/* User Profile */}
                        <div className="relative group cursor-pointer inline-block">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-slate-900">{userData?.fullName || 'Vendor'}</span>
                                    <span className="text-xs text-slate-500">Premium Vendor</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold ring-2 ring-white shadow-sm">
                                    {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'V')}
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
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl">
                    {/* Header Section */}
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Vehicle</h1>
                        <p className="text-slate-500">List your vehicle on our platform to reach thousands of travelers.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8">
                            <form className="space-y-8" onSubmit={handleSave}>
                                {/* Step 1: Basic Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="material-symbols-outlined text-primary">info</span>
                                        <h3 className="text-lg font-bold text-slate-900">Vehicle Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Vehicle Name */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Name</label>
                                            <input
                                                name="vehicleName"
                                                value={formData.vehicleName}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g. Mercedes-Benz V-Class 2023"
                                                type="text"
                                            />
                                            <p className="mt-1 text-xs text-slate-400">This will be the main title of your listing.</p>
                                        </div>
                                        {/* Vehicle Type */}
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Type</label>
                                            <div className="relative">
                                                <select
                                                    name="vehicleType"
                                                    value={formData.vehicleType}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none transition-all"
                                                >
                                                    <option disabled value="">Select a type</option>
                                                    <option value="car">Car (Sedan/SUV)</option>
                                                    <option value="van">Van / Minivan</option>
                                                    <option value="bus">Bus / Coach</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Brand */}
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Brand / Make</label>
                                            <input
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g. Toyota, Ford, Mercedes"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Specifications */}
                                <div className="space-y-6 pt-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="material-symbols-outlined text-slate-400">settings</span>
                                        <h3 className="text-lg font-bold text-slate-900">Specifications</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Seat Count</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px]">airline_seat_recline_normal</span>
                                                </span>
                                                <input
                                                    name="seatCount"
                                                    value={formData.seatCount}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="4"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                                                </span>
                                                <select
                                                    name="fuelType"
                                                    value={formData.fuelType}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none transition-all"
                                                >
                                                    <option value="Petrol">Petrol</option>
                                                    <option value="Diesel">Diesel</option>
                                                    <option value="Electric">Electric</option>
                                                    <option value="Hybrid">Hybrid</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Transmission</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                                                </span>
                                                <select
                                                    name="transmission"
                                                    value={formData.transmission}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none transition-all"
                                                >
                                                    <option value="Automatic">Automatic</option>
                                                    <option value="Manual">Manual</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">Key Features</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="airConditioning" checked={formData.features.airConditioning} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Air Conditioning</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="bluetooth" checked={formData.features.bluetooth} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Bluetooth</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="gpsNavigation" checked={formData.features.gpsNavigation} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">GPS Navigation</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="childSeat" checked={formData.features.childSeat} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Child Seat</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="wheelchairAccess" checked={formData.features.wheelchairAccess} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Wheelchair Access</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input name="tintedWindows" checked={formData.features.tintedWindows} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary outline-none" type="checkbox" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Tinted Windows</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Pricing & Availability */}
                                <div className="space-y-6 pt-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="material-symbols-outlined text-slate-400">payments</span>
                                        <h3 className="text-lg font-bold text-slate-900">Pricing &amp; Availability</h3>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="w-full md:w-1/3 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Daily Rental Rate ($)</label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">$</span>
                                                    <input
                                                        name="dailyRate"
                                                        value={formData.dailyRate}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-8 text-lg font-semibold text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                        placeholder="0.00"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-primary/10 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
                                                    <p className="text-xs text-primary font-medium leading-relaxed">Tip: Vehicles priced between $100-$150 see 40% more bookings in your region.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Availability Calendar (Coming Soon)</label>
                                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center opacity-70">
                                                <span className="text-slate-500 text-sm italic">Calendar integration is locked for this demo.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Photos */}
                                <div className="space-y-6 pt-6 mb-12">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="material-symbols-outlined text-slate-400">imagesmode</span>
                                        <h3 className="text-lg font-bold text-slate-900">Vehicle Photos</h3>
                                    </div>
                                    <div className="w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/50 hover:bg-slate-50 rounded-xl cursor-pointer transition-all group relative">
                                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="mb-3 p-3 rounded-full bg-blue-50 text-primary shadow-sm border border-slate-100 group-hover:bg-blue-100 transition-colors">
                                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                                </div>
                                                <p className="mb-1 text-sm text-slate-600 font-medium"><span className="text-primary font-bold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-slate-400">PNG, JPG or WEBP (MAX. 5MB per image)</p>
                                            </div>
                                        </label>

                                        {imagePreviews.length > 0 && (
                                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[4/3]">
                                                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); removeImage(index); }}
                                                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-sm block">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions - Moved fully inside form to act as submit */}
                                <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-between items-center -mx-8 -mb-8 mt-12 rounded-b-xl">
                                    <Link to="/vendor" className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-white hover:text-slate-900 transition-colors">
                                        Cancel
                                    </Link>
                                    <div className="flex gap-3">
                                        <button disabled={loading} className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:bg-blue-400" type="submit">
                                            {loading ? 'Submitting...' : 'List Vehicle'}
                                            {!loading && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

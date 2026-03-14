import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Unique high-quality car images from Unsplash (each vehicle gets its own image)
const MOCK_VEHICLES = [
    {
        vehicleName: "Toyota Camry 2023",
        vehicleType: "car",
        brand: "Toyota",
        seatCount: 5,
        fuelType: "Hybrid",
        transmission: "Automatic",
        dailyRate: 65,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80"]
    },
    {
        vehicleName: "Mercedes-Benz Sprinter",
        vehicleType: "van",
        brand: "Mercedes",
        seatCount: 12,
        fuelType: "Diesel",
        transmission: "Automatic",
        dailyRate: 150,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: true, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"]
    },
    {
        vehicleName: "Ford Mustang GT",
        vehicleType: "car",
        brand: "Ford",
        seatCount: 4,
        fuelType: "Petrol",
        transmission: "Manual",
        dailyRate: 140,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: false, childSeat: false, wheelchairAccess: false, tintedWindows: false },
        photos: ["https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800&q=80"]
    },
    {
        vehicleName: "Honda Odyssey",
        vehicleType: "van",
        brand: "Honda",
        seatCount: 8,
        fuelType: "Petrol",
        transmission: "Automatic",
        dailyRate: 95,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1547027159-b7d665fe7c7b?w=800&q=80"]
    },
    {
        vehicleName: "Volvo XC90",
        vehicleType: "car",
        brand: "Volvo",
        seatCount: 7,
        fuelType: "Hybrid",
        transmission: "Automatic",
        dailyRate: 130,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"]
    },
    {
        vehicleName: "Tesla Model 3",
        vehicleType: "car",
        brand: "Tesla",
        seatCount: 5,
        fuelType: "Electric",
        transmission: "Automatic",
        dailyRate: 110,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80"]
    },
    {
        vehicleName: "BMW X5",
        vehicleType: "car",
        brand: "BMW",
        seatCount: 5,
        fuelType: "Petrol",
        transmission: "Automatic",
        dailyRate: 145,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"]
    },
    {
        vehicleName: "Chevrolet Suburban",
        vehicleType: "suv",
        brand: "Chevrolet",
        seatCount: 8,
        fuelType: "Petrol",
        transmission: "Automatic",
        dailyRate: 125,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"]
    },
    {
        vehicleName: "Ford Transit Custom",
        vehicleType: "van",
        brand: "Ford",
        seatCount: 9,
        fuelType: "Diesel",
        transmission: "Manual",
        dailyRate: 105,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: false, childSeat: false, wheelchairAccess: true, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80"]
    },
    {
        vehicleName: "Volkswagen Transporter",
        vehicleType: "van",
        brand: "Volkswagen",
        seatCount: 9,
        fuelType: "Diesel",
        transmission: "Automatic",
        dailyRate: 115,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80"]
    },
    {
        vehicleName: "Luxury Coach 50-Seater",
        vehicleType: "bus",
        brand: "Volvo",
        seatCount: 50,
        fuelType: "Diesel",
        transmission: "Automatic",
        dailyRate: 450,
        features: { airConditioning: true, bluetooth: false, gpsNavigation: true, childSeat: false, wheelchairAccess: true, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"]
    },
    {
        vehicleName: "Mini Bus 24-Seater",
        vehicleType: "bus",
        brand: "Mercedes",
        seatCount: 24,
        fuelType: "Diesel",
        transmission: "Manual",
        dailyRate: 280,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: false, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&q=80"]
    },
    {
        vehicleName: "Hyundai Tucson",
        vehicleType: "suv",
        brand: "Hyundai",
        seatCount: 5,
        fuelType: "Petrol",
        transmission: "Automatic",
        dailyRate: 85,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1616788494672-ec7ca9534769?w=800&q=80"]
    },
    {
        vehicleName: "Kia Carnival",
        vehicleType: "van",
        brand: "Kia",
        seatCount: 8,
        fuelType: "Diesel",
        transmission: "Automatic",
        dailyRate: 110,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"]
    },
    {
        vehicleName: "Range Rover Sport",
        vehicleType: "suv",
        brand: "Land Rover",
        seatCount: 5,
        fuelType: "Hybrid",
        transmission: "Automatic",
        dailyRate: 195,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1506016421802-1ba6c5b7b220?w=800&q=80"]
    },
    {
        vehicleName: "Audi A6",
        vehicleType: "car",
        brand: "Audi",
        seatCount: 5,
        fuelType: "Petrol",
        transmission: "Automatic",
        dailyRate: 155,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"]
    },
    {
        vehicleName: "Porsche Cayenne",
        vehicleType: "suv",
        brand: "Porsche",
        seatCount: 5,
        fuelType: "Hybrid",
        transmission: "Automatic",
        dailyRate: 220,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"]
    },
    {
        vehicleName: "Nissan Leaf",
        vehicleType: "car",
        brand: "Nissan",
        seatCount: 5,
        fuelType: "Electric",
        transmission: "Automatic",
        dailyRate: 75,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: false },
        photos: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"]
    },
    {
        vehicleName: "Toyota Land Cruiser",
        vehicleType: "suv",
        brand: "Toyota",
        seatCount: 8,
        fuelType: "Diesel",
        transmission: "Automatic",
        dailyRate: 175,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: true, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80"]
    },
    {
        vehicleName: "Lexus ES 350",
        vehicleType: "car",
        brand: "Lexus",
        seatCount: 5,
        fuelType: "Hybrid",
        transmission: "Automatic",
        dailyRate: 135,
        features: { airConditioning: true, bluetooth: true, gpsNavigation: true, childSeat: false, wheelchairAccess: false, tintedWindows: true },
        photos: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80"]
    }
];

export default function DevTools() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [status, setStatus] = useState('');

    const seedData = async () => {
        if (!currentUser) {
            setStatus("Error: Must be logged in to seed data. Vehicles need a vendorId.");
            toast.error("Must be logged in to seed data.");
            return;
        }

        setLoading(true);
        setStatus("Seeding data... please wait.");
        let count = 0;

        try {
            for (const vehicle of MOCK_VEHICLES) {
                await addDoc(collection(db, 'vehicles'), {
                    ...vehicle,
                    vendorId: currentUser.uid,
                    seeded: true, // Tag for easy removal
                    createdAt: new Date().toISOString()
                });
                count++;
            }
            setStatus(`✅ Success! Added ${count} vehicles with unique images.`);
            toast.success(`Added ${count} vehicles!`);
        } catch (error) {
            console.error("Error seeding data:", error);
            setStatus("Error: " + error.message);
            toast.error("Error seeding data.");
        } finally {
            setLoading(false);
        }
    };

    const removeSeededData = async () => {
        if (!currentUser) {
            setStatus("Error: Must be logged in.");
            toast.error("Must be logged in.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete all seeded vehicles for your account? This cannot be undone.")) return;

        setRemoving(true);
        setStatus("Removing seeded vehicles...");
        let count = 0;

        try {
            // Query all vehicles tagged as seeded for this user
            const q = query(
                collection(db, 'vehicles'),
                where('vendorId', '==', currentUser.uid),
                where('seeded', '==', true)
            );
            const snapshot = await getDocs(q);
            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, 'vehicles', docSnap.id));
                count++;
            }
            setStatus(`🗑️ Removed ${count} seeded vehicles from the database.`);
            toast.success(`Removed ${count} vehicles.`);
        } catch (error) {
            console.error("Error removing data:", error);
            setStatus("Error: " + error.message);
            toast.error("Error removing data.");
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            <Navbar />
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-slate-800">Developer Options</h1>
                <p className="text-slate-500 text-sm mb-8">Manage mock data for development and testing purposes.</p>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold text-slate-700 border-b pb-3">Database Actions</h2>

                    {/* Seed Data */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-slate-800">Seed Mock Vehicles</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Adds {MOCK_VEHICLES.length} vehicles (each with a unique image) to the database, tagged with your user ID. Useful for testing search and filtering quickly.
                            </p>
                        </div>
                        <button
                            onClick={seedData}
                            disabled={loading || removing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">database</span>
                            {loading ? 'Seeding Database...' : 'Seed Mock Vehicles'}
                        </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Remove Data */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-slate-800">Remove Seeded Data</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Deletes all vehicles that were added using the seed button above (tagged <code className="bg-slate-100 px-1 rounded text-xs">seeded: true</code>). Only removes your own seeded data.
                            </p>
                        </div>
                        <button
                            onClick={removeSeededData}
                            disabled={loading || removing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">delete_sweep</span>
                            {removing ? 'Removing...' : 'Remove Seeded Vehicles'}
                        </button>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${status.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {status}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <a href="/" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}

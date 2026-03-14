import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function VehicleSearchResults() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [capacity, setCapacity] = useState('any');
    const [transmission, setTransmission] = useState('any');

    const handleTypeChange = (type) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const handleReset = () => {
        setSearchTerm('');
        setMaxPrice(1000);
        setSelectedTypes([]);
        setCapacity('any');
        setTransmission('any');
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const q = query(collection(db, 'vehicles'));
                const querySnapshot = await getDocs(q);
                const vehicleList = [];
                querySnapshot.forEach((doc) => {
                    vehicleList.push({ id: doc.id, ...doc.data() });
                });
                setVehicles(vehicleList);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const vName = v.vehicleName?.toLowerCase() || '';
            const vType = v.vehicleType?.toLowerCase() || '';
            const matchSearch = vName.includes(searchTerm.toLowerCase()) || vType.includes(searchTerm.toLowerCase());

            const matchPrice = (v.dailyRate || 100) <= maxPrice;

            const matchType = selectedTypes.length === 0 || selectedTypes.includes(vType);

            let matchCapacity = true;
            if (capacity !== 'any') {
                const seats = v.seatCount || 4;
                if (capacity === '2-4') matchCapacity = seats >= 2 && seats <= 4;
                else if (capacity === '5-7') matchCapacity = seats >= 5 && seats <= 7;
                else if (capacity === '8+') matchCapacity = seats >= 8;
            }

            const vTrans = v.transmission?.toLowerCase() || 'automatic';
            const matchTransmission = transmission === 'any' || vTrans === transmission;

            return matchSearch && matchPrice && matchType && matchCapacity && matchTransmission;
        });
    }, [vehicles, searchTerm, maxPrice, selectedTypes, capacity, transmission]);
    return (
        <div className="bg-background-light text-slate-900 font-display flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 flex justify-center py-5 px-4 md:px-10 lg:px-20 bg-background-light">
                <div className="flex flex-col max-w-[1200px] flex-1 w-full">
                    <div className="flex flex-wrap gap-2 p-4 items-center text-sm">
                        <Link to="/" className="text-slate-500 font-medium hover:text-primary">Home</Link>
                        <span className="text-slate-500 material-symbols-outlined text-xs pt-0.5">chevron_right</span>
                        <a className="text-slate-500 font-medium hover:text-primary" href="#">Search</a>
                        <span className="text-slate-500 material-symbols-outlined text-xs pt-0.5">chevron_right</span>
                        <span className="text-slate-900 font-medium">Results</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 mt-4">
                        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                            <div className="bg-sidebar-bg rounded-xl p-5 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                                    <button onClick={handleReset} className="text-sm text-primary font-medium hover:underline">Reset</button>
                                </div>

                                <div className="border-b border-slate-200 pb-5 mb-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-slate-900 font-semibold text-sm">Max Price (Daily)</p>
                                        <p className="text-primary font-bold text-sm">${maxPrice}</p>
                                    </div>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="20"
                                            max="1000"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>$20</span>
                                            <span>$1000+</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-slate-200 pb-5 mb-5">
                                    <p className="text-slate-900 font-semibold mb-3 text-sm">Vehicle Type</p>
                                    <div className="flex flex-col gap-3">
                                        {['car', 'suv', 'van', 'bus', 'convertible'].map(type => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => handleTypeChange(type)}
                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-white cursor-pointer"
                                                />
                                                <span className="text-slate-700 text-sm group-hover:text-primary transition-colors capitalize">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-b border-slate-200 pb-5 mb-5">
                                    <p className="text-slate-900 font-semibold mb-3 text-sm">Passenger Capacity</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['any', '2-4', '5-7', '8+'].map(cap => (
                                            <label key={cap} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="capacity"
                                                    value={cap}
                                                    checked={capacity === cap}
                                                    onChange={() => setCapacity(cap)}
                                                    className="peer sr-only"
                                                />
                                                <div className="flex items-center justify-center py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all shadow-sm capitalize hover:border-slate-300">
                                                    {cap}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <p className="text-slate-900 font-semibold mb-3 text-sm">Transmission</p>
                                    <div className="flex flex-col gap-3">
                                        {['any', 'automatic', 'manual'].map(trans => (
                                            <label key={trans} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="transmission"
                                                    value={trans}
                                                    checked={transmission === trans}
                                                    onChange={() => setTransmission(trans)}
                                                    className="w-4 h-4 border-slate-300 text-primary focus:ring-primary bg-white cursor-pointer"
                                                />
                                                <span className="text-slate-700 text-sm group-hover:text-primary transition-colors capitalize">{trans}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <main className="flex-1 flex flex-col min-w-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h1 className="text-slate-900 text-3xl font-bold leading-tight">Available Vehicles</h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 text-sm whitespace-nowrap">Sort by:</span>
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary focus:outline-none shadow-sm">
                                            Recommended
                                            <span className="material-symbols-outlined text-sm">expand_more</span>
                                        </button>
                                    </div>
                                    <div className="flex bg-white border border-slate-200 rounded-lg p-1 ml-2 shadow-sm">
                                        <button className="p-1.5 rounded bg-slate-100 text-primary">
                                            <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                                        </button>
                                        <button className="p-1.5 rounded text-slate-400 hover:text-slate-600">
                                            <span className="material-symbols-outlined text-[20px] block">view_list</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {loading ? (
                                    <div className="col-span-full py-20 text-center text-slate-500">
                                        Loading vehicles...
                                    </div>
                                ) : filteredVehicles.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-slate-500">
                                        No vehicles found. Expand your search or check back later!
                                    </div>
                                ) : (
                                    filteredVehicles.map((vehicle) => (
                                        <div key={vehicle.id} className="bg-card-bg rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl shadow-sm transition-all hover:border-primary/50 group flex flex-col h-full">
                                            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                                <img alt={vehicle.vehicleName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuBfYfPSYxglIbcm0vlL4EpYiqARWzXhisZVKTTq835Lz52Fqthz1KKdrPIGRQ--2jngPbB2HeenFKDldEHVbcr4whDD0KkQDKX3KBi0Z6I8osWMnTbLABm8JRVci-ui9QQA2PcrjFi7v5-S1CY1XpAcZaMrh7uXDP0fm_MUG8Ylbn1gvQOo-1fYw4ZSj1NzytmeoQBQ-z8nwu90P1NUub_Xq1xgfdAQWQ7Xca7Q3SfMx4psuXQ7GPx2pdsh9t9KNYX8E4rRxIv0kNA"} />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-slate-900 shadow-sm">
                                                    <span className="material-symbols-outlined text-yellow-500 text-sm fill-current">star</span>
                                                    4.8
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 capitalize">{vehicle.vehicleType || "Car"}</p>
                                                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{vehicle.vehicleName}</h3>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">group</span><span>{vehicle.seatCount || 4} Seats</span></div>
                                                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">local_gas_station</span><span className="capitalize">{vehicle.fuelType || "Petrol"}</span></div>
                                                    {vehicle.features?.airConditioning && <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">ac_unit</span><span>AC</span></div>}
                                                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">settings</span><span className="capitalize">{vehicle.transmission || "Automatic"}</span></div>
                                                </div>
                                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-xl font-bold text-slate-900">${vehicle.dailyRate || 100}</span>
                                                            <span className="text-xs text-slate-500">/ day</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/vehicle/${vehicle.id}`} className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm hover:shadow-md block text-center">Book Now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-center justify-center mt-12 mb-8 gap-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">3</button>
                                <span className="text-slate-400 px-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">12</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

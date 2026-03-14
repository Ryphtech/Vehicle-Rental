import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function Home() {
    const [featuredVehicles, setFeaturedVehicles] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const q = query(collection(db, 'vehicles'), limit(3));
                const querySnapshot = await getDocs(q);
                const vehicleList = [];
                querySnapshot.forEach((doc) => {
                    vehicleList.push({ id: doc.id, ...doc.data() });
                });
                setFeaturedVehicles(vehicleList);
            } catch (error) {
                console.error("Error fetching featured vehicles:", error);
            }
        };

        fetchFeatured();
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <section
                    className="relative py-12 lg:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[600px] bg-cover bg-center bg-no-repeat"
                    data-alt="Scenic winding road through mountains during a road trip"
                    style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAziCK-Bmyi6pCvxzo3-SDiNF49B2WUjgGSD7Osw9vbGxks_MGOJiYhxINDIXRHW6_oZCvt5l6o_YsG3l8c4rduj9e9IH6PI65YDgZcBapR6r1lW_gCAqHme010WzGUVh_a7SeVbUuKX3yMik1eo8SJbjkI1E3qK6c9uB_ngxGXIzqH5bJqMXG22ugPq9P8IgBe_801r9F02VmoaNZ31p_OYs0CpVnAlrBdFyTuUzZEe1dDNzX0idbYBLrojChs0XSz7d9_Lnp4S8")' }}
                >
                    <div className="text-center max-w-3xl mx-auto mb-10 z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-4 drop-shadow-lg">
                            Start Your Journey Today
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
                            Rent the perfect car, bus, or van for your next adventure. Premium fleet, affordable prices.
                        </p>
                    </div>
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-border-subtle p-6 z-10">
                        <div className="flex flex-col gap-2 mb-6">
                            <h2 className="text-text-main text-lg font-bold">Find Your Ride</h2>
                            <div className="flex flex-wrap gap-3">
                                <label className="cursor-pointer group">
                                    <input defaultChecked className="peer sr-only" name="vehicle_type" type="radio" />
                                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 peer-checked:bg-blue-50 peer-checked:border-primary peer-checked:text-primary transition-all hover:border-slate-400 hover:bg-white">
                                        <span className="material-symbols-outlined text-[20px]">directions_car</span>
                                        <span className="text-sm font-bold">Car</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input className="peer sr-only" name="vehicle_type" type="radio" />
                                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 peer-checked:bg-blue-50 peer-checked:border-primary peer-checked:text-primary transition-all hover:border-slate-400 hover:bg-white">
                                        <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                                        <span className="text-sm font-bold">Bus</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input className="peer sr-only" name="vehicle_type" type="radio" />
                                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 peer-checked:bg-blue-50 peer-checked:border-primary peer-checked:text-primary transition-all hover:border-slate-400 hover:bg-white">
                                        <span className="material-symbols-outlined text-[20px]">airport_shuttle</span>
                                        <span className="text-sm font-bold">Van</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-bold text-text-main mb-2">Pickup Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted">location_on</span>
                                    </div>
                                    <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-300 text-text-main placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white" placeholder="City or Airport" type="text" />
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-bold text-text-main mb-2">Drop-off Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted">location_on</span>
                                    </div>
                                    <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-300 text-text-main placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white" placeholder="City or Airport" type="text" />
                                </div>
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-sm font-bold text-text-main mb-2">Pick-up &amp; Drop-off Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted">calendar_month</span>
                                    </div>
                                    <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-300 text-text-main placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white" placeholder="Add dates" type="text" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Link to="/search" className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200">
                                    <span className="material-symbols-outlined">search</span>
                                    Search
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-background-light">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-text-main mb-2">Featured Vehicles</h2>
                            <p className="text-text-muted">Choose from our top-rated fleet for your next trip.</p>
                        </div>
                        <a className="text-primary font-semibold hover:text-blue-700 flex items-center gap-1" href="#">
                            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="group bg-white rounded-xl overflow-hidden border border-border-subtle shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col h-full">
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img alt={vehicle.vehicleName} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuBEiL-PxKsihVHORLQjl9nyCFE5DgdTwc_Gv4lRWC-v5xc9J_r4TcvTQvBqWYMHo4ZFxu4yLlRkcZ-bAm4vQ0arUv7n-PO6Gep4rzUJZJ1cLB11VK4If6NhgZLC29ii_5ONsWJfgsD3hCmYzqc9l92AbnbWs2NbbpDj_dk4uO8rUJ5ip5Ub9sDyTerDhCERXmQQphATE3RmPPlRXN4bwhUHwjNjQ9Qm9CiOmgoLIUWNGZ5nM40kXDwoz8MICYu58CgG06CaIVVW4Q8"} />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-xs font-bold text-text-main shadow-sm capitalize">
                                        {vehicle.vehicleType || "Vehicle"}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-text-main line-clamp-1">{vehicle.vehicleName}</h3>
                                        <span className="text-primary font-bold whitespace-nowrap">${vehicle.dailyRate || 100}<span className="text-sm text-text-muted font-normal">/day</span></span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">person</span> {vehicle.seatCount || 4}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">local_gas_station</span> {vehicle.fuelType || "Petrol"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">settings</span> {vehicle.transmission || "Auto"}
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Link to={`/vehicle/${vehicle.id}`} className="w-full py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors block text-center">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-16 bg-background-alt">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-text-main mb-4">Why Choose Wheels Live?</h2>
                            <p className="text-text-muted max-w-2xl mx-auto">We provide the best experience for your journey with top-notch services and reliable vehicles.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 rounded-xl bg-white border border-border-subtle text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-2">Safe &amp; Reliable</h3>
                                <p className="text-text-muted">All our vehicles are regularly inspected and maintained to ensure your safety on the road.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white border border-border-subtle text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <span className="material-symbols-outlined text-3xl">headset_mic</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-2">24/7 Support</h3>
                                <p className="text-text-muted">Our dedicated support team is available around the clock to assist you with any questions.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white border border-border-subtle text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <span className="material-symbols-outlined text-3xl">savings</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-2">Best Price Guarantee</h3>
                                <p className="text-text-muted">We offer competitive pricing and no hidden fees, ensuring you get the best value for money.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-background-light">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-text-main mb-4">Top Destinations</h2>
                        <p className="text-text-muted">Explore the most popular routes and destinations our customers love.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative group rounded-xl overflow-hidden cursor-pointer h-64 shadow-md">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="New York City skyline during day" data-location="New York City" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSYDVj66Vxd3gX728IDjPXfzqgQd5UDNe2yBK609ooFx9e0NU2b1JXfkh0YQkgM-Il_9s6KzdeRQFEmUX8vjaCU6IDevijyNhd7Idls9UX3eJfvKS3SVMkIXwY56pr14YbtEBDEOh-BU9pvzNHCgO67G2YXEPftKbQ6jjX9HZdEp91tLmmP6jRIrhvdfo9Y9N2WMiRI1giyYEaQ8LV4Bo_FId-eak0ibTgpzo0PMCV8ZwJ7yor0ZcAKrI4SqkF6k0aeZ0H1tgseCw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-lg">New York</h3>
                                <p className="text-sm opacity-90">50+ Vehicles Available</p>
                            </div>
                        </div>
                        <div className="relative group rounded-xl overflow-hidden cursor-pointer h-64 shadow-md">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Golden Gate Bridge in San Francisco" data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasmmUpbGcDePxIXBI9XgLU3X9Q3dLZ__OrqzJ7LFyDo9Y-VKSoJ3gnPdXxN8K_BiIft5v1lBGbXWR0A3OPmsqiQpPY-YGc_a0ZEisZMqkzuvLzo39soT3qFh9SUAxy0VNwPxdS0IXS4P6_IAbti8VUfXu9XJ7NT31PxqubWZDFITs6KSuJqAQIdbj9q4yIfunKfI8SUTf99vAnA9r34dqcgGbNxIUtF3XzuZEIOej2JZwfhAJ6BVXlfQNvqesoVlYhgtz6uEevL0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-lg">San Francisco</h3>
                                <p className="text-sm opacity-90">35+ Vehicles Available</p>
                            </div>
                        </div>
                        <div className="relative group rounded-xl overflow-hidden cursor-pointer h-64 shadow-md">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Beautiful Swiss Alps mountains" data-location="Swiss Alps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtz28bMXNjOuDqywvRH0hfjfZBp9MAYaWlKiDZmf3_JXgxQA3MjGPVPfM2w1kjk62gdUbAGkKBsd843pLV-YBrXMz-_z4X9B7Tax20DjESDkkBE7iB5oOn0tFdfZDg8Gbk8-w55gMH70W5Q9Eeou4SIvnJV9jyzGTAmjVwqy4VZ1LVBgf29hOuFTJ495KIgPJ4-gBhxJw30ivBKscMX1nmBCm6ogq62VLnG9Yherxd_ZpWRTFKm6IEuiDb1Uy0txk03Z7BBBWzLMc" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-lg">Swiss Alps</h3>
                                <p className="text-sm opacity-90">20+ Vehicles Available</p>
                            </div>
                        </div>
                        <div className="relative group rounded-xl overflow-hidden cursor-pointer h-64 shadow-md">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Sunny beach road in Miami" data-location="Miami" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhwNhxvTW3u4W-j3SMR4LIT1Oes5FVYRXUyGuKHvBz8q-VMeJtY0N1eVjNAlEi7znvHyBuc0FffzYYyNorTDsP0KghQbvNvToJCVFwyRLTtRTS51CdSWNuHtXJR0oxtklyOaVevP5HMfjamNKMtPwfl-LgU0ZnFK9y25Uca7vL2xCUA0OXXNqApNoLlIyoIZGSSSRNwoRkaCQVgeRlmizgc2IphR3NZ0tee2pr7jL_RGZfVbQZT__rH1MfMWAeou4UxnODRVTpbWM" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-lg">Miami</h3>
                                <p className="text-sm opacity-90">45+ Vehicles Available</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-6">
                            <span className="text-primary font-bold tracking-widest uppercase text-sm">Established 2012</span>
                            <h2 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Our Story</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Founded with a vision to simplify group and individual travel, our platform has grown from a local startup to a comprehensive global booking system. We bridge the gap between travelers and quality transport providers, ensuring every mile traveled is a mile enjoyed.
                            </p>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Over the past decade, we have partnered with over 500 premium transport providers and served millions of travelers across 30 countries. Our commitment to technology-driven logistics has transformed how groups plan their road travel.
                            </p>
                            <div className="flex gap-10 mt-4">
                                <div>
                                    <div className="text-3xl font-bold text-primary">10k+</div>
                                    <div className="text-slate-500 text-sm">Active Vehicles</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">1M+</div>
                                    <div className="text-slate-500 text-sm">Happy Travelers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">500+</div>
                                    <div className="text-slate-500 text-sm">Partner Agencies</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <img className="w-full h-full object-cover" data-alt="Two colleagues looking at a travel map and logistics software" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1uUtEktmA_ZIOap0Xhc4ePQ3XaLtqWShuCL4BhpmlYtoKqdFHDq3kcbfL8cxvVG_mlg8CuNkTfHGmCOIdY5cXdj7wiCudoU1K6RYhuH5RltMIXFrpUNbXsbvVayVLMzjRDZdpNb2Qb6x9veZeD_owMD8lD1soQ5nw8aFJFojO1zWYy-jlNOqfI6gt2WCnBTyk85-RrJB4Aq0IjqeEdmeSI5-_z62pTsuEzP_Hat4SOYUpCMUY7bVhSetCgGbaRKLPJkdQBTlZQMg" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-[240px] border border-slate-100 dark:border-slate-700">
                                <p className="text-primary font-bold italic">"We don't just move vehicles, we move memories."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-slate-900 text-4xl font-black mb-4">Core Values</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">The principles that drive every decision we make and every journey we facilitate.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-background-light p-8 hover:shadow-lg transition-all border-b-4 border-b-primary">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">visibility</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-slate-900 text-xl font-bold">Transparency</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        No hidden fees, no surprise charges. We believe in clear, upfront pricing and honest communication at every step of your booking.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-background-light p-8 hover:shadow-lg transition-all border-b-4 border-b-primary">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-slate-900 text-xl font-bold">Reliability</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        All vehicles undergo rigorous safety inspections and background checks. When you book with us, you book peace of mind.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-background-light p-8 hover:shadow-lg transition-all border-b-4 border-b-primary">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">favorite</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-slate-900 text-xl font-bold">Customer-First</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Your comfort and safety are our absolute priority. Our 24/7 support team is always ready to assist you during your journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-slate-900 text-4xl font-black mb-4">Meet the Leadership</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">The visionaries behind Wheels Live's success.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Professional headshot of male CEO in a suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwGh7k18R41KNATx153dMWnY48oFpccs03dteI-85WPa35BOWzmCSpZn0utCWtdap8GY8U2KucwzUfTJOogKfRcPt4c-qdivmB7sTjqn2KwQunSbfTcSJPwpwT3fvNw_hgPXsjq3rjqBc2PT4TfdP67MAxnB21cFhgMl76s2lhuwNp2RqYsWwMOORehf7JphS3NE6dA-F8taLOg0fqX0ITO61CaJnGc-uZNJbm_yH-nTuqECElL-QBGTuhLj61utBYy_nI-6n5A-s" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-slate-900 text-lg font-bold">Marcus Chen</h3>
                            <p className="text-primary text-sm font-medium uppercase tracking-wider">CEO &amp; Founder</p>
                        </div>
                        <div className="group">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Professional headshot of female COO in office attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWirvhn60YHFe7QWWrTbpEugHlwKy2OaQiY9l181zlFwnSz4kYbFrVV2d96jXSxrYU2tgIFQisDJU2a9T7WY5AgT5-0M9kWFhV96NPYEMdRPZqcFIkt_f70tEvxBAmchRH1nrFCVubaQ1ocHnuL0nsDtOdpb6UAIv4vBVBKB1SqeUgZr2YCRDLORvpGGj8Ts0cCeF4Qa0lgTtSZ7vlr0O06_zPzF_DqTlVEdMxBXEvEu9trTVPbZ2em0uY2S9CRMrEiPj3d7sPl9c" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-slate-900 text-lg font-bold">Sarah Jenkins</h3>
                            <p className="text-primary text-sm font-medium uppercase tracking-wider">COO</p>
                        </div>
                        <div className="group">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Professional headshot of male CTO with tech background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1oCSDLj8B6fgr6iY9vdhEp9mCsdfUfjvgWyrrcgVmO6uLPXbb9q8l8qv5EBYoS5RYgrwZ_FHjhfUIZ_w8B8osDBodh6tbYi9os_MxtN0hYjmmcXn9DvCaSS3-RGMjCnbVh0CugSimQ0DsJauCInoExh24tLpWnMQ52br2kZrjNjvleflGjEo_m4RFcLEAkBzeFXyNLwMmWIUfTo97oFWnSAJ7URMlRFysODwRFIisKlK7z9HDwr0kgfPaDamPWGUT7X33RNAsxlU" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-slate-900 text-lg font-bold">David Rivera</h3>
                            <p className="text-primary text-sm font-medium uppercase tracking-wider">Head of Engineering</p>
                        </div>
                        <div className="group">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Professional headshot of female Marketing Director" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6G19poM_FMIvRmbUXW_MvaOIzMikhqLkLt9CTi7vvr0VtCXLTQ9QbCxDO52EFXDnxIZUuQCdntAjS-WLB_KI__x_eUV-QlPUDJ_n2rf6bNVTFP_31G73n9rKCDz3HM9pVacBAl5zisjL4VZuVFQQWN3i-xbSbxCd1XpO3BPT4a4rZ5VHhUooZvprBtGJa2kEKTmcINVuA6LSCQPDjeerQKnKjtDeHgFkMuVCaYaHJPkYLwoPc_Rl3fDenf747H8UqIXrN_eNnWsY" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-slate-900 text-lg font-bold">Elena Vance</h3>
                            <p className="text-primary text-sm font-medium uppercase tracking-wider">Director of Partnerships</p>
                        </div>
                    </div>
                </section> */}
            </main>

            <footer className="bg-slate-50 border-t border-border-subtle pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-text-main mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
                                <h3 className="text-xl font-bold">Wheels Live</h3>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-4">
                                Your trusted partner for road trips, group travel, and luxury transport. We connect you with the best wheels for your journey.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-text-main font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-text-main font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-text-main font-bold mb-4">Newsletter</h4>
                            <p className="text-text-muted text-sm mb-4">Subscribe to get the latest offers and travel tips.</p>
                            <div className="flex gap-2">
                                <input className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-text-main placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Email address" type="email" />
                                <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2024 Wheels Live. All rights reserved.</p>
                        <div className="flex gap-4 text-slate-400">
                            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">rss_feed</span></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

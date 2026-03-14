import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ReviewAndPayment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: routeId } = useParams(); // Could be passed as /payment/:id

    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);

    // Get booking ID either from state or URL params
    const bookingId = location.state?.bookingRef || routeId;
    const passedTotal = location.state?.totalPrice;

    useEffect(() => {
        if (!bookingId) {
            navigate('/');
            return;
        }

        const fetchDetails = async () => {
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBookingData(data);

                    // Fetch vehicle info for summary
                    if (data.vehicleId) {
                        const vRef = doc(db, 'vehicles', data.vehicleId);
                        const vSnap = await getDoc(vRef);
                        if (vSnap.exists()) {
                            setVehicleData(vSnap.data());
                        }
                    }
                } else {
                    console.error("No booking found");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching payment details:", error);
            }
        };

        fetchDetails();
    }, [bookingId, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update booking status in Firestore to confirmed
            const docRef = doc(db, 'bookings', bookingId);
            await updateDoc(docRef, {
                status: 'confirmed',
                paymentDate: new Date().toISOString(),
                paymentMethod: 'Credit Card', // Hardcoded for demo
                amountPaid: bookingData?.pricing?.totalPrice || passedTotal
            });

            toast.success("Payment successful! Your booking is confirmed.");
            navigate('/'); // Could go to a specific "Success" page later
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) {
        return <div className="min-h-screen flex items-center justify-center font-display">Loading secure payment portal...</div>;
    }

    const { pricing, dates, driverDetails } = bookingData;
    return (
        <div className="bg-background-light font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-slate-900">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">directions_car</span>
                    </div>
                    <Link to="/" className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Wheels Live</Link>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9 hidden md:flex">
                        <Link to="/" className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal">Home</Link>
                        <Link to="/search" className="text-slate-900 font-semibold text-sm leading-normal">Vehicles</Link>
                        <a className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">My Bookings</a>
                        <a className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Support</a>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRI6yAuwDNe9bFhPs3lKN0D4ZmiNAIrwBwppZX2uRwxKAN9z3K8m6Lvdko-d_EN7XwFXlpShkjTuwoajN12-BMPu32ESE47U7DtG7krRcarIJZd3AdMb0EYafx6KsGC521oQntZLSw4ONP86Ml0UXtd2oTErq-9FANgjVjj84N_3uii13SO_jI03aZXGIfK2P1L7pPzDvdFIjxwKBC_UFTygGFvwT3z3fV8N0akHibx2-jqjIcKUTU1XlgXDrmJh62skd076XPk_4")' }}></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-[1200px] flex flex-col gap-8">
                    {/* Progress Stepper */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <div>
                                <p className="text-slate-900 text-2xl font-bold leading-tight">Review &amp; Payment</p>
                                <p className="text-slate-500 text-sm mt-1">Step 2 of 3</p>
                            </div>
                            <p className="text-primary font-bold text-sm">66% Completed</p>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-2">
                            <span className="text-slate-500">1. Details &amp; Add-ons</span>
                            <span className="text-primary font-bold">2. Review &amp; Payment</span>
                            <span>3. Confirmation</span>
                        </div>
                        <div className="rounded-full bg-slate-200 h-2 overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '66%' }}></div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Payment & Review */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* Payment Method Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    Payment Method
                                </h3>
                                <div className="flex flex-col gap-4 mb-8">
                                    <label className="group relative flex items-center gap-4 rounded-xl border border-primary bg-primary/5 p-4 cursor-pointer transition-all">
                                        <input defaultChecked className="h-5 w-5 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent" name="payment_method" type="radio" />
                                        <div className="flex grow flex-col">
                                            <div className="flex justify-between items-center w-full">
                                                <p className="text-slate-900 text-base font-semibold">Credit or Debit Card</p>
                                                <div className="flex gap-2">
                                                    <div className="h-6 w-10 bg-slate-200 rounded bg-contain bg-center bg-no-repeat" data-alt="Visa Logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCASUCFxu6Ts5TwNEhEkZVAcGdFijaQGpIeuAV0aDx7zACP1nAzXn6dyjMmeFtf9vnB3TCLIOqxgNIq6_nHidTqBzjneuK2QxmvEhrOsIgZ574xckxK9e-MTVAwklrT49l4-FT_8U_jlplHeRZU_rx3Dksm0EGjORVDapVugS0eQp1RTkZTOzTM7z6Z34LWdw1fyd-8nAuzJPtBmAKjlilP-Kdtcwho4YeiLyMvHLv37E9qWP1DCiDts_uw8uQF8k2cRFoLpA1QN9M")' }}></div>
                                                    <div className="h-6 w-10 bg-slate-200 rounded bg-contain bg-center bg-no-repeat" data-alt="Mastercard Logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFgubn0ekU3JRtGHtZfnHrodCf67eUqUfef_x70pUJS1LRP9ewVH1ffMNkk-nOQt9ZCxuQwLdPOa5qmaiSZPWqbkw0Cp9KgxQ6in7AqctJ_mwfew-ogs6HGvblvTwk-jRC0XMAUa7EGBbaTw0HgL8u6z_F00FDUISSNo8eu-QOuMMbUrR11cU1foG0DU30zXdqkYpKh7QvvmmnGrbdowHaknJlM2un_DT687PT0YBStLOalPb6C6Q-KFFEMruvEDsY3uEh-4gxUeY")' }}></div>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm mt-1">Pay securely with Visa, Mastercard, or Amex</p>
                                        </div>
                                    </label>

                                    {/* Card Details Form (Visible when Card is selected) */}
                                    <div className="pl-9 pr-2 pb-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-slate-400 text-xl">credit_card</span>
                                                </span>
                                                <input className="block w-full pl-10 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 outline-none px-3" placeholder="0000 0000 0000 0000" type="text" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiration Date</label>
                                            <input className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 outline-none px-3" placeholder="MM/YY" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">CVC / CVV</label>
                                            <div className="relative">
                                                <input className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 outline-none px-3" placeholder="123" type="text" />
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-help">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">help</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cardholder Name</label>
                                            <input className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 outline-none px-3" placeholder="Full Name on Card" type="text" />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-slate-300 transition-colors">
                                        <input className="h-5 w-5 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent" name="payment_method" type="radio" />
                                        <div className="flex grow flex-col">
                                            <p className="text-slate-900 text-base font-semibold">PayPal</p>
                                            <p className="text-slate-500 text-sm mt-1">Fast and secure checkout</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
                                    </label>
                                    <label className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-slate-300 transition-colors">
                                        <input className="h-5 w-5 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent" name="payment_method" type="radio" />
                                        <div className="flex grow flex-col">
                                            <p className="text-slate-900 text-base font-semibold">Digital Wallet</p>
                                            <p className="text-slate-500 text-sm mt-1">Apple Pay or Google Pay</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400">smartphone</span>
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 text-slate-50 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 dark:text-slate-600">
                                    <span className="material-symbols-outlined text-green-600 text-lg">lock</span>
                                    <p className="text-slate-600">Your payment information is encrypted and secure. We never store your CVV.</p>
                                </div>
                            </div>

                            {/* Booking Review Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">fact_check</span>
                                    Booking Review
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 h-40 rounded-lg bg-cover bg-center relative overflow-hidden group" style={{ backgroundImage: `url(${vehicleData?.photos?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDSvFWwXHr56PZ8cSlfSvhpjFZeiVgz-o5zjGEe7d0vB1cTnYnUUAl60Q4Fj367Wglw1czF-noqEfY0lbeq0_Y8ezoJt9vDwExVnGQ035airoe7TDtqqlVP7DcwDWL2u5mERw7PADjAJPOfQVPvPZRQvQypa5mDRw0iUZ9PzDgvPAERTLxsJZFalAgd-O1SE7FGeDYUD3aSWT-zi-h-n2ohUbGRKWMRqQohRhtHWFublEwdYb68HLItMOMwKYfrD0UPSkgleTaruc'})` }}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{vehicleData?.vehicleName || 'Vehicle Name Loading...'}</h4>
                                            <p className="text-slate-500 text-sm capitalize">{vehicleData?.vehicleType || 'Car'} • {vehicleData?.transmission || 'Auto'} • {vehicleData?.seatCount || 5} Seats</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pick-up</p>
                                                    <p className="text-slate-900 font-medium">{dates?.pickupDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <span className="material-symbols-outlined text-xl">event_available</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drop-off</p>
                                                    <p className="text-slate-900 font-medium">{dates?.dropoffDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 col-span-full">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <span className="material-symbols-outlined text-xl">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver Details</p>
                                                    <p className="text-slate-900 font-medium">{driverDetails?.firstName} {driverDetails?.lastName}</p>
                                                    <p className="text-slate-500 text-sm">{driverDetails?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Summary & Pay Button */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-24">
                                <h3 className="text-slate-900 text-xl font-bold mb-6">Booking Summary</h3>
                                <div className="space-y-4 mb-6 border-b border-slate-100 pb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Vehicle Rental ({pricing?.days || 1} days)</span>
                                        <span className="font-medium">${(pricing?.carTotal || 0).toFixed(2)}</span>
                                    </div>
                                    {pricing?.addonTotal > 0 && (
                                        <div className="flex justify-between text-slate-600">
                                            <span>Add-ons</span>
                                            <span className="font-medium">${(pricing.addonTotal).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-600">
                                        <span>Taxes &amp; Fees</span>
                                        <span className="font-medium">${(pricing?.taxes || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-slate-500 text-sm">Total Price</p>
                                        <p className="text-slate-900 text-3xl font-bold tracking-tight">${(pricing?.totalPrice || passedTotal || 0).toFixed(2)}</p>
                                    </div>
                                    <p className="text-slate-400 text-xs mb-1">USD</p>
                                </div>
                                <button onClick={handlePayment} disabled={loading} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:transform-none">
                                    <span>{loading ? 'Processing...' : 'Confirm & Pay'}</span>
                                    {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                                </button>
                                <div className="mt-6 flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                                    <div className="h-6 w-10 bg-contain bg-center bg-no-repeat" data-alt="Stripe Badge" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAK-zGjO97R6Jv2iYAqsiAXp1v5btE77vRxBDJwNmIHUgd_GXavBc-iPJwvxIxHDYPdO7JBKreuOswk653b1H8ZTPxneQZ_63izXTJ-YetQqfik_6RGeyGY-HcLu-P0W2TW2AcCMZAtWIJ0IIfnKfwhUBWlHugvElCrgdRlTbuq6MHE5jI9ERXr1e2anmfBybrQTjdUaUYRMuxFTsoAUk_cJ4_tfUWeHLFcmzJMdB1rFAcD41a50IA8PG5iSeM9RoN08P5-E7DrEg")' }}></div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-slate-500">verified_user</span>
                                        <span className="text-xs font-semibold text-slate-500">SSL Secure</span>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
                                    By clicking "Confirm &amp; Pay", you agree to our <a className="underline hover:text-primary" href="#">Terms of Service</a> and <a className="underline hover:text-primary" href="#">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            // Log in using Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore to check role
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                toast.success(`Welcome back${userData.firstName ? ', ' + userData.firstName : ''}!`);
                // Route appropriately based on user role
                if (userData.role === 'vendor') {
                    navigate('/vendor');
                } else {
                    navigate('/'); // General users or admins
                }
            } else {
                toast.success('Welcome back!');
                // Default to home if no doc explicitly states vendor
                navigate('/');
            }

        } catch (err) {
            setError('Failed to log in: ' + err.message);
            toast.error('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light font-display min-h-screen flex flex-col justify-center">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
                <div className="flex h-full grow flex-col justify-center items-center p-4 text-center md:text-left">
                    <div className="w-full max-w-[1100px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px] border border-slate-200">
                        {/* Left Side: Image */}
                        <div className="w-full md:w-1/2 bg-slate-100 relative hidden md:block">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8YUD-biK8WxbpCKXTZSrV0tV9gLplTRybJNa_0K5kL3yHMtEWXi4L0KH3tzqTleiRptHlalozs-DYgEc93IbOCKot4YNGxcu8Dy0ZQ_dR-BWjfuIyjy7DS1ITtZTOW7tRW0-vGSEbUd0Hg-d40yTX5C2kbTB7RSg7sW-cByQGTqyjThckdCxX7Ww13lrKb-WGGW5OFz1HEysIYV7y5unmbwvl0pN_yAAlqnZhFb0cojiBpRIEqEoaTlpiFUgoBZX32w6zVLgbm20')" }}>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Explore the world with comfort</h3>
                                <p className="text-slate-200">Book your perfect vehicle for your next adventure seamlessly.</p>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                            <div className="flex flex-col gap-6 max-w-[480px] mx-auto w-full">
                                {/* Header */}
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-3 mb-2 md:hidden">
                                        <div className="size-8 text-primary">
                                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">Wheels Live</h2>
                                    </div>

                                    <h1 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight text-left">
                                        Welcome Back
                                    </h1>
                                    <h2 className="text-slate-500 text-sm font-normal leading-normal text-left">
                                        Log in to manage your bookings and travel plans.
                                    </h2>
                                </div>

                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

                                {/* Login Form */}
                                <form className="flex flex-col gap-4 text-left" onSubmit={handleSignIn}>
                                    {/* Email Field */}
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-slate-900 text-sm font-medium">Email Address</span>
                                        <div className="flex w-full items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden h-12 transition-all">
                                            <div className="pl-4 text-slate-400 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                            </div>
                                            <input
                                                className="w-full h-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm px-3 outline-none"
                                                placeholder="name@example.com"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </label>

                                    {/* Password Field */}
                                    <label className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-900 text-sm font-medium">Password</span>
                                        </div>
                                        <div className="flex w-full items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden h-12 transition-all">
                                            <div className="pl-4 text-slate-400 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                            </div>
                                            <input
                                                className="w-full h-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm px-3 outline-none"
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="pr-4 text-slate-400 hover:text-primary flex items-center justify-center focus:outline-none"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </label>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary checked:bg-primary transition-colors outline-none" type="checkbox" />
                                            <span className="text-slate-600 text-sm">Remember me</span>
                                        </label>
                                        <a className="text-primary hover:text-blue-700 text-sm font-medium transition-colors" href="#">Forgot Password?</a>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full h-12 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm tracking-wide transition-colors mt-2 shadow-md hover:shadow-lg flex items-center justify-center disabled:bg-blue-400"
                                    >
                                        {loading ? 'Logging In...' : 'Log In'}
                                    </button>
                                </form>

                                {/* Sign Up Link */}
                                <div className="flex justify-center mt-4 text-center">
                                    <p className="text-slate-500 text-sm">
                                        Don't have an account?
                                        <Link className="text-primary font-bold hover:underline ml-1" to="/signup">Sign Up</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

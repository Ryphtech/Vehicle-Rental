import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('user'); // Default to normal user
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional info to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                email,
                phone,
                role,
                createdAt: new Date().toISOString()
            });

            // Redirect based on role
            toast.success('Account created successfully!');
            if (role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-slate-900">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <Link to="/" className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Wheels Live</Link>
                </div>
                <div className="flex flex-1 justify-end gap-8 hidden md:flex">
                    <div className="flex items-center gap-9">
                        <Link to="/" className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors">Home</Link>
                        <Link to="/search" className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors">Vehicles</Link>
                        <a className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">About</a>
                        <a className="text-slate-900 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Support</a>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/signup" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors">
                            <span className="truncate">Sign Up</span>
                        </Link>
                        <Link to="/signin" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 transition-colors">
                            <span className="truncate">Login</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-65px)]">
                {/* Left Split */}
                <div className="hidden md:flex w-1/2 bg-slate-100 relative overflow-hidden flex-col justify-between p-12">
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-cover bg-center opacity-90" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJobio40stTuFD2PwvAnVXzS3oEFBJMORepjSI0_F7CWDLBN-WMi5pZAbe8_Gncdeu_-JYymaoDBi5rZaI4vvOQcmI-E5pfj2pS7n3jlvECcP3ZQ8ok0Oc2w2bAhw-dJ3r_IBhBtuFf3yfieKBNUrqe63MMnOsnL_8JD8uasWpNCvHuh569v376q4bBS7jHzhNiDXcuYUWAUWC8yC2rqLR9QNT3cCfuetW4n6fyWyjSBLsucfIzu8jmaChmUXW3IAraIZSs7FtayI')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-white text-3xl">explore</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Start your journey with confidence.</h1>
                        <p className="text-slate-200 text-lg max-w-md">Join thousands of travelers booking cars, buses, and vans seamlessly across the globe.</p>
                    </div>
                </div>

                {/* Right Split: Form */}
                <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 overflow-y-auto">
                    <div className="w-full max-w-[480px]">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
                            <p className="text-slate-500">Enter your details to register and start booking vehicles.</p>
                        </div>

                        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

                        <form className="flex flex-col gap-5" onSubmit={handleSignUp}>

                            {/* Account Role Selection */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="role">Account Type</label>
                                <div className="relative">
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 appearance-none outline-none text-base font-normal leading-normal transition-all"
                                    >
                                        <option value="user">Customer (Looking to rent)</option>
                                        <option value="vendor">Vendor (List my vehicles)</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 text-base font-normal leading-normal placeholder:text-slate-400 transition-all outline-none"
                                    placeholder="e.g. John Doe"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 text-base font-normal leading-normal placeholder:text-slate-400 transition-all outline-none"
                                    placeholder="e.g. john@example.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 text-base font-normal leading-normal placeholder:text-slate-400 transition-all outline-none"
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Password Row */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="password">Password</label>
                                    <div className="relative flex w-full items-center">
                                        <input
                                            id="password"
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 pr-10 text-base font-normal leading-normal placeholder:text-slate-400 transition-all outline-none"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 text-slate-400 hover:text-primary flex items-center justify-center focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-slate-900 text-sm font-medium leading-normal" htmlFor="confirmPassword">Confirm</label>
                                    <div className="relative flex w-full items-center">
                                        <input
                                            id="confirmPassword"
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-300 bg-white h-12 px-4 pr-10 text-base font-normal leading-normal placeholder:text-slate-400 transition-all outline-none"
                                            placeholder="••••••••"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 text-slate-400 hover:text-primary flex items-center justify-center focus:outline-none"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={loading}
                                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 active:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:bg-blue-400"
                                type="submit"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?
                            <Link className="text-primary font-bold hover:underline ml-1" to="/signin">Log in</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

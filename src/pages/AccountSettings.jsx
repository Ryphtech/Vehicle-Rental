import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AccountSettings() {
    return (
        <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
            <Navbar />

            {/* Main Content Layout */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-full overflow-hidden" data-alt="User avatar">
                                    <img alt="John Doe" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv3Fe2Ewr0_cFDNVd-wT6v-io_rpoSn3x7QTL6BhHu0Dv9rjz3G3B5tXfqrYjHLZ45hpv6qtS9bFGjekXbGeqLIabxGNxpqOuLIEQrGN2EyHUc9cUcrvutFcgNSj1J0-wFvq1-qv7ImbnvrPeKoO6vJPbTH-ZkVdTmKP4HkVgFTxFJW8l6-X5H5-728zsSbpgt0_2SGYwhGPf9ugsg8wWr-i5lZTLMKDIKLFY1T05EdGgctHKeap7DSx2lfvcvm7_u9z0IOYIWTmY" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">John Doe</h3>
                                    <p className="text-xs text-slate-500">Premium Member</p>
                                </div>
                            </div>
                            <nav className="flex flex-col gap-1">
                                <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
                                    <span className="material-symbols-outlined">person</span>
                                    <span className="font-medium">Public Profile</span>
                                </a>
                                <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                                    <span className="material-symbols-outlined fill-1">settings</span>
                                    <span className="font-medium">Account Settings</span>
                                </Link>
                                <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
                                    <span className="material-symbols-outlined">payments</span>
                                    <span className="font-medium">Payment Methods</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
                                    <span className="material-symbols-outlined">history</span>
                                    <span className="font-medium">Booking History</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
                                    <span className="material-symbols-outlined">shield</span>
                                    <span className="font-medium">Privacy Data</span>
                                </a>
                                <div className="h-px bg-slate-100 my-2"></div>
                                <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors" href="#">
                                    <span className="material-symbols-outlined">logout</span>
                                    <span className="font-medium">Sign Out</span>
                                </a>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                            <p className="text-slate-500 mt-2">Manage your personal information, security preferences, and notifications.</p>
                        </div>

                        {/* Profile Information Section */}
                        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                                <button className="text-sm font-medium text-primary hover:text-blue-700 transition-colors">Edit details</button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" type="text" defaultValue="John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" type="email" defaultValue="john.doe@example.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" type="tel" defaultValue="+1 (555) 000-0000" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Address</label>
                                    <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" type="text" defaultValue="123 Travel Lane, Suite 100" />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">Save Profile Changes</button>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900">Security</h2>
                            </div>
                            <div className="p-6 space-y-8">
                                {/* Password Change */}
                                <div className="max-w-2xl">
                                    <h3 className="text-base font-semibold text-slate-900 mb-4">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="rounded-lg border-slate-200 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" placeholder="Current Password" type="password" />
                                        <div className="hidden md:block"></div>
                                        <input className="rounded-lg border-slate-200 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" placeholder="New Password" type="password" />
                                        <input className="rounded-lg border-slate-200 text-slate-900 focus:border-primary focus:ring-primary outline-none px-3 py-2 border transition-all" placeholder="Confirm New Password" type="password" />
                                    </div>
                                    <button className="mt-4 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">Update Password</button>
                                </div>
                                <div className="border-t border-slate-100 my-6"></div>

                                {/* 2FA */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">Two-Factor Authentication</h3>
                                        <p className="text-slate-500 text-sm mt-1">Add an extra layer of security to your account by enabling 2FA.</p>
                                    </div>
                                    <button aria-checked="false" className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-slate-200" role="switch">
                                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>
                                <div className="border-t border-slate-100 my-6"></div>

                                {/* Active Sessions */}
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-4">Active Sessions</h3>
                                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg border border-slate-100">
                                                <span className="material-symbols-outlined text-slate-600">desktop_windows</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Chrome on macOS</p>
                                                <p className="text-xs text-slate-500">San Francisco, USA • Active now</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current</span>
                                    </div>

                                    <div className="mt-3 bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <span className="material-symbols-outlined text-slate-400">smartphone</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Safari on iPhone 13</p>
                                                <p className="text-xs text-slate-500">New York, USA • 2 days ago</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors">Revoke</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Notification Preferences */}
                        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-primary">mail</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">Email Notifications</h3>
                                            <p className="text-sm text-slate-500">Receive booking confirmations and updates via email.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-primary">sms</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">SMS Notifications</h3>
                                            <p className="text-sm text-slate-500">Receive urgent travel updates directly to your phone.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-primary">notifications_active</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">Push Notifications</h3>
                                            <p className="text-sm text-slate-500">Get real-time updates on booking status and offers.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <section className="bg-red-50 rounded-xl border border-red-100 overflow-hidden mb-8">
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-red-900">Delete Account</h2>
                                    <p className="text-sm text-red-700 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors whitespace-nowrap">
                                    Delete Account
                                </button>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

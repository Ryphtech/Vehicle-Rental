import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleSearchResults from './pages/VehicleSearchResults';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BookingDetails from './pages/BookingDetails';
import ReviewAndPayment from './pages/ReviewAndPayment';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VendorDashboard from './pages/VendorDashboard';
import VendorAddVehicle from './pages/VendorAddVehicle';
import VendorBookings from './pages/VendorBookings';
import AccountSettings from './pages/AccountSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminVendorManagement from './pages/AdminVendorManagement';
import AdminBookings from './pages/AdminBookings';
import DevTools from './pages/DevTools';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<VehicleSearchResults />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/book/:id" element={<BookingDetails />} />
          <Route path="/payment/:id" element={<ReviewAndPayment />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/vendor/add-vehicle" element={<VendorAddVehicle />} />
          <Route path="/vendor/bookings" element={<VendorBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<AdminVendorManagement />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/dev-tools" element={<DevTools />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

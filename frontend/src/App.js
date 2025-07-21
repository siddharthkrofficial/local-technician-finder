import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home'; // Updated path
import Register from './components/Register'; // Updated path
import Login from './components/Login'; // Updated path
import TechnicianList from './components/TechnicianList'; // Updated path
import TechnicianProfile from './components/TechnicianProfile'; // Updated path
import ServiceList from './components/ServiceList'; // Updated path
import BookingForm from './components/BookingForm'; // Updated path
import MyBookings from './components/MyBookings'; // Updated path
import ReviewForm from './components/ReviewForm'; // Updated path
import TechnicianProfileForm from './components/TechnicianProfileForm'; // Updated path
import TechniciansByService from './components/TechniciansByService'; // Updated path
import AuthContext, { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { NotificationProvider } from './NotificationContext';
import { useContext } from 'react';

import './App.css'; // For basic styling

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {user && user.role === 'customer' && <li><Link to="/technicians">Technicians</Link></li>}
                {user && user.role === 'customer' && <li><Link to="/services">Services</Link></li>}
                {user ? (
                    <>
                        {user.role === 'technician' && <li><Link to="/profile-form">My Profile</Link></li>}
                        {user.role === 'customer' && <li><Link to="/book">Book Service</Link></li>}
                        <li><Link to="/my-bookings">My Bookings</Link></li>
                        {user.role === 'customer' && <li><Link to="/review">Submit Review</Link></li>}
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <div className="App">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />

                            {/* Protected Routes */}
                            <Route path="/technicians" element={<ProtectedRoute allowedRoles={['customer']}><TechnicianList /></ProtectedRoute>} />
                            <Route path="/technicians/service/:serviceName" element={<ProtectedRoute allowedRoles={['customer']}><TechniciansByService /></ProtectedRoute>} />
                            <Route path="/technicians/:id" element={<ProtectedRoute allowedRoles={['customer']}><TechnicianProfile /></ProtectedRoute>} />
                            <Route path="/services" element={<ProtectedRoute allowedRoles={['customer']}><ServiceList /></ProtectedRoute>} />
                            <Route path="/book" element={<ProtectedRoute allowedRoles={['customer']}><BookingForm /></ProtectedRoute>} />
                            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['customer', 'technician']}><MyBookings /></ProtectedRoute>} />
                            <Route path="/review" element={<ProtectedRoute allowedRoles={['customer']}><ReviewForm /></ProtectedRoute>} />
                            <Route path="/profile-form" element={<ProtectedRoute allowedRoles={['technician']}><TechnicianProfileForm /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
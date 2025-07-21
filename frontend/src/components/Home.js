import React, { useContext } from 'react';
import AuthContext from '../AuthContext';

const Home = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading home page...</div>; // Or a spinner
    }

    return (
        <div className="home-container">
            {!user && (
                // Content for not logged-in users
                <header className="hero-section neomorphic-card">
                    <h1>Welcome to Local Technician Finder</h1>
                    <p>Your trusted platform to connect with skilled local technicians for all your home and business needs.</p>
                    <div className="cta-buttons">
                        <a href="/technicians" className="neomorphic-button">Find a Technician</a>
                        <a href="/register" className="neomorphic-button">Become a Technician</a>
                    </div>
                </header>
            )}

            {user && user.role === 'customer' && (
                // Content for logged-in customers
                <header className="hero-section neomorphic-card">
                    <h1>Hello, {user.username}!</h1>
                    <p>Ready to find the perfect technician for your next project?</p>
                    <div className="cta-buttons">
                        <a href="/technicians" className="neomorphic-button">Browse Technicians</a>
                        <a href="/book" className="neomorphic-button">Book a Service</a>
                    </div>
                </header>
            )}

            {user && user.role === 'technician' && (
                // Content for logged-in technicians
                <header className="hero-section neomorphic-card">
                    <h1>Welcome back, {user.username}!</h1>
                    <p>Manage your profile, view your bookings, and grow your business.</p>
                    <div className="cta-buttons">
                        <a href="/profile-form" className="neomorphic-button">Manage My Profile</a>
                        <a href="/my-bookings" className="neomorphic-button">View My Bookings</a>
                    </div>
                </header>
            )}

            <section className="how-it-works-section">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step-card neomorphic-card">
                        <h3>1. Search</h3>
                        <p>Easily find technicians by service type, location, and ratings.</p>
                    </div>
                    <div className="step-card neomorphic-card">
                        <h3>2. Book</h3>
                        <p>Request appointments directly through our platform.</p>
                    </div>
                    <div className="step-card neomorphic-card">
                        <h3>3. Review</h3>
                        <p>Rate and review services to help others make informed decisions.</p>
                    </div>
                </div>
            </section>

            <section className="why-choose-us-section neomorphic-card">
                <h2>Why Choose Us?</h2>
                <ul>
                    <li><strong>Local Experts:</strong> Connect with verified professionals in your area.</li>
                    <li><strong>Transparent Pricing:</strong> Clear hourly rates and service descriptions.</li>
                    <li><strong>Reliable Reviews:</strong> Real feedback from real customers.</li>
                    <li><strong>Convenient Booking:</strong> Schedule services at your fingertips.</li>
                </ul>
            </section>

            <section className="popular-services-section">
                <h2>Popular Services</h2>
                <div className="services-grid">
                    <div className="service-item neomorphic-card">
                        <h3>Plumbing</h3>
                        <p>Leaky faucets, clogged drains, water heater repair.</p>
                    </div>
                    <div className="service-item neomorphic-card">
                        <h3>Electrical</h3>
                        <p>Wiring, outlet installation, circuit breaker issues.</p>
                    </div>
                    <div className="service-item neomorphic-card">
                        <h3>IT Support</h3>
                        <p>Computer repair, network setup, software troubleshooting.</p>
                    </div>
                    <div className="service-item neomorphic-card">
                        <h3>HVAC</h3>
                        <p>AC repair, furnace maintenance, duct cleaning.</p>
                    </div>
                </div>
            </section>

            <footer className="footer-section neomorphic-card">
                <p>&copy; {new Date().getFullYear()} Local Technician Finder. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
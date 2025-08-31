import React from 'react';
import { Link } from 'react-router-dom';
import TripList from '../components/TripList';
import useTripData from '../hooks/useTripData';
import './Home.css';

const Home: React.FC = () => {
    const { trips, copyTrip, deleteTrip } = useTripData();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="home-title">Trip Baggage Manager</h1>
                <p className="home-description">Manage your trips and track your items effortlessly!</p>
            </header>
            <div className="home-actions">
                <Link to="/create-trip" className="create-trip-button">
                    Create New Trip
                </Link>
            </div>
            <TripList 
                trips={trips}
                onCopyTrip={copyTrip}
                onDeleteTrip={deleteTrip}
            />
        </div>
    );
};

export default Home;
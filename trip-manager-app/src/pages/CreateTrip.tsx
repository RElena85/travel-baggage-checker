import React from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import useTripData from '../hooks/useTripData';
import { Trip } from '../types';

const CreateTrip: React.FC = () => {
    const navigate = useNavigate();
    const { addTrip } = useTripData();

    const handleTripSubmit = (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
        addTrip(tripData);
        navigate('/');
    };

    return (
        <div className="create-trip-container">
            <header>
                <h1>Create New Trip</h1>
                <button onClick={() => navigate('/')} className="back-button">
                    ← Back to Home
                </button>
            </header>
            <TripForm onSubmit={handleTripSubmit} />
        </div>
    );
};

export default CreateTrip;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import useTripData from '../hooks/useTripData';

const CreateTrip: React.FC = () => {
    const navigate = useNavigate();
    const { addTrip } = useTripData();

    const handleSaveTrip = (tripName: string, items: { name: string }[]) => {
        addTrip(tripName, items);
        navigate('/');
    };

    return (
        <div className="app">
            <div className="container">
                <div className="page">
                    <div className="trip-form-header">
                        <h1 className="trip-form-title">✨ Create New Trip</h1>
                        <p>Plan your perfect journey and never forget anything!</p>
                    </div>
                    
                    <div className="trip-form-content">
                        <TripForm onSave={handleSaveTrip} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;
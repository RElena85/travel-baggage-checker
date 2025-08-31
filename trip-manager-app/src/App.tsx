import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './contexts/TripContext';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import TripsPage from './pages/TripsPage';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trip/:id" element={<TripDetails />} />
        </Routes>
      </Router>
    </TripProvider>
  );
};

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripsPage from './pages/TripsPage';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import './styles/globals.css';
import './styles/components.css';

export function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trip/:id" element={<TripDetails />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <TripProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <AppRoutes />
      </BrowserRouter>
    </TripProvider>
  );
}

export default App;

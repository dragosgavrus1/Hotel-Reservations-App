import React from 'react';
import './App.css';
import HotelList from './components/HotelList/HotelList';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import HotelDetails from "./components/HotelDetails/HotelDetails";
import FeedbackForm from "./components/FeedbackPage/FeedbackForm";
import ReservationList from "./components/ReservationList/ReservationList";

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/hotels" element={<HotelList />} />
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/feedback/:id" element={<FeedbackForm />} />
                  <Route path="/reservations" element={<ReservationList />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;

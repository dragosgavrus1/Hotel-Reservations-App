import React, { useEffect, useState } from 'react';
import {getAllHotels, getHotelInRange} from '../../services/apiService';
import {Link} from "react-router-dom";
import './HotelList.css';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);
    const [range, setRange] = useState(10);

    useEffect(() => {
        getAllHotels().then(response => {
            setHotels(response.data);
        });
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((postion) => {
                const { latitude, longitude } = postion.coords;
                setUserLatitude(latitude);
                setUserLongitude(longitude);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    const handleSearch = () => {
        getLocation();
        if (userLatitude && userLongitude) {
            getHotelInRange(userLatitude, userLongitude, range)
                .then(response => {
                    setHotels(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the hotels!', error);
                });
        }
    }

    return (
        <div className="hotel-list-container">
            <h1 className="hotel-list-title">Hotels</h1>
            <label htmlFor="radiusInput" className="radius-label">Search Range (km):</label>
            <input
                type="number"
                placeholder="Radius (km)"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="radius-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
            <ul className="hotel-list">
                {hotels.map(hotel => (
                    <li key={hotel.id} className="hotel-list-item">
                        <Link to={`/hotels/${hotel.id}`} className="hotel-link">{hotel.name}</Link>
                    </li>
                ))}
            </ul>
            <Link to={`/reservations`} className="reservation-link-button">
                <button>Your Reservations</button>
            </Link>
        </div>
    );
};

export default HotelList;

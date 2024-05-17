import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reservations, cancelReservation, getAllHotels } from '../../services/apiService';
import "./ReservationList.css"

const ReservationList = () => {
    const [reservationList, setReservationList] = useState([]);
    const [hotelMap, setHotelMap] = useState({});
    const username = localStorage.getItem('username');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await reservations(username);
                setReservationList(response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservations();

        const fetchHotels = async () => {
            try {
                const response = await getAllHotels();
                const hotelData = response.data.reduce((map, hotel) => {
                    map[hotel.id] = hotel.name;
                    return map;
                }, {});
                setHotelMap(hotelData);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };
        fetchHotels();
    }, [username]);

    const handleCancelReservation = async (reservationId) => {
        try {
            await cancelReservation(reservationId);
            // Refresh reservation list after cancellation
            const response = await reservations(username);
            setReservationList(response.data);
            alert('Reservation cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const handleChangeRooms = async (reservationId, hotelId, selectedRooms) => {
        try {
            // Assuming selectedRooms is the array containing the rooms you want to change to
            localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
            localStorage.setItem('reservationId', reservationId);
            navigate(`/hotels/${hotelId}`);
        } catch (error) {
            console.error('Error handling change rooms:', error);
        }
    };

    const formatReservationDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US');
    };

    return (
        <div className="container">
            <h2>Reservation List</h2>
            <ul>
                {reservationList.map(reservation => (
                    <li key={reservation.id} className="reservation-item">
                        <p>Reservation ID: {reservation.id}</p>
                        <p>Hotel Name: {hotelMap[reservation.hotelId]}</p>
                        <p>Room Numbers: {reservation.roomNumbers.join(', ')}</p>
                        <p>Date of reservation: {formatReservationDate(reservation.reservationDateTime)}</p>
                        <button onClick={() => handleCancelReservation(reservation.id)}>Cancel Reservation</button>
                        <button onClick={() => handleChangeRooms(reservation.id, reservation.hotelId, reservation.roomNumbers)}>Change Rooms</button>
                    </li>
                ))}
            </ul>
            <Link to={`/hotels`} className="back-button">
                <button>Back to Hotels List</button>
            </Link>
        </div>
    );
};

export default ReservationList;

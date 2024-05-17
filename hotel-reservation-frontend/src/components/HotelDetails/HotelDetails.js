// HotelDetails.js
import React, {useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {bookRooms, changeRooms, getFeedbacks, getHotelById} from '../../services/apiService';
import "./HotelDetails.css";

const HotelDetails = () => {
    const { id } = useParams();
    const [initialSelectedRooms, setInitialSelectedRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [hotel, setHotel] = useState(null);
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const navigate = useNavigate();

    const handleDateChange = (event) => {
        setReservationDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setReservationTime(event.target.value);
    };

    useEffect(()=>{
        const fetchHotel = async () => {
            try {
                const response = await getHotelById(id);
                setHotel(response.data);
            } catch (error) {
                console.error('Error fetching hotel:', error);
            }
        };
        fetchHotel();

        const fetchFeedbacks = async () => {
            try {
                const response = await getFeedbacks(id);
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };
        fetchFeedbacks();

        const storedSelectedRooms = localStorage.getItem('selectedRooms');
        if (storedSelectedRooms) {
            setInitialSelectedRooms(JSON.parse(storedSelectedRooms));
            setSelectedRooms(JSON.parse(storedSelectedRooms));
        }
    }, [id])

    const handleRoomSelection = (roomNumber) => {
        // Toggle room selection
        if (selectedRooms.includes(roomNumber)) {
            setSelectedRooms(selectedRooms.filter(room => room !== roomNumber));
        } else {
            setSelectedRooms([...selectedRooms, roomNumber]);
        }
    };

    const handleSubmit = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
            const reservationId = localStorage.getItem('reservationId');
            if (reservationId) {
                try {
                    console.log(selectedRooms);
                    await changeRooms(reservationId, selectedRooms);
                    // Navigate to hotel page
                    navigate('/reservations');
                } catch (error) {
                    console.error('Error changing rooms:', error);
                }
            } else {
                try {
                    await bookRooms(id, username, selectedRooms, reservationDateTime);
                    alert('Rooms booked successfully!');
                } catch (error) {
                    console.error('Error booking rooms:', error);
                }
            }
        } else {
            alert('Please log in to make a reservation.');
        }
    };

    // Render hotel details, room selection, feedback section, and reserve button

    return (
        <div className="container">
            {hotel && (
                <div>
                    <h2>{hotel.name}</h2>
                    <h3>Select Rooms to reserve</h3>
                    <ul>
                        {hotel.rooms.map(room => (
                            <li key={room.roomNumber}>
                                {(initialSelectedRooms.includes(room.roomNumber) || room.available) && (
                                    <input
                                        type="checkbox"
                                        checked={selectedRooms.includes(room.roomNumber)}
                                        onChange={() => handleRoomSelection(room.roomNumber)}
                                    />
                                )}
                                Room number: {room.roomNumber} - Room type: {room.type} - Price: {room.price}
                            </li>
                        ))}
                    </ul>
                </div>
                )
            }
            <h3>Make a Reservation</h3>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="date">Reservation Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={reservationDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="time" style={{ marginRight: '10px' }}>Reservation Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={reservationTime}
                        onChange={handleTimeChange}
                        required
                    />
                </div>
                <button onClick={handleSubmit}>Make Reservation</button>

            <h3>Hotel Reviews</h3>
            <ul>
                <div className="feedback-list">

                {feedbacks.map((feedback, index) => (
                    <li key={index}>
                        <p>{feedback.review}  -  Rating: {feedback.rating} / 5</p>
                    </li>
                ))}
                    </div>
            </ul>
            <Link to={`/feedback/${id}`}>
                <button>Leave Feedback</button>
            </Link>
            <Link to={`/hotels`}>
                <button>Back to Hotels List</button>
            </Link>
        </div>
    );
};

export default HotelDetails;

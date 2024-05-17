import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const registerUser = (username, password) => {
    return axios.post(`${API_URL}/register`, { username, password });
};

export const loginUser = (username, password) => {
    return axios.post(`${API_URL}/login`, { "username":username, "password":password });
};

export const getAllHotels = () => {
    return axios.get(`${API_URL}/hotels`);
};

export const getHotelById = (id) => {
    return axios.get(`${API_URL}/hotel/${id}`);
}

export const getHotelInRange = (userLatitude, userLongitude, radiusKm) => {
    return axios.get(`${API_URL}/hotelsInRange?`, {
        params: {
            userLatitude,
            userLongitude,
            radiusKm
        }
    });
}

export const bookRooms = (hotelId, username, bookedRooms, checkIn) => {
    return axios.post(`${API_URL}/bookRooms?hotelId=${hotelId}&username=${username}`,  {
        bookedRooms,
        checkIn
    });
};

export const cancelReservation = (reservationId) => {
    return axios.post(`${API_URL}/cancelReservation?reservationId=${reservationId}`);

}

export const changeRooms = (reservationId, bookedRooms) => {
    return axios.post(`${API_URL}/changeRooms?reservationId=${reservationId}`, {
        bookedRooms
    });

}

export const leaveFeedback = (hotelId, username, description, rating) => {
    return axios.post(`${API_URL}/feedback?hotelId=${hotelId}&username=${username}`, {
        description,
        rating
    });
};

export const getFeedbacks = (hotelId) => {
    return axios.get(`${API_URL}/feedbacks?hotelId=${hotelId}`);
};

export const reservations = (username) => {
    return axios.get(`${API_URL}/reservations?username=${username}`);
};

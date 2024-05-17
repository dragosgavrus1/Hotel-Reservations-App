// FeedbackForm.js
import React, { useState } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {leaveFeedback} from "../../services/apiService";
import './FeedbackForm.css';

const FeedbackForm = () => {
    const { id } = useParams(); // Hotel ID from the URL
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(3); // Default rating
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username');
        if (!username) {
            alert('Please log in to submit feedback.');
            return;
        }

        try {
            const response = await leaveFeedback(id, username, description, rating)

            if (response.status === 200) {
                alert('Feedback submitted successfully!');

                navigate(`/hotels/${id}`); // Redirect back to hotel details page
            } else {
                alert('Failed to submit feedback.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('An error occurred while submitting feedback.');
        }
    };

    return (
        <div className="feedback-form">
            <h2>Leave Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rating">Rating: {rating}</label>
                    <input
                        type="range"
                        id="rating"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value, 10))}
                        step="1"
                    />
                </div>
                <div className="button-container">
                    <button type="submit">Submit Feedback</button>
                </div>
            </form>
            <div className="button-container">
                <Link to={`/hotels/${id}`}>
                    <button>Back to Hotel Details</button>
                </Link>
            </div>
        </div>
    );
};

export default FeedbackForm;

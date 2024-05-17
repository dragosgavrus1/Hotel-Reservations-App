import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/apiService';
import "./RegisterPage.css";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        registerUser({ username, password })
            .then(response => {
                navigate('/')
            })
            .catch(error => {
                setError('Failed to register. Please try again.');
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Register</h2>
            <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="login-button"
                onClick={handleRegister}
                disabled={!username || !password}
            >
                Register
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RegisterPage;

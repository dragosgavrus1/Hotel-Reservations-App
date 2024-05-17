import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/apiService';
import './LoginPage.css'; // Import CSS file for styling

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!username || !password) return; // Disable login button if inputs are empty
        loginUser(username, password)
            .then(response => {
                localStorage.setItem('username', username);
                navigate('/hotels');
            })
            .catch(error => {
                setError('Invalid credentials. Please try again.');
            });
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
            />
            <button onClick={handleLogin} className="login-button" disabled={!username || !password}>
                Login
            </button>
            {error && <p className="error-message">{error}</p>}
            <button onClick={navigateToRegister} className="register-button">Register</button>
        </div>
    );
};

export default LoginPage;

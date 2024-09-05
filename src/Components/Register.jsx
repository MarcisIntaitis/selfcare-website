import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Sending registration data to the backend
            const response = await axios.post('https://thiba.up.railway.app/register', { username, email, password });
            
            // If registration is successful, log in the user automatically
            if (response.data.message === 'User registered successfully') {
                const loginResponse = await axios.post('https://thiba.up.railway.app/login', { username, password });
                
                // Save the JWT token in localStorage
                localStorage.setItem('jwtToken', loginResponse.data.token);
                
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
            <p>Have an account? <a href='/login'>Log in</a></p>
        </div>
    );
};

export default Register;

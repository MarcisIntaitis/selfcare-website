import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Register.css'

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
            const response = await axios.post('https://selfcare-website.onrender.com/register', { username, email, password });
            
            // If registration is successful, log in the user automatically
            if (response.data.message === 'User registered successfully') {
                const loginResponse = await axios.post('https://selfcare-website.onrender.com/login', { username, password });
                
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
        <div className='body'>
            <div className='register-main'>
                <div className='register-left'>
                    <h1>Welcome!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                </div>
                <div className='register-right'>
                <form onSubmit={handleRegister}>
                    <div>
                        <input 
                            type="text" 
                            placeholder='Username'
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            placeholder='Email'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder='Password'
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
            </div>
        </div>
    );
};

export default Register;

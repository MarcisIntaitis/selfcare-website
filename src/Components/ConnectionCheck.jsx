import React, { useState, useEffect } from 'react';


const ConnectionCheck = () => {
  const [status, setStatus] = useState('Checking connection...');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://thiba.up.railway.app:${process.env.PORT}/ping');
        if (response.ok) {
          const data = await response.json();
          setStatus(data.message); // Display "Connected to backend"
        } else {
          setStatus('Failed to connect to backend');
        }
      } catch (err) {
        setStatus('Error connecting to backend');
        console.log(err)
      }
    };

    checkConnection();
  }, []);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default ConnectionCheck;

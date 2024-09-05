import React, { useState } from 'react'
import UserInfo from './Hooks/UserInfo'
import LevelInfo from './Hooks/LevelInfo'
import '../Styles/UserChallenges.css'

function UserChallenges() {
    const { level, challenge } = UserInfo(); // assuming UserInfo provides userId as well
    const { levelDesc, challengeDesc } = LevelInfo(level - 1, challenge - 1);
    const [error, setError] = useState(null);

    const completeChallenge = async () => {
        try {
            const response = await fetch('https://www.thiba.up.railway.app/complete-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,  // Send the JWT token
                },
            });
    
            if (!response.ok) {
                throw new Error('Error completing challenge');
            }
            window.location.reload();
        } catch (err) {
            setError('Failed to complete the challenge');
        }
    };
    

    return (
        <div className='main-container'>
            <div className='title-container'>
                <h1 className='title'>{levelDesc}</h1>
            </div>
            <div className='challenge-container' onClick={completeChallenge}>
                <p className='challenge'>{challengeDesc}</p>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    )
}

export default UserChallenges;

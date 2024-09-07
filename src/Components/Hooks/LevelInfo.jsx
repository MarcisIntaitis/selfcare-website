import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function LevelInfo(levelNum, challengeNum) {
        const [levelDesc, setLevelDesc] = useState(null);
        const [challengeDesc, setChallengeDesc] = useState('');
        const navigate = useNavigate();
        const token = localStorage.getItem('jwtToken')

        useEffect(() => {
            const fetchUserData = async () => {
                if (!token) {
                    console.error('No token found');
                    return;
                }
        
                try {
                    const response = await fetch('https://thiba.up.railway.app/collections/levels', {
                        method: 'GET',
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                        setLevelDesc(data[levelNum].title)
                        setChallengeDesc(data[levelNum].challenges[challengeNum].description)
                    } else {
                        console.error('Failed to fetch level data:', data.message);
                        navigate('/login')
                    }
                } catch (error) {
                    console.error('Error fetching level data:', error);
                }
            };
            fetchUserData();
        }, [levelNum, challengeNum, navigate, token]);

        return(
            {levelDesc, challengeDesc}
        )
}

export default LevelInfo

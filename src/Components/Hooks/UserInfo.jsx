import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';


function UserInfo() {
        // State to store the user data
        const [user, setUser] = useState(null);
        const [level, setLevel] = useState(null);
        const [challenge, setChallenge] = useState(null);
        const navigate = useNavigate();
        const token = localStorage.getItem('jwtToken')

        useEffect(() => {
            const fetchUserData = async () => {
                if (!token) {
                    console.error('No token found');
                    return;
                }
        
                try {
                    const response = await fetch('https://thiba.up.railway.app/current-user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
                        },
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                        setUser(data);  // Store the fetched user data in the state
                        setLevel(data.level);
                        setChallenge(data.challenge);
                    } else {
                        console.error('Failed to fetch user data:', data.message);
                        navigate('/login')
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }, [token, navigate]);

        return(
            {user, level, challenge}
        )
}

export default UserInfo

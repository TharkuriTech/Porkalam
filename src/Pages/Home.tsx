import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';

interface UserData {
    userId: number;
    userName: string;
    fullName: string;
    token: string;
    expiration: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserData(user);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                navigate('/');
            }
        } else {
            // If no user data, redirect to login
            navigate('/');
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="home-container">
            <div className="home-card">
                <div className="home-header">
                    <h2>Welcome, {userData.fullName}!</h2>
                    <p>You have successfully logged in</p>
                </div>

                <div className="user-info">
                    <div className="info-item">
                        <label>Full Name:</label>
                        <span>{userData.fullName}</span>
                    </div>
                    <div className="info-item">
                        <label>Username:</label>
                        <span>{userData.userName}</span>
                    </div>
                    <div className="info-item">
                        <label>User ID:</label>
                        <span>{userData.userId}</span>
                    </div>
                    <div className="info-item">
                        <label>Token Expiration:</label>
                        <span>{new Date(userData.expiration).toLocaleString()}</span>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Auth.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header mb-0">
                    <h2>404 - Page Not Found</h2>
                    <p>Redirecting to login page...</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const user = localStorage.getItem('user');

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
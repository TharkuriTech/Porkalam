import { Navigate, Outlet } from 'react-router-dom';
import { getUserData } from '../Util/Util.ts';

const PublicRoute = () => {
    const user = getUserData();

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
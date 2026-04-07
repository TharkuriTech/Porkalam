import { Navigate, Outlet } from 'react-router-dom';
import { getUserData } from '../Util/Util.ts';

const ProtectedRoute = () => {
    const user = getUserData();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
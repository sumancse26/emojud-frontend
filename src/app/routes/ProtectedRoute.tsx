import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { ROUTES } from './paths';

export interface ProtectedRouteProps {
    children?: React.ReactNode;
}

/**
 * Route guard component that checks for an access token in the cookie.
 * If no token is present, user is redirected to the login page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = tokenStorage.getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

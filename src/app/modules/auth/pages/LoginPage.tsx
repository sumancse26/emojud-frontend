import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ROUTES } from '@/app/routes/paths';
import { useAuth } from '../hooks/useAuth';
import { LoginPresenter } from './presenters/LoginPresenter';
import type { LoginCredentials } from '../types/auth.types';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, error, login, clearError } = useAuth();

    const [formData, setFormData] = useState<LoginCredentials>({
        username: 'suman',
        password: '12345678',
        rememberMe: true
    });

    useEffect(() => {
        if (isAuthenticated) {
            const redirectPath =
                (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME.DASHBOARD;
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleFillDemo = () => {
        setFormData({
            username: 'suman',
            password: '12345678',
            rememberMe: true
        });
        clearError();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (credentials: LoginCredentials) => {
        try {
            await login(credentials);
            const redirectPath =
                (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME.DASHBOARD;
            navigate(redirectPath, { replace: true });
        } catch {
            // Error is managed and displayed by useAuth state
        }
    };

    return (
        <LoginPresenter
            formData={formData}
            isLoading={isLoading}
            error={error}
            onChange={handleChange}
            onFillDemo={handleFillDemo}
            onSubmit={handleSubmit}
        />
    );
};

export const LoginContainer = LoginPage;
export default LoginPage;

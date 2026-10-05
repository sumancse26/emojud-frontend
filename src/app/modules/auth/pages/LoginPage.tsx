import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ROUTES } from '@/app/routes/paths';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { authService } from '../services/authService';
import { LoginPresenter } from './presenters/LoginPresenter';
import type { LoginCredentials } from '../types/auth.types';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<LoginCredentials>({
        username: 'suman',
        password: '12345678',
        rememberMe: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (tokenStorage.getToken()) {
            const redirectPath =
                (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME.DASHBOARD;
            navigate(redirectPath, { replace: true });
        }
    }, [navigate, location]);

    const handleFillDemo = () => {
        setFormData({
            username: 'suman',
            password: '12345678',
            rememberMe: true
        });
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (credentials: LoginCredentials) => {
        setError(null);
        setIsLoading(true);
        try {
            await authService.login(credentials);
            const redirectPath =
                (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME.DASHBOARD;
            navigate(redirectPath, { replace: true });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
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

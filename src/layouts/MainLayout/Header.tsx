import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/app/providers';
import { ROUTES } from '@/app/routes/paths';
import { authService } from '@/app/modules/auth/services/authService';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User as UserType } from '@/app/modules/auth/types/auth.types';
import { HeaderPresenter } from './presenters/HeaderPresenter';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = tokenStorage.getUser<UserType>();

    const userName = currentUser?.name || currentUser?.username || 'Suman (Admin)';
    const userEmail = currentUser?.email || 'suman.admin@emojud.com';
    const userRole = currentUser?.role || 'Super Administrator';

    const userInitials = useMemo(() => {
        return (currentUser?.name || currentUser?.username || 'AD')
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }, [currentUser]);

    const {
        isDarkMode,
        toggleTheme,
        toggleMobileSidebar
    } = useApp();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleNotification = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const handleToggleProfileMenu = () => {
        setIsProfileMenuOpen((prev) => !prev);
    };

    const handleNavigatePermissions = () => {
        setIsProfileMenuOpen(false);
        navigate(ROUTES.CONFIGURATIONS.USER_SHOP_PERMISSION);
    };

    const handleNavigateShops = () => {
        setIsProfileMenuOpen(false);
        navigate(ROUTES.CONFIGURATIONS.SHOPS);
    };

    const handleNavigateProfile = () => {
        setIsProfileMenuOpen(false);
        navigate(ROUTES.HR.EMPLOYEES);
    };

    const handleSignOut = () => {
        setIsProfileMenuOpen(false);
        authService.logout();
        navigate(ROUTES.AUTH.LOGIN);
    };

    return (
        <HeaderPresenter
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            userInitials={userInitials}
            isDarkMode={isDarkMode}
            isNotificationOpen={isNotificationOpen}
            isProfileMenuOpen={isProfileMenuOpen}
            notificationMenuRef={notificationMenuRef}
            profileMenuRef={profileMenuRef}
            onToggleMobileSidebar={toggleMobileSidebar}
            onToggleTheme={toggleTheme}
            onToggleNotification={handleToggleNotification}
            onToggleProfileMenu={handleToggleProfileMenu}
            onNavigatePermissions={handleNavigatePermissions}
            onNavigateShops={handleNavigateShops}
            onNavigateProfile={handleNavigateProfile}
            onSignOut={handleSignOut}
        />
    );
};

export const HeaderContainer = Header;
export default Header;

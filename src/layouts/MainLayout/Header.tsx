import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/app/providers';
import { ROUTES } from '@/app/routes/paths';
import { authService } from '@/app/modules/auth/services/authService';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User as UserType } from '@/app/modules/auth/types/auth.types';
import { HeaderPresenter } from './presenters/HeaderPresenter';

const ROLE_NAMES: Record<string, string> = {
    '1': 'Super Administrator',
    '2': 'Administrator',
    '3': 'Manager',
    '4': 'Staff',
    '5': 'Operator'
};

const resolveDisplayName = (user: UserType | null): string => {
    if (!user) return 'Suman (Admin)';
    if (user.name && !/^\d+$/.test(user.name.trim())) {
        return user.name;
    }
    if (user.username && !/^\d+$/.test(user.username.trim())) {
        return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    if (user.email && user.email.includes('@')) {
        const prefix = user.email.split('@')[0];
        if (!/^\d+$/.test(prefix)) {
            return prefix.charAt(0).toUpperCase() + prefix.slice(1);
        }
    }
    return 'Suman (Admin)';
};

const resolveRoleName = (user: UserType | null): string => {
    if (!user) return 'Super Administrator';
    const role = user.role;
    if (role && ROLE_NAMES[String(role)]) {
        return ROLE_NAMES[String(role)];
    }
    if (role && !/^\d+$/.test(String(role).trim())) {
        return String(role);
    }
    return 'Super Administrator';
};

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserType | null>(() => tokenStorage.getUser<UserType>());

    useEffect(() => {
        const user = tokenStorage.getUser<UserType>();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const userName = useMemo(() => resolveDisplayName(currentUser), [currentUser]);
    const userRole = useMemo(() => resolveRoleName(currentUser), [currentUser]);
    const userEmail = currentUser?.email || 'suman.admin@emojud.com';

    const userInitials = useMemo(() => {
        return userName
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'AD';
    }, [userName]);

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

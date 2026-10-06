import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useApp } from '@/app/providers';
import { useSidebar } from '@/hooks/useSidebar';
import type { NavMenuItem } from '@/app/routes/types';
import { ROUTES } from '@/app/routes/paths';
import { SidebarPresenter } from './presenters/SidebarPresenter';

export interface SidebarProps {
    menuData?: NavMenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        isSidebarCollapsed,
        toggleSidebarCollapse,
        isMobileSidebarOpen,
        closeMobileSidebar,
        selectedBranch,
        setSelectedBranch
    } = useApp();

    const { menuData: apiMenuData } = useSidebar();

    const activeMenuData = useMemo(() => {
        return apiMenuData;
    }, [apiMenuData]);

    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

    // Auto-expand accordion if child route is active on page load or navigation
    useEffect(() => {
        const currentPath = location.pathname;
        const newAccordionState: Record<string, boolean> = {};

        activeMenuData.forEach((parent) => {
            if (parent.children && parent.children.length > 0) {
                const hasActiveChild = parent.children.some(
                    (child) => child.route_url && currentPath.startsWith(child.route_url)
                );
                if (hasActiveChild) {
                    newAccordionState[parent.id] = true;
                }
            }
        });

        if (Object.keys(newAccordionState).length > 0) {
            setOpenAccordions((prev) => ({ ...prev, ...newAccordionState }));
        }
    }, [location.pathname, activeMenuData]);

    const handleToggleAccordion = (parentId: string) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [parentId]: !prev[parentId]
        }));
    };

    const handleSelectBranch = (branchId: string) => {
        setSelectedBranch(branchId);
    };

    const handleBrandClick = () => {
        navigate(ROUTES.HOME.DASHBOARD);
    };

    return (
        <SidebarPresenter
            menuData={activeMenuData}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobileSidebarOpen={isMobileSidebarOpen}
            currentPath={location.pathname}
            selectedBranch={selectedBranch}
            openAccordions={openAccordions}
            onToggleCollapse={toggleSidebarCollapse}
            onToggleAccordion={handleToggleAccordion}
            onSelectBranch={handleSelectBranch}
            onBrandClick={handleBrandClick}
            onCloseMobileSidebar={closeMobileSidebar}
        />
    );
};

export const SidebarContainer = Sidebar;
export default Sidebar;

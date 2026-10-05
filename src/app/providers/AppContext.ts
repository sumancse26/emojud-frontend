import { createContext, useContext } from 'react';

export interface AppContextType {
    // Theme State
    isDarkMode: boolean;
    toggleTheme: () => void;

    // Sidebar & Layout State
    isSidebarCollapsed: boolean;
    toggleSidebarCollapse: () => void;
    isMobileSidebarOpen: boolean;
    toggleMobileSidebar: () => void;
    closeMobileSidebar: () => void;

    // Store Branch State
    selectedBranch: string;
    setSelectedBranch: (branch: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp(): AppContextType {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

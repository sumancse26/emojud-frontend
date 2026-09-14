import React, { createContext, useContext, useState, useEffect } from 'react'

export type AppModuleView =
  | 'view-login'
  | 'view-dashboard'
  | 'view-invoices'
  | 'view-products'
  | 'view-purchases'
  | 'view-customers'
  | 'view-reports'

export interface AppContextType {
  activeView: AppModuleView
  setActiveView: (view: AppModuleView) => void
  isDarkMode: boolean
  toggleTheme: () => void
  isPOSDrawerOpen: boolean
  togglePOSDrawer: () => void
  openPOSDrawer: () => void
  closePOSDrawer: () => void
  isAddProductModalOpen: boolean
  setIsAddProductModalOpen: (open: boolean) => void
  isSidebarCollapsed: boolean
  toggleSidebarCollapse: () => void
  isMobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppModuleView>('view-dashboard')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isPOSDrawerOpen, setIsPOSDrawerOpen] = useState<boolean>(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const [selectedBranch, setSelectedBranch] = useState<string>('1')

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)
  const togglePOSDrawer = () => setIsPOSDrawerOpen((prev) => !prev)
  const openPOSDrawer = () => setIsPOSDrawerOpen(true)
  const closePOSDrawer = () => setIsPOSDrawerOpen(false)
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev)
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev)

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        isDarkMode,
        toggleTheme,
        isPOSDrawerOpen,
        togglePOSDrawer,
        openPOSDrawer,
        closePOSDrawer,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

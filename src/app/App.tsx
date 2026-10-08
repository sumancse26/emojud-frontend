import React from 'react';
import { AppProvider } from './providers';
import { AppRouter } from './routes';
import { ToastProvider } from '@/shared/components/Toast';

export const App: React.FC = () => {
    return (
        <AppProvider>
            <ToastProvider>
                <AppRouter />
            </ToastProvider>
        </AppProvider>
    );
};

export default App;

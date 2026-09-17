import React from 'react';
import { AppProvider } from './providers/AppProvider';
import { AppRouter } from './routes';

export const App: React.FC = () => {
    return (
        <AppProvider>
            <AppRouter />
        </AppProvider>
    );
};

export default App;

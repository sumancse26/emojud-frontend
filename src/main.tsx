import { createRoot } from 'react-dom/client';
import '@/styles/global.css';
import { App } from '@/app/App';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

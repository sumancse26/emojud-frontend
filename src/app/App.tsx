import React from 'react'
import { MainLayout } from '@/layouts'
import { AppProvider } from './providers/AppProvider'
import { AppRouter } from './routes'

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </AppProvider>
  )
}

export default App

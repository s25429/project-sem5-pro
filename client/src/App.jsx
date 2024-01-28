import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './components/Header'

import ShopIdProvider from './context/ShopIdProvider'

import './css/App.css'


function App() {
    return (
        <ShopIdProvider>
            <Header />
            <main>
                <Outlet />
            </main>
        </ShopIdProvider>
    )
}


export default App

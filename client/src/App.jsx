import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './components/Header'

import './css/App.css'


function App() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}


export default App

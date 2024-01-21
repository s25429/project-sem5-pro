import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './components/Header'

import './css/App.css'


function App({ children }) {
    const [count, setCount] = useState(0) // this is clicks on page by user

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

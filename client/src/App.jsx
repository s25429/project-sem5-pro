import { useState } from 'react'

import Header from './components/Header'
import MapControls from './components/MapControls'

import './css/App.css'


function App({ children }) {
    const [count, setCount] = useState(0) // this is clicks on page by user

    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    )
}


export default App

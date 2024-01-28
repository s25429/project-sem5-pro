import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import ShopMap from './pages/ShopMap/ShopMap.jsx'
import Intro from './pages/GoogleMap/GoogleMap.jsx'

import './css/variables.css'
import './css/resets.css'
import './css/main.css'


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <p>Error 404</p>,
        children: [
            {
                path: 'shop-map/:shopId',
                element: <ShopMap />,
            },
            {
                path: 'google-map',
                element: <Intro />,
            }
        ]
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import ShopMap, { loader as shopIdLoader } from './pages/ShopMap/ShopMap.jsx'
import Intro from './pages/GoogleMap/GoogleMap.jsx'
import ReportBug from './pages/ReportBug/ReportBug.jsx'
import LoaderPage from './pages/GoogleMap/route.jsx'

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
                loader: shopIdLoader,
            },
            {
                path: 'google-map',
                element: <Intro />,
            },
            {
                path: 'report-bug',
                element: <ReportBug />,
            },
            {
                path: '/',
                element: <LoaderPage />,
            }
        ]
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)

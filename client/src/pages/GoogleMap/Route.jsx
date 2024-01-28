import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../../css/LoaderPage.css'


function LoaderPage() {
    const navigate = useNavigate()

    useEffect(() => {
        document.querySelector('header').classList.add('hide')

        const timer = setTimeout(() => {
            document.querySelector('header').classList.remove('hide')
            navigate('/google-map')
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="loader-container">
            <div className="loader"></div> 
        </div>
    )
}


export default LoaderPage

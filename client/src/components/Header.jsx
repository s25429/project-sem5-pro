import { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../assets/logo.svg'
import { FaEllipsisVertical } from 'react-icons/fa6'


import '../css/Header.css'
import Nav from './Nav'
import Footer from './Footer'


function Header({ title = 'Półkarzyk' }) {
    const [toggleNav, setToggleNav] = useState(false)

    return (
        <>
            <header>
                <img className='logo' src={Logo} alt='logo' />
                <h1>{title}</h1>
                <FaEllipsisVertical onClick={() => setToggleNav(!toggleNav)} className='toggler-nav' />
            </header>
            <Nav shown={toggleNav}>
                <Link onClick={() => setToggleNav(false)}>
                    <button type='button'>Zgłoś błąd</button>
                </Link>
                <Link to='google-map' onClick={() => setToggleNav(false)}>
                    <button type='button'>Wybierz sklep</button>
                </Link>
                <Link to='shop-map/1' onClick={() => setToggleNav(false)}>
                    <button type='button'>Mapa sklepu</button>
                </Link>
                <Footer />
            </Nav>
        </>
    )
}


export default Header
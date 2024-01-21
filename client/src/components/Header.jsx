import { useState } from 'react'

import Logo from '../assets/logo.svg'
import { FaEllipsisVertical } from 'react-icons/fa6'


import '../css/Header.css'
import Nav from './Nav'
import Footer from './Footer'


function Header({ title = 'Półkarzyk' }) {
    const [toggleNav, setToggleNav] = useState(false)

    return (
        <header>
            <img className='logo' src={Logo} alt='logo' />
            <h1>{title}</h1>
            <FaEllipsisVertical onClick={() => setToggleNav(!toggleNav)} className='toggler-nav' />
            <Nav shown={toggleNav}>
                <button type='button'>Zgłoś błąd</button>
                <button type='button'>Wybierz sklep</button>
                <button type='button'>Mapa sklepu</button>
                <Footer />
               
            </Nav>

        </header>
    )
}


export default Header
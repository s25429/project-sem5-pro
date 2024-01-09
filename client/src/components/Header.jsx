import { useState } from 'react'

import Logo from '../assets/logo.svg'
import { FaEllipsisVertical } from 'react-icons/fa6'

import '../css/Header.css'


function Header({ title = 'Półkarzyk' }) {
    const [toggleNav, setToggleNav] = useState(false)

    return (
        <header>
            <img className='logo' src={Logo} alt='logo' />
            <h1>{title}</h1>
            <FaEllipsisVertical onClick={() => setToggleNav(!toggleNav)} className='toggler-nav' />
            <nav aria-hidden={!toggleNav}>
                {/* TODO: Here paste Nav component or override <nav> with it and paste a prop into it stating if it is hidden */}
            </nav>
        </header>
    )
}


export default Header
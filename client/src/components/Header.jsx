import { useState } from 'react'


function Header({ title = 'Półkarzyk' }) {
    const [toggleNav, setToggleNav] = useState(false)

    return (
        <header>
            <i className='logo'></i>
            <h1>{title}</h1>
            <i onClick={() => setToggleNav(!toggleNav)}>H</i>
            {toggleNav ? (
                <nav>
                    siema
                </nav>
            ) : null}
        </header>
    )
}


export default Header
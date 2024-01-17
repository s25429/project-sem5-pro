


function Nav({ shown = false, children }) {
    return (
        <nav className='nav-main' aria-hidden={!shown}>
            {children}
        </nav>
    )
}


export default Nav

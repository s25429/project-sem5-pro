import { FaMagnifyingGlass, FaSliders } from 'react-icons/fa6'

import '../css/Filter.css'
import { useRef } from 'react'


function Filter({ placeholder = 'placeholder', onFilterSubmit = (value) => {} }) {
    const inputRef = useRef(null)

    const onSubmit = (e) => {
        e.preventDefault()
        onFilterSubmit(inputRef.current.value)
    }

    return (
        <form method="get" className='form-filter' onSubmit={onSubmit}>
            <div className='filter-input'>
                <input type="search" name="find" id="find" placeholder={placeholder} ref={inputRef} />
                <button type="submit">
                    <FaMagnifyingGlass />
                </button>
            </div>

            <div className="filter-settings">
                <button type="button">
                    <FaSliders />
                </button>
            </div>
        </form>
    )
}


export default Filter

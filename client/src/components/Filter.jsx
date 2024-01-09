import { FaMagnifyingGlass, FaSliders } from 'react-icons/fa6'

import '../css/Filter.css'


function Filter({ placeholder = 'placeholder' }) {
    return (
        <form method="get" className='form-filter'>
            <div className='filter-input'>
                <input type="search" name="find" id="find" placeholder={placeholder} />
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

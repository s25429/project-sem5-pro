import { FaPlus, FaMinus } from 'react-icons/fa6'

import '../css/MapControls.css'


function MapControls() {
    return (
        <div className="map-controls">
            <button type="button">
                <FaPlus />
            </button>
            <button type="button">
                <FaMinus />
            </button>
        </div>
    )
}


export default MapControls

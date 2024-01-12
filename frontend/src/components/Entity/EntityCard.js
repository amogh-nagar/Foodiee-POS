import React from 'react'
import './EntityCard.css'
import { getColor } from "../../utils/constants";
const EntityCard = React.forwardRef(({img, name, description, ...args}, ref) => {
    let styleObj = getColor(img, name);
    return <div ref={ref} {...args} style={styleObj} className='h-72 max-h-96 w-56 rounded-lg flex items-end'>
        <div className='inner-div rounded-lg before:rounded-lg w-full h-32 max-h-80 px-2 py-3'>
            <h4 className='text-xl'>{name}</h4>
            <p className='text-md'>{description}</p>
        </div>
    </div>
})

export default EntityCard
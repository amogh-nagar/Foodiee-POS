import React from 'react'
import { getRandomColors } from '../../utils/constants';

const CategoryCard = ({img, name, handler}) => {
  var styleObj = {}
  if(img) {
    styleObj.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(" + img + ')';
    styleObj.backgroundSize = 'cover';
    styleObj.color = 'white'
    styleObj.backgroundPosition = 'center';
    styleObj.filter = "blur('8px')"
  } else {
    styleObj.backgroundImage = 'linear-gradient(' + getRandomColors() + ',' + getRandomColors() + ")";
  }
  return (
    <div onClick={handler} className="flex flex-col items-start justify-end text-primary-700 w-40 h-32 p-4 rounded-xl cursor-pointer" style={styleObj}>
      <div className="">
        <h3 className='text-xl font-semibold'>{name}</h3>
      </div>
  </div>
  )
}

export default CategoryCard
import React from 'react'
import { DiCoffeescript } from "react-icons/di";
import { getRandomColors } from '../utils/constants';

const CtgNdSuperCtgCard = ({img, name, handler}) => {
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
    <div onClick={handler} className="flex-col flex justify-between text-primary-700 w-36 h-32 p-4 rounded-xl" style={styleObj}>
      <div className=''>
        <DiCoffeescript className='w-8 h-8'/>
      </div>
      <div className="">
        <h3 className='text-xl font-semibold'>{name}</h3>
      </div>
  </div>
  )
}

export default CtgNdSuperCtgCard
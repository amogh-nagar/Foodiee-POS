import React from 'react'
import PageNameWithDate from '../components/PageNameWithDate'
import { IoMdAdd } from "react-icons/io";
import EntityCard from '../components/Entity/EntityCard';
import CustomMasonry from '../components/Wrappers/Masonry';
const Tenants = () => {
  return (
    <div>
      <PageNameWithDate name="Tenants" />
      <div>
        <div className=" items-center gap-x-3 mx-3 my-5 flex h-fit">
          <input
            className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
            placeholder="Search Tenants"
          />
          <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
            <IoMdAdd />
            <p>Tenant</p>
          </button>
        </div>
        <div className='mx-3'>
          <CustomMasonry colsCountBreakPoints={{ 350: 1,450:2,620:3, 810: 4,950:5, 1150: 6, 1500: 8 }} className='gap-y-4' Component={EntityCard} items={[
            {
              name: "Subway",
              description: "Subway India",
              img: "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg"
            }
          ]} colsCount={3} gutter='15px'/>
        </div>
      </div>
    </div>
  )
}

export default Tenants
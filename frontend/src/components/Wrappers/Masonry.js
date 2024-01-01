import React from 'react'
import Measure from 'react-measure';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
const CustomMasonry = ({ items, Component, colsCount = 3, gutter = '15px', className, colsCountBreakPoints = { 350: 1, 450: 2, 620: 3, 810: 4, 950: 5, 1150: 6, 1500: 8 } }) => {
    console.log("items are", items)
    return (
        <ResponsiveMasonry
            columnsCountBreakPoints={colsCountBreakPoints} className='cursor-pointer'
        >
            <Masonry columnsCount={colsCount} gutter={gutter} className={className}>
                {items.map((item, index) => <Measure key={index}>
                    {({ measureRef }) => (
                        <Component {...item} ref={measureRef} />
                    )}
                </Measure>)}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default CustomMasonry
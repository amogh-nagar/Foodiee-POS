import React from 'react'

const ChartWrapper = ({Chart, ...args}) => {
  return (
    <div className="bg-slate-800 rounded-xl border-secondary-600 border-2 p-5 flex justify-center" style={{ width: '350px', height: '250px' }}>
        <Chart {...args}/>
    </div>
  )
}

export default ChartWrapper
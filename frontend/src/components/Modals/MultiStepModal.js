import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
const MultiStepModal = ({ PopUpButton, HeaderText, steps }) => {
    const [stepIndex, setStepIndex] = useState(0);
    console.log("stepIndex is", stepIndex)
    return (
        <Popup
            trigger={PopUpButton}
            modal
            nested
            overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
            {close => (
                <div className="modal bg-slate-900 text-white max-w-4xl">
                    <div className="header px-5 py-3"><HeaderText /></div>
                    <div className="content px-5 py-3 flex justify-between items-center gap-x-3">
                        <div onClick={() => {
                            setStepIndex((prev) => prev === 0 ? 0 : prev - 1);
                        }} className={`w-7 h-7 flex justify-center items-center ${(stepIndex === 0 ? "disableEntity" : "")}`}>
                            <button className='text-secondary-700'><GrCaretPrevious className='w-5 h-5' /></button>
                        </div>
                        <div className='flex justify-center items-center overflow-y-auto h-[30rem] w-[50rem] hide-scrollbar'>
                            {
                                steps.map((Step, index) => stepIndex === index && <Step key={index} />)
                            }
                        </div>
                        <div onClick={() => {
                            setStepIndex((prev) => prev == steps.length - 1 ? steps.length - 1 : prev + 1);
                        }} className={`w-7 h-7 flex justify-center items-center ${(stepIndex === steps.length - 1 ? "disableEntity" : "")}`} >
                            <button className='text-secondary-700'><GrCaretNext className='w-5 h-5' /></button>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center gap-x-2 mb-2">
                        {
                            steps.map((Step, index) => (
                                <span key={index} className={`h-3 w-3 block rounded-full ${stepIndex >= index ? "bg-secondary-600" : "bg-gray-700"}`}></span>
                            ))
                        }
                    </div>
                    <div className="actions px-5 py-3">
                        <button
                            className="button bg-secondary-500 hover:bg-secondary-700"
                            onClick={() => {
                                setStepIndex(0);
                                close();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default MultiStepModal
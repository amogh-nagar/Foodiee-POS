import React from 'react'
import Popup from 'reactjs-popup'
const Modal = ({ PopUpButton, HeaderText, BodyContent }) => {
    return (
        <Popup
            trigger={PopUpButton}
            modal
            nested
            overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
            {close => (
                <div className="modal bg-slate-900 text-white">
                    <div className="header px-5 py-3"><HeaderText /></div>
                    <div className='content px-5 py-3 flex justify-center items-center overflow-y-auto h-[30rem] w-[50rem] hide-scrollbar'>
                        <BodyContent />
                    </div>
                    <div className="actions px-5 py-3">
                        <button
                            className="button bg-secondary-500 hover:bg-secondary-700"
                            onClick={() => {
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

export default Modal
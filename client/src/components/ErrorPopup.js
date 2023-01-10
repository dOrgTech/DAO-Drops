import React, { useState } from 'react'
import closeIcon from '../assets/icons/close.svg'

// Error Popup Component
// ------------------------------------------------------------------------------------------------------- //
const ErrorPopup = ({errorPopupStatus, setErrorPopupStatus}) => {

  return (
    <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='error-popup-overlay' 
         onClick={(e) => e.target === document.querySelector('#error-popup-overlay') ? (document.querySelector('#error-popup-overlay').style.display = 'none', setErrorPopupStatus(false)) : null}>
        <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100' style={{backgroundPosition: '0 -75px'}}>
            <img className='absolute right-3 top-3 cursor-pointer hover:brightness-75' src={closeIcon} alt='Close Popup' 
                 onClick={() => {document.querySelector('#error-popup-overlay').style.display = 'none'; setErrorPopupStatus(false); }} />

            <div className='rounded-t-[4.5rem] mt-[10rem] px-12 800px:px-16 py-8 bg-white w-full h-[calc(100%-10rem)]'>
            
            <div className='flex flex-col my-16 1000px:my-[100px] justify-center items-center'>
                <h3 className='font-ibm 800px:font-obWide font-bold 800px:font-semibold leading-[2.7rem] mb-14 text-center text-3xl'>We've encountered an issue!</h3>
                <div className='font-ibm font-semibold text-2xl text-gray6 text-center'>Please refresh your page and try again in a few minutes.</div>

            </div>
            </div>

        </div>
    </div>
)}
// ------------------------------------------------------------------------------------------------------- //

export default ErrorPopup;

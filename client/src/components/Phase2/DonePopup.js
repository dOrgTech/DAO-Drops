import React from 'react'
import * as constants from '../../Constants'

import twitter from '../../assets/icons/twitter2.svg'
import closeIcon from '../../assets/icons/close.svg'


// Done Popup Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const DonePopup = ({ donePopupStatus, setDonePopupStatus }) => {

    return (
      <>
        { donePopupStatus && 
            <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='done-popup-overlay' onClick={(e) => e.target === document.querySelector('#done-popup-overlay') ? (document.querySelector('#done-popup-overlay').style.display = 'none', setDonePopupStatus('hidden')) : null}>
              <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100' style={{backgroundPosition: '0 -75px'}}>
                
                <img className='absolute right-3 top-3 cursor-pointer' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#done-popup-overlay').style.display = 'none'; setDonePopupStatus(false); }} />
                <div className='rounded-t-[4.5rem] mt-[10rem] px-12 800px:px-16 py-8 bg-white w-full h-[calc(100%-10rem)]'>
                  <div className='flex flex-col my-16 1000px:my-[100px] justify-center items-center'>
                    <h3 className='font-ibm 800px:font-obWide font-bold 800px:font-semibold leading-[2.7rem] mb-14 text-center text-3xl'>Awesome!<br/>Your points were submitted.</h3>
                    <div className='font-ibm font-semibold text-xl text-gray6 text-center'>Stay tuned for the next phase in:</div>

                    <div className='mt-1 text-center'>
                      <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                        <div className='font-ibm font-semibold text-xl text-magentaDD2 underline mb-2 hover:text-magentaDD3'>DAO drops twitter</div>
                        <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        }
      </>
)}
// ------------------------------------------------------------------------------------------------------- //

export default DonePopup;

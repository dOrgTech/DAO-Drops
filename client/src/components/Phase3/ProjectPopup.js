import React from 'react'
import closeIcon from '../../assets/icons/close.png'


// Project Popup Component (Phase3)
// ------------------------------------------------------------------------------------------------------- //
const ProjectPopup = ({ popupStatus, setPopupStatus, popupDetails }) => {

    return (
      <>
        { popupStatus === 'visible' ?
          <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden')) : null}>
            <div className='project-popup'>
              <img className='absolute -left-4 top-5 cursor-pointer' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; setPopupStatus('hidden');}} />
            
              <div className='bg-white w-full relative h-[calc(100%-89px)] mt-[89px] border-r-[6px] border-b-[6px] border-l-[6px] border-indigoDD'>
  
                  <div className='absolute inset-x-0 top-[-4.4rem] m-auto w-max'>
                    <div className='bg-white border-indigoDD border-[7px] rounded-full flex justify-center items-center'><img className='w-32 h-32 object-none rounded-full' src={popupDetails.image} alt='Project Icon' /></div>
                  </div>
  
                  <div className='px-8 pt-20 text-indigoDD'>
                    <h4 className='font-ob font-black text-3xl mb-6'>{popupDetails.name}</h4>
                    <div className='font-ibm text-lg h-[21.25rem] overflow-y-auto'>{popupDetails.message}</div>
  
                    <div className='mt-6 p-6 border-[6px] border-[#CAFEF7]'>
                      <div className='font-ob font-bold uppercase'>Project Link:</div>
                      <a target='_blank' rel='noreferrer' href={popupDetails.link} className='font-ibm'>{popupDetails.link}</a>
  
                      <div className='font-ob font-bold uppercase mt-6'>Address:</div>
                      <a target='_blank' rel='noreferrer' href={`https://etherscan.io/address/0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca`} className='font-ibm'>0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca</a>
                    </div>
  
                    <div className='flex mt-8 justify-center'>
                      <span className='font-ibm font-semibold text-[1.75rem] mx-4'>{popupDetails.points || '0'} Points Received</span>
                    </div>
                  </div>
                  
              </div>
  
            </div>
          </div>
  
          : null
        }
  
      </>
    )}
// ------------------------------------------------------------------------------------------------------- //

export default ProjectPopup;

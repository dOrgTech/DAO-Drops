import React from 'react'
import Repeatable from 'react-repeatable'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { withHttp } from '../../Utils'

import plus from '../../assets/icons/plus.svg'
import minus from '../../assets/icons/minus.svg'
import closeIcon from '../../assets/icons/close.png'


// Project Popup Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const ProjectPopup = ({ popupStatus, setPopupStatus, popupDetails, setVotes, votes, points, setPoints, votesSubmitted }) => {
    
    function decrement() {
      if(votesSubmitted !== 'true' && votes && votes[popupDetails.id] !== 0) {
        setVotes(v => ({...v, [popupDetails.id]: v[popupDetails.id]-1}))
        setPoints(points+1)
      }
    }
  
    function increment() {
      if(votesSubmitted !== 'true' && votes && points !==0) {
        setVotes(v => ({...v, [popupDetails.id]: v[popupDetails.id]+1}))
        setPoints(points-1)
      }
    }
  
    return (
      <>
        { popupStatus === 'visible' ?
            <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-20' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden')) : null}>
              <div className='project-popup'>
                <img className='absolute -left-4 top-5 cursor-pointer' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; setPopupStatus('hidden');}} />
              
                <div className='project-popup-bg w-full relative h-[calc(100%-89px)] mt-[78px] 525px:mt-[82px] 550px:mt-[86px] 600px:mt-[89px] border-r-[6px] border-b-[6px] border-l-[6px] border-indigoDD'>
    
                    <div className='absolute inset-x-0 top-[-4.4rem] m-auto w-max'>
                      <div className='bg-white border-indigoDD border-[7px] rounded-full flex justify-center items-center'>
                        { popupDetails.image 
                          ? <img className='w-32 h-32 object-cover rounded-full' src={popupDetails.image} alt={popupDetails.name} />
                          : <div className='w-32 h-32 object-cover rounded-full'> <Jazzicon diameter={128} seed={jsNumberForAddress(popupDetails.paddress)} paperStyles={{ borderRadius: 99 }}/> </div>
                        }
                      </div>
                    </div>
    
                    <div className='pr-8 pl-[30px] 600px:px-8 pt-20 text-indigoDD'>
                      <h4 className='font-ob font-extrabold text-3xl mb-6'>{popupDetails.name}</h4>
                      <div className='font-ibm text-lg h-[20.5rem] overflow-y-auto whitespace-pre-wrap'>{popupDetails.message}</div>
    
                      <div className='bg-white mt-6 p-6 border-[6px] border-[#CAFEF7]'>
                        <div className='font-ob font-bold uppercase'>Project Link:</div>
                        <a target='_blank' rel='noreferrer' href={withHttp(popupDetails.link)} className='font-ibm break-all'>{popupDetails.link}</a>
    
                      {/* <div className='font-ob font-bold uppercase mt-6'>Address:</div>
                        <a target='_blank' rel='noreferrer' href={`https://etherscan.io/address/${popupDetails.paddress}`} className='font-ibm'>{popupDetails.paddress}</a> */}

                      </div>
    
                      <div className='flex mt-8 mb-6 justify-center items-center'>
                        <Repeatable repeatInterval={100} onPress={decrement} onHold={decrement}> <img className='scale-[135%] cursor-pointer' src={minus} alt='minus' /> </Repeatable>
                        <span className='font-ibm font-semibold text-[2.5rem] mx-4'>{votes ? votes[popupDetails.id] : '0'}</span>
                        <Repeatable repeatInterval={100} onPress={increment} onHold={increment}> <img className='scale-[135%] cursor-pointer' src={plus} alt='plus' /> </Repeatable>
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

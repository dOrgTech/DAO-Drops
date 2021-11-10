import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import logo from '../assets/logos/logo.svg'
import dropsVideo from '../assets/video/drops.mp4'
import dropsThumbnail from '../assets/video/drops-thumbnail.jpg'
import bubble from '../assets/phase1/bubble.png'
import squiggle from '../assets/phase1/squiggle.svg'
import dots from '../assets/phase1/dots.svg'
import smallDots from '../assets/phase1/dots-small.svg'
import aquaBox from '../assets/phase1/aqua-box.svg'
import twitter from '../assets/icons/twitter.svg'
import picture from '../assets/icons/picture.png'
import closeIcon from '../assets/icons/close.png'

// Phase1 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase1 = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, SetPopupStatus] = useState('hidden');
  
  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed
    }) => {
    if (completed) {
      return <span> </span>;
    } else {
      return <span className='flex'>
                <span className='mr-5 countdown-number'>{days}<div className='countdown-text'>days</div></span>
                <span className='mr-5 countdown-number'>{hours}<div className='countdown-text'>hours</div></span>
                <span className='mr-5 countdown-number'>{minutes}<div className='countdown-text'>min</div></span>
                <span className='countdown-number'>{seconds}<div className='countdown-text'>sec</div></span>
            </span>;
    }
  };

  return (
    <>
      <div className='phase1-bg h-screen px-[5%] 800px:px-[10%] pt-16'>

          <div className='flex items-start relative'>
              <img src={logo} alt='DAO Drops Logo' />
              <div className='ml-12 w-full h-[38rem] border-[6px] border-indigoDD z-10 relative'>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} src={dropsVideo} autoPlay loop playsInline muted onLoadedData={onLoadedData} />
                  
                  <img className='absolute top-[-6%] left-[35%] z-20 800px:bubble' src={bubble} alt='Bubble' />
                  <img className='absolute top-[111%] left-[47%] 800px:top-[20%] 800px:left-[9%] z-20' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[44%] right-[19%] z-10 hidden 800px:block' src={dots} alt='Dots' />
                  <img className='absolute -bottom-32 -left-20 800px:-bottom-1 800px:left-[-3.125rem] z-0' src={smallDots} alt='Dots' />

                  <div className='absolute bottom-0 z-20'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line'>
                      <div className='absolute pb-0.5'>PHASE 1 ENDS IN:</div>
                    </div>

                    <div className='w-[32rem] h-[6.5rem] bg-white border-t-[6px] border-r-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                      <Countdown date={'2021-11-20T12:00:00.000+00:00'} renderer={renderer} />  
                    </div>
                  </div>

              </div>
              <img className='absolute -bottom-20 z-0 scale-75 800px:scale-100' src={aquaBox} alt='Aqua Box' />
          </div>

          <div className='flex flex-wrap pb-8 800px:p-0'>
            <div className='mt-[6.25rem] order-2 800px:order-1 w-full 800px:w-auto relative'>
                <div className='font-ob text-magentaDD text-xl 800px:text-sm border-b border-magentaDD pb-4 w-full 800px:w-[19rem]'>
                  Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                  by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                </div>

                <div className='800px:mt-2.5 absolute 800px:relative right-4 top-4 800px:inset-0 scale-150 800px:scale-100'>
                  <a target='_blank' rel='noreferrer' href='https://twitter.com'>
                    <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                  </a>
                </div>
            </div>

            <div className='800px:ml-16 mt-48 800px:mt-10 z-10 order-1 800px:order-2'>
              <h3 className='text-3xl 800px:text-[2.6rem] mb-5'>something big is about to drop.</h3>
              <div className='subtitle2 hidden 800px:block'>know someone deserving?</div>
              <div className='button1 mt-10' onClick={ () => { SetPopupStatus('nominate'); } }>Nominate Them</div>
            </div>
          </div>

      </div>

      <NominatePopup popupStatus={popupStatus} SetPopupStatus={SetPopupStatus} />
    </>
  )}
// ------------------------------------------------------------------------------------------------------- //

const NominatePopup = (props) => {
  
  const { popupStatus, SetPopupStatus } = props

  return (
    <>

      { popupStatus === 'nominate' ?
          <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-10' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden')) : null}>
              <div className='popup'>
                <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; SetPopupStatus('hidden');}} />
                <div className='rounded-t-[4.5rem] mt-[3.75rem] px-16 py-8 bg-white w-full h-[calc(100%-3.75rem)]'>
                  <div className='font-ibm font-bold text-lg text-center mb-9'>Hello! Please nominate a project that you think should receive funds.</div>
                  
                  <div className='flex'>
                    <div className='w-max mr-16'>
                      <div className='bg-gray1 border-gray2 border-[7px] rounded-full w-max p-5 mb-2 cursor-pointer'><img src={picture} alt='Picture' /></div>
                      <div className='font-ibm font-bold text-xl text-center'>Picture</div>
                    </div>

                    <form className='flex flex-col w-full mt-2 mr-16 font-ibm font-bold text-base' autocomplete='off'>
                      <label for='project-name' className='required'>Project Name</label>
                      <input className='w-full h-10 mt-1.5 mb-3' type='text' id='project-name' name='project-name' required />

                      <label for='funding-reason' className='required'>Why should they receive the funding? Tell us more!</label>
                      <textarea className='w-full h-28 mt-1.5 mb-2' id='funding-reason' name='funding-reason' required />

                      <label for='website'>Link to website/Gitcoin</label>
                      <input className='w-full h-10 mt-1.5 mb-3' type='text' id='website' name='website' />
                      
                      <label for='contact' className='required'>Contact of project (for verification)</label>
                      <div className='flex items-center mt-1.5 mb-6'>
                        <select className='border border-gray3 rounded-[1.25rem] h-10 px-7 text-gray4 font-bold mr-7' name="contact-method" id="contact-method">
                          <option value="email">email</option>
                          <option value="twitter">twitter</option>
                          <option value="discord">discord</option>
                        </select>
                        <input className='w-full h-10' type='text' id='contact' name='contact' required />
                      </div>
                      
                      <button className='button2 ml-auto' type='submit' onClick={ () => { SetPopupStatus('submitted'); } }>Submit</button>
                    </form>
                  </div>
                </div>

              </div>
          </div>

        : popupStatus === 'submitted' ?
        <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-10' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden')) : null}>
        <div className='popup' style={{backgroundPosition: '0 -75px'}}>
          <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; SetPopupStatus('hidden');}} />
          <div className='rounded-t-[4.5rem] mt-[13rem] px-16 py-8 bg-white w-full h-[calc(100%-13rem)]'>
            
            <div className='flex mt-24'>
                <div div className='w-max mr-16'>
                  <div className='bg-gray1 border-gray2 border-[7px] rounded-full w-max p-5'><img src={picture} alt='Picture' /></div>
                </div>

                <div>
                  <h3 className='font-semibold leading-[3rem] mb-5'>Awesome!<br/>Project nominated.</h3>
                  <div className='font-ibm font-semibold text-[1.65rem] text-[#727272]'>Stay tuned for Phase 2!</div>
                </div>
                
            </div>
          </div>

        </div>
        </div>

        : null
      }

    </>
  )}



export default Phase1;
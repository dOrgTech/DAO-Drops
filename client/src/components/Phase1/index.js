import React, { useState, useEffect, useRef } from 'react'
import NominatePopup from './NominatePopup'
import ErrorPopup from '../ErrorPopup'
import * as constants from '../../Constants'
import Countdown from 'react-countdown'

import logo from '../../assets/logos/logo.svg'
import dropsVideo from '../../assets/video/drops.mp4'
import dropsVideoOGG from '../../assets/video/drops.ogg'
import dropsVideoWEBM from '../../assets/video/drops.webm'
import dropsThumbnail from '../../assets/video/drops-thumbnail.jpg'
import bubble from '../../assets/particles/bubble.png'
import squiggle from '../../assets/phase1/squiggle.svg'
import dots from '../../assets/phase1/dots.svg'
import smallDots from '../../assets/phase1/dots-small.svg'
import aquaBox from '../../assets/phase1/aqua-box.svg'
import twitter from '../../assets/icons/twitter.svg'
import github from '../../assets/icons/github.svg'


// Phase1 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase1 = ({setPhaseView}) => {
  const [errorPopupStatus, setErrorPopupStatus] = useState(false)

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [popupStatus, setPopupStatus] = useState('hidden')
  const phase1End = '2023-02-03T00:00:00.000+00:00'
  // const phase1End = Date.now() + 10000

  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [height])

  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed
    }) => {
    if (completed) {
      setPhaseView('p')
      return <span> </span>;
    } else {
      return <span className='flex'>
                <span className='countdown-number'>{days}<div className='countdown-text'>days</div></span>
                <span className='countdown-number'>{hours}<div className='countdown-text'>hours</div></span>
                <span className='countdown-number'>{minutes}<div className='countdown-text'>min</div></span>
                <span className='mr-0 countdown-number'>{seconds}<div className='countdown-text'>sec</div></span>
            </span>;
    }
  };

  return (
    <>
      <div className='phase1-bg-mobile h-screen 1000px:phase1-bg px-[5%] 1000px:px-[10%] pt-9'>
          <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl relative flex justify-end 1200px:right-[-8.5%] -top-3 z-20 hover:text-magentaDD4' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>
          <div className='flex items-start relative'>
              <img src={logo} alt='DAO Drops Logo' className='z-10'/>
              <div className='ml-8 600px:ml-12 w-full border-[6px] border-indigoDD z-10 relative !min-h-[31rem]' style={{height: `calc(100vh - ${height+105}px)`}}>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={() => setIsVideoLoaded(true)}>
                    <source src={dropsVideo} type='video/mp4'/>
                    <source src={dropsVideoOGG} type='video/ogg'/>
                    <source src={dropsVideoWEBM} type='video/webm'/>
                  </video>

                  <img className='absolute top-[-10%] left-[8%] 1000px:top-[-25%] 1000px:left-[18%] z-20 bubble-animation min-w-[60vw] 1000px:min-w-[700px] w-[60%] opacity-95' src={bubble} alt='Bubble' />
                  <img className='absolute top-[111%] left-[40%] 1000px:top-[20%] 1000px:left-[9%] z-10 scale-75 600px:scale-100' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[44%] right-[19%] z-10 hidden 1000px:block' src={dots} alt='Dots' />
                  <img className='absolute -bottom-32 left-[-4.5rem] 1000px:-bottom-1 1000px:left-[-3.125rem] z-0 scale-75 600px:scale-100' src={smallDots} alt='Dots' />

                  <div className='absolute bottom-0 z-20 w-full 800px:w-auto'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line'>
                      <div className='absolute pb-0.5 uppercase text-[15px]'>nomination phase:</div>
                    </div>

                    <div className='w-full 800px:w-[32rem] h-[6.5rem] bg-white border-t-[6px] 800px:border-r-[6px] border-indigoDD font-obWide font-extrabold text-5xl flex justify-center items-center'>
                      <Countdown date={phase1End} renderer={renderer} />
                    </div>
                  </div>

              </div>
              <img className='absolute -bottom-20 z-0 -left-7 1000px:left-0 scale-75 1000px:scale-100' src={aquaBox} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 1000px:p-0 flex-wrap 1000px:flex-nowrap' ref={ref}>
            <div className='mt-20 1000px:mt-[6.25rem] order-2 1000px:order-1 w-auto relative'>
                <div className='font-ob text-magentaDD text-sm border-b border-magentaDD pb-4 w-[19rem]'>
                  Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and supported<br/>
                  by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                </div>

                <div className='mt-2.5 relative inset-0'>
                  <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                    <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                  </a>
                  <a target='_blank' rel='noreferrer' href={constants.Github}>
                    <img className='inline hover:scale-105 ml-3 w-[23px] h-[23px]' src={github} alt='Twitter' />
                  </a>
                </div>
            </div>

            <div className='1000px:ml-16 mt-32 1000px:mt-7 z-10 order-1 1000px:order-2'>
              <h3 className='text-3xl h870px:text-[calc(1rem+1vw)] 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-6 leading-10'>something big is about to drop.</h3>
              <div className='subtitle2 hidden 1000px:block text-[calc(0.4rem+1vw)] leading-snug'>know a project or someone deserving?</div>
              {/* <div className='subtitle2 text-[calc(0.7rem+1vw)] leading-6 800px:leading-7 1000px:leading-snug 1000px:text-[calc(0.4rem+1vw)]'>know a project or someone deserving?</div> */}
              <div className='button1-small 600px:button1 mt-6 1000px:mt-7 1000px:mb-8 h870px:button1-small' onClick={ () => { setPopupStatus('nominate'); } }>Nominate Them</div>
            </div>
          </div>

      </div>

      <NominatePopup popupStatus={popupStatus} setPopupStatus={setPopupStatus} setErrorPopupStatus={setErrorPopupStatus} />
      {errorPopupStatus && <ErrorPopup setErrorPopupStatus={setErrorPopupStatus} />}
    </>
  )}
// ------------------------------------------------------------------------------------------------------- //

export default Phase1;

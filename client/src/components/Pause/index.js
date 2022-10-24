import React, { useState, useEffect, useRef } from 'react'
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


// Pause Component
// ------------------------------------------------------------------------------------------------------- //
const Pause = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [height])

  return (
    <>
      <div className='phase1-bg-mobile h-screen 1000px:phase1-bg px-[5%] 1000px:px-[10%] pt-9'>
      <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl relative flex justify-end 1200px:right-[-8.5%] -top-3 z-20 hover:text-magentaDD4' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>
          <div className='flex items-start relative'>
              <img src={logo} alt='DAO Drops Logo' className='z-10'/>

              <div className='flex flex-col'>
                <div className='ml-8 600px:ml-12 mt-10 z-10'>
                  <h3 className='text-3xl h870px:text-[calc(1.1rem+1vw)] 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-6 leading-10'>pause time</h3>
                  <div className='font-obWide font-medium text-base 1000px:text-[calc(0.5rem+0.55vw)] leading-snug 1000px:w-[70%]'>we received all the amazing nominations and now they are being curated. Stay tuned for the next phase in: <a className='underline hover:text-indigoDD2 font-semibold' href={constants.Twitter} target='_blank' rel='noreferrer'> DAO drops twitter.</a></div>
                </div>

                <div className='ml-8 600px:ml-12 w-auto border-[6px] border-indigoDD z-10 relative !min-h-[20.5rem] mt-14' style={{height: `calc(100vh - ${height+350}px)`}}>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={() => setIsVideoLoaded(true)}>
                    <source src={dropsVideo} type='video/mp4'/>
                    <source src={dropsVideoOGG} type='video/ogg'/>
                    <source src={dropsVideoWEBM} type='video/webm'/>
                  </video>

                  <img className='absolute top-[-10%] left-[8%] 1000px:top-[-25%] 1000px:left-[40%] z-20 bubble-animation min-w-[60vw] 1000px:min-w-[600px] w-[50%] opacity-95' src={bubble} alt='Bubble' />
                  <img className='absolute top-[111%] left-[40%] 1000px:top-[40%] 1000px:left-[9%] z-10 scale-75 600px:scale-100' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[-133px] right-[8%] z-10 hidden 1000px:block max-h-[60%]' src={dots} alt='Dots' />
                  <img className='absolute -bottom-32 left-[-4.5rem] 1000px:-bottom-1 1000px:left-[-3.125rem] z-0 scale-75 600px:scale-100' src={smallDots} alt='Dots' />
                </div>
              </div>

              <img className='absolute -bottom-20 z-0 -left-7 1000px:left-0 scale-75 1000px:scale-100' src={aquaBox} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 1000px:p-0 flex-wrap 1000px:flex-nowrap' ref={ref}>
            <div className='mt-44 1000px:mt-[6.25rem] order-2 1000px:order-1 w-full 1000px:w-auto relative'>
                <div className='font-ob text-magentaDD text-xl 1000px:text-sm border-b border-magentaDD pb-4 w-full 1000px:w-[19rem]'>
                  Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                  by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                </div>

                <div className='1000px:mt-2.5 absolute 1000px:relative right-4 top-4 1000px:inset-0 scale-150 1000px:scale-100'>
                  <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                    <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                  </a>
                </div>
            </div>
          </div>

      </div>

    </>
  )}
// ------------------------------------------------------------------------------------------------------- //

export default Pause;
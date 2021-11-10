import React, { useState, useEffect } from 'react';
import { commify, formatUnit, bigNumber, truncate } from "../Utils";
import Countdown from 'react-countdown';
import logo from '../assets/logos/logo.svg'
import dropsVideo from '../assets/video/drops.mp4'
import dropsThumbnail from '../assets/video/drops-thumbnail.jpg'
import bubble from '../assets/phase1/bubble.png'
import squiggle from '../assets/phase1/squiggle.svg'
import dots from '../assets/phase1/dots.svg'
import dots2 from '../assets/phase2/dots2.svg'
import smallDots from '../assets/phase1/dots-small.svg'
import smallDots2 from '../assets/phase2/dots-small2.svg'
import aquaBox from '../assets/phase1/aqua-box.svg'
import twitter from '../assets/icons/twitter.svg'
import picture from '../assets/icons/picture.png'
import closeIcon from '../assets/icons/close.png'
import projectImage from '../assets/phase2/project-image.png'
import projectIcon from '../assets/phase2/project-icon.svg'
import plus from '../assets/icons/plus.svg'
import minus from '../assets/icons/minus.svg'

// Phase2 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase2 = (props) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, SetPopupStatus] = useState('hidden');
  const [points, SetPoints] = useState(0);
  
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
      <div className='phase1-bg px-[5%] 800px:px-[10%]'>

          <header className={`flex justify-end z-20 w-full mt-4 ${props.address && 'fixed pr-[10%] ml-[-10%] mt-0 pt-[15px] header-bg h-[70px]'}`}>
          {/* <header className={`flex justify-end mt-4 z-20`}> */}
            { props.address 
              ? <div className='uppercase flex flex-col relative'>
                  <div className='border-[3px] border-aquaDD font-ob font-bold w-[21rem] px-4 pb-2 pt-1 address mb-2 bg-white'>{truncate(props.address)}</div>
                  
                  <div className='absolute top-12 z-20 bg-white'>
                    <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] p-4 text-center'>
                      <div>you have</div>
                      <div className='font-obWide font-black text-6xl pb-3'>{100-points}</div>
                      <div>points remaining</div>
                    </div>
                    <div className='border-b-4 border-r-4 border-l-4 border-aquaDD font-ob font-bold w-[21rem] p-4'>
                      <div className='button1-small w-[16rem] m-auto'>Send Points</div>
                    </div>
                  </div>

                </div>

              : <div className='button1-small w-[20rem]' onClick={props.loadWeb3}>Connect Wallet</div>
            }
              
          </header>

          <div className={`flex items-start relative ${props.address ? 'pt-16' : 'mt-4'}`}>
          {/* <div className={`flex items-start relative mt-4`}> */}
              <img src={logo} alt='DAO Drops Logo' />

              <div className='ml-12 w-full h-[28rem] mt-32 border-[6px] border-indigoDD z-10 relative'>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} src={dropsVideo} autoPlay loop playsInline muted onLoadedData={onLoadedData} />
                  
                  <img className='absolute -top-36 left-[35%] z-20 bubble-animation2' src={bubble} alt='Bubble' />
                  <img className='absolute top-[111%] left-[47%] 800px:top-[20%] 800px:left-[5%] z-20' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[30%] right-[27%] z-10 hidden 800px:block' src={dots} alt='Dots' />
                  <img className='absolute top-[51rem] -left-60 z-10' src={dots2} alt='Dots' />
                  <img className='absolute top-14 -left-10 z-0' src={smallDots} alt='Dots' />

                  <div className='absolute -top-24 -left-1.5 z-20'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                      <div className='absolute pb-1 pl-1'>PHASE 2 ENDS IN:</div>
                    </div>

                    <div className='w-[32rem] h-[6.5rem] bg-white border-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                      <Countdown date={'2021-11-30T12:00:00.000+00:00'} renderer={renderer} />  
                    </div>
                  </div>

              </div>

              <img className='absolute bottom-[-9.125rem] right-[-1px] z-0 scale-75 800px:scale-100' src={aquaBox} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 800px:p-0 800px:ml-24 justify-between'>
            
          { props.address 
            ? <div className='mt-10 z-10'>
                <h3 className='text-3xl 800px:text-[2.6rem] mb-10'>You are now part of the DAO</h3>
                <div className='subtitle2 text-3xl leading-10 mb-10'>Drop your points and make it rain ☔ ️</div>
                <div className='button1-down text-3xl w-[24rem]'>Drop Points</div>
              </div>
            : <div className='mt-10 z-10'>
                <h3 className='text-3xl 800px:text-[2.6rem] mb-5'>Connect your wallet</h3>
                <div className='subtitle2 text-3xl leading-10'>To be part of this awesome experience to drop your points and make it rain ☔</div>
              </div>
          }

            <div className='mt-[10.5rem] relative right-0'>
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

          </div>
          
          { !props.address
          ? <div className='flex justify-center mt-8 mb-32'>
              <div className='relative z-10'>
                <div className='w-32 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line toplay'>
                  <div className='absolute pb-1'>To Play</div>
                </div>

                <div className='w-[44rem] h-[8.5rem] bg-white border-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                  <div className='button1 w-[29rem] 800px:w-[35.5rem]' onClick={props.loadWeb3}>Connect Wallet</div>
                </div>
              </div>
            </div>
          : <div className='mt-32 mb-16 z-10 w-[72rem] text-center m-auto'>
              <h3 className='text-3xl 800px:text-[2.6rem] mb-10'>HOW TO DROP POINTS</h3>
              <div className='subtitle2 text-2xl mb-10'>Distribute your points in the projects you think should receive funding. You can modify your points until Phase 2 ends and it will always be automatically saved.️</div>
            </div>
          }

          <div className={`flex flex-wrap justify-center gap-10 mb-16 ${!props.address && 'grayscale'} `}>

            <Project color='p-orange' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} points={points} SetPoints={SetPoints} id='1' />
            <Project color='p-green' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-pink' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-blue' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />

            <Project color='p-green' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-pink' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-blue' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-orange' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />

            <Project color='p-pink' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-blue' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-orange' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-green' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />

            <Project color='p-blue' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-orange' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-green' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />
            <Project color='p-pink' name='Project Name' image={projectImage} SetPopupStatus={SetPopupStatus} />

          </div>

      </div>

      <footer className='w-full h-24 px-[4%] flex justify-between items-center bg-[#FFF3FF]'>
        <div className='font-ob text-magentaDD text-lg'>
          Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
          by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
        </div>

        <div className='scale-150'>
          <a target='_blank' rel='noreferrer' href='https://twitter.com'>
            <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
          </a>
        </div>
      </footer>

      <ProjectPopup popupStatus={popupStatus} SetPopupStatus={SetPopupStatus} />
    </>
  )}

// ------------------------------------------------------------------------------------------------------- //

const Project = (props) => {
  
  return (
    <div className={`w-72 h-64 rounded-[1.75rem] p-4 pl-7 relative ${props.color} `}>
      <div className='font-ob font-black text-4xl pt-1'>{props.name}</div>
      <div className={`${props.color == 'p-blue' ? 'details-button-indigo' : 'details-button-yellow' } mt-4`} onClick={ () => { props.SetPopupStatus('visible'); } }>view details</div>

      <div class='flex mt-10'>
        <img src={minus} alt="minus" onClick={() => props.SetPoints(props.points-1)} className='cursor-pointer'/>
        <span className='font-ibm font-semibold text-[1.75rem] mx-2'>{props.id == 1 ? props.points : '00'}</span>
        <img src={plus} alt="plus" onClick={() => props.SetPoints(props.points+1)} className='cursor-pointer'/>
      </div>

      {props.color == 'p-pink' && <img className='absolute bottom-6 right-2 mr-4 mb-4 z-0' src={smallDots2} alt='Dots' /> }
      <img className='absolute bottom-0 right-0 mr-4 mb-4' src={props.image} alt={props.name} />

    </div>
  )}


const ProjectPopup = (props) => {
  
  const { popupStatus, SetPopupStatus } = props

  return (
    <>
      { popupStatus === 'visible' ?
        <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-10' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden')) : null}>
          <div className='project-popup'>
            <img className='absolute -left-4 top-5 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; SetPopupStatus('hidden');}} />
          
            <div className='bg-white w-full relative h-[calc(100%-89px)] mt-[89px] border-r-[6px] border-b-[6px] border-l-[6px] border-indigoDD'>

                <div div className='absolute inset-x-0 top-[-4.4rem] m-auto w-max'>
                  <div className='bg-white border-indigoDD border-[7px] rounded-full flex justify-center items-center w-32 h-32 p-2'><img src={projectIcon} alt='Project Icon' /></div>
                </div>

                <div className='px-8 pt-20 text-indigoDD'>

                  <h4 className='font-ob font-black text-3xl mb-6'>This nominee  HAS A PRETTY LONG TITLE</h4>
                  <div className='font-ibm text-lg'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et   dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br/><br/>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</div>

                  <div className='mt-6 p-6 border-[6px] border-[#CAFEF7]'>
                    <div className='font-ob font-bold uppercase'>Project Link:</div>
                    <a target='_blank' rel='noreferrer' href='https://www.gitcoin.com/my-project-123' className='font-ibm'>https://www.gitcoin.com/my-project-123</a>

                    <div className='font-ob font-bold uppercase mt-6'>Address:</div>
                    <a href='#' className='font-ibm'>0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca</a>
                  </div>

                  <div class='flex mt-8 justify-center'>
                    <img className='scale-[135%]' src={minus} alt="minus" className='cursor-pointer'/>
                    <span className='font-ibm font-semibold text-[2.5rem] mx-4'>00</span>
                    <img className='scale-[135%]' src={plus} alt="plus" className='cursor-pointer'/>
                  </div>

                </div>
                
            </div>

          </div>
        </div>

        : null
      }

    </>
  )}


export default Phase2;
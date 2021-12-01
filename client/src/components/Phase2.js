import React, { useState, useEffect } from 'react';
import { truncate } from "../Utils";
import Countdown from 'react-countdown';
import logo from '../assets/logos/logo.svg'
import dropsVideo from '../assets/video/drops.mp4'
import dropsVideoOGG from '../assets/video/drops.ogg'
import dropsVideoWEBM from '../assets/video/drops.webm'
import dropsThumbnail from '../assets/video/drops-thumbnail.jpg'
import bubble from '../assets/particles/bubble.png'
import squiggle from '../assets/phase1/squiggle.svg'
import dots from '../assets/phase1/dots.svg'
import dots2 from '../assets/phase2/dots2.svg'
import smallDots from '../assets/phase1/dots-small.svg'
import smallDots2 from '../assets/phase2/dots-small2.svg'
import aquaBox from '../assets/phase1/aqua-box.svg'
import aquaBoxMobile from '../assets/phase2/aqua-box-mobile.svg'
import twitter from '../assets/icons/twitter.svg'
import closeIcon from '../assets/icons/close.png'
import plus from '../assets/icons/plus.svg'
import minus from '../assets/icons/minus.svg'
import dots3 from '../assets/phase2/dots3.svg'
import squiggle2 from '../assets/phase2/squiggle2.svg'
import metamask from '../assets/phase2/metamask.png'
import axios from "axios";
import {useStickyState} from '../customHooks/StickyState'

// Phase2 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase2 = (props) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, setPopupStatus] = useState('hidden');
  const [popupDetails, setPopupDetails] = useState();
  const [connectToggle, setConnectToggle] = useState(false);
  const [projectsPicks, setProjectsPicks] = useState();
  const [votes, setVotes] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/posts/picks/')
      .then(r => {
        // let randomProjects = r.data.sort(() => Math.random() - 0.5);
        let sortedProjects = r.data.sort((a, b) => a.address.localeCompare(b.address));
        setProjectsPicks(sortedProjects)
        r.data.map( project => setVotes(votes => ({...votes, [project._id]: 0})) )
      })
      .catch(e => console.error(e));

  }, []);

  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed
    }) => {
    if (completed) {
      props.setPhaseView("3");
      return <div> </div>;
    } else {
      return <span className='flex'>
                <span className='mr-5 countdown-number2'>{days}<div className='countdown-text'>days</div></span>
                <span className='mr-5 countdown-number2'>{hours}<div className='countdown-text'>hours</div></span>
                <span className='mr-5 countdown-number2'>{minutes}<div className='countdown-text'>min</div></span>
                <span className='countdown-number2'>{seconds}<div className='countdown-text'>sec</div></span>
            </span>;
    }
  };

  return (
    <>
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>

          <header className={`flex justify-end z-20 w-full pt-4 ${props.walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
            { props.walletStatus === 'connected'
              ? <div className='uppercase flex flex-col relative w-full 1000px:w-auto'>
                  <div className='border-[3px] border-aquaDD aqua-dot font-ob font-bold w-[21rem] px-4 pb-2 pt-1 mb-2 bg-white hidden 1000px:block'>{truncate(props.address,11)}</div>
          
                  <div className='absolute top-[49px] z-20 bg-white hidden 1000px:block'>
                    <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] p-4 text-center'>
                      <div>you have</div>
                      <div className='font-obWide font-black text-6xl pb-3'>{props.points}</div>
                      <div>points remaining</div>
                    </div>
                    <div className='border-b-4 border-r-4 border-l-4 border-aquaDD font-ob font-bold w-[21rem] p-4'>
                      <div className='button1-small text-[1.3rem] w-[16.5rem] pb-2 m-auto' style={{backgroundPosition: '100% 35%', backgroundSize: '14%'}}>Send Points</div>
                    </div>
                  </div>

                  <div className='flex 1000px:hidden h-[50px] bg-white border-[3px] border-aquaDD'>
                    <div className='flex justify-center items-center flex-1 border-aquaDD border-r-[3px] font-ob font-bold w-full uppercase px-2 600px:px-4'>
                      <span className='font-obWide font-black text-2xl pb-2 pr-2 w-[73px]'>{props.points} </span>
                      <span className='leading-3 700px:leading-4 text-[0.7rem] 700px:text-[0.9rem] pb-0.5'>Your Points Remaining</span>
                    </div>
                    <div className="flex-1">
                      <div className='button1-small text-[0.6rem] w-[7.5rem] 700px:text-[0.8rem] 700px:w-[10rem] pb-0 m-auto border-b-4 mx-2 600px:mx-auto' style={{backgroundPosition: '100% 60%', backgroundSize: '14%'}}>Send Points</div>
                    </div>
                    <div className='flex justify-center items-center pb-1 px-1 pr-2 flex-1 aqua-dot 700px:after:content-["•"] after:right-4 after:top-0 font-ob font-bold w-full border-aquaDD border-l-[3px] bg-white'>{truncate(props.address,4)}</div>
                  </div>

                </div>

              : <div className={`button1-small text-lg w-[18rem] pb-2 600px:text-xl 600px:w-[20rem] 600px:pb-3 1000px:z-30 border-b-[5px] 600px:border-b-[6px] ${connectToggle && '1000px:fixed button1-small-down'} `} onClick={() => setConnectToggle(!connectToggle)}>Connect Wallet</div>
            }

            { connectToggle && props.walletStatus !== 'connected' &&
              <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay2 z-20' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setConnectToggle(false)) : null}>
                <a href={`${props.walletStatus === 'NA' ? 'https://metamask.io' : '#'}`} target={`${props.walletStatus === 'NA' ? '_blank' : '_self'}`} className='fixed 1000px:top-[4.4rem] 1000px:right-[10%] z-30 bg-white cursor-pointer' onClick={props.loadWeb3}>
                  <div className='border-[5px] border-indigoDD font-ob font-bold h-[26rem] py-20 px-6 w-[20rem] flex flex-col justify-between'>
                    
                    <div>
                      <div className='text-lg font-obWide font-medium'>{props.walletStatus === 'connecting' ? 'Connecting' : props.walletStatus === 'NA' ? 'Please Install' : 'Sign in with'}</div>
                      <div className='text-2xl font-obWide font-black uppercase'>MetaMask</div>
                    </div>
                    <div className={`mx-auto ${props.walletStatus === 'connecting' && 'rotate-180 transition-transform duration-500 ease-linear'}`}>
                      <img src={metamask} alt='MetaMask' />
                    </div>

                  </div>
                </a>
              </div>
            }
              
          </header>

          <div className={`flex items-start relative ${connectToggle && props.walletStatus !== 'connected' && '1000px:mt-[3.375rem]'} ${props.walletStatus === 'connected' ? 'pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem] mt-0' : 'mt-8 700px:mt-12 1000px:mt-2'}`}>
              <img className='mt-6 700px:mt-0' src={logo} alt='DAO Drops Logo' />

              <div className='ml-12 w-full h-[25rem] 1000px:h-[28rem] mt-16 1000px:mt-32 border-[6px] border-indigoDD z-10 relative'>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={onLoadedData}>
                    <source src={dropsVideo} type="video/mp4"/>
                    <source src={dropsVideoOGG} type="video/ogg"/>
                    <source src={dropsVideoWEBM} type="video/webm"/>
                  </video>
                  <img className='absolute top-[10%] left-[10%] 800px:top-[-25%] 800px:left-[15%] 1000px:top-[-45%] 1000px:left-[32%] z-20 bubble-animation min-w-[55vw] 1000px:min-w-[700px] w-[50%] opacity-95' src={bubble} alt='Bubble' />
                  <img className='absolute top-[20%] left-[5%] z-20 hidden 1000px:block' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[34%] right-[23%] z-10 hidden 1000px:block' src={dots} alt='Dots' /> 
                  <img className='absolute top-14 -left-10 z-0' src={smallDots} alt='Dots' />
                  <img className='absolute top-[51rem] -left-60 z-10 hidden 1000px:block' src={dots2} alt='Dots' />

                  <div className='absolute top-[-5.5rem] left-[-6.7rem] 700px:-top-24 700px:-left-10 1000px:-left-1.5 z-20 scale-75 700px:scale-100'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                      <div className='absolute pb-1 pl-1'>PHASE 2 ENDS IN:</div>
                    </div>

                    <div className='w-[31rem] 700px:w-[32rem] h-[6.5rem] bg-white border-[7px] 700px:border-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                      <Countdown date={'2021-12-28T00:00:00.000+00:00'} renderer={renderer} />
                    </div>
                  </div>

              </div>

              <img className='absolute bottom-[-9.125rem] right-[-1px] z-0 scale-100 hidden 1000px:block' src={aquaBox} alt='Aqua Box' />
              <img className='absolute bottom-[-11.1rem] right-[9px] z-0 block 1000px:hidden scale-125' src={aquaBoxMobile} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 1000px:p-0 1000px:ml-24 justify-between relative'>
            
            { props.walletStatus === 'connected' 
              ? <div  className='flex flex-col'>
                  <div className='mt-4 1000px:mt-10 z-10 pr-[6.3rem] 1000px:pr-6 pl-8 1000px:pl-0'>
                    <h3 className='text-3xl 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-5 700px:mb-10'>You are now part of the DAO</h3>
                    <div className='subtitle2 text-[calc(0.7rem+1vw)] leading-6 800px:leading-7 1000px:leading-8 1200px:leading-10 mb-10'>Drop your points and make it rain ☔ ️</div>
                  </div>
                  <a href='#drop-points' className='button1-down mx-auto self-center 1000px:mx-0 1000px:self-start text-3xl w-[24rem] block'>Drop Points</a>
                </div>
              : <div className='mt-4 1000px:mt-10 z-10 pr-[6.3rem] 1000px:pr-6 pl-8 1000px:pl-0'>
                  <h3 className='text-3xl 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-5'>Connect your wallet</h3>
                  <div className='subtitle2 text-[calc(0.65rem+1vw)] leading-6 800px:leading-7 1000px:leading-8 1200px:leading-10'>To be part of this awesome experience to drop your points and make it rain ☔</div>
                </div>
            }

            <div className='mt-[10.5rem] relative right-0 hidden 1000px:block'>
              <div className='font-ob text-magentaDD text-xl 1000px:text-sm border-b border-magentaDD pb-4 w-full 1000px:w-[19rem]'>
                Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
              </div>

              <div className='1000px:mt-2.5 absolute 1000px:relative right-4 top-4 1000px:inset-0 scale-150 1000px:scale-100'>
                <a target='_blank' rel='noreferrer' href='https://twitter.com'>
                  <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                </a>
              </div>
            </div>

            { projectsPicks &&
              <>
                <img className='absolute top-[83rem] left-[80%] z-0 hidden 1000px:block' src={dots3} alt='Dots' />
                <img className='absolute top-[90rem] left-[10%] z-0 hidden 1000px:block' src={squiggle2} alt='Squiggle' />
              </>
            }

          </div>
          
          { props.walletStatus !== 'connected'
          ? <>
              <div className='flex justify-center mt-16 1200px:mt-12 mb-20 1000px:mb-32'>
                <div className='relative z-10 w-full 800px:w-auto'>
                  <div className='w-32 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line toplay'>
                    <div className='absolute pb-1'>To Play</div>
                  </div>

                  <div className='w-full 800px:w-[43rem] h-[7.5rem] 800px:h-[8.5rem] bg-white border-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                    <div className='button1-small w-[24rem] text-[1.5rem] 800px:button1 800px:w-[32rem] 800px:text-[2rem]' onClick={() => setConnectToggle(!connectToggle)}>Connect Wallet</div>
                  </div>
                </div>
              </div>

              <div className='mb-20 w-full relative block 1000px:hidden'>
                <div className='font-ob text-magentaDD text-xl border-b border-magentaDD pb-4 w-full '>
                  Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                  by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                </div>

                <div className='absolute right-4 top-4 scale-150'>
                  <a target='_blank' rel='noreferrer' href='https://twitter.com'>
                    <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                  </a>
                </div>

                <div className='mt-16 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40'></div>
              </div>
            </>

          : <div id='drop-points' className='mt-12 1000px:mt-32 mb-20 z-10 text-center m-auto'>
              <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.6rem] mb-6 800px:mb-10'>HOW TO DROP POINTS</h3>
              <div className='subtitle2 text-base 600px:text-lg 800px:text-xl 1000px:text-2xl mb-10 1200px:px-[13%]'>Distribute your points in the projects that you think they should receive fundings. You can modify your points until Phase 2 ends and it will always be automatically saved.</div>
              <div className='mt-16 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40 1000px:hidden'></div>
            </div>
          }

          <div className={`flex flex-wrap justify-center gap-6 700px:gap-10 pb-16 ${ props.walletStatus !== 'connected' && 'grayscale pointer-events-none'} `}>

            { !projectsPicks
              ? <h4 className='text-5xl mb-20' >Loading Projects...</h4>
              : projectsPicks.map((project, index) =>
                <Project
                  key={index}
                  index={index}
                  id={project._id}
                  name={project.projectName}
                  desc={project.projectDescription}
                  website={project.website}
                  paddress={project.address}
                  icon={project.icon}
                  setPopupStatus={setPopupStatus}
                  setPopupDetails={setPopupDetails}
                  setVotes={setVotes}
                  votes={votes}
                  points={props.points}
                  setPoints={props.setPoints}
                />
              )
            }

          </div>

      </div>

      <footer className='w-full h-24 px-[4%] flex justify-between items-center bg-footerColor'>
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

      <ProjectPopup popupStatus={popupStatus} setPopupStatus={setPopupStatus} popupDetails={popupDetails} setVotes={setVotes} votes={votes} points={props.points} setPoints={props.setPoints} />
    </>
  )}

// ------------------------------------------------------------------------------------------------------- //

const Project = (props) => {

  const colors = ['p-orange', 'p-green', 'p-pink', 'p-blue']
  const colorsPattern = [0,1,2,3,1,2,3,0,2,3,0,1,3,0,1,2]
  const color = colors[colorsPattern[props.index%16]]

    return (
    <div className={`w-52 h-48 700px:w-72 700px:h-64 rounded-[1.75rem] p-2 pl-5 700px:p-4 700px:pl-7 relative ${color} `}>
      <div className='font-ob font-black text-[1.65rem] 700px:text-4xl leading-8 700px:leading-10 pt-1 ellipsis'>{props.name}</div>
      <div className={`${color === 'p-blue' ? 'details-button-indigo' : 'details-button-yellow' } mt-3 700px:mt-4 z-10`} onClick={ () => { props.setPopupStatus('visible'); props.setPopupDetails({ name: props.name, message: props.desc, link: props.website, image: props.icon, id:props.id }); } }>view details</div>

      <div class='flex mt-6 700px:mt-10'>
        <img src={minus} alt="minus" className='cursor-pointer w-7 700px:w-auto' onClick={props.votes && props.votes[props.id] !== 0 ? () => { props.setVotes({...props.votes, [props.id]: props.votes[props.id]-1}); props.setPoints(props.points+1) } : null } />
        <span className='font-ibm font-semibold text-[1.5rem] 700px:text-[1.75rem] mx-1.5 700px:mx-2'>{props.votes ? props.votes[props.id] : '0'}</span>
        <img src={plus} alt="plus" className='cursor-pointer w-7 700px:w-auto' onClick={ props.votes && props.points !==0 ?  () => {props.setVotes({...props.votes, [props.id]: props.votes[props.id]+1}); props.setPoints(props.points-1) } : 0 }/>
      </div>

      { props.icon &&
        <>
          {color === 'p-pink' && <img className='absolute bottom-6 right-2 mr-3 mb-3 700px:mr-4 700px:mb-4 z-0 w-[42px] 700px:w-auto' src={smallDots2} alt='Dots' /> }
          <img className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] object-cover rounded-full' src={props.icon} alt={props.name} />
        </>
      }


    </div>
  )}


const ProjectPopup = (props) => {
  
  const { popupStatus, setPopupStatus, popupDetails, setVotes, votes, points, setPoints } = props

  return (
    <>
      { popupStatus === 'visible' ?
        <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-20' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden')) : null}>
          <div className='project-popup'>
            <img className='absolute -left-4 top-5 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; setPopupStatus('hidden');}} />
          
            <div className='bg-white w-full relative h-[calc(100%-89px)] mt-[89px] border-r-[6px] border-b-[6px] border-l-[6px] border-indigoDD'>

                <div div className='absolute inset-x-0 top-[-4.4rem] m-auto w-max'>
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

                  <div class='flex mt-8 justify-center'>
                    <img className='scale-[135%] cursor-pointer' src={minus} alt="minus" onClick={votes && votes[popupDetails.id] !== 0 ? () => { setVotes({...votes, [popupDetails.id]: votes[popupDetails.id]-1}); setPoints(points+1) } : null } />
                    <span className='font-ibm font-semibold text-[2.5rem] mx-4'>{votes ? votes[popupDetails.id] : '0'}</span>
                    <img className='scale-[135%] cursor-pointer' src={plus} alt="plus" onClick={ votes && points !==0 ?  () => {setVotes({...votes, [popupDetails.id]: votes[popupDetails.id]+1}); setPoints(points-1) } : 0 }/>
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
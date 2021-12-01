import React, { useState, useEffect } from 'react';
import { truncate } from "../Utils";
import logo from '../assets/logos/logo.svg'
import dropsVideo from '../assets/video/drops.mp4'
import dropsVideoOGG from '../assets/video/drops.ogg'
import dropsVideoWEBM from '../assets/video/drops.webm'
import dropsThumbnail from '../assets/video/drops-thumbnail.jpg'
import bubble from '../assets/particles/bubble.png'
import squiggle from '../assets/phase1/squiggle.svg'
import dots from '../assets/phase1/dots.svg'
import smallDots2 from '../assets/phase2/dots-small2.svg'
import twitter from '../assets/icons/twitter.svg'
import closeIcon from '../assets/icons/close.png'
import dots3 from '../assets/phase2/dots3.svg'
import squiggle2 from '../assets/phase2/squiggle2.svg'
import metamask from '../assets/phase2/metamask.png'
import poapSmall from '../assets/phase3/poap-small.png'
import poap from '../assets/phase3/poap.png'
import heart from '../assets/icons/heart.svg'
import axios from "axios";

// Phase3 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase3 = (props) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, setPopupStatus] = useState('hidden');
  const [connectToggle, setConnectToggle] = useState(false);
  const [walletToggle, setWalletToggle] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [projectsPicks, setProjectsPicks] = useState();
  const [popupDetails, setPopupDetails] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/posts/picks/')
      .then(r => {
        let sortedProjects = r.data.sort((a,b) => b.currentPoints - a.currentPoints)
        setProjectsPicks(sortedProjects)
      })
      .catch(e => console.error(e));

  }, []);

  return (
    <>
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>

          <header className={`flex justify-end z-30 w-full pt-4 ${props.walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
            { props.walletStatus === 'connected'
              ? <div className='flex flex-col relative'>
                  <div className='border-[3px] border-aquaDD aqua-dot after:content-["•"] after:right-4 font-ob font-bold w-[21rem] px-4 pb-2 pt-1 mb-2 bg-white cursor-pointer uppercase' onClick={() => setWalletToggle(!walletToggle)}>{truncate(props.address,11)}</div>
          
                  { walletToggle && 
                      <div className='absolute top-0 z-20 bg-white cursor-pointer' onClick={() => setWalletToggle(!walletToggle)}>
                        <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] py-2 px-4 text-center'>
                          <div className='aqua-dot after:content-["•"] after:top-[2px]'>Your wallet is connected</div>
                          <div className='text-left font-ob font-normal mt-4'>Signed in as:</div>
                          <div className='break-words text-left leading-5 pb-3'>{props.address}</div>
                          
                          {claimed && 
                            <>
                              <hr className='-mx-4 mt-3' />
                              <div className='text-left font-ob font-normal mt-5 mb-1'>Your rewards:</div>
                              <div className='break-words text-left leading-5 flex items-center py-2'>
                                <img src={poapSmall} alt='poap' />
                                <span className='pb-1 pl-1'>DAO DROPS poap</span>
                              </div>
                            </>
                          }

                        </div>
                      </div>
                    }

                </div>

              : <div className={`button1-small text-lg w-[18rem] pb-2 600px:text-xl 600px:w-[20rem] 600px:pb-3 1000px:z-30 border-b-[5px] 600px:border-b-[6px] ${connectToggle && '1000px:fixed button1-small-down'} `} onClick={() => setConnectToggle(!connectToggle)}>Connect Wallet</div>
            }

            { connectToggle && props.walletStatus !== 'connected' &&
              <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay2 z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setConnectToggle(false)) : null}>
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

          <div className={`flex items-end relative ${connectToggle && props.walletStatus !== 'connected' && '1000px:mt-[3.375rem]'} ${props.walletStatus === 'connected' ? 'pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem] mt-0' : 'mt-8 700px:mt-12 1000px:mt-2'}`}>
              <img className='mt-6 700px:mt-0 self-start' src={logo} alt='DAO Drops Logo' />
              
              <div className='ml-4 1000px:ml-8 mb-16 1000px:mb-0 1000px:mt-8 z-20 scale-75 1000px:scale-100 absolute 1000px:relative'>
                <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                  <div className='absolute pb-1 pl-1'>PHASE 3 THE END</div>
                </div>

                <div className='w-[24rem] 1000px:w-[28rem] h-[31.1rem] bg-white border-[6px] border-indigoDD font-obWide font-black text-5xl flex flex-col'>
                  <div className='border-b-[6px] w-full pb-6 pt-3 text-center border-indigoDD text-4xl 1000px:text-5xl'>REWARDS</div>
                  <div className={`px-8 ${claimed ? 'py-6' : 'py-10'} flex flex-col`}>
                    <div className='font-obWide font-medium text-lg'>{claimed ? 'Awesome!' : 'You won the'}</div>
                    <div className='text-xl 1000px:text-2xl'>{claimed ? 'DAO drops poap will now appear on your wallet.' : 'DAO drops poap!'}</div>
                    <img className='mx-auto mt-2' src={poap} alt='poap' />
                    <div className='text-2xl text-center'>DDP</div>
                    { claimed
                      ? <div className='font-ob font-medium text-center mt-3 text-xl'>✅ CLAIMED</div>
                      : <button className='button2 ml-auto text-sm mt-6 mx-auto' onClick={() => setClaimed(true)}>Claim Poap</button>
                    }
                  </div>   
                </div>
              </div>
              
              <div className='flex flex-col items-end ml-12 1000px:ml-0 w-full 1000px:w-auto'>
                <h3 className='text-3xl 1000px:text-3xl 1200px:text-[calc(1.3rem+1vw)] 1200px:leading-10 1000px:pl-6 1200px:pl-12 pr-[5%] 1200px:pr-[25%] mb-20 mt-8 1000px:my-0 self-start 1000px:self-end -ml-4 1000px:ml-0'>we made it rain for you  too! ☔</h3>
                <div className='w-full h-[25rem] 1000px:h-[21rem] mt-24 1000px:mt-8 border-[6px] 1000px:border-l-0 border-indigoDD z-10 relative'>
                    <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                    <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={onLoadedData}>
                      <source src={dropsVideo} type="video/mp4"/>
                      <source src={dropsVideoOGG} type="video/ogg"/>
                      <source src={dropsVideoWEBM} type="video/webm"/>
                    </video>
                    
                    <img className='absolute top-[-20%] left-[0%] 600px:top-[10%] 600px:left-[10%] 800px:top-[-25%] 800px:left-[15%] 1000px:top-[5%] 1000px:left-0 1200px:left-[27%] z-20 bubble-animation min-w-[90vw] 600px:min-w-[55vw] 1000px:min-w-[500px] w-[50%] opacity-95' src={bubble} alt='Bubble' />
                    <img className='absolute top-[35%] left-[10%] z-10 hidden 1200px:block' src={squiggle} alt='Squiggle' />
                    <img className='absolute top-[-10%] right-[5%] z-10 hidden 1200px:block' src={dots} alt='Dots' /> 
                </div>
              </div>

          </div>

          <div className='flex pb-8 1000px:p-0 1000px:ml-20 justify-between relative'>
            <div className='mt-8 relative right-0 hidden 1000px:block'>
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

          </div>

          <a href='#leaderboard' className='button1-down mx-auto self-center 1000px:mx-0 1000px:self-start text-3xl w-[26rem] block 1000px:hidden'>Check Results</a>
          <div className='mt-32 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40 1000px:hidden'></div>
  
          <div id='leaderboard' className='mt-12 1000px:mt-32 mb-20 z-10 text-center m-auto'>
            <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.6rem] mb-6 800px:mb-10'>LEADER BOARD RESULTS</h3>
            <div className='subtitle2 text-base 600px:text-lg 800px:text-xl 1000px:text-2xl mb-10 1200px:px-[14%]'>Each project will receive funds in proportion to the points they were given. Thanks for being part of DAO drops community and helping other projects to grow!</div>
          </div>

          <div className={`flex flex-wrap justify-center gap-6 700px:gap-10 pb-16`}>

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
                  points={project.currentPoints}
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

      <ProjectPopup popupStatus={popupStatus} setPopupStatus={setPopupStatus} popupDetails={popupDetails} />
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
      <div className={`${color === 'p-blue' ? 'details-button-indigo' : 'details-button-yellow' } mt-3 700px:mt-4 z-10`} onClick={ () => { props.setPopupStatus('visible'); props.setPopupDetails({ name: props.name, message: props.desc, link: props.website, image: props.icon, points:props.points }); } }>view details</div>

      <div className='flex flex-col mt-2 700px:mt-5'>
        <div className='font-obWide font-black text-4xl 700px:text-5xl pb-0.5 700px:pb-1'>{props.points || '0'}</div>
        <div className='font-bold uppercase text-[0.6rem] 700px:text-[0.8rem]'>points Received</div>
      </div>

      { props.icon &&
        <>
          {color === 'p-pink' && <img className='absolute bottom-6 right-2 mr-3 mb-3 700px:mr-4 700px:mb-4 z-0 w-[42px] 700px:w-auto' src={smallDots2} alt='Dots' /> }
          <img className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] object-cover rounded-full' src={props.icon} alt={props.name} />
        </>
      }

      { props.voted &&
        <div className='absolute top-2 700px:top-4 right-0 scale-75 700px:scale-100'>
          <img className='mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] 700px:w-auto' src={heart} alt='voted' />
          <div className='absolute top-[14px] left-2 text-[10.5px] font-bold'>VOTED</div>
        </div>
      }
      
    </div>
  )}


const ProjectPopup = (props) => {
  
  const { popupStatus, setPopupStatus, popupDetails } = props

  return (
    <>
      { popupStatus === 'visible' ?
        <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden')) : null}>
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


export default Phase3;
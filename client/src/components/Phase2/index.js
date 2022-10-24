import React, { useState, useEffect } from 'react'
import Header from './Header'
import Project from './Project'
import ProjectPopup from './ProjectPopup'
import * as constants from '../../Constants'
import { shuffle } from '../../Utils'
import Countdown from 'react-countdown'
import axios from 'axios'

import logo from '../../assets/logos/logo.svg'
import dropsVideo from '../../assets/video/drops.mp4'
import dropsVideoOGG from '../../assets/video/drops.ogg'
import dropsVideoWEBM from '../../assets/video/drops.webm'
import dropsThumbnail from '../../assets/video/drops-thumbnail.jpg'
import bubble from '../../assets/particles/bubble.png'
import squiggle from '../../assets/phase1/squiggle.svg'
import dots from '../../assets/phase1/dots.svg'
import dots2 from '../../assets/phase2/dots2.svg'
import smallDots from '../../assets/phase1/dots-small.svg'
import aquaBox from '../../assets/phase1/aqua-box.svg'
import aquaBoxMobile from '../../assets/phase2/aqua-box-mobile.svg'
import twitter from '../../assets/icons/twitter.svg'
import dots3 from '../../assets/phase2/dots3.svg'
import squiggle2 from '../../assets/phase2/squiggle2.svg'


// Phase2 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase2 = ({loadWeb3, disconnectWeb3, signer, address, addressDetails, walletStatus, points, setPoints, votes, setVotes, setPhaseView}) => {
  
  const PICKS = 'https://dao-drops.herokuapp.com/posts/picks/'

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [popupStatus, setPopupStatus] = useState('hidden')
  const [popupDetails, setPopupDetails] = useState()
  const [projectsPicks, setProjectsPicks] = useState()
  const [votesSubmitted, setVotesSubmitted] = useState('false')
  const phase2End = '2022-11-21T00:00:00.000+00:00'
  // const phase2End = Date.now() + 10000
  
  useEffect(() => {
    axios.get(PICKS)
      .then(r => {
        // let randomProjects = r.data.sort(() => Math.random() - 0.5)
        // let sortedProjects = r.data.sort((a, b) => a.address.localeCompare(b.address))
        let projects = r.data.map(a => ({...a}));
        shuffle(projects)

        if (address) {
          let votesStorage = localStorage.getItem(`votes_${address}`)
          votesStorage ? setVotes(JSON.parse(votesStorage)) : r.data.map( project => setVotes(votes => ({...votes, [project._id]: 0})) )
        }

        setProjectsPicks(projects)
      })
      .catch(e => console.error(e))
  }, [address])

  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed
    }) => {
    if (completed) {
      setPhaseView('3')
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

          <Header
            loadWeb3={loadWeb3}
            disconnectWeb3={disconnectWeb3}
            signer={signer}
            address={address}
            addressDetails={addressDetails}
            walletStatus={walletStatus}
            points={points}
            votes={votes}
            setVotesSubmitted={setVotesSubmitted}
            votesSubmitted={votesSubmitted}
          />

          <div className={`flex items-start relative ${walletStatus === 'connected' ? 'pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem] mt-0' : 'mt-8 700px:mt-12 1000px:mt-2'}`}>
              <img className='mt-6 700px:mt-0' src={logo} alt='DAO Drops Logo' />

              <div className='ml-12 w-full !min-h-[30rem] 1000px:!min-h-[21rem] 1000px:!max-h-[38rem] 1000px:h-[calc(100vh-500px)] mt-16 1000px:mt-32 border-[6px] border-indigoDD z-10 relative'>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={() => setIsVideoLoaded(true)}>
                    <source src={dropsVideo} type='video/mp4'/>
                    <source src={dropsVideoOGG} type='video/ogg'/>
                    <source src={dropsVideoWEBM} type='video/webm'/>
                  </video>
                  <img className='absolute top-[10%] left-[10%] 800px:top-[-25%] 800px:left-[15%] 1000px:top-[-45%] 1000px:left-[32%] z-20 bubble-animation min-w-[55vw] 1000px:min-w-[700px] w-[50%] opacity-95' src={bubble} alt='Bubble' />
                  <img className='absolute top-[20%] left-[5%] z-20 hidden 1000px:block' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[34%] right-[23%] z-10 hidden 1000px:block' src={dots} alt='Dots' /> 
                  <img className='absolute top-14 -left-10 z-0' src={smallDots} alt='Dots' />
                  <img className='absolute top-[51rem] -left-60 z-10 hidden 1000px:block' src={dots2} alt='Dots' />

                  <div className='absolute top-[-5.5rem] left-[-6.7rem] 700px:-top-24 700px:-left-10 1000px:-left-1.5 z-20 scale-75 700px:scale-100'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                      <div className='absolute pb-1 pl-1'>PHASE ENDS IN:</div>
                    </div>

                    <div className='w-[31rem] 700px:w-[32rem] h-[6.5rem] bg-white border-[7px] 700px:border-[6px] border-indigoDD font-obWide font-extrabold text-5xl flex justify-center items-center'>
                      <Countdown date={phase2End} renderer={renderer} />
                    </div>
                  </div>
              </div>

              <img className='absolute bottom-[-9.125rem] right-[-1px] z-0 scale-100 hidden 1000px:block' src={aquaBox} alt='Aqua Box' />
              <img className='absolute bottom-[-11.1rem] right-[9px] z-0 block 1000px:hidden scale-125' src={aquaBoxMobile} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 1000px:p-0 1000px:ml-24 justify-between relative'>
            { walletStatus === 'connected' 
              ? <div  className='flex flex-col'>
                  <div className='mt-4 1000px:mt-10 z-10 pr-[6.3rem] 1000px:pr-6 pl-8 1000px:pl-0'>
                    <h3 className='text-3xl h870px:text-[calc(1.15rem+1vw)] 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-5 700px:mb-8'>You are now part of the DAO</h3>
                    <div className='subtitle2 text-[calc(0.7rem+1vw)] leading-6 800px:leading-7 1000px:leading-8 1200px:leading-10 mb-14 1000px:mb-10'>Drop your points and make it rain ☔ ️</div>
                  </div>
                  <a href='#drop-points' className='button1-down mx-auto self-center 1000px:mx-0 1000px:self-start text-3xl w-[24rem] block'>Drop Points</a>
                </div>
              : <div className='mt-4 1000px:mt-10 z-10 pr-[6.3rem] 1000px:pr-6 pl-8 1000px:pl-0'>
                  <h3 className='text-3xl 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-6'>Connect your wallet</h3>
                  <div className='subtitle2 text-[calc(0.75rem+1vw)] 1000px:text-[calc(0.65rem+1vw)] leading-6 800px:leading-7 1000px:leading-8 1200px:leading-10'>To drop your points and make it rain ☔</div>
                </div>
            }

            <div className='mt-[10.5rem] relative right-0 hidden 1000px:block'>
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

            { projectsPicks &&
              <>
                <img className='absolute top-[83rem] left-[80%] z-0 hidden 1000px:block' src={dots3} alt='Dots' />
                <img className='absolute top-[94rem] left-[10%] z-0 hidden 1000px:block' src={squiggle2} alt='Squiggle' />
              </>
            }
          </div>
          
          { walletStatus !== 'connected'
            ? <>
                <div className='flex justify-center mt-16 1200px:mt-12 mb-20 1000px:mb-32'>
                  <div className='relative z-10 w-full 800px:w-auto'>
                    <div className='w-32 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line toplay'>
                      <div className='absolute pb-1'>To Play</div>
                    </div>

                    <div className='w-full 800px:w-[43rem] h-[7.5rem] 800px:h-[8.5rem] bg-white border-[6px] border-indigoDD font-obWide font-extrabold text-5xl flex justify-center items-center'>
                      <div className='button1-small w-[24rem] text-[1.5rem] 800px:button1 800px:w-[32rem] 800px:text-[2rem]' onClick={() => loadWeb3('click')}>Connect Wallet</div>
                    </div>
                  </div>
                </div>

                <div className='mb-20 w-full relative block 1000px:hidden'>
                  <div className='font-ob text-magentaDD text-xl border-b border-magentaDD pb-4 w-full '>
                    Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                    by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                  </div>

                  <div className='absolute right-4 top-4 scale-150'>
                    <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                      <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                    </a>
                  </div>

                  <div className='mt-16 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40'></div>
                </div>
              </>

            : <div id='drop-points' className='mt-12 1000px:mt-[6.5rem] mb-20 z-10 text-center m-auto'>
                <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.6rem] mb-6 800px:mb-10'>HOW TO DROP POINTS</h3>
                <div className='font-ibm text-base 600px:text-lg 800px:text-xl 1800px:text-2xl 1000px:px-[13%] mb-10 m-auto'>Distribute your points in the projects you think should receive funding.<br/>Once you are finished, press submit to send them.</div>
                <div className='mt-16 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40 1000px:hidden'/>
              </div>
          }

          { votesSubmitted === 'true' &&
             <>
                <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.3rem] my-12 1000px:mt-32 1000px:mb-14 text-center 1000px:text-left'>YOUR DROPS</h3>
                <div className={`flex flex-wrap justify-center gap-6 700px:gap-10 pb-16 ${ walletStatus !== 'connected' && 'grayscale pointer-events-none'} `}>
                  { projectsPicks
                    ? projectsPicks.filter(project => votes && votes[project._id] > 0).map((project, index) =>
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
                          points={points}
                          setPoints={setPoints}
                          votesSubmitted={votesSubmitted}
                          address={address}
                        />
                    )
                    : <h4 className='text-5xl mb-20' >Loading Your Drops...</h4>
                  }
                </div>
              </>
          }

          { votesSubmitted === 'true' && <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.3rem] mt-16 mb-12 1000px:mt-16 1000px:mb-14 text-center 1000px:text-left'>OTHER NOMINEES</h3> }
          <div className={`flex flex-wrap justify-center gap-6 700px:gap-10 pb-16 ${ walletStatus !== 'connected' && 'grayscale pointer-events-none'} `}>
            { projectsPicks
              ? projectsPicks.filter(project => (votes && votesSubmitted === 'true') ? votes[project._id] === 0 : project._id).map((project, index) =>
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
                  points={points}
                  setPoints={setPoints}
                  votesSubmitted={votesSubmitted}
                  address={address}
                />
              )
              : <h4 className='text-5xl mb-20' >{votesSubmitted === 'true' ? 'Loading Other Nominees...' : 'Loading Projects...' }</h4>
            }
          </div>

      </div>

      <footer className='w-full h-24 px-[4%] flex justify-between items-center bg-footerColor'>
        <div className='font-ob text-magentaDD text-base 600px:text-lg 1000px:w-1/3'>
          Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
          by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
        </div>

        <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl 1000px:w-1/3 text-center hover:text-magentaDD4' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>

        <div className='1000px:w-1/3 text-right'>
          <a target='_blank' rel='noreferrer' href={constants.Twitter}>
            <img className='inline scale-150 hover:scale-[155%]' src={twitter} alt='Twitter' />
          </a>
        </div>
      </footer>

      <ProjectPopup
        popupStatus={popupStatus}
        setPopupStatus={setPopupStatus}
        popupDetails={popupDetails}
        setVotes={setVotes}
        votes={votes}
        points={points}
        setPoints={setPoints}
        votesSubmitted={votesSubmitted} 
      />

    </>
  )}

// ------------------------------------------------------------------------------------------------------- //

export default Phase2;

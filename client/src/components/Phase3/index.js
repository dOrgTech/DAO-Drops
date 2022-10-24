import React, { useState, useEffect } from 'react'
import Header from './Header'
import Project from './Project'
import ProjectPopup from './ProjectPopup'
import * as constants from '../../Constants'
import logo from '../../assets/logos/logo.svg'
import dropsVideo from '../../assets/video/drops.mp4'
import dropsVideoOGG from '../../assets/video/drops.ogg'
import dropsVideoWEBM from '../../assets/video/drops.webm'
import dropsThumbnail from '../../assets/video/drops-thumbnail.jpg'
import bubble from '../../assets/particles/bubble.png'
import squiggle from '../../assets/phase1/squiggle.svg'
import dots from '../../assets/phase1/dots.svg'
import twitter from '../../assets/icons/twitter.svg'
import dots3 from '../../assets/phase2/dots3.svg'
import squiggle2 from '../../assets/phase2/squiggle2.svg'
import poap from '../../assets/phase3/poap.png'
import axios from 'axios'


// Phase3 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase3 = ({loadWeb3, disconnectWeb3, address, addressDetails, walletStatus}) => {
  
  const PICKS = 'https://dao-drops.herokuapp.com/posts/picks/'

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [popupStatus, setPopupStatus] = useState('hidden')
  const [winner, setWinner] = useState('check')
  const [projectsPicks, setProjectsPicks] = useState()
  const [popupDetails, setPopupDetails] = useState()
  const [votedProjects, setVotedProjects] = useState()

  useEffect(() => {
    axios.get(PICKS)
      .then(r => {
        let sortedProjects = r.data.sort((a,b) => b.currentScore - a.currentScore)
        setProjectsPicks(sortedProjects)
      })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (address && addressDetails !== 'none') {
      let voted = []
      addressDetails.picks.forEach(pick => {
        if (pick.points > 0) {
          voted.push(pick.id)
        }
      })
      setVotedProjects(voted)
    }
  }, [address, walletStatus])

  return (
    <>
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>

          <Header
            loadWeb3={loadWeb3}
            disconnectWeb3={disconnectWeb3}
            address={address}
            walletStatus={walletStatus}
            winner= {winner}
          />

          <div className={`flex items-end relative ${walletStatus === 'connected' ? 'pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem] mt-0' : 'mt-8 700px:mt-12 1000px:mt-2'}`}>
              <img className='mt-6 700px:mt-0 self-start' src={logo} alt='DAO Drops Logo' />
              
              <div className='ml-4 1000px:ml-8 mb-16 1000px:mb-0 1000px:mt-8 z-20 scale-75 1000px:scale-100 absolute 1000px:relative'>
                <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                  <div className='absolute pb-1 pl-1'>LAST PHASE</div>
                </div>

                <div className='w-[24rem] 1000px:w-[28rem] !min-h-[29.1rem] !max-h-[45.1rem] 1000px:h-[calc(100vh-310px)] bg-white border-[6px] border-indigoDD font-obWide font-extrabold text-5xl flex flex-col'>
                  <div className='border-b-[6px] w-full pb-6 pt-3 text-center border-indigoDD text-4xl 1000px:text-5xl'>REWARDS</div>


                  { winner === 'check'
                    ? <div className='px-12 my-auto flex flex-col'>
                        <div className='font-ibm font-semibold text-xl mb-6 1000px:mb-10'>If you participated as an allocator you have a reward!</div>
                        <div className='font-ibm font-semibold text-xl mb-8 1000px:mb-12'>You can check the leader board results below.</div>
                        <button className='button2 text-sm uppercase w-full' style={{backgroundPosition: '90% 50%'}} onClick={walletStatus === 'connected' ? () => setWinner('winner') : () => loadWeb3('click')}>Check Rewards</button>
                      </div>

                    : winner === 'winner'
                    ? <div className='px-8 1000px:px-12 my-auto flex flex-col'>
                        <img className='mx-auto' src={poap} alt='poap' />
                        <div className='font-obWide font-medium text-xl text-center mt-4'>Awesome! You were airdropped the DAO drops POAP</div>
                      </div>

                    : winner === 'not-winner'
                      ? <div className='px-8 1000px:px-10 my-auto flex flex-col'>
                        <div className='font-ibm font-semibold text-lg mb-8 1000px:mb-10'>You don’t have any rewards to claim but be sure to participate on the next Dao Drops round!</div>
                        <div className='font-ibm font-semibold text-lg 1000px:mb-12'>You can check the leader board results below.</div>
                      </div>
                    : null
                  }


                </div>
              </div>
              
              <div className='flex flex-col items-end ml-12 1000px:ml-0 w-full 1000px:w-full'>
                <h3 className='text-3xl 1000px:text-3xl 1200px:text-[calc(1.3rem+1vw)] 1200px:leading-10 1000px:pl-6 1200px:pl-12 pr-[5%] 1200px:pr-[25%] mb-16 mt-8 1000px:my-0 self-start 1000px:self-end -ml-4 1000px:ml-0'>we made it rain for you  too! ☔</h3>
                <div className='w-full !min-h-[23.5rem] !max-h-[39.5rem] 1000px:h-[calc(100vh-400px)] mt-24 1000px:mt-[18px] border-[6px] 1000px:border-l-0 border-indigoDD z-10 relative'>
                    <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                    <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={() => setIsVideoLoaded(true)}>
                      <source src={dropsVideo} type='video/mp4'/>
                      <source src={dropsVideoOGG} type='video/ogg'/>
                      <source src={dropsVideoWEBM} type='video/webm'/>
                    </video>
                    
                    <img className='absolute top-[-20%] left-[0%] 600px:top-[10%] 600px:left-[10%] 800px:top-[-25%] 800px:left-[15%] 1000px:top-[5%] 1000px:left-0 1200px:left-[27%] z-20 bubble-animation min-w-[90vw] 600px:min-w-[55vw] 1000px:min-w-[500px] w-[50%] opacity-95  max-w-[600px]' src={bubble} alt='Bubble' />
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
                <a target='_blank' rel='noreferrer' href={constants.Twitter}>
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
              <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
              </a>
            </div>

          </div>

          <a href='#leaderboard' className='button1-down mx-auto self-center 1000px:mx-0 1000px:self-start text-3xl w-[26rem] block 1000px:hidden'>Check Results</a>
          <div className='mt-32 mb-8 mx-auto w-72 h-[6px] bg-[#ACBBC2] rounded-full opacity-40 1000px:hidden'/>
  
          <div id='leaderboard' className='mt-12 1000px:mt-32 mb-20 z-10 text-center m-auto'>
            <h3 className='text-2xl 600px:text-3xl 1000px:text-[2.6rem] mb-6 800px:mb-10'>LEADER BOARD RESULTS</h3>

            <div className='font-ibm text-base 600px:text-lg 800px:text-xl 1800px:text-2xl 1000px:px-[13%] mb-10 m-auto'>Each project will receive funds in proportion to the points they were given.<br/>Thanks for being part of DAO drops community and helping other projects to grow!</div>
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
                  points={project.currentScore}
                  votedProjects={votedProjects}
                />
              )
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

      <ProjectPopup popupStatus={popupStatus} setPopupStatus={setPopupStatus} popupDetails={popupDetails} />
    </>
  )}

// ------------------------------------------------------------------------------------------------------- //

export default Phase3;

import React, { useState, useEffect } from 'react';
import Header from './Header'
import Project from './Project'
import ProjectPopup from './ProjectPopup'
import * as constants from '../../Constants';
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
import axios from 'axios';

const PICKS = 'https://dao-drops.herokuapp.com/posts/picks/'


// Phase3 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase3 = ({loadWeb3, address, addressDetails, walletStatus}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, setPopupStatus] = useState('hidden');
  const [connectToggle, setConnectToggle] = useState(false);
  const [claimed, setClaimed] = useState('check');
  const [projectsPicks, setProjectsPicks] = useState();
  const [popupDetails, setPopupDetails] = useState();
  const [votedProjects, setVotedProjects] = useState();

  useEffect(() => {
    axios.get(PICKS)
      .then(r => {
        let sortedProjects = r.data.sort((a,b) => b.currentScore - a.currentScore)
        setProjectsPicks(sortedProjects)
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (address && addressDetails !== 'none') {
      let voted = []
      addressDetails.picks.forEach(pick => {
        if (pick.points > 0) {
          voted.push(pick.id)
        }
      });
      setVotedProjects(voted)
    }
  }, [address, walletStatus]);

  return (
    <>
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>

          <Header
            loadWeb3={loadWeb3}
            address={address}
            walletStatus={walletStatus}
            setConnectToggle={setConnectToggle}
            connectToggle={connectToggle}
            claimed= {claimed}
          />

          <div className={`flex items-end relative ${connectToggle && walletStatus !== 'connected' && '1000px:mt-[3.375rem]'} ${walletStatus === 'connected' ? 'pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem] mt-0' : 'mt-8 700px:mt-12 1000px:mt-2'}`}>
              <img className='mt-6 700px:mt-0 self-start' src={logo} alt='DAO Drops Logo' />
              
              <div className='ml-4 1000px:ml-8 mb-16 1000px:mb-0 1000px:mt-8 z-20 scale-75 1000px:scale-100 absolute 1000px:relative'>
                <div className='w-48 h-10 bg-white border-t-[6px] border-l-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line phase2'>
                  <div className='absolute pb-1 pl-1'>PHASE 3 THE END</div>
                </div>

                <div className='w-[24rem] 1000px:w-[28rem] h-[31.1rem] bg-white border-[6px] border-indigoDD font-obWide font-black text-5xl flex flex-col'>
                  <div className='border-b-[6px] w-full pb-6 pt-3 text-center border-indigoDD text-4xl 1000px:text-5xl'>REWARDS</div>


                  { claimed === 'check'
                    ? <div className='px-8 py-12 flex flex-col'>
                        <div className='font-obWide font-medium text-lg'>If you participated as an allocator you have a reward!</div>
                        <button className='button2 text-sm my-8 uppercase w-60' style={{backgroundPosition: '90% 50%'}} onClick={walletStatus === 'connected' ? () => setClaimed('winner') : () => setConnectToggle(true)}>Check Rewards</button>
                        <div className='font-obWide font-medium text-lg'>You can check the leader board results below.</div>
                      </div>

                    : claimed === 'winner'
                    ? <div className='px-8 py-10 flex flex-col'>
                        <div className='font-obWide font-medium text-lg'>You won the</div>
                        <div className='text-xl 1000px:text-2xl'>DAO drops poap</div>
                        <img className='mx-auto mt-6' src={poap} alt='poap' />
                        <button className='button2 ml-auto text-sm mt-8 mx-auto' onClick={() => setClaimed('claimed')}>Claim Poap</button>
                      </div>

                    : claimed === 'claimed'
                      ? <div className='px-8 py-6 flex flex-col'>
                          <div className='font-obWide font-medium text-lg'>Awesome!</div>
                          <div className='text-xl 1000px:text-2xl'>DAO drops poap will now appear on your wallet.</div>
                          <img className='mx-auto mt-3' src={poap} alt='poap' />
                          <div className='font-ob font-medium text-center mt-5 text-xl'>✅ CLAIMED</div>
                        </div>

                    : claimed === 'not-winner'
                      ? <div className='pl-8 pr-16 py-12 flex flex-col'>
                          <div className='font-obWide font-medium text-xl mb-10'>You don’t have any rewards to claim but be sure to participate on the next DAO Drops!</div>
                          <div className='font-obWide font-medium text-xl'>You can check the leader board results below.</div>
                      </div>
                    : null
                  }


                </div>
              </div>
              
              <div className='flex flex-col items-end ml-12 1000px:ml-0 w-full 1000px:w-full'>
                <h3 className='text-3xl 1000px:text-3xl 1200px:text-[calc(1.3rem+1vw)] 1200px:leading-10 1000px:pl-6 1200px:pl-12 pr-[5%] 1200px:pr-[25%] mb-20 mt-8 1000px:my-0 self-start 1000px:self-end -ml-4 1000px:ml-0'>we made it rain for you  too! ☔</h3>
                <div className='w-full h-[25rem] 1000px:h-[21rem] mt-24 1000px:mt-8 border-[6px] 1000px:border-l-0 border-indigoDD z-10 relative'>
                    <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                    <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={onLoadedData}>
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

        <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl 1000px:w-1/3 text-center' href={constants.FAQ} target='_blank'>FAQ</a>

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

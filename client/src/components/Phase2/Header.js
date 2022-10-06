import React, { useState, useEffect } from 'react'
import * as constants from '../../Constants'
import { truncate } from '../../Utils'
import Web3Token from 'web3-token'
import { ethers } from 'ethers'
import metamask from '../../assets/phase2/metamask.png'
import axios from 'axios'

const SCORE = 'https://dao-drops.herokuapp.com/posts/score/'


// Header Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const Header = ({loadWeb3, address, addressDetails, walletStatus, points, votes, setVotesSubmitted, votesSubmitted, setConnectToggle, connectToggle}) => {
    const [sendPointsNote, setSendPointsNote] = useState(false)

    useEffect(() => {
      setVotesSubmitted(addressDetails && addressDetails.picks && addressDetails.picks.length && address ? 'true' : 'false')
    }, [address, walletStatus])

    async function submitSign(picksSelected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const token = await Web3Token.sign(async msg => await signer.signMessage(msg), { statement: JSON.stringify(picksSelected) })
      return token
    }

    const submitPoints = async e => {
      if (points === 0) {
        setSendPointsNote(false)
        e.preventDefault()

        const picksSelected = Object.entries(votes).map(([k, v]) => ({ ['id']: k, ['points']: v }))
        const token = await submitSign(picksSelected)
        setVotesSubmitted('sending')
        const picksSubmission = {account: address, message: token, score: points, picks: picksSelected}

        const url = SCORE + addressDetails._id
        axios.patch(url, picksSubmission).then(r => { r.status === 200 && setVotesSubmitted('true')} ).catch(e => console.error(e))
      }
      else {
        setSendPointsNote(true)
      }
    }

    return(
        <header className={`flex justify-end z-20 w-full pt-4 ${walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
          <a className={`font-ob font-semibold text-magentaDD tracking-[4px] text-xl absolute left-[5%] 1000px:left-[calc(10%+97px)] top-5 z-20 ${walletStatus === 'connected' && 'hidden 1000px:block'}`} href={constants.FAQ} target='_blank'>FAQ</a>

            { walletStatus === 'connected'
              ? <div className='uppercase flex flex-col relative w-full 1000px:w-auto'>
                  <div className='border-[3px] border-aquaDD aqua-dot font-ob font-bold w-[21rem] px-4 pb-2 pt-1 mb-2 bg-white hidden 1000px:block'>{truncate(address,11)}</div>

                  <div className={`absolute top-[49px] z-20 bg-white hidden 1000px:block ${ (votesSubmitted === 'true' || addressDetails === 'none') && 'grayscale pointer-events-none'} `} >
                    <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] p-4 text-center'>
                      <div>you have</div>
                      <div className='font-obWide font-black text-6xl pb-3'>{points}</div>
                      <div>points remaining</div>
                    </div>
                    <div className='border-b-4 border-r-4 border-l-4 border-aquaDD font-ob font-bold w-[21rem] p-4'>
                      <div className='button1-small text-[1.3rem] w-[16.5rem] pb-2 m-auto' style={{backgroundPosition: '100% 35%', backgroundSize: '14%'}} onClick={submitPoints}>{votesSubmitted === 'sending' ? 'Sending...' : votesSubmitted === 'true' ? 'Points Sent' : 'Send Points'}</div>
                      { sendPointsNote && <div className={'mt-3 text-center font-ob font-medium text-sm text-magentaDD'}>Please allocate all points before sending.</div>}
                    </div>
                  </div>

                  <div className='flex 1000px:hidden h-[50px] bg-white border-[3px] border-aquaDD'>
                    <div className={`flex justify-center items-center flex-1 border-aquaDD border-r-[3px] font-ob font-bold w-full uppercase px-2 600px:px-4 ${ (votesSubmitted === 'true' || addressDetails === 'none') && 'grayscale pointer-events-none'} `} >
                      <span className='font-obWide font-black text-2xl pb-2 pr-2 w-[73px]'>{points} </span>
                      <span className='leading-3 700px:leading-4 text-[0.7rem] 700px:text-[0.9rem] pb-0.5'>Your Points Remaining</span>
                    </div>
                    <div className={`flex-1 ${ (votesSubmitted === 'true' || addressDetails === 'none') && 'grayscale pointer-events-none'} `} >
                      <div className='button1-small text-[0.6rem] w-[7.5rem] 700px:text-[0.8rem] 700px:w-[10rem] pb-0 m-auto border-b-4 mx-2 600px:mx-auto' style={{backgroundPosition: '100% 60%', backgroundSize: '14%'}} onClick={submitPoints}>{votesSubmitted === 'sending' ? 'Sending...' : votesSubmitted === 'true' ? 'Points Sent' : 'Send Points'}</div>
                    </div>
                    <div className='flex justify-center items-center pb-1 px-1 pr-2 flex-1 aqua-dot 700px:after:content-["•"] after:right-4 after:top-0 font-ob font-bold w-full border-aquaDD border-l-[3px] bg-white'>{truncate(address,4)}</div>
                  </div>

                </div>

              : <div className={`button1-small text-lg w-[18rem] pb-2 600px:text-xl 600px:w-[20rem] 600px:pb-3 1000px:z-30 border-b-[5px] 600px:border-b-[6px] ${connectToggle && '1000px:fixed button1-small-down'} `} onClick={() => setConnectToggle(!connectToggle)}>Connect Wallet</div>
            }

            { connectToggle && walletStatus !== 'connected' &&
              <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay2 z-20' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setConnectToggle(false)) : null}>
                <a href={`${walletStatus === 'NA' ? 'https://metamask.io' : '#'}`} target={`${walletStatus === 'NA' ? '_blank' : '_self'}`} className='fixed 1000px:top-[4.4rem] 1000px:right-[10%] z-30 bg-white cursor-pointer' onClick={loadWeb3}>
                  <div className='border-[5px] border-indigoDD font-ob font-bold h-[26rem] py-20 px-6 w-[20rem] flex flex-col justify-between'>
                    
                    <div>
                      <div className='text-lg font-obWide font-medium'>{walletStatus === 'connecting' ? 'Connecting' : walletStatus === 'NA' ? 'Please Install' : 'Sign in with'}</div>
                      <div className='text-2xl font-obWide font-black uppercase'>MetaMask</div>
                    </div>
                    <div className={`mx-auto ${walletStatus === 'connecting' && 'rotate-180 transition-transform duration-500 ease-linear'}`}>
                      <img src={metamask} alt='MetaMask' />
                    </div>

                  </div>
                </a>
              </div>
            }

        </header>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Header;
import React, { useState, useEffect } from 'react'
import DonePopup from './DonePopup'
import * as constants from '../../Constants'
import { truncate } from '../../Utils'
import Web3Token from 'web3-token'
import { ethers } from 'ethers'
import axios from 'axios'


// Header Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const Header = ({loadWeb3, disconnectWeb3, signer, address, addressDetails, walletStatus, points, votes, setVotesSubmitted, votesSubmitted, setErrorPopupStatus}) => {

    const SCORE = 'https://dao-drops.herokuapp.com/posts/score/'

    const [sendPointsNote, setSendPointsNote] = useState('false')
    const [walletToggle, setWalletToggle] = useState(false);
    const [donePopupStatus, setDonePopupStatus] = useState(false)

    useEffect(() => {
      setVotesSubmitted(addressDetails && addressDetails.picks && addressDetails.picks.length && address ? 'true' : 'false')
    }, [address, walletStatus])

    async function submitSign(picksSelected) {
      const token = await Web3Token.sign(async msg => await signer.signMessage(msg), { statement: JSON.stringify(picksSelected) })
      return token
    }

    const submitPoints = async e => {
      if (points === 0 && votesSubmitted === 'false') {
        setSendPointsNote('false')
        e.preventDefault()

        const picksSelected = Object.entries(votes).map(([k, v]) => ({ ['id']: k, ['points']: v }))
        const token = await submitSign(picksSelected)
        setVotesSubmitted('sending')
        const picksSubmission = {account: address.toLowerCase(), message: token, score: points, picks: picksSelected}

        const url = SCORE + addressDetails._id
        // const url = 'https://httpstat.us/500'

        axios.patch(url, picksSubmission)
             .then(r => { r.status === 200 && setVotesSubmitted('true') && setDonePopupStatus(true)} )
             .catch(function (error) {
              if (error.response && error.response.status === 500) {
                setVotesSubmitted('false')
                disconnectWeb3()
                setErrorPopupStatus(true)
              } else {
                console.error('Error', error.message)
              }
              // console.log(error.config)
            })
      }
      else if (votesSubmitted === 'true') {
        setSendPointsNote('done')
      }
      else {
        setSendPointsNote('all')
      }
    }

    useEffect(() => {
      const timeOut = setTimeout(() => setSendPointsNote('false'), 5000);
      return () => { clearTimeout(timeOut); };
    }, [sendPointsNote]);

    return(
        <>
          <header className={`flex justify-end z-20 w-full pt-4 ${walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
            <a className={`font-ob font-semibold text-magentaDD tracking-[4px] text-xl absolute left-[5%] 1000px:left-[calc(10%+97px)] top-5 z-20 hover:text-magentaDD4 ${walletStatus === 'connected' && 'hidden 1000px:block'}`} href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>

              { walletStatus === 'connected'
                ? <div className='flex flex-col relative w-full 1000px:w-auto'>
                    <div className='border-[3px] border-aquaDD aqua-dot font-ob font-bold w-[21rem] px-4 pb-2 pt-1 bg-white hidden 1000px:block uppercase cursor-pointer hover:text-indigoDD2' onClick={() => setWalletToggle(!walletToggle)}>{truncate(address,11)}</div>

                    { walletToggle && 
                      <div className='absolute top-0 z-30 bg-white cursor-pointer' onClick={() => setWalletToggle(!walletToggle)}>
                        <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] pt-2 text-center'>
                          <div className='aqua-dot after:content-["•"] after:top-0 after:mr-[3px] px-4 hover:text-indigoDD2'>Your wallet is connected</div>
                          <hr className='mt-3 border-[#CCCCCC]' />
                          <div className='text-left font-ob font-normal mt-3 mb-1 px-4'>Signed in as:</div>
                          <div className='break-words text-left leading-5 pb-2 px-4'>{address}</div>
                          <hr className='mt-3 border-[#CCCCCC]' />
                          <div className='text-left font-ob font-semibold p-4 pb-[18px] hover:text-indigoDD2' onClick={disconnectWeb3}>Disconnect</div>
                        </div>
                      </div>
                    }

                    { addressDetails !== 'none'
                      ? <>
                          <div className={`absolute top-[42px] z-20 bg-white hidden 1000px:block uppercase`} >
                            <div className='flex justify-around items-center border-4 border-indigoDD font-obWide font-bold w-[21rem] text-center text-indigoDD3 h-[74px]'>
                              <div className='p-1 h-full w-[53%] border-r-4 border-indigoDD'>
                                <div className='flex justify-center items-center'>
                                  <div className='text-magentaDD5 text-2xl tracking-[0.12rem] w-[76px] text-right pr-1'>{points}</div>
                                  <div className={`lowercase tracking-[0.12rem] self-end ${points > 99 ? 'pr-0' : points > 9 ? 'pr-4' : 'pr-9'  }`}> pts</div>
                                </div>
                                <div className='text-xs mt-[3px]'>Vote Credits</div>
                              </div>
                              <div className={`flex items-center justify-center py-1 px-5 h-full bg-aquaDD hover:bg-aquaDD2 hover:text-indigoDD2 cursor-pointer min-w-[157px] 
                                  ${points > 0 && 'grayscale brightness-150 hover:brightness-125'} 
                                  ${votesSubmitted === 'true' && 'grayscale brightness-110 hover:brightness-110 hover:bg-aquaDD hover:text-indigoDD3'}`} 
                                  onClick={submitPoints}>
                                <div className='text-xl'>{votesSubmitted === 'sending' ? 'Sending' : votesSubmitted === 'true' ? 'Done' : 'Submit'}</div>
                              </div>
                            </div>
                            { votesSubmitted !== 'true' && points === 0 && 
                              <div className={'flex justify-center items-center px-1 text-center font-ibm font-bold text-[11px] text-indigoDD normal-case h-8 border-4 border-t-0 border-indigoDD'}>
                                <span>By submitting you agree to&nbsp;<a target='_blank' rel='noreferrer' href='/terms' className='underline'>terms and conditions</a></span>
                              </div>
                            }
                            { sendPointsNote === 'all' && <div className={'note flex justify-center items-center pt-0.5 text-center font-ibm font-semibold text-sm text-[#181818] normal-case h-9'}>Distribute all your points to submit!</div>}
                            { sendPointsNote === 'done' && <div className={'note flex justify-center items-center pt-0.5 text-center font-ibm font-semibold text-sm text-[#181818] normal-case h-9'}>All your points were sent!</div>}
                          </div>

                          {/* Mobile View */}
                          <div className='flex 1000px:hidden h-[50px] bg-white border-[3px] border-indigoDD'>
                            <div className={`flex justify-center items-center flex-1 border-aquaDD border-r-[3px] font-ob font-bold w-full uppercase px-2 600px:px-4 ${ (votesSubmitted === 'true' || addressDetails === 'none') && 'grayscale pointer-events-none'} `} >
                              <span className='font-obWide font-extrabold text-2xl pb-2 pr-2 min-w-[60px]'>{points} </span>
                              <span className='leading-3 700px:leading-4 text-[0.7rem] 700px:text-[0.9rem] pb-0.5'>Your Points Remaining</span>
                            </div>
                            <div className={`flex-1 ${ (votesSubmitted === 'true' || addressDetails === 'none') && 'grayscale pointer-events-none'} `} >
                              <div className='button1-small text-[0.6rem] w-[7.5rem] 700px:text-[0.8rem] 700px:w-[10rem] pb-0 m-auto border-b-4 mx-2 600px:mx-auto' style={{backgroundPosition: '100% 60%', backgroundSize: '14%'}} onClick={submitPoints}>{votesSubmitted === 'sending' ? 'Sending...' : votesSubmitted === 'true' ? 'Points Sent' : 'Send Points'}</div>
                            </div>
                            <div className='flex justify-center items-center pb-1 px-1 pr-2 flex-1 aqua-dot 700px:after:content-["•"] after:right-4 after:top-0 font-ob font-bold w-full border-aquaDD border-l-[3px] bg-white'>{truncate(address,4)}</div>
                          </div>
                        </>

                      : <>
                          <div className='hidden 1000px:flex flex-col justify-center items-center text-center bg-white border-4 border-indigoDD3 w-[21rem] h-[140px] p-5 mt-[7px]'>
                            <div className='mb-4 font-obWide font-bold'>Oh we are sorry!</div>
                            <div className='font-ibm font-semibold text-sm'>It seems that you don’t have any points. You can try another wallet or try next time.</div>
                          </div>

                          {/* Mobile View */}
                          <div className='flex 1000px:hidden h-[50px] bg-white border-[3px] border-indigoDD'>
                            <div className={`flex justify-center items-center font-ob font-bold px-2 600px:px-4 w-3/4 `} >
                              <div className='font-ibm font-semibold text-xs leading-[13px]'>Oh we are sorry! It seems that you don’t have any points. You can try another wallet or try next time.</div>
                            </div>
                            <div className='flex justify-center items-center pb-1 px-1 pr-2 aqua-dot 700px:after:content-["•"] after:right-4 after:top-0 font-ob font-bold border-indigoDD border-l-[3px] bg-white w-1/4 min-w-[128px]'>{truncate(address,4)}</div>
                        </div>
                        </>
                    }

                  </div>

                : <div className={`button1-small text-lg w-[18rem] pb-2 600px:text-xl 600px:w-[20rem] 600px:pb-3 1000px:z-30 border-b-[5px] 600px:border-b-[6px]`} onClick={() => loadWeb3('click')}>Connect Wallet</div>
              }

          </header>
          
          <DonePopup donePopupStatus={donePopupStatus} setDonePopupStatus={setDonePopupStatus} />
      </>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Header;
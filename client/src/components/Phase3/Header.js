import React, { useState, useEffect } from 'react'
import * as constants from '../../Constants'
import { truncate } from '../../Utils'
import metamask from '../../assets/phase2/metamask.png'
import poapSmall from '../../assets/phase3/poap-small.png'


// Header Component (Phase3)
// ------------------------------------------------------------------------------------------------------- //
const Header = ({loadWeb3, address, walletStatus, setConnectToggle, connectToggle, claimed}) => {
    const [walletToggle, setWalletToggle] = useState(false);

    return(
      <header className={`flex justify-end z-30 w-full pt-4 ${walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
        <a className={`font-ob font-semibold text-magentaDD tracking-[4px] text-xl absolute left-[5%] 1000px:left-[calc(10%+81px)] top-4 z-20 ${walletStatus === 'connected' && 'hidden 600px:block'}`} href={constants.FAQ} target='_blank'>FAQ</a>
        { walletStatus === 'connected'
          ? <div className='flex flex-col relative'>
              <div className='border-[3px] border-aquaDD aqua-dot after:content-["•"] after:right-4 font-ob font-bold w-[21rem] px-4 pb-2 pt-1 mb-2 bg-white cursor-pointer uppercase' onClick={() => setWalletToggle(!walletToggle)}>{truncate(address,11)}</div>
      
              { walletToggle && 
                  <div className='absolute top-0 z-20 bg-white cursor-pointer' onClick={() => setWalletToggle(!walletToggle)}>
                    <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] py-2 px-4 text-center'>
                      <div className='aqua-dot after:content-["•"] after:top-[1px] after:mr-1'>Your wallet is connected</div>
                      <div className='text-left font-ob font-normal mt-4'>Signed in as:</div>
                      <div className='break-words text-left leading-5 pb-3'>{address}</div>

                      {(claimed === 'winner' || claimed === 'claimed') &&
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

        { connectToggle && walletStatus !== 'connected' &&
          <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay2 z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setConnectToggle(false)) : null}>
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
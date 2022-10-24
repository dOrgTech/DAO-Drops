import React, { useState } from 'react'
import * as constants from '../../Constants'
import { truncate } from '../../Utils'
import poap from '../../assets/phase3/poap.png'


// Header Component (Phase3)
// ------------------------------------------------------------------------------------------------------- //
const Header = ({loadWeb3, disconnectWeb3, address, walletStatus, winner}) => {
    const [walletToggle, setWalletToggle] = useState(false);

    return(
      <header className={`flex justify-end z-30 w-full pt-4 ${walletStatus === 'connected' && 'fixed px-[5%] 1000px:pr-[10%] ml-[-5%] 1000px:ml-[-10%] pt-2 1000px:pt-4 bg-headerColor h-[65px]'}`}>
        <a className={`font-ob font-semibold text-magentaDD tracking-[4px] text-xl absolute left-[5%] 1000px:left-[calc(10%+81px)] top-4 z-20 hover:text-magentaDD4 ${walletStatus === 'connected' && 'hidden 500px:block'}`} href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>
        
        { walletStatus === 'connected'
          ? <div className='flex flex-col relative'>
              <div className='border-[3px] border-aquaDD aqua-dot font-ob font-bold w-[21rem] px-4 pb-2 pt-1 mb-2 bg-white cursor-pointer uppercase hover:text-indigoDD2' onClick={() => setWalletToggle(!walletToggle)}>{truncate(address,11)}</div>
      
              { walletToggle && 
                  <div className='absolute top-0 z-30 bg-white cursor-pointer' onClick={() => setWalletToggle(!walletToggle)}>
                    <div className='border-4 border-aquaDD font-ob font-bold w-[21rem] pt-2 text-center'>
                    <div className='aqua-dot after:content-["•"] after:top-[0px] after:mr-[3px] px-4 hover:text-indigoDD2'>Your wallet is connected</div>
                      <hr className='mt-3 border-[#CCCCCC]' />
                      <div className='text-left font-ob font-normal mt-3 mb-1 px-4'>Signed in as:</div>
                      <div className='break-words text-left leading-5 pb-2 px-4'>{address}</div>
                      <hr className='mt-3 border-[#CCCCCC]' />

                      { winner === 'winner' &&
                        <>
                          <div className='break-words text-left leading-5 flex items-center px-4 py-5'>
                            <img className='w-20' src={poap} alt='poap' />
                            <div className='flex flex-col ml-3'>
                              <div className='text-left font-ob font-normal'>Your rewards:</div>
                              <div className=''>DAO DROPS poap</div>
                            </div>
                          </div>
                          <hr className='border-[#CCCCCC]' />
                        </>
                      }

                      <div className='text-left font-ob font-semibold p-4 pb-[18px] hover:text-indigoDD2' onClick={disconnectWeb3}>Disconnect</div>

                    </div>
                  </div>
                }

            </div>

          : <div className={`button1-small text-lg w-[18rem] pb-2 600px:text-xl 600px:w-[20rem] 600px:pb-3 1000px:z-30 border-b-[5px] 600px:border-b-[6px]`} onClick={() => loadWeb3('click')}>Connect Wallet</div>
        }

      </header>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Header;
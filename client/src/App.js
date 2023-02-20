import React, { useState, useEffect } from 'react'
import Phase1 from './components/Phase1'
import Phase2 from './components/Phase2'
import Phase3 from './components/Phase3'
import Pause from './components/Pause'
import Terms from './components/Terms'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { providers } from 'ethers'
import Web3Token from 'web3-token'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import * as dotenv from 'dotenv'

dotenv.config()


// App Component
// ------------------------------------------------------------------------------------------------------- //
const App = () => {

    const INFURA_ID = process.env.REACT_APP_INFURA_ID
    const SCORE = 'https://dao-drops.herokuapp.com/posts/score/'
      
    const [web3Modal, setWeb3Modal] = useState(null)
    const [signer, setSigner] = useState(null)
    const [address, setAddress] = useState('')
    const [addressDetails, setAddressDetails] = useState('none')
    const [points, setPoints] = useState(null)
    const [votes, setVotes] = useState(null)
    const [walletStatus, setWalletStatus] = useState('disconnected')
    const [phaseView, setPhaseView] = useState('1')
  
    useEffect(() => {
      address && points !== null && localStorage.setItem(`points_${address}`, parseInt(points))
    }, [address, points])

    useEffect(() => {
      address && votes !== null && localStorage.setItem(`votes_${address}`, JSON.stringify(votes))
    }, [address, votes])

    // useEffect(() => {
    //   const providerOptions = {
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: INFURA_ID,
    //       }
    //     },
    //   }
  
    //   const newWeb3Modal = new Web3Modal({
    //     cacheProvider: true,
    //     network: 'mainnet',
    //     providerOptions,
    //     // theme: 'dark',
    //   })
  
    //   setWeb3Modal(newWeb3Modal)
    // }, [])
  
    // useEffect(() => {
    //   if(web3Modal && web3Modal.cachedProvider){
    //     loadWeb3('load')
    //   }
    // }, [web3Modal])
  
    async function sign(token, eSigner) {
      token = await Web3Token.sign(async msg => await eSigner.signMessage(msg), {
        statement: 'This is a signed message',
        expires_in: '5y'
      })
      return token
    }

    async function loadWeb3(type) {
      setWalletStatus('connecting')
      const provider = await web3Modal.connect()
      addListeners(provider)
      const ethersProvider = new providers.Web3Provider(provider)
      const signer = ethersProvider.getSigner()
      setSigner(signer)
      const ethAddress = await signer.getAddress()

      let token = localStorage.getItem(ethAddress)

      if (!token && type === 'load') {
        setWalletStatus('disconnected')
        setSigner(null)
        return
      }

      token && setAddress(ethAddress)
      if (!token) { 
        token = await sign(token, signer)
        localStorage.setItem(ethAddress, token)
        setAddress(ethAddress)
      }

      await axios.get(SCORE + (await signer.getAddress()).toLowerCase(), { headers: { auth: token }})
        .then(r => 
          { if (r.data !== null) {
              setAddressDetails(r.data)

              let pointsStorage = localStorage.getItem(`points_${ethAddress}`)
              pointsStorage ? setPoints(parseInt(pointsStorage)) : setPoints(parseInt(r.data['score']))

              r.data.picks.length && r.data.picks.map( pick => setVotes(votes => ({...votes, [pick.id]: pick.points})) )
          }
        })
        .catch(e => {
          // console.error(e)
          setPoints(0)
        })

      setWalletStatus('connected')
    }

    function clearAddress() {
      setAddress('')
      setPoints(null)
      setVotes(null)
      localStorage.removeItem(address)
      localStorage.removeItem(`points_${address}`)
      localStorage.removeItem(`votes_${address}`)
      setWalletStatus('disconnected')
    }

    async function addListeners(web3ModalProvider) {
      web3ModalProvider.on('accountsChanged', (accounts) => {
        window.location.reload()
      })

      // web3ModalProvider.on('chainChanged', (chainId) => {
      //   window.location.reload()
      // })

      // web3ModalProvider.on('connect', (info) => {
      //   console.log(info)
      // })
      
      web3ModalProvider.on('disconnect', (error) => {
        web3Modal.clearCachedProvider()
        clearAddress()
        // window.location.reload()
        console.log(error)
      })
    }

    async function disconnectWeb3() {
      await web3Modal.clearCachedProvider()
      clearAddress()
    }

    return(
      <>
        {/* { phaseView === '1' && <Phase1 setPhaseView={setPhaseView} /> }
        { phaseView === '2' && <Phase2 loadWeb3={loadWeb3} disconnectWeb3={disconnectWeb3} signer={signer} address={address} addressDetails={addressDetails} walletStatus={walletStatus} points={points} setPoints={setPoints} votes={votes} setVotes={setVotes} setPhaseView={setPhaseView} /> }
        { phaseView === '3' && <Phase3 loadWeb3={loadWeb3} disconnectWeb3={disconnectWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} /> }
        { phaseView === 'p' && <Pause /> } */}

        <BrowserRouter>
          <Routes>
            <Route path='/' element={phaseView === '1' ? <Phase1 setPhaseView={setPhaseView} /> : phaseView === 'p' ? <Pause /> : <Phase1 setPhaseView={setPhaseView} /> } />
            {/* <Route path='2' element={<Phase2 loadWeb3={loadWeb3} disconnectWeb3={disconnectWeb3} signer={signer} address={address} addressDetails={addressDetails} walletStatus={walletStatus} points={points} setPoints={setPoints} votes={votes} setVotes={setVotes} setPhaseView={setPhaseView} />} /> */}
            {/* <Route path='3' element={<Phase3 loadWeb3={loadWeb3} disconnectWeb3={disconnectWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} />} /> */}
            {/* <Route path='/p' element={<Pause />} /> */}
            <Route path='/terms' element={<Terms />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>

      </>
    )
  }
// ------------------------------------------------------------------------------------------------------- //

export default App;

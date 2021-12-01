import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';
import Phase3 from './components/Phase3';
import axios from "axios";

// App Component
// ------------------------------------------------------------------------------------------------------- //
const App = () => {
      
    const [address, setAddress] = useState('');
    const [points, setPoints] = useState(0);
    const [walletStatus, setWalletStatus] = useState('disconnected');
    const [phaseView, setPhaseView] = useState("2");

    async function loadWeb3() {
      if (window.ethereum) {
        setWalletStatus('connecting');
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        setAddress(await signer.getAddress());

        await axios.get(`http://localhost:5000/posts/score/${await signer.getAddress()}`)
          .then(r => setPoints(r.data["score"]))
          .catch(e => console.error(e));


        setWalletStatus('connected');
      }
      else{
        setWalletStatus('NA');
      }
    }

    // useEffect(() => {
    //   loadWeb3()
    // }, []);

    return(
      <>
        { phaseView === '1' && <Phase1 /> }
        { phaseView === '2' && <Phase2 loadWeb3={loadWeb3} address={address} walletStatus={walletStatus} points={points} setPoints={setPoints} setPhaseView={setPhaseView} /> }
        { phaseView === '3' && <Phase3 loadWeb3={loadWeb3} address={address} walletStatus={walletStatus} /> }
      </>
    )
  }
// ------------------------------------------------------------------------------------------------------- //

export default App;
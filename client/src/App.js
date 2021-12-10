import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';
import Phase3 from './components/Phase3';
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// App Component
// ------------------------------------------------------------------------------------------------------- //
const App = () => {
      
    const [address, setAddress] = useState('');
    const [addressDetails, setAddressDetails] = useState('none');
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

        await axios.get(`https://daodrops4.herokuapp.com/posts/score/${await signer.getAddress()}`)
          .then(r => { if(r.data !== null) {setAddressDetails(r.data); setPoints(r.data["score"]);} })
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
        {/*{ phaseView === '1' && <Phase1 /> }*/}
        {/*{ phaseView === '2' && <Phase2 loadWeb3={loadWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} points={points} setPoints={setPoints} setPhaseView={setPhaseView} /> }*/}
        {/*{ phaseView === '3' && <Phase3 loadWeb3={loadWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} /> }*/}

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Phase1 />} />
            <Route path="2" element={<Phase2 loadWeb3={loadWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} points={points} setPoints={setPoints} setPhaseView={setPhaseView} />} />
            <Route path="3" element={<Phase3 loadWeb3={loadWeb3} address={address} addressDetails={addressDetails} walletStatus={walletStatus} />} />
          </Routes>
        </BrowserRouter>

      </>
    )
  }
// ------------------------------------------------------------------------------------------------------- //

export default App;
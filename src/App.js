import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';

// App Component
// ------------------------------------------------------------------------------------------------------- //
const App = () => {
      
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState();

    async function checkNetwork() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const selectedNetwork = await provider.getNetwork();

        if (selectedNetwork.name !== 'homestead') {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
        }
      }
    }

    async function loadWeb3() {
      if (window.ethereum) {
        
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const signer = provider.getSigner()
        setAddress(await signer.getAddress());

        const selectedNetwork = await provider.getNetwork();
        setNetwork(selectedNetwork.name);

        provider.on("network", (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                window.location.reload();
            }
        });
      }

      else if (window.ethereum) {
        window.web3 = new ethers.providers.Web3Provider(window.ethereum.currentProvider)
      }

      else {
        setAddress('NA');
      }
    }

    useEffect( () => {
      checkNetwork()
    }, []);

    return(
      <>
        {/* <Phase1 /> */}
        <Phase2 loadWeb3={loadWeb3} address={address} network={network} />
      </>
    )
  }
// ------------------------------------------------------------------------------------------------------- //

export default App;
require("@nomiclabs/hardhat-waffle");

const infuraKey = "229827e347a949a68726a4a934c90f6a";
// const mnemonic =
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

const account1 =
  "fbd764b80dff508f898a76a8e3f56c00debaff777757bd751c367fad47976497";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    // hardhat: { blockGasLimit: 200000000, chainId: 1337 },

    kovan: {
      url: `https://kovan.infura.io/v3/${infuraKey}`,
      accounts: [account1],
    },
  },
};

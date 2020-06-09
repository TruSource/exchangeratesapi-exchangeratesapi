// require('dotenv').config();

// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const Web3WsProvider = require('web3-providers-ws');

// const mnemonic = process.env.SEED_PHRASE;
// const rpcUrl = process.env.ETHEREUM_RPC_URL;

// // Monkey patching missing functionality - see https://github.com/trufflesuite/truffle/issues/2567
// const wsProvider = new Web3WsProvider(rpcUrl);
// HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      websockets: true,
    },
    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, wsProvider),
    //   network_id: 3, // Ropsten network id
    //   websockets: true,
    // },
  },
  compilers: {
    solc: {
      version: '^0.5.0', // A version or constraint - Ex. "^0.5.0"
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Optimize for how many times you intend to run the code
        },
      },
    },
  },
  mocha: {
    timeout: 2000,
  },
};

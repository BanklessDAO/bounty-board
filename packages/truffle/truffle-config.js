const communityRopstenPk =
  '513fb779a26000395c5a35b63248c6d6617408f3b7ff693bf5bf81b57010c25c';

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '5777',
      skipDryRun: true,
      settings: {
        optimizer: {
          enabled: true,
          runs: 1, // Optimize for how many times you intend to run the code
        },
      },
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  plugins: ['truffle-contract-size', 'solidity-coverage'],
  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.3',
    },
  },
};

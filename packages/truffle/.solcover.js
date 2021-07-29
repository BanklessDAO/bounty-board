module.exports = {
  port: 7545,
  testrpcOptions:
    'ganache-cli -m "flat right front private empower oblige enlist awful quote dash wine attitude" -f "https://mainnet.infura.io/v3/bba528677c47487aa3bf31793386fb88" -i 1 -p 7545',

  providerOptions: {
    network_id: 1,
    mnemonic:
      'flat right front private empower oblige enlist awful quote dash wine attitude',
    port: 7545,
  },

  skipFiles: ['contracts/flattened.sol', 'contracts/WaterlineModule.sol'],

  mocha: {
    fgrep: '[skip-on-coverage]',
    invert: true,
  },
};

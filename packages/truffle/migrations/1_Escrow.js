const Escrow = artifacts.require('Escrow');

module.exports = function (deployer) {
  deployer.deploy(Escrow, '0x0'.padEnd(42, '0'));
};

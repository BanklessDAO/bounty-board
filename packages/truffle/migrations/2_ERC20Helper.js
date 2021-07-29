const ERC20Helper = artifacts.require('ERC20Helper');

module.exports = function (deployer) {
  deployer.deploy(ERC20Helper, 'NAME', 'SYMBOL', '10000000000000000000000' /* 10,000 */);
};

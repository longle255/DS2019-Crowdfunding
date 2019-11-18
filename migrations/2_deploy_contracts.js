const Crowdfunding = artifacts.require("./Crowdfunding.sol");
const web3 = require("web3");


module.exports = function(deployer) {
  deployer.deploy(Crowdfunding, web3.utils.toWei("100", 'ether'));
};

var Crowdfunding = artifacts.require("./Crowdfunding.sol");
const web3 = require("web3");

contract("Crowdfunding", function(accounts) {

  it("initializes with pre-defined goal", function() {
    return Crowdfunding.deployed()
    .then(function(instance) {
      return instance.getGoal();
    }).then(function(goal) {
      assert.equal(goal, web3.utils.toWei("100", 'ether'));
    });
  });

  it("initializes with pre-defined goal - another way to write this test", async function() {
    const instance = await Crowdfunding.deployed();
    const goal = await instance.getGoal();
    assert.equal(goal, web3.utils.toWei("100", 'ether'));
  });

});

pragma solidity ^0.5.0;

contract Crowdfunding {
  mapping(address => uint) pledges;
  uint sum;
  uint goal;
  bool campaingLive;
  address owner;
  address[] donors;

  constructor(uint _goal) public {
    sum = 0;
    goal = _goal;
    campaingLive = true;
    owner = msg.sender;
  }

  function getGoal() external view returns (uint) {
    return goal;
  }
  function getSum() external view returns (uint) {
    return sum;
  }

  function donate(address donor) external payable {
    require(msg.value > 0 && donor != address(0) && campaingLive);
    sum += msg.value;
    pledges[donor] += msg.value;

    donors.push(msg.sender);
  }

  function endCampaing(address payable beneficiary) external returns (bool) {
    require(campaingLive);
    require(msg.sender == owner);
    campaingLive = false;
    beneficiary.send(sum);
    return sum >= goal;
  }

  function getDonnors() external view returns (address[] memory) {
    require(msg.sender == owner);
    return donors;
  }
}

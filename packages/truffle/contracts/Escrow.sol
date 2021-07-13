// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
  enum State {
    AWAITING_PAYMENT,
    AWAITING_DELIVERY,
    COMPLETE
  }

  struct Bounty {
    State state;
    address payable contributor;
    address payable payer;
    uint256 value;
    Levels contributorLevel;
  }

  enum Levels {
    GUEST_PASS,
    LEVEL_0,
    LEVEL_1,
    LEVEL_2
  }

  uint256 public constant ONE = 10**18;

  mapping(Levels => uint256) private _firstPaymentPercentage;
  mapping(bytes32 => Bounty) private _bounties; // bouty hash => State

  address private _owner;
  address private _treasury;

  modifier onlyPayer(bytes32 bountyHash) {
    require(msg.sender == _bounties[bountyHash].payer, "ONLY_BOUNTY_PAYER");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == _owner, "ONLY_OWNER");
    _;
  }

  modifier onlyTreasury() {
    require(msg.sender == _treasury, "ONLY_TREASURY");
    _;
  }

  constructor(address treasury_) {
    _treasury = treasury_;
    _owner = msg.sender;
  }

  function firstPaymentPercentage(Levels level) public view returns (uint256) {
    return _firstPaymentPercentage[level];
  }

  function bounties(bytes32 bountyHash)
    public
    view
    returns (Bounty memory bouty)
  {
    return _bounties[bountyHash];
  }

  function balance() public view returns (uint256) {
    return address(this).balance;
  }

  function owner() public view returns (address) {
    return _owner;
  }

  function treasury() public view returns (address) {
    return _treasury;
  }

  function changeOwner(address newOwner) public onlyOwner {
    _owner = newOwner;
  }

  function changeTreasury(address newTreasury)
    public
    onlyTreasury
  {
    _treasury = newTreasury;
  }

  fallback() external payable {}

  function changeFirstPaymentPercentage(Levels level, uint256 newPercentage)
    public
    onlyOwner
  {
    _firstPaymentPercentage[level] = newPercentage;
  }

  modifier notZeroAddress(address addr) {
    require(addr != address(0), "ZERO_ADDRESS_NOT_ALLOWED");
    _;
  }

  function hashBountyInfo(
    string memory title,
    string memory description,
    string memory doneCriteria,
    string memory reward
  ) public pure returns (bytes32) {
    return keccak256(abi.encode(title, description, doneCriteria, reward));
  }

  function defineNewBounty(
    bytes32 bountyHash,
    address payable contributor_,
    address payable payer_,
    uint256 value_,
    Levels contributorLevel_
  ) public notZeroAddress(contributor_) notZeroAddress(payer_) {
    _bounties[bountyHash].contributor = contributor_;
    _bounties[bountyHash].payer = payer_;
    _bounties[bountyHash].value = value_;
    _bounties[bountyHash].contributorLevel = contributorLevel_;
  }

  function getContributorPercentage(Levels contributorLevel)
    public
    view
    returns (uint256)
  {
    return firstPaymentPercentage(contributorLevel);
  }

  function deposit(bytes32 bountyHash) external payable onlyPayer(bountyHash) {
    require(
      _bounties[bountyHash].state == State.AWAITING_PAYMENT,
      "BOUNTY_ALREADY_PAYED_FOR"
    );

    require(msg.value == _bounties[bountyHash].value, "WRONG_BOUNTY_VALUE");

    _bounties[bountyHash].state = State.AWAITING_DELIVERY;

    uint256 contributorPercentage = getContributorPercentage(
      _bounties[bountyHash].contributorLevel
    );

    uint256 contributorReceivalbe = (_bounties[bountyHash].value *
      contributorPercentage) / ONE;

    // value is subtracted here in case contributor initial percentage changes afterwards
    _bounties[bountyHash].value =
      (_bounties[bountyHash].value * (ONE - contributorPercentage)) /
      ONE;

    _bounties[bountyHash].contributor.transfer(contributorReceivalbe);
  }

  function confirmDelivery(bytes32 bountyHash) external onlyPayer(bountyHash) {
    require(
      _bounties[bountyHash].state == State.AWAITING_DELIVERY,
      "BOUNTY_NOT_DEPOSITED"
    );
    _bounties[bountyHash].state = State.COMPLETE;

    _bounties[bountyHash].contributor.transfer(_bounties[bountyHash].value);
  }

  function emergencyWithdrawal(bytes32 bountyHash) public onlyTreasury {
    _bounties[bountyHash].payer.transfer(_bounties[bountyHash].value);
  }
}

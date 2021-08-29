// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    IERC20 token;
    uint256 value;
    uint256 expirationDays;
    uint256 depositTimestamp;
    Levels contributorLevel;
  }

  enum Levels {
    GUEST_PASS,
    LEVEL_0,
    LEVEL_1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4
  }

  uint256 public constant ONE = 10**18;

  mapping(Levels => uint256) private _firstPaymentPercentage;
  mapping(bytes32 => Bounty) private _bounties; // bouty hash => State


  address private _owner;
  address private _multisig;

  modifier onlyPayer(bytes32 bountyHash) {
    require(msg.sender == _bounties[bountyHash].payer, "ONLY_BOUNTY_PAYER");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == _owner, "ONLY_OWNER");
    _;
  }
  
  modifier onlyMultisig() {
    require(msg.sender == _multisig, "ONLY_MULTISIG");
    _;
  }

  constructor(address multisig_) {
    _owner = msg.sender;
    _multisig = multisig_;
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
  
  function multisig() public view returns (address) {
    return _multisig;
  }

  function changeOwner(address newOwner) public onlyOwner {
    _owner = newOwner;
  }

  function changeMultisig(address newMultisig) public onlyMultisig {
    _multisig = newMultisig;
  }

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

  event Approval(
    address indexed tokenOwner,
    address indexed spender,
    uint256 tokens
  );

  event Transfer(address indexed from, address indexed to, uint256 tokens);

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
    IERC20 token_,
    address payable contributor_,
    address payable payer_,
    uint256 value_,
    uint256 expirationDays_,
    Levels contributorLevel_
  ) public notZeroAddress(contributor_) notZeroAddress(payer_) {
    _bounties[bountyHash].contributor = contributor_;
    _bounties[bountyHash].token = token_;
    _bounties[bountyHash].payer = payer_;
    _bounties[bountyHash].value = value_;
    _bounties[bountyHash].expirationDays = expirationDays_;
    _bounties[bountyHash].contributorLevel = contributorLevel_;
  }

  function getContributorPercentage(Levels contributorLevel)
    public
    view
    returns (uint256)
  {
    return firstPaymentPercentage(contributorLevel);
  }

  function deposit(uint256 amount, bytes32 bountyHash)
    external
    payable
    onlyPayer(bountyHash)
  {
    require(amount == _bounties[bountyHash].value, "WRONG_BOUNTY_VALUE");

    require(
      _bounties[bountyHash].state == State.AWAITING_PAYMENT,
      "BOUNTY_ALREADY_PAYED_FOR"
    );

    _bounties[bountyHash].depositTimestamp = block.timestamp;

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

    require(
      _bounties[bountyHash].token.transferFrom(
        msg.sender,
        address(this),
        _bounties[bountyHash].value
      ),
      "TOKEN_NOT_APPROVED"
    );
    require(
      _bounties[bountyHash].token.transferFrom(
        msg.sender,
        _bounties[bountyHash].contributor,
        contributorReceivalbe
      ),
      "TOKEN_NOT_APPROVED"
    );
  }

  uint256 constant daysInSeconds = 24 * 60 * 60;

  function emergencyWithdrawal(bytes32 bountyHash)
    public
    onlyMultisig
  {
    require(
      block.timestamp - _bounties[bountyHash].depositTimestamp >
        _bounties[bountyHash].expirationDays * daysInSeconds,
      "FUNDS_STILL_IN_ESCROW"
    );

    uint256 amount = _bounties[bountyHash].value; // SPDX-License-Identifier: MIT
    _bounties[bountyHash].value = 0;
    require(_bounties[bountyHash].token.transfer(msg.sender, amount));
  }

  function confirmDelivery(bytes32 bountyHash) external onlyPayer(bountyHash) {
    require(
      _bounties[bountyHash].state == State.AWAITING_DELIVERY,
      "BOUNTY_NOT_DEPOSITED"
    );
    _bounties[bountyHash].state = State.COMPLETE;

    _bounties[bountyHash].token.transfer(
      _bounties[bountyHash].contributor,
      _bounties[bountyHash].value
    );
  }
}

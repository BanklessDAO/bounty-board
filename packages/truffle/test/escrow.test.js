const { expect } = require('chai');
const Escrow = artifacts.require('Escrow');
const ERC20Helper = artifacts.require('ERC20Helper');

const BigNumber = require('bignumber.js');

const crypto = require('crypto');

function hash(data) {
  return '0x' + crypto.createHmac('sha256', data.toString()).digest('hex');
}

function subtract(n1, n2) {
  return new BigNumber(n1.toString()).minus(n2.toString()).toString();
}

const zeroAddr = '0x0000000000000000000000000000000000000000';

function revert() {
  throw 'Transaction not reverted';
}

function ethToWei(eth) {
  return BigNumber(eth.toString()).times('1e18').integerValue().toString(10);
}

contract('Escrow Test', async (accounts) => {
  let escrow;
  let ERC20;

  const defaultContributor = accounts[1];
  const defaultPayer = accounts[0];
  const defaultMultisig = accounts[2];

  beforeEach(async () => {
    escrow = await Escrow.new(defaultMultisig);
    ERC20 = await ERC20Helper.new('NAME', 'SYMBOL', ethToWei('10000'));
  });

  it('initial check', async () => {
    const ONE = await escrow.ONE();
    expect(ONE.toString()).to.eq('1000000000000000000');

    const owner = await escrow.owner();
    expect(owner).to.eq(accounts[0]);
  });

  it('changes owner', async () => {
    const owner = await escrow.owner();

    const newOwner = accounts[3];

    await escrow.changeOwner(newOwner, { from: owner });

    const newOwnerCheck = await escrow.owner();
    expect(newOwnerCheck).to.eq(newOwner);

    try {
      await escrow.changeOwner(newOwner, { from: owner });
    } catch (e) {
      expect(e.reason).to.eq('ONLY_OWNER');
      return;
    }

    revert();
  });
  
  it('changes multisig', async () => {
    const newMultisig = accounts[4];

    await escrow.changeMultisig(newMultisig, { from: defaultMultisig });

    const newMultisigCheck = await escrow.multisig();
    expect(newMultisigCheck).to.eq(newMultisig);

    try {
      await escrow.changeMultisig(newMultisig, { from: accounts[0] });
    } catch (e) {
      expect(e.reason).to.eq('ONLY_MULTISIG');
      return;
    }

    revert();
  });

  it('gets bounty hash from info', async () => {
    const title = 'Devs Guild - Solidity Bounty V1';
    const description = 'Devs compensation';
    const doneCriteria = 'when bounty board moon?';
    const reward = '69420 $BANK';
    const bountyHahs1 = await escrow.hashBountyInfo(
      title,
      description,
      doneCriteria,
      reward,
    );
    const bountyHahs2 = await escrow.hashBountyInfo(
      title,
      description,
      doneCriteria,
      reward,
    );
    expect(bountyHahs1).to.equal(bountyHahs2);
  });

  it('Creates new bounty', async () => {
    await ERC20.approve(escrow.address, ethToWei('10000'));

    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('10'),
      '1',
      1,
    );

    // await escrow.deposit(ethToWei('10'), bountyHash);

    const bounty = await escrow.bounties(bountyHash);
    expect(bounty.state).to.eq('0');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('10'));
    expect(bounty.contributorLevel).to.eq('1');
  });

  it('Fails to create new bounty with contributor address 0', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    try {
      await escrow.defineNewBounty(
        bountyHash,
        ERC20.address,
        zeroAddr,
        defaultPayer,
        ethToWei('5'),
        '1',
        1,
      );
    } catch (e) {
      expect(e.reason).to.eq('ZERO_ADDRESS_NOT_ALLOWED');
      return;
    }

    revert();
  });

  it('Fails to create new bounty with payer address 0', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    try {
      await escrow.defineNewBounty(
        bountyHash,
        ERC20.address,
        defaultContributor,
        zeroAddr,
        ethToWei('5'),
        '1',
        1,
      );
    } catch (e) {
      expect(e.reason).to.eq('ZERO_ADDRESS_NOT_ALLOWED');
      return;
    }

    revert();
  });

  it('Fails to create new bounty with payer and contributor address 0', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    try {
      await escrow.defineNewBounty(
        bountyHash,
        ERC20.address,
        zeroAddr,
        zeroAddr,
        ethToWei('5'),
        '1',
        1,
      );
    } catch (e) {
      expect(e.reason).to.eq('ZERO_ADDRESS_NOT_ALLOWED');
      return;
    }

    revert();
  });

  it('Deposit with no first payment percentage set', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');
  });

  it('Fails to deposit without being bounty payer', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    try {
      await escrow.deposit(ethToWei('5'), bountyHash, {
        value: ethToWei('5'),
        from: defaultContributor,
      });
    } catch (e) {
      expect(e.reason).to.eq('ONLY_BOUNTY_PAYER');
      return;
    }

    revert();
  });

  it('Fails to deposit wrong bounty value', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    try {
      await escrow.deposit(ethToWei('6'), bountyHash, {
        from: defaultPayer,
      });
    } catch (e) {
      expect(e.reason).to.eq('WRONG_BOUNTY_VALUE');
      return;
    }

    revert();
  });

  it('Deposit with first payment percentage set to 25%', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const contributorBalanceBefore = await ERC20.balanceOf(defaultContributor);

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      '1',
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await ERC20.balanceOf(
      defaultContributor,
    );

    expect(
      subtract(contributorBalanceAfterFirstDeposit, contributorBalanceBefore),
    ).to.equal(ethToWei('1.25'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('3.75'));
    expect(bounty.contributorLevel).to.eq('1');
  });

  it('Payer confirms bounty delivery', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const contributorBalanceBeforeBounty = await ERC20.balanceOf(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');

    await escrow.confirmDelivery(bountyHash, { from: defaultPayer });

    const contractBalanceAfterDelivery = await ERC20.balanceOf(escrow.address);
    expect(contractBalanceAfterDelivery.toString()).to.eq(ethToWei('0'));

    const contributorBalanceAfterBounty = await ERC20.balanceOf(
      defaultContributor,
    );

    expect(
      subtract(contributorBalanceAfterBounty, contributorBalanceBeforeBounty),
    ).to.equal(ethToWei('5'));
  });

  it('Contributor fails to confirm bounty delivery', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');

    try {
      await escrow.confirmDelivery(bountyHash, { from: defaultContributor });
    } catch (e) {
      expect(e.reason).to.eq('ONLY_BOUNTY_PAYER');
      return;
    }

    revert();
  });

  it('Fails to confirm delivery on a bounty without deposit', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    try {
      await escrow.confirmDelivery(bountyHash, { from: defaultPayer });
    } catch (e) {
      expect(e.reason).to.eq('BOUNTY_NOT_DEPOSITED');
      return;
    }

    revert();
  });

  it('Payer fails to deposit twice on bounty', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    try {
      await escrow.deposit(ethToWei('5'), bountyHash, {
        from: defaultPayer,
      });
    } catch (e) {
      expect(e.reason).to.eq('BOUNTY_ALREADY_PAYED_FOR');
      return;
    }

    revert();
  });

  it('Payer fails to deposit on delivered bounty', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');

    await escrow.confirmDelivery(bountyHash, { from: defaultPayer });

    try {
      await escrow.deposit(ethToWei('5'), bountyHash, {
        from: defaultPayer,
      });
    } catch (e) {
      expect(e.reason).to.eq('BOUNTY_ALREADY_PAYED_FOR');
      return;
    }

    revert();
  });

  it('Fails to emercency withdrawal from contributor wallet', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const contributorBalanceBefore = await ERC20.balanceOf(defaultContributor);

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await ERC20.balanceOf(
      defaultContributor,
    );

    expect(
      subtract(contributorBalanceAfterFirstDeposit, contributorBalanceBefore),
    ).to.equal(ethToWei('1.25'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('3.75'));
    expect(bounty.contributorLevel).to.eq('1');

    try {
      await escrow.emergencyWithdrawal(bountyHash, {
        from: defaultContributor,
      });
    } catch (e) {
      expect(e.reason).to.equal('ONLY_MULTISIG');
      return;
    }
    revert();
  });

  it('Fails to emercency withdrawal from payer wallet', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const contributorBalanceBefore = await ERC20.balanceOf(defaultContributor);

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      '1',
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await ERC20.approve(escrow.address, ethToWei('10000'));

    await escrow.deposit(ethToWei('5'), bountyHash, {
      from: defaultPayer,
    });

    const contractBalance = await ERC20.balanceOf(escrow.address);
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await ERC20.balanceOf(
      defaultContributor,
    );

    expect(
      subtract(contributorBalanceAfterFirstDeposit, contributorBalanceBefore),
    ).to.equal(ethToWei('1.25'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('3.75'));
    expect(bounty.contributorLevel).to.eq('1');

    try {
      await escrow.emergencyWithdrawal(bountyHash, { from: defaultPayer });
    } catch (e) {
      expect(e.reason).to.equal('ONLY_MULTISIG');
      return;
    }
    revert();
  });

  it('approves BANK to be sent to the contract', async () => {
    const ownerBalance = await ERC20.balanceOf(accounts[0]);

    expect(ownerBalance.toString()).to.equal(ethToWei('10000'));

    await ERC20.approve(escrow.address, ethToWei('10000'));

    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('10000'),
      '1',
      1,
    );

    await escrow.deposit(ethToWei('10000'), bountyHash);

    const ownerBalanceAfterTransfer = await ERC20.balanceOf(accounts[0]);
    const escrowBalanceAfterTransfer = await ERC20.balanceOf(escrow.address);

    expect(ownerBalanceAfterTransfer.toString()).to.equal(ethToWei('0'));
    expect(escrowBalanceAfterTransfer.toString()).to.equal(ethToWei('10000'));

    try {
      await escrow.emergencyWithdrawal(bountyHash, { from: accounts[0] });
      revert();
    } catch (e) {
      expect(e.reason).to.equal('FUNDS_STILL_IN_ESCROW');
    }

    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

    await escrow.emergencyWithdrawal(bountyHash, { from: accounts[0] });

    const ownerBalanceAfterWithdrawal = await ERC20.balanceOf(accounts[0]);
    const escrowBalanceAfterWithdrawal = await ERC20.balanceOf(escrow.address);

    expect(ownerBalanceAfterWithdrawal.toString()).to.equal(ethToWei('10000'));
    expect(escrowBalanceAfterWithdrawal.toString()).to.equal(ethToWei('0'));
  });

  it('fails to deposit token not approved to be spent by contract', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      ERC20.address,
      defaultContributor,
      defaultPayer,
      ethToWei('10000'),
      '1',
      1,
    );

    try {
      await escrow.deposit(ethToWei('10000'), bountyHash);
    } catch (e) {
      expect(e.reason).to.equal('ERC20: transfer amount exceeds allowance');
      return;
    }

    revert();
  });
});

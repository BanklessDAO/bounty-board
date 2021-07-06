const { expect } = require('chai');
const Escrow = artifacts.require('Escrow');

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

  const defaultContributor = accounts[1];
  const defaultPayer = accounts[2];
  const treasury = accounts[7];

  beforeEach(async () => {
    escrow = await Escrow.new(treasury);
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

  it('changes trasury wallet', async () => {
    const treasury = await escrow.treasury();

    const newTreasury = accounts[4];

    await escrow.changeTreasury(newTreasury, { from: treasury });

    const newTreasuryCheck = await escrow.treasury();
    expect(newTreasuryCheck).to.eq(newTreasury);

    try {
      await escrow.changeTreasury(newTreasury, { from: treasury });
    } catch (e) {
      expect(e.reason).to.eq('ONLY_TREASURY');
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
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    const bounty = await escrow.bounties(bountyHash);
    expect(bounty.state).to.eq('0');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');
  });

  it('Fails to create new bounty with contributor address 0', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    try {
      await escrow.defineNewBounty(
        bountyHash,
        zeroAddr,
        defaultPayer,
        ethToWei('5'),
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
        defaultContributor,
        zeroAddr,
        ethToWei('5'),
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
        zeroAddr,
        zeroAddr,
        ethToWei('5'),
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    try {
      await escrow.deposit(bountyHash, {
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    try {
      await escrow.deposit(bountyHash, {
        value: ethToWei('6'),
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

    const contributorBalanceBefore = await web3.eth.getBalance(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await web3.eth.getBalance(
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

    const contributorBalanceBeforeBounty = await web3.eth.getBalance(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');

    await escrow.confirmDelivery(bountyHash, { from: defaultPayer });

    const contractBalanceAfterDelivery = await escrow.balance();
    expect(contractBalanceAfterDelivery.toString()).to.eq(ethToWei('0'));

    const contributorBalanceAfterBounty = await web3.eth.getBalance(
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    try {
      await escrow.deposit(bountyHash, {
        value: ethToWei('5'),
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
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('5'));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('5'));
    expect(bounty.contributorLevel).to.eq('1');

    await escrow.confirmDelivery(bountyHash, { from: defaultPayer });

    try {
      await escrow.deposit(bountyHash, {
        value: ethToWei('5'),
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

    const contributorBalanceBefore = await web3.eth.getBalance(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await web3.eth.getBalance(
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
      expect(e.reason).to.equal('ONLY_TREASURY');
      return;
    }
    revert();
  });

  it('Fails to emercency withdrawal from payer wallet', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const contributorBalanceBefore = await web3.eth.getBalance(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await web3.eth.getBalance(
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
      expect(e.reason).to.equal('ONLY_TREASURY');
      return;
    }
    revert();
  });

  it('Fails to emercency withdrawal from payer wallet', async () => {
    const bountyHash = hash('Devs Guild - Solidity Bounty V1');

    const payerBalanceBefore = await web3.eth.getBalance(defaultPayer);

    const contributorBalanceBefore = await web3.eth.getBalance(
      defaultContributor,
    );

    await escrow.defineNewBounty(
      bountyHash,
      defaultContributor,
      defaultPayer,
      ethToWei('5'),
      1,
    );

    await escrow.changeFirstPaymentPercentage('1', ethToWei('0.25'));

    const level1ContributorPercentage = await escrow.getContributorPercentage(
      '1',
    );

    expect(level1ContributorPercentage.toString()).to.eq(ethToWei('0.25'));

    await escrow.deposit(bountyHash, {
      value: ethToWei('5'),
      from: defaultPayer,
    });

    const contractBalance = await escrow.balance();
    expect(contractBalance.toString()).to.eq(ethToWei('3.75'));

    const contributorBalanceAfterFirstDeposit = await web3.eth.getBalance(
      defaultContributor,
    );

    const payerBalanceAfterFirstDeposit = await web3.eth.getBalance(
      defaultPayer,
    );

    expect(
      subtract(contributorBalanceAfterFirstDeposit, contributorBalanceBefore),
    ).to.equal(ethToWei('1.25'));

    expect(
      subtract(payerBalanceBefore, payerBalanceAfterFirstDeposit).slice(0, 14),
    ).to.equal(ethToWei('5').slice(0, 14));

    const bounty = await escrow.bounties(bountyHash);

    expect(bounty.state).to.eq('1');
    expect(bounty.contributor).to.eq(defaultContributor);
    expect(bounty.payer).to.eq(defaultPayer);
    expect(bounty.value).to.eq(ethToWei('3.75'));
    expect(bounty.contributorLevel).to.eq('1');

    const treasury = await escrow.treasury();
    expect(treasury).to.equal(accounts[7]);

    await escrow.emergencyWithdrawal(bountyHash, { from: treasury });

    const payerBalanceAfterEmergencyWithdrawal = await web3.eth.getBalance(
      defaultPayer,
    );

    expect(
      subtract(
        payerBalanceAfterEmergencyWithdrawal,
        payerBalanceAfterFirstDeposit,
      ),
    ).to.equal(ethToWei('3.75'));

    const contractBalanceAfterEmergencyWithdrawal = await escrow.balance();
    expect(contractBalanceAfterEmergencyWithdrawal.toString()).to.eq(
      ethToWei('0'),
    );
  });
});

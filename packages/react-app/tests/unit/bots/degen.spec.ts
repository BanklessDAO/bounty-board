export {};

describe('Testing DEGEN integration', () => {

  const buildBountyCreateNewParams = (guild: string, ctxOptions: { [key: string]: any }) => {

    const [reward, symbol] = (ctxOptions.reward != null) ? ctxOptions.reward.split(' ') : [null, null];
    const copies = (ctxOptions.copies == null || ctxOptions.copies <= 0) ? 1 : ctxOptions.copies;
    let scale = reward.split('.')[1]?.length;
    scale = (scale != null) ? scale : 0;
    
    return {
        customer_id: guild,
        title: ctxOptions.title,
        reward: {
            amount: reward,
            currencySymbol: symbol,
            scale: scale,
            amountWithoutScale: reward.replace('.', ''),
        },
        copies: copies,
    };
  };

  it('Takes in a reward without a scale and writes just the reward, with scale 0', () => {
    const bounty = buildBountyCreateNewParams('guild', {
      title: 'test',
      reward: '1000 BANK',
    });

    expect(bounty.reward.scale).toBe(0);
    expect(bounty.reward.amount).toBe('1000');
    expect(bounty.reward.currencySymbol).toBe('BANK');
  });

  it('Takes in a reward with a decimal point and writes the reward, with scale as well', () => {
    const bounty = buildBountyCreateNewParams('guild', {
      title: 'test',
      reward: '1.5 ETH',
    });

    expect(bounty.reward.scale).toBe(1);
    expect(bounty.reward.amount).toBe('1.5');
    expect(bounty.reward.currencySymbol).toBe('ETH');
  });

});
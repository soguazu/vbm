const data = {
  agent1: {
    app: 25,
    earnings: 30000,
    account: 25,
  },
  agent2: {
    app: 75,
    earnings: 50000,
    account: 75,
  },
  agent3: {
    app: 100,
    earnings: 100000,
    account: 100,
  },
  agent4: {
    app: 250,
    earnings: 150000,
    account: 250,
  },
  branch1: {
    app: 1000,
    earnings: 500000,
    account: 1000,
  },
  branch2: {
    app: 2000,
    earnings: 1000000,
    account: 2000,
  },
  superbranch: {
    app: 3000,
    earnings: 2000000,
    account: 3000,
  },
};

const getAgentDetail = async (activeClient, totalMoney) => {
  let level = 'agent0';
  if (
    (activeClient < 25 && totalMoney <= 200000000) ||
    ((activeClient > 25 || activeClient < 75) && totalMoney < 500000) ||
    (activeClient > 75 && activeClient < 100 && totalMoney < 500000) ||
    (activeClient > 100 && activeClient < 250 && totalMoney < 500000) ||
    (activeClient > 250 && activeClient < 1000 && totalMoney < 500000) ||
    (activeClient > 1000 && activeClient < 2000 && totalMoney < 500000) ||
    (activeClient > 2000 && activeClient < 3000 && totalMoney < 500000) ||
    (activeClient >= 3000 && totalMoney < 500000)
  ) {
    level = 'agent1';
  }

  if (
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 2000000 &&
      totalMoney < 5000000) ||
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 5000000 &&
      totalMoney < 7500000) ||
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 7500000 &&
      totalMoney < 25000000) ||
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 75 &&
      activeClient < 100 &&
      totalMoney >= 100000000 &&
      totalMoney < 200000000) ||
    (activeClient >= 75 && activeClient < 100 && totalMoney >= 200000000) ||
    (activeClient >= 100 &&
      activeClient < 250 &&
      totalMoney >= 2000000 &&
      totalMoney < 5000000) ||
    (activeClient >= 250 &&
      activeClient < 1000 &&
      totalMoney >= 2000000 &&
      totalMoney < 5000000) ||
    (activeClient >= 2000 &&
      activeClient < 3000 &&
      totalMoney >= 2000000 &&
      totalMoney < 5000000) ||
    (activeClient >= 3000 && totalMoney >= 2000000 && totalMoney < 5000000)
  ) {
    level = 'agent2';
  }

  if (
    (activeClient >= 100 &&
      activeClient < 250 &&
      totalMoney >= 5000000 &&
      totalMoney < 7500000) ||
    (activeClient >= 100 &&
      activeClient < 250 &&
      totalMoney >= 7500000 &&
      totalMoney < 25000000) ||
    (activeClient >= 100 &&
      activeClient < 250 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 100 &&
      activeClient < 250 &&
      totalMoney >= 100000000 &&
      totalMoney < 200000000) ||
    (activeClient >= 100 && activeClient < 250 && totalMoney >= 200000000) ||
    (activeClient >= 250 &&
      activeClient < 1000 &&
      totalMoney >= 5000000 &&
      totalMoney < 7500000) ||
    (activeClient >= 1000 &&
      activeClient < 2000 &&
      totalMoney >= 5000000 &&
      totalMoney < 7500000) ||
    (activeClient >= 2000 &&
      activeClient < 3000 &&
      totalMoney >= 5000000 &&
      totalMoney < 7500000) ||
    (activeClient >= 3000 && totalMoney >= 5000000 && totalMoney < 7500000)
  ) {
    level = 'agent3';
  }

  if (
    (activeClient >= 250 &&
      activeClient < 1000 &&
      totalMoney >= 7500000 &&
      totalMoney < 25000000) ||
    (activeClient >= 250 &&
      activeClient < 1000 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 250 &&
      activeClient < 1000 &&
      totalMoney >= 100000000 &&
      totalMoney < 200000000) ||
    (activeClient >= 250 && activeClient < 1000 && totalMoney >= 200000000) ||
    (activeClient >= 1000 &&
      activeClient < 2000 &&
      totalMoney >= 7500000 &&
      totalMoney < 25000000) ||
    (activeClient >= 2000 &&
      activeClient < 3000 &&
      totalMoney >= 7500000 &&
      totalMoney < 25000000) ||
    (activeClient >= 3000 && totalMoney >= 7500000 && totalMoney < 25000000)
  ) {
    level = 'agent4';
  }

  if (
    (activeClient >= 1000 &&
      activeClient < 2000 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 1000 &&
      activeClient < 2000 &&
      totalMoney >= 100000000 &&
      totalMoney < 200000000) ||
    (activeClient >= 1000 && activeClient < 2000 && totalMoney >= 200000000) ||
    (activeClient >= 2000 &&
      activeClient < 3000 &&
      totalMoney >= 25000000 &&
      totalMoney < 100000000) ||
    (activeClient >= 3000 && totalMoney >= 25000000 && totalMoney < 100000000)
  ) {
    level = 'branch1';
  }
  if (
    (activeClient >= 2000 &&
      activeClient < 3000 &&
      totalMoney >= 100000000 &&
      totalMoney < 200000000) ||
    (activeClient >= 2000 && activeClient < 3000 && totalMoney >= 200000000) ||
    (activeClient >= 3000 && totalMoney >= 100000000 && totalMoney < 200000000)
  ) {
    level = 'branch2';
  }

  if (activeClient >= 3000 && totalMoney >= 200000000) {
    level = 'superbranch';
  }
  const payload = data[level];
  if (payload === undefined) {
    return 'agent0';
  }

  const temp = level[level.length - 1];
  const next = `agent${Number(temp) + 1}`;
  const noAccountToNextAgency = data[next].account - data[level].account;

  return {
    status: level,
    ...data[level],
    noAccountToNextAgency,
  };
};

export default getAgentDetail;

getAgentDetail(75, 10000000).then((level) => console.log(level));

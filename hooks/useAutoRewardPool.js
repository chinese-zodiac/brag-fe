import { useCalls } from '@usedapp/core';
import { Contract } from 'ethers';
import { ADDRESS_AUTO_REWARD_POOL, ADDRESS_ZERO } from '../constants/addresses';

import { parseEther } from '@ethersproject/units';
import AutoRewardPoolAbi from "../abi/AutoRewardPool.json";


function useAutoRewardPool(provider, account) {
  const arpContract = new Contract(ADDRESS_AUTO_REWARD_POOL, AutoRewardPoolAbi, provider);
  const results = useCalls([
    {
      contract: arpContract,
      method: 'rewardPerSecond',
      args: []
    },
    {
      contract: arpContract,
      method: 'totalRewardsPaid',
      args: []
    },
    {
      contract: arpContract,
      method: 'combinedStakedBalance',
      args: [account ?? ADDRESS_ZERO]
    },
    {
      contract: arpContract,
      method: 'totalRewardsReceived',
      args: [account ?? ADDRESS_ZERO]
    },
    {
      contract: arpContract,
      method: 'pendingReward',
      args: [account ?? ADDRESS_ZERO]
    },
    {
      contract: arpContract,
      method: 'totalStaked',
      args: []
    },
    {
      contract: arpContract,
      method: 'timestampLast',
      args: []
    }
  ]) ?? [];
  return {
    rewardPerSecond: results?.[0]?.value?.[0] ?? parseEther("0"),
    totalRewardsPaid: results?.[1]?.value?.[0] ?? parseEther("0"),
    combinedStakedBalance: results?.[2]?.value?.[0] ?? parseEther("0"),
    totalRewardsReceived: results?.[3]?.value?.[0] ?? parseEther("0"),
    pendingReward: results?.[4]?.value?.[0] ?? parseEther("0"),
    totalStaked: results?.[5]?.value?.[0] ?? parseEther("0"),
    timestampLast: results?.[6]?.value?.[0] ?? parseEther("0"),
  }
}

export default useAutoRewardPool;
import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import BigNumber from 'bignumber.js';


import { VOTECAST_EVENT,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_3_ALERTID,
  PROTOCOL,
  UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
  DECREASE_MANIPULATION_TRIGGER_VOTES_PERCENT,
  BLOCKS_BEFORE_VOTE_CAST
 } from './constants'

import { ContractUtils } from './ContractUtils';

const contractUtils = new ContractUtils();

function provideHandleTransaction(contractUtils: ContractUtils) {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = []

    const voteCastEvents = txEvent.filterLog(VOTECAST_EVENT, UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS);

    for (const voteCast of voteCastEvents) {
      const {proposalId, voter } = voteCast.args;
      const currentVotes: BigNumber = new BigNumber(voteCast.args.votes.toBigInt())
      // 100 blocks prior vote cast
      const priorVoteCastCount: BigNumber = await contractUtils.getVoteCastPriorVotes(txEvent.blockNumber, voter);
      const votesChangeRate:BigNumber = new BigNumber(1).minus(currentVotes.dividedBy(priorVoteCastCount))
      const maxChangeVotesBeforeVoteCast = new BigNumber(DECREASE_MANIPULATION_TRIGGER_VOTES_PERCENT).multipliedBy(new BigNumber('0.01'));
      //console.log(`current ${currentVotes}  prior ${priorVotesCount} [${currentVotes.minus(priorVotesCount)}] times ${votesChangeRate} max ${maxVoteTimes}`)
      if (votesChangeRate.isPositive() && votesChangeRate.gte(maxChangeVotesBeforeVoteCast)) {
        const votesChangeRatePercent = votesChangeRate.multipliedBy(new BigNumber(100))
        findings.push(
          Finding.fromObject({
            alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_3_ALERTID,
            name: `Uniswap governance proposal ${proposalId.toString()} manipulation detected.`,
            description: `Voter with address ${voter} had an decrease of ${votesChangeRatePercent.toString()} percent in vote numbers, since ${BLOCKS_BEFORE_VOTE_CAST} blocks before the vote cast`,
            severity: FindingSeverity.High,
            type: FindingType.Suspicious,
            protocol : PROTOCOL,
            metadata: {
              voter: voter,
              proposalId: proposalId.toString(),
              votetimesChange: votesChangeRatePercent.toString(),
              maxVotedecreasePercent: String(DECREASE_MANIPULATION_TRIGGER_VOTES_PERCENT)
            },
          })
        );
      }
    }

    return findings
  }
}

export default {
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(contractUtils),
}
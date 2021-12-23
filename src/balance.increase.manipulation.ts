import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import BigNumber from 'bignumber.js';


import { VOTECAST_EVENT,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
  PROTOCOL,
  MANIPULATION_TRIGGER_VOTES_TIMES,
  UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_2_ALERTID,
  BLOCKS_BEFORE_PROPOSAL_START
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
      const priorVotesCount: BigNumber = await contractUtils.getProposalPriorVotes(proposalId, voter);
      if (!priorVotesCount.isZero()) {
        const votesChangeRate:BigNumber = currentVotes.dividedBy(priorVotesCount)
        const maxVoteTimes = new BigNumber(MANIPULATION_TRIGGER_VOTES_TIMES)
        //console.log(`current ${currentVotes}  prior ${priorVotesCount} [${currentVotes.minus(priorVotesCount)}] times ${votesChangeRate} max ${maxVoteTimes}`)
        if (votesChangeRate.gte(maxVoteTimes)) {
          findings.push(
            Finding.fromObject({
              alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
              name: `Uniswap governance proposal ${proposalId.toString()} manipulation detected.`,
              description: `Voter with address ${voter} had an increase of ${votesChangeRate.toString()} times in vote numbers, since ${BLOCKS_BEFORE_PROPOSAL_START} blocks before the start of the proposal`,
              severity: FindingSeverity.Critical,
              type: FindingType.Suspicious,
              protocol : PROTOCOL,
              metadata: {
                voter: voter,
                proposalId: proposalId.toString(),
                votetimesChange: votesChangeRate.toString()
              },
            })
          );
        }
    } else {
      findings.push(
        Finding.fromObject({
          alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_2_ALERTID,
          name: `Uniswap governance proposal ${proposalId.toString()} new voter detected`,
          description: `Voter with address ${voter} has ${currentVotes.toString()} votes now but has 0 votes ${BLOCKS_BEFORE_PROPOSAL_START} blocks before the start of the proposal`,
          severity: FindingSeverity.Info,
          type: FindingType.Suspicious,
          protocol : PROTOCOL,
          metadata: {
            voter: voter,
            proposalId: proposalId.toString()
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
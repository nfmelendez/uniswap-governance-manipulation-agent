import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import { BigNumber } from '@ethersproject/bignumber';

import { VOTECAST_EVENT,
  BLOCKS_BEFORE_PROPOSAL_START,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_1_NAME,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_1_DESCRIPTION,
  PROTOCOL,
  MANIPULATION_TRIGGER_PERCENTAGE,
  UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS
 } from './constants'

import { ContractUtils } from './ContractUtils';

const contractUtils = new ContractUtils();

function provideHandleTransaction(contractUtils: ContractUtils) {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = []

    const voteCastEvents = txEvent.filterLog(
      VOTECAST_EVENT
    );
    for (const voteCast of voteCastEvents) {
      if (voteCast.address.toLowerCase() != UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS.toLowerCase()) continue;
      const {proposalId, voter, votes } = voteCast.args;
      const proposal = await contractUtils.proposalProp(proposalId);
      const startBlock: BigNumber = proposal.startBlock;
      const fetchBlock = startBlock.sub(BLOCKS_BEFORE_PROPOSAL_START);
      const priorVotesCount = await contractUtils.getPriorVotes(voter, fetchBlock);
      if (!priorVotesCount.isZero()) {
        const p:BigNumber = votes.div(priorVotesCount);
        console.log(`current ${votes}  prior ${priorVotesCount} por ${p}`)
        if (p.gte(MANIPULATION_TRIGGER_PERCENTAGE)) {
          findings.push(
            Finding.fromObject({
              name: UNISWAP_GOV_PROPOSAL_MANIPULATION_1_NAME,
              description: UNISWAP_GOV_PROPOSAL_MANIPULATION_1_DESCRIPTION,
              alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
              severity: FindingSeverity.Critical,
              type: FindingType.Suspicious,
              protocol : PROTOCOL,
              metadata: {
                voter: voter,
                proposalId: proposalId.toNumber(),
                percentage: p.mul(100).toString(),
                maxPercentageChangeAccepted: MANIPULATION_TRIGGER_PERCENTAGE.toString()
              },
            })
          );
        }
    } else {
      console.log('New commer')
    }
    }

    return findings
}
}

export default {
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(contractUtils),
}
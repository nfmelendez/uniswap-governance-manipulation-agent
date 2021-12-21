import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import { VOTECAST_EVENT,
  BLOCKS_BEFORE_PROPOSAL_START,
  OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
  OZ_UPGRADE_SELFDESTRUCT_1_NAME,
  OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
  PROTOCOL
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
      const {proposalId, voter, votes} = voteCast.args;
      const proposal = await contractUtils.proposalProp(proposalId);
      const startBlock = proposal.startBlock;
      const fetchBlock = startBlock - BLOCKS_BEFORE_PROPOSAL_START;
      
      debugger;
      if (await contractUtils.isContractEmpty(voteCast.address)) {
        findings.push(
          Finding.fromObject({
            name: OZ_UPGRADE_SELFDESTRUCT_1_NAME,
            description: OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
            alertId: OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
            severity: FindingSeverity.Critical,
            type: FindingType.Suspicious,
            protocol : PROTOCOL,
            metadata: {
              from: txEvent.from,
              contractDestructed: voteCast.address
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
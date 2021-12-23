import { 
  TransactionEvent, 
} from 'forta-agent'

import balanceIncreaseManipulationAgent  from './balance.increase.manipulation'
import balanceDecreaseManipulationAgent  from './balance.decrease.manipulation'

function provideHandleTransaction(balanceIncreaseManipulationAgent: any, balanceDecreaseManipulationAgent: any) {
  return async function handleTransaction(txEvent: TransactionEvent) {

    const findings = (
      await Promise.all([
        balanceIncreaseManipulationAgent.handleTransaction(txEvent),
        balanceDecreaseManipulationAgent.handleTransaction(txEvent),
      ])
    ).flat();

    return findings;
  }
}

export default {
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(balanceIncreaseManipulationAgent, balanceDecreaseManipulationAgent),
}
import { utils } from 'ethers';
import { createTransactionEvent, Receipt, TransactionEvent } from 'forta-agent';

export class TestUtils {

    createReceipt(abi: string, data: ReadonlyArray<any>) : Receipt {
        const iface = new utils.Interface([abi]);
        const fragment = Object.values(iface.events)[0];
        const encode = iface.encodeEventLog(fragment, data)

        const log = {
            topics: encode.topics,
            data: encode.data,
            address: data[0]
        } 

        const receipt = {
            logs:[log]
        } as any

        return receipt
    }
  
    createTxEvent(
      receipt: Receipt,
      from: string = '0x0992',
      to: string = '0x0981'
    ): TransactionEvent {
      return createTransactionEvent({
        traces: {} as any,
        transaction: {
          from,
          to
        } as any,
        addresses: { [from]: true, [to]: true },
        receipt: receipt,
        block: {} as any
      });
    }
}

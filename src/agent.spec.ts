import {
  FindingType,
  FindingSeverity,
  Finding,
} from "forta-agent"
import agent from "./agent"

import { VOTECAST_EVENT,
  OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
  OZ_UPGRADE_SELFDESTRUCT_1_NAME,
  OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
  PROTOCOL
 } from './constants'
 
 import { TestUtils } from './testUtils'

const utils = new TestUtils();

// any address that meets the requirement for an address
const contractAddress = "0x2226755A6d1E0852FbdC139D5a6cC39DB84401f1";

describe("OpenZeppelin UUPSUpgradeable agent", () => {

  describe("handleTransaction", () => {
    it("returns empty findings if contract was upgraded and has code", async () => {
      const txEvent = utils.createTxEvent(utils.createReceipt(VOTECAST_EVENT, [contractAddress]))
      const mockContractUtils = {
        isContractEmpty : jest.fn().mockReturnValueOnce(false)
      } as any
      const handleTransaction = agent.provideHandleTransaction(mockContractUtils)


      const findings = await handleTransaction(txEvent)

      expect(mockContractUtils.isContractEmpty.mock.calls.length).toBe(1);

      expect(findings).toStrictEqual([])
    })

    it("returns a findings if contract was upgraded and hasn't any code", async () => {
      const from = "0x001"
      const txEvent = utils.createTxEvent(utils.createReceipt(VOTECAST_EVENT, [contractAddress]), from)
      const mockContractUtils = {
        isContractEmpty : jest.fn().mockReturnValueOnce(true)
      } as any
      const handleTransaction = agent.provideHandleTransaction(mockContractUtils)


      const findings = await handleTransaction(txEvent)

      const finding = Finding.fromObject({
        name: OZ_UPGRADE_SELFDESTRUCT_1_NAME,
        description: OZ_UPGRADE_SELFDESTRUCT_1_DESCRIPTION,
        alertId: OZ_UPGRADE_SELFDESTRUCT_1_ALERTID,
        protocol: PROTOCOL,
        severity: FindingSeverity.Critical,
        type: FindingType.Suspicious,
        metadata: {
          from: from,
          contractDestructed: contractAddress
        }
      });

      expect(mockContractUtils.isContractEmpty.mock.calls.length).toBe(1);

      expect(findings).toStrictEqual([finding]);

    })

  })
})

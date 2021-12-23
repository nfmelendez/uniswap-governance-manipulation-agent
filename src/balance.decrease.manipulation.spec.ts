import BigNumber from 'bignumber.js';

import {
  FindingType,
  FindingSeverity,
  Finding,
} from "forta-agent"

import { 
  BLOCKS_BEFORE_VOTE_CAST,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_3_ALERTID,
  PROTOCOL,
  DECREASE_MANIPULATION_TRIGGER_VOTES_PERCENT
 } from './constants'
 
import { TestUtils } from './testUtils'
import balanceDecreaseManipulation from "./balance.decrease.manipulation";

const utils = new TestUtils();

describe("Uniswap governance decrease votes manipulation agent", () => {

  const mockTxEvent = {
    filterLog: jest.fn(),
    blockNumber: 100
  } as any;

  const mockContractUtils = {
    getVoteCastPriorVotes : jest.fn(),
  } as any

  beforeEach(() => {
    mockTxEvent.filterLog.mockReset();
    mockContractUtils.getVoteCastPriorVotes.mockReset();
  });

  describe("handleTransaction", () => {
    it ("returns empty findings if the voter didn't have a significant votes change previous the vote cast", async () => {
  
      const handleTransaction = balanceDecreaseManipulation.provideHandleTransaction(mockContractUtils)

      //mocking
      const currentVotes = 100
      const votesPriorTheVoteCast = 101
      const voter = "aVoterAddress"
      const proposalId = '13';
      const mockVoteCastLog = utils.createVoteCast(proposalId, voter, currentVotes)
      mockTxEvent.filterLog.mockReturnValueOnce([mockVoteCastLog])
      mockContractUtils.getVoteCastPriorVotes.mockReturnValueOnce(new BigNumber(votesPriorTheVoteCast))

      const findings = await handleTransaction(mockTxEvent)

      expect(mockTxEvent.filterLog.mock.calls.length).toBe(1)
      expect(mockContractUtils.getVoteCastPriorVotes.mock.calls.length).toBe(1)

      expect(findings).toStrictEqual([])
    })

    it ("returns a finding if the voter had a significant votes change previous the vote cast", async () => {
  
      const handleTransaction = balanceDecreaseManipulation.provideHandleTransaction(mockContractUtils)

      //mocking
      const currentVotes = 50
      const votesPriorVoteCast = 100
      const voter = "aVoterAddress"
      const proposalId = '10';
      const mockVoteCastLog = utils.createVoteCast(proposalId, voter, currentVotes)
      mockTxEvent.filterLog.mockReturnValueOnce([mockVoteCastLog])
      mockContractUtils.getVoteCastPriorVotes.mockReturnValueOnce(votesPriorVoteCast)

      const findings = await handleTransaction(mockTxEvent)

      expect(mockTxEvent.filterLog.mock.calls.length).toBe(1)
      expect(mockContractUtils.getVoteCastPriorVotes.mock.calls.length).toBe(1)

      const finding = Finding.fromObject({
        alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_3_ALERTID,
        name: `Uniswap governance proposal ${proposalId.toString()} manipulation detected.`,
        description: `Voter with address ${voter} had an decrease of 50 percent in vote numbers, since ${BLOCKS_BEFORE_VOTE_CAST} blocks before the vote cast`,
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        protocol : PROTOCOL,
        metadata: {
          voter: voter,
          proposalId: proposalId.toString(),
          votesChangeRatePercent: '50'
        },
      });

      expect(findings).toStrictEqual([finding]);
    })

  })
})

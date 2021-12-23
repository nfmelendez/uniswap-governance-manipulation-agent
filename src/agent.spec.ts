import {
  FindingType,
  FindingSeverity,
  Finding,
} from "forta-agent"
import agent from "./agent"

import BigNumber from 'bignumber.js';


import { 
  BLOCKS_BEFORE_PROPOSAL_START,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
  PROTOCOL,
  MANIPULATION_TRIGGER_VOTES_TIMES,
  UNISWAP_GOV_PROPOSAL_MANIPULATION_2_ALERTID
 } from './constants'
 
 import { TestUtils } from './testUtils'

const utils = new TestUtils();

describe("Uniswap governance manipulation agent", () => {

  const mockTxEvent = {
    filterLog: jest.fn(),
  } as any;

  const mockContractUtils = {
    getPriorVotes : jest.fn(),
  } as any

  beforeEach(() => {
    mockTxEvent.filterLog.mockReset();
    mockContractUtils.getPriorVotes.mockReset();
  });

  describe("handleTransaction", () => {
    it ("returns empty findings if the voter didn't have a significant votes change previous the proposal", async () => {
  
      const handleTransaction = agent.provideHandleTransaction(mockContractUtils)

      //mocking
      const currentVotes = 100
      const votesPriorProposal = 101
      const voter = "aVoterAddress"
      const proposalId = '10';
      const mockVoteCastLog = utils.createVoteCast(proposalId, voter, currentVotes)
      mockTxEvent.filterLog.mockReturnValueOnce([mockVoteCastLog])
      mockContractUtils.getPriorVotes.mockReturnValueOnce(new BigNumber(votesPriorProposal))

      const findings = await handleTransaction(mockTxEvent)

      expect(mockTxEvent.filterLog.mock.calls.length).toBe(1)
      expect(mockContractUtils.getPriorVotes.mock.calls.length).toBe(1)

      expect(findings).toStrictEqual([])
    })

    it ("returns a finding if the voter had a significant votes change previous to the proposal", async () => {
  
      const handleTransaction = agent.provideHandleTransaction(mockContractUtils)

      //mocking
      const currentVotes = 1230
      const votesPriorProposal = 1000
      const voter = "aVoterAddress"
      const proposalId = '10';
      const mockVoteCastLog = utils.createVoteCast(proposalId, voter, currentVotes)
      mockTxEvent.filterLog.mockReturnValueOnce([mockVoteCastLog])
      mockContractUtils.getPriorVotes.mockReturnValueOnce(new BigNumber(votesPriorProposal))

      const findings = await handleTransaction(mockTxEvent)

      expect(mockTxEvent.filterLog.mock.calls.length).toBe(1)
      expect(mockContractUtils.getPriorVotes.mock.calls.length).toBe(1)

      const finding = Finding.fromObject({
        alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID,
        name: `Uniswap governance proposal ${proposalId.toString()} manipulation detected.`,
        description: `Voter with address ${voter} had an increase of 1.23 times in vote numbers, since ${BLOCKS_BEFORE_PROPOSAL_START} blocks before the start of the proposal`,
        severity: FindingSeverity.Critical,
        type: FindingType.Suspicious,
        protocol : PROTOCOL,
        metadata: {
          voter: voter,
          proposalId: proposalId.toString(),
          votetimesChange: '1.23',
          maxVoteTimes: MANIPULATION_TRIGGER_VOTES_TIMES
        },
      });

      expect(findings).toStrictEqual([finding]);
    })

    it ("returns a finding if the voter is a new commer to the proposal", async () => {
  
      const handleTransaction = agent.provideHandleTransaction(mockContractUtils)

      //mocking
      const currentVotes = 1000
      const votesPriorProposal = 0
      const voter = "aVoterAddress"
      const proposalId = '10';
      const mockVoteCastLog = utils.createVoteCast(proposalId, voter, currentVotes)
      mockTxEvent.filterLog.mockReturnValueOnce([mockVoteCastLog])
      mockContractUtils.getPriorVotes.mockReturnValueOnce(new BigNumber(votesPriorProposal))

      const findings = await handleTransaction(mockTxEvent)

      expect(mockTxEvent.filterLog.mock.calls.length).toBe(1)
      expect(mockContractUtils.getPriorVotes.mock.calls.length).toBe(1)

      const finding = Finding.fromObject({
        alertId: UNISWAP_GOV_PROPOSAL_MANIPULATION_2_ALERTID,
        name: `Uniswap governance proposal ${proposalId.toString()} new voter detected`,
        description: `Voter with address ${voter} has ${currentVotes} votes now but has 0 votes ${BLOCKS_BEFORE_PROPOSAL_START} blocks before the start of the proposal`,
        severity: FindingSeverity.Info,
        type: FindingType.Suspicious,
        protocol : PROTOCOL,
        metadata: {
          voter: voter,
          proposalId: proposalId,
          maxVoteTimes: MANIPULATION_TRIGGER_VOTES_TIMES
        },
      });

      expect(findings).toStrictEqual([finding]);
    })

  })
})

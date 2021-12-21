import { BigNumber } from '@ethersproject/bignumber';

// protocol is uniswap governance
export const PROTOCOL = 'uniswap governance';

// An event emitted when a vote has been cast on a proposal
// @param voter The address which casted a vote
// @param proposalId The proposal id which was voted on
// @param votes Number of votes which were cast by the voter
export const VOTECAST_EVENT = "event VoteCast(address indexed voter, uint proposalId, uint8 support, uint votes, string reason)";

// Uniswap Governor Bravo Delegator address. The delegator has the state and the delegate has the behaviour.
export const UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS = "0x408ED6354d4973f66138C91495F2f2FCbd8724C3";

// Uniswap Governor Bravo Delegator ABI
export const UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI = [ 
    "function proposals(uint) public view returns ( (uint256 id, address proposer, uint256 eta, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool canceled, bool executed) proposal)"
];

export const UNI_CONTRACT_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

export const UNI_TOKEN_ABI = [ 
    "function getPriorVotes(address account, uint blockNumber) public view returns (uint96)"
];

export const BLOCKS_BEFORE_PROPOSAL_START = 1264630;//100;

export const BLOCKS_BEFORE_VOTE_CAST = 100;

// % that triggers the uniswap proposal manipulation alert, 10 is 10% of change
export const MANIPULATION_TRIGGER_PERCENTAGE = 10;

// 0x represents a contract without code
export const DESTROYED_CONTRACT = "0x";
// alert id
export const UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID = "UNISWAP-GOV-PROPOSAL-MANIPULATION-1";
// alert name
export const UNISWAP_GOV_PROPOSAL_MANIPULATION_1_NAME = "OpenZeppelin UUPSUpgradeable contract selfdestructed";
// alert description
export const UNISWAP_GOV_PROPOSAL_MANIPULATION_1_DESCRIPTION = "UUPSUpgradeable contract was upgraded and selfdestructed. Funds are locked and impossible to rollback";

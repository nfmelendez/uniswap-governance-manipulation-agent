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

// blocks before the start of the proposal, we can use some data of mainnet if we use a big offset like 1264630
export const BLOCKS_BEFORE_PROPOSAL_START = 100;

export const BLOCKS_BEFORE_VOTE_CAST = 100;

// votes times in relation to pior the proposal that triggers manipulation alert. 
// for example: '1.2' is 1.2 times votes since 100 blocks before the proposal
export const MANIPULATION_TRIGGER_VOTES_TIMES = '1.2';

// alert id 1: a voter has too much votes than pior the start of the proposal.
export const UNISWAP_GOV_PROPOSAL_MANIPULATION_1_ALERTID = "UNISWAP-GOV-PROPOSAL-MANIPULATION-1";
// alert id 2: Newcomer, a voter didn't have any vote prior the proposal but now it has.
export const UNISWAP_GOV_PROPOSAL_MANIPULATION_2_ALERTID = "UNISWAP-GOV-PROPOSAL-MANIPULATION-2";

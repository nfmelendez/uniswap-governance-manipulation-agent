import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getJsonRpcUrl } from 'forta-agent';

import { 
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI,
    UNI_CONTRACT_ADDRESS,
    UNI_TOKEN_ABI,
    BLOCKS_BEFORE_PROPOSAL_START,
    BLOCKS_BEFORE_VOTE_CAST
} from './constants'

export class ContractUtils {

    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
    }

    // asks the Uniswap governor bravo the start block of the proposal
    // @param proposalId The proposal id
    private async fetchProposalStartBlock(proposalId: Number): Promise<any> {
        const governorBravoDelegator = new ethers.Contract(UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
            UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI, this.provider);
        const proposal = await governorBravoDelegator.proposals(proposalId);
        return proposal.startBlock;
    }

    // asks the UNI token contract how many votes the address had at a given moment.
    // UNI token implementation has checkpoint to know how many votes a user had at a given moment
    // @param fetchBlock The block number as ethers BigNumber
    // @param address the address of the voter
    private async getPriorVotes(fetchBlock: any, address: string): Promise<any> {
        const uniTokenContract = new ethers.Contract(UNI_CONTRACT_ADDRESS,
            UNI_TOKEN_ABI, this.provider);
        const votesCount = await uniTokenContract.getPriorVotes(address, fetchBlock);
        return votesCount;
    }

    // votes the voter had before the proposal starts
    // @param proposalId The proposal id
    // @param address the address of the voter
    public async getProposalPriorVotes(proposalId: number, address: string): Promise<BigNumber> {
        const startBlock = await this.fetchProposalStartBlock(proposalId);
        const fetchBlock = startBlock.sub(BLOCKS_BEFORE_PROPOSAL_START);
        const votesCount = await this.getPriorVotes(fetchBlock, address)
        return new BigNumber(votesCount.toBigInt());
    }

    // votes the voter had before pior the vote cast
    // @param voteCastBlock The vote cast block number
    // @param address the address of the voter
    public async getVoteCastPriorVotes(voteCastBlock: number, address: string): Promise<BigNumber> {
        const fetchBlock = voteCastBlock - BLOCKS_BEFORE_VOTE_CAST;
        const votesCount = await this.getPriorVotes(fetchBlock, address)
        return new BigNumber(votesCount.toBigInt());
    }
    
}
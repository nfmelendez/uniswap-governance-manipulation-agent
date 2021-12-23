import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getJsonRpcUrl } from 'forta-agent';

import { 
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI,
    UNI_CONTRACT_ADDRESS,
    UNI_TOKEN_ABI,
    BLOCKS_BEFORE_PROPOSAL_START
} from './constants'

export class ContractUtils {

    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
    }

    private async fetchProposalStartBlock(proposalId: Number): Promise<any> {
        const governorBravoDelegator = new ethers.Contract(UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
            UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI, this.provider);
        const proposal = await governorBravoDelegator.proposals(proposalId);
        return proposal.startBlock;
    }

    public async getPriorVotes(proposalId: Number, address: string): Promise<BigNumber> {
        const startBlock = await this.fetchProposalStartBlock(proposalId);
        const fetchBlock = startBlock.sub(BLOCKS_BEFORE_PROPOSAL_START);

        const uniTokenContract = new ethers.Contract(UNI_CONTRACT_ADDRESS,
            UNI_TOKEN_ABI, this.provider);
        const votesCount = await uniTokenContract.getPriorVotes(address, fetchBlock);
        return new BigNumber(votesCount.toBigInt());
    }
    
}
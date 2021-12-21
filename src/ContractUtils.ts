import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { getJsonRpcUrl } from 'forta-agent';

import { 
    DESTROYED_CONTRACT,
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
    UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI,
    UNI_CONTRACT_ADDRESS,
    UNI_TOKEN_ABI
} from './constants'

export class ContractUtils {

    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
    }

    public async isContractEmpty(address: string): Promise<boolean> {
        // query the contract code
        const contractCode = await this.provider.getCode(address);
        return contractCode == DESTROYED_CONTRACT;
    }

    public async proposalProp(proposalId: Number): Promise<any> {
        const governorBravoDelegator = new ethers.Contract(UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
            UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI, this.provider);
        const proposal = await governorBravoDelegator.proposals(proposalId);
        return proposal;
    }

    public async getPriorVotes(address: string, blockNumber: BigNumber): Promise<any> {
        const uniTokenContract = new ethers.Contract(UNI_CONTRACT_ADDRESS,
            UNI_TOKEN_ABI, this.provider);
        const votesCount = await uniTokenContract.getPriorVotes(address, blockNumber);
        return votesCount;
    }
    
}
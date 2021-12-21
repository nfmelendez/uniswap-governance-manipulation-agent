import { ethers } from 'ethers';
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

    public async proposalProp(proposalId: any): Promise<any> {
        const governorBravoDelegator = new ethers.Contract(UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ADDRESS,
            UNISWAP_GOVERNOR_BRAVO_DELEGATOR_ABI, this.provider);
        const proposal = await governorBravoDelegator.proposals(proposalId);
        return proposal;
    }
    
}
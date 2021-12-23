import { BigNumber } from '@ethersproject/bignumber';


export class TestUtils {

    createVoteCast(proposalId:string, voter:string, votes: Number) : any {
      const mockVoteCastLog = {
        args : {
          proposalId : proposalId,
          voter: voter,
          votes: BigNumber.from(votes)
        }
      }
        return mockVoteCastLog
    }
  
}

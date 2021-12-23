import agent from "./agent"

describe("Uniswap governance manipulation agent", () => {

  let handleTransaction: any;

  const mockTxEvent = {
    some: "event",
  } as any;

  const balanceIncreaseManipulationAgent = {
    handleTransaction: jest.fn(),
  } as any

  const balancedecreaseManipulationAgent = {
    handleTransaction: jest.fn(),
  } as any

  beforeAll(() => {
    handleTransaction = agent.provideHandleTransaction(
      balanceIncreaseManipulationAgent,
      balancedecreaseManipulationAgent
      );
  });

  beforeEach(() => {
    balanceIncreaseManipulationAgent.handleTransaction.mockReset();
    balancedecreaseManipulationAgent.handleTransaction.mockReset();
  });

  describe("handleTransaction", () => {
    it("invokes balnceIncreaseManipulationAgent and balanceDecreaseManipulation agents and returns their findings", async () => {
      const mockFinding = { some: "finding" };
      balanceIncreaseManipulationAgent.handleTransaction.mockReturnValueOnce([mockFinding]);
      balancedecreaseManipulationAgent.handleTransaction.mockReturnValueOnce([mockFinding]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([mockFinding, mockFinding]);
      expect(balanceIncreaseManipulationAgent.handleTransaction).toHaveBeenCalledTimes(1);
      expect(balanceIncreaseManipulationAgent.handleTransaction).toHaveBeenCalledWith(
        mockTxEvent
      );
      
      expect(balancedecreaseManipulationAgent.handleTransaction).toHaveBeenCalledTimes(1);
      expect(balancedecreaseManipulationAgent.handleTransaction).toHaveBeenCalledWith(
        mockTxEvent
      );
    });
  })
})

# Uniswap Governance Manipulation Agent

## Description

This agent detects manipulations in the uniswap governace protocol. It can detect when a voter has a significant vote increase, when there is a significant vote decrease and also when a newcomer shows up.

## Supported Chains

- Ethereum

## Alerts

- UNISWAP-GOV-PROPOSAL-MANIPULATION-1
  - Fired when a uniswap governance proposal is being manipulated. It detects when there is a significant change in the votes of an address 100 block prior to the start of the proposal at the moment of the vote cast
  - Severity is always set to "critical" as is manipulation of the protocol and will affect all the community
  - Type is always set to "Suspicious" as it may be a manipulation or real vote delegation
  - Metadata
    - `voter` address of the voter
    - `proposalId` Proposal being manipulated
    - `votetimesChange` Times the votes increased 100 blocks prior start of the proposal

- UNISWAP-GOV-PROPOSAL-MANIPULATION-2
  - Fired when an uniswap governance proposal is being manipulated. It detects when there is a newcomer to proposal at the moment of the vote cast. A newcomer is an user that didn't have votes 100 blocks prior to the proposal start but now it has
  - Severity is always set to "critical" as the newcomer can manipulate the result of the proposal.
  - Type is always set to "Suspicious" as someone who didn't have votes, suddenly it has.
    - `voter` address of the voter
    - `proposalId` Proposal being manipulated

- UNISWAP-GOV-PROPOSAL-MANIPULATION-3
  - Fired when an uniswap governance proposal is being manipulated. An user has a significant decrease of his vote numbers compared to 100 block before the vote cast.
  - Severity is always set to "high" as is a manipulation of the future of the protocol and impact all the community.
  - Type is always set to "Suspicious" as suddenly a voter decresed his number of votes
  - Metadata
    - `voter` address of the voter
    - `proposalId` Proposal being manipulated
    - `votesChangeRatePercent` change rate of the votes now compared to 100 blocks before the vote cast

## Test Data

The agent behaviour can be verified with the following transactions:
- UNISWAP-GOV-PROPOSAL-MANIPULATION-1
  1. Modify BLOCKS_BEFORE_PROPOSAL_START = 1264630 in constants.ts 
  2. forta-agent run --tx 0xd42c2a97d14d1faaf9037445bd5b0d117e9d077455ec188a9cca89239cbcc59e (throw UNISWAP-GOV-PROPOSAL-MANIPULATION-1)
- UNISWAP-GOV-PROPOSAL-MANIPULATION-2
  1. Modify BLOCKS_BEFORE_PROPOSAL_START = 1264630 in constants.ts 
  2. forta-agent run --tx 0x0a4a0a8888fba93c97aebe754981721190e2f4b30d3b42507c7620e343f5c0ef (throw UNISWAP-GOV-PROPOSAL-MANIPULATION-2)
  

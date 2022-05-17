# Introduction

NFTContract: Truffle Suite Minimal Setup

Setup
TokenBaseURI:  ipfs://__CID__/
ContractURI:   ipfs://__CID__/erc721.json
UnRevealedURI: ipfs://__CID__/erc721-preview.json

Contract Address
0x0000000000000000000000000000000000000000

Token Address
0x0000000000000000000000000000000000000000

## Installation
1. Replace NFTContract to your desired NFT name.
2. Upload your meta and images to ipfs.
3. Run migrations.

## Commands
---
a. Running migration to a network.

```sh
yarn migrate:[mainnet, rinkeby, development]
```

b. Running tests.

```sh
yarn contract:test
```

c. Check contract size for optimization.

```sh
yarn contract:size
```

d. Verify the contract after publishing in etherscan.

```sh
yarn verify:[mainnet, rinkeby]
```

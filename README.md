
# Introduction

## NFTContract: Truffle Suite Minimal Setup

**Contract Setup:**
Params        | Value
--------------| ----------------------------------
TokenBaseURI  | ipfs://CID/
ContractURI   | ipfs://CID/erc721.json
UnRevealedURI | ipfs://CID/erc721-preview.json

**Token Addresses:**
Network     | Migration                                  | NFTContract
------------| -------------------------------------------| ------------------------------------------
Mainnet     | 0x0000000000000000000000000000000000000000 | 0x0000000000000000000000000000000000000000
Rinkeby     | 0x0000000000000000000000000000000000000000 | 0x0000000000000000000000000000000000000000
Development | 0x0000000000000000000000000000000000000000 | 0x0000000000000000000000000000000000000000


## Installation
1. Replace NFTContract to your desired NFT name.
2. Upload your meta and images to ipfs.
3. Run migrations.

## Commands
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

require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require('web3');
const fs = require('fs');
const path = require('path');
const MerkleTree = require('merkletreejs');
const keccak256 = require('keccak256');

const INFURA_KEY = process.env.INFURA_KEY;
const NETWORK = process.env.NETWORK;

const MNEMONIC = process.env.MNEMONIC;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

if (!INFURA_KEY || !MNEMONIC || !OWNER_ADDRESS || !NFT_CONTRACT_ADDRESS) {
  console.error('Please set a infura key, mnemonic, owner address, and contract address.');
  return;
}

const whitelistAddresses = require('./whitelistAddresses.json');
const leafNode = whitelistAddresses.map(addr => keccak256(addr));
const treeNode = new MerkleTree(leafNode, keccak256, { sort: true });

const hexRoot = treeNode.getHexRoot();
console.log('Root: ' + hexRoot + '');

whitelistAddresses.foreach((addr) => {
  let leaf = keccak256(addr);
  console.log('Leaf: ' + leaf + ' -> Proof: ' + treeNode.getHexProof(leaf) + '');
});

let rawData = fs.readFileSync(path.resolve(__dirname, '../build/contracts/NFTContractWhitelist.json'));
let contractABI = JSON.parse(rawData);
const NFT_ABI = contractABI.abi;

async function main() {
  try
  {
    let providerURL = '';

    if (NETWORK == 'development') {
      providerURL = 'http://127.0.0.1:7545';
    } else {
      providerURL = 'wss://' + NETWORK + '.infura.io/ws/v3/' + INFURA_KEY + '';
    }

    const provider = new HDWalletProvider(MNEMONIC, providerURL);
    const web3Instance = new web3(provider);

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
    );

    const result = await nftContract.methods.setMerkleRoot(hexRoot).send({from: OWNER_ADDRESS});
    console.log('Set Merkle Tree Root. Transaction: ' + result.transactionHash);
  } catch (e) {
    console.log(e);
  }
}

main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

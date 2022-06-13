require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require('web3');
const fs = require('fs');
const path = require('path');

const INFURA_KEY = process.env.INFURA_KEY;
const NETWORK = process.env.NETWORK;

const MNEMONIC = process.env.MNEMONIC;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

if (!INFURA_KEY || !MNEMONIC || !OWNER_ADDRESS || !NFT_CONTRACT_ADDRESS) {
  console.error('Please set a infura key, mnemonic, owner address, and contract address.');
  return;
}

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
    const tokenQuantity = 2;
    const msgValue = tokenQuantity * web3.utils.toWei('0.02', 'ether');
    const merkleProof = '';

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
    );

    const result = await nftContract.methods.whitelistMint(tokenQuantity, merkleProof)
      .send({
        from: OWNER_ADDRESS,
        value: msgValue
      });

    console.log('Minted NFT from the whitelists. Transaction: ' + result.transactionHash);
  } catch (e) {
    console.log(e);
  }
}

main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require('web3');
const opensea = require('opensea-js');
const OpenSeaPort = opensea.OpenSeaPort;

const INFURA_KEY = process.env.INFURA_KEY;
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const NETWORK = process.env.NETWORK;

const MNEMONIC = process.env.MNEMONIC;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

if (!INFURA_KEY || !OPENSEA_API_KEY || !MNEMONIC || !OWNER_ADDRESS || !NFT_CONTRACT_ADDRESS) {
  console.error('Please set a infura key, opensea api key, mnemonic, owner address, and contract address.');
  return;
}

async function main() {
  try
  {
    let RPC = '';

    if (NETWORK == 'development') {
      RPC = 'http://127.0.0.1:7545';
    } else {
      RPC = 'wss://' + NETWORK + '.infura.io/ws/v3/' + INFURA_KEY + '';
    }

    const provider = new HDWalletProvider(MNEMONIC, RPC);
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24 * 30);
    const DESTINATION_ADDRESS = '';

    const seaport = new OpenSeaPort(provider, {
      networkName: NETWORK,
      apiKey: OPENSEA_API_KEY,
    })

    const result = await seaport.transfer({
      asset: {
        tokenId: 1,
        tokenAddress: NFT_CONTRACT_ADDRESS,
      },
      OWNER_ADDRESS,
      DESTINATION_ADDRESS
    });

    console.log('Successfully transferred token!');
  } catch (e) {
    console.log(e);
  }
}

main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


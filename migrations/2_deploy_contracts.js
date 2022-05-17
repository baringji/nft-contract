const NFTContract = artifacts.require('NFTContract');

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(
    NFTContract,
    'ipfs://__CID__/',
    'ipfs://__CID__/erc721.json',
    'ipfs://__CID__/erc721-preview.json'
  );
};


const NFTContractWhitelist = artifacts.require('NFTContractWhitelist');

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(
    NFTContractWhitelist,
    'ipfs://__CID__/',
    'ipfs://__CID__/erc721.json',
    'ipfs://__CID__/erc721-preview.json'
  );
};


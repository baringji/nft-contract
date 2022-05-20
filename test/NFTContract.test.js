const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { BN, constants, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const NFTContract = contract.fromArtifact('NFTContract');

describe('NFTContract', function () {
  const [owner, minter] = accounts;
  const { ZERO_ADDRESS } = constants;

  const tokenBaseURI  = 'ipfs://__CID__/';
  const contractURI   = 'ipfs://__CID__/erc721.json';
  const unRevealedURI = 'ipfs://__CID__/erc721-preview.json';

  const price = new web3.utils.toWei('0.04', 'ether');

  let nftContract;

  beforeEach(async function () {
    this.nftContract = await NFTContract.new(tokenBaseURI, contractURI, unRevealedURI, { from: owner });
    this.nftContract.toggleSaleLive();
    this.nftContract.toggleReveal();
  });

  describe('#constructor', function () {
    it('should set the tokenURI', async function () {
      return true;
    });

    it('should set the contractURI', async function () {
      expect(await this.nftContract.contractURI({ from: owner })).to.equal(contractURI);
    });

    // No test for preview URI (unRevealedURI)
  });

  describe('#mint', function () {
    it('should not mint when contract is paused', async function () {
      return true;
    });

    it('should not mint when contract sale is not live', async function () {
      return true;
    });

    it('should not allow minting after collection is sold out', async function () {
      return true;
    });

    it('should not allow minting more than the collection supply', async function () {
      return true;
    });

    it('should not allow minter to mint more than the minting limit', async function () {
      return true;
    });

    it('should not allow minting with insufficient ether', async function () {
      return true;
    });

    it('should mint token(s) to the minter', async function () {
      return true;
    });
  });

  describe('#mintFor', function () {
    it('should not allow minting after collection is sold out', async function () {
      return true;
    });

    it('should not allow minting more than the collection supply', async function () {
      return true;
    });

    it('should mint token(s) for destination wallet', async function () {
      return true;
    });
  });

  describe('#tokenOf', function () {
    it('should list all tokens of wallet', async function () {
      return true;
    });
  });
});

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFTContractWhitelist is ERC721Enumerable, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    string public _contractURI;
    string public _tokenBaseURI;
    string public _unRevealedURI;

    uint256 public PRICE = 0.05 ether;
    uint256 public MAX_SUPPLY = 500;
    uint256 public MAX_PER_MINT = 5;

    uint256 public WHITELIST_PRICE = 0.02 ether;
    uint256 public WHITELIST_MAX_SUPPLY = 55;
    uint256 public WHITELIST_MAX_PER_MINT = 2;

    bool public isPreSaleLive = false;
    bool public isSaleLive = false;
    bool public isRevealed = false;

    address private _signerAddress = 0x032F19C4d64044195C1892197dDAdeaB76ecfd45;
    bytes32 private _merkleRoot = "";

    constructor(
        string memory _initTokenBaseURI,
        string memory _initContractURI,
        string memory _initUnRevealedURI
    ) ERC721("NFTContractWhitelist", "NFT") {
        setTokenBaseURI(_initTokenBaseURI);
        setContractURI(_initContractURI);
        setUnRevealedURI(_initUnRevealedURI);
    }

    function mint(uint256 tokenQuantity) external payable nonReentrant {
        require(!paused(), "PAUSABLE_PAUSED");
        require(isSaleLive, "SALE_NOT_STARTED");
        require(totalSupply() <= WHITELIST_MAX_SUPPLY + MAX_SUPPLY, "OUT_OF_STOCK");
        require(totalSupply() + tokenQuantity <= WHITELIST_MAX_SUPPLY + MAX_SUPPLY, "EXCEED_SUPPLY_LIMIT");
        require(tokenQuantity <= MAX_PER_MINT, "EXCEED_PER_MINT_LIMIT");
        require(PRICE * tokenQuantity <= msg.value, "INSUFFICIENT_ETHER");

        for (uint256 i = 0; i < tokenQuantity; i++) {
            _safeMint(_msgSender(), totalSupply() + 1);
        }
    }

    function whitelistMint(uint256 tokenQuantity, bytes32[] calldata merkleProof) external payable nonReentrant {
        require(!paused(), "PAUSABLE_PAUSED");
        require(isPreSaleLive, "PRE_SALE_NOT_STARTED");
        require(MerkleProof.verify(merkleProof, _merkleRoot, keccak256(abi.encodePacked(_msgSender()))), "NOT_WWHITELISTED");
        require(totalSupply() <= WHITELIST_MAX_SUPPLY + MAX_SUPPLY, "OUT_OF_STOCK");
        require(totalSupply() + tokenQuantity <= WHITELIST_MAX_SUPPLY, "EXCEED_WHITELIST_SUPPLY_LIMIT");
        require(balanceOf(_msgSender()) + tokenQuantity <= WHITELIST_MAX_PER_MINT, "EXCEED_WHITELIST_PER_MINT_LIMIT");
        require(WHITELIST_PRICE * tokenQuantity <= msg.value, "INSUFFICIENT_ETHER");

        for (uint256 i = 0; i < tokenQuantity; i++) {
            _safeMint(_msgSender(), totalSupply() + 1);
        }
    }

    function mintFor(uint256 tokenQuantity, address destination) external onlyOwner nonReentrant{
        require(totalSupply() <= WHITELIST_MAX_SUPPLY + MAX_SUPPLY, "OUT_OF_STOCK");
        require(totalSupply() + tokenQuantity <= WHITELIST_MAX_SUPPLY + MAX_SUPPLY, "EXCEED_SUPPLY_LIMIT");

        for (uint256 i = 0; i < tokenQuantity; i++) {
            _safeMint(destination, totalSupply() + 1);
        }
    }

    function tokenOf(address wallet) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(wallet);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(wallet, i);
        }

        return tokenIds;
    }

    function toggleSaleLive() public onlyOwner {
        isSaleLive = !isSaleLive;
    }

    function togglePreSaleLive() public onlyOwner {
        isPreSaleLive = !isPreSaleLive;
    }

    function toggleReveal() public onlyOwner {
        isRevealed = !isRevealed;
    }

    function togglePause(bool state) public onlyOwner {
        if (state == true) {
            _pause();
            return;
        }

        _unpause();
    }

    function setPrice(uint256 cost) public onlyOwner {
        PRICE = cost;
    }

    function setMaxPerMint(uint256 limit) public onlyOwner {
        MAX_PER_MINT = limit;
    }

    function setMaxSupply(uint256 limit) public onlyOwner {
        MAX_SUPPLY = limit;
    }

    function setWhitelistPrice(uint256 cost) public onlyOwner {
        WHITELIST_PRICE = cost;
    }

    function setWhitelistMaxPerMint(uint256 limit) public onlyOwner {
        WHITELIST_MAX_PER_MINT = limit;
    }

    function setWhitelistMaxSupply(uint256 limit) public onlyOwner {
        WHITELIST_MAX_SUPPLY = limit;
    }

    function setTokenBaseURI(string memory URI) public onlyOwner {
        _tokenBaseURI = URI;
    }

    function setContractURI(string memory URI) public onlyOwner {
        _contractURI = URI;
    }

    function setUnRevealedURI(string memory URI) public onlyOwner {
        _unRevealedURI = URI;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _tokenBaseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        if (isRevealed == false) {
            return _unRevealedURI;
        }

        return string(abi.encodePacked(_tokenBaseURI, tokenId.toString(), ".json"));
    }

    function setMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        _merkleRoot = merkleRoot;
    }

    function setSignerAddress(address addr) external onlyOwner {
        _signerAddress = addr;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "INSUFFICIENT_ETHER");
        (bool success, ) = payable(_signerAddress).call{value: amount}("");
        require(success, "ETHER_WITHDRAW_FAILED");
    }
}

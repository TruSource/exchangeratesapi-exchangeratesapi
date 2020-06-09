pragma solidity ^0.5.0;

/**
 * @title Oracles contract address resolver
 * @author TruSource
 * @dev Oracles contract address resolver
 */
contract Resolver {
    address private oracle;
    address private owner;

    constructor(address oracleAddress) public {
        owner = msg.sender;
        oracle = oracleAddress;
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }

    /**
     * @dev sets oracle contract address
     * @param oracleAddress oracle contract address
     */
    function setOracleAddress(address oracleAddress) external onlyOwner {
        oracle = oracleAddress;
    }

    /**
     * @dev gets oracle contract address
     * @return address oracle contract address
     */
    function getOracleAddress() external view returns(address) {
        return oracle;
    }
}

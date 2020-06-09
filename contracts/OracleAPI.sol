pragma solidity ^0.5.0;

import "@trusource/solidity-cbor/contracts/CBOR.sol";
import "./Resolver.sol" as Resolver;
import "./Oracle.sol" as Oracle;

/**
 * @title API for Oracle contract
 * @author TruSource
 * @dev API for Oracle contract
 */
contract OracleAPI {
    uint256 internal constant DEFAULT_BUFFER_SIZE = 256;
    using CBOR for Buffer.buffer;

    // keep track of queries that did not get a response yet
    mapping(bytes32 => bool) internal remainingQueries;

    Resolver.Resolver private resolver;
    Oracle.Oracle private oracle;
    address private owner;

    constructor(address resolverAddress) public {
        owner = msg.sender;
        resolver = Resolver.Resolver(resolverAddress);
        oracle = Oracle.Oracle(resolver.getOracleAddress());
    }

    modifier checkAddress() {
        require(
            msg.sender == callback_address(),
            "Only address that deployed the oracle can call this contract back"
        );
        _;
    }

    modifier checkQueryId(bytes32 queryId) {
        require(
            remainingQueries[queryId],
            "Id is not one of a remaining query (query never existed or already fulfilled)"
        );

        // remove query from list of unfulfilled queries
        remainingQueries[queryId] = false;

        _;
    }

    modifier setOracle {
        oracle = Oracle.Oracle(resolver.getOracleAddress());
        _;
    }

    /**
     * @dev get callback address
     * @return address Oracle owner address
     */
    function callback_address() internal view returns (address) {
        return oracle.getOwner();
    }

    /**
     * @dev getHistory
     * @return queryId unique id for query
     */
    function trusource_getHistory() internal returns (bytes32) {
        return trusource_getHistory("");
    }
    
    /**
     * @dev getHistory
     * @param options options string
     * @return queryId unique id for query
     */
    function trusource_getHistory(string memory options) internal setOracle returns (bytes32) {
        bytes32 queryId = oracle.getHistory("", options);
    
        // add query to list of unfulfilled queries
        remainingQueries[queryId] = true;
    
        return queryId;
    }

    /**
     * @dev getHistory
     * @param optionalQueryParams encoded query parameters buffer
     * @return queryId unique id for query
     */
    function trusource_getHistory(Buffer.buffer memory optionalQueryParams) internal returns (bytes32) {
        return trusource_getHistory(optionalQueryParams, "");
    }

    /**
     * @dev getHistory
     * @param optionalQueryParams encoded query parameters buffer
     * @param options options string
     * @return queryId unique id for query
     */
    function trusource_getHistory(Buffer.buffer memory optionalQueryParams, string memory options) internal setOracle returns (bytes32) {
        bytes32 queryId = oracle.getHistory(optionalQueryParams.buf, options);
    
        // add query to list of unfulfilled queries
        remainingQueries[queryId] = true;
    
        return queryId;
    }

    /**
     * @dev getLatest
     * @return queryId unique id for query
     */
    function trusource_getLatest() internal returns (bytes32) {
        return trusource_getLatest("");
    }
    
    /**
     * @dev getLatest
     * @param options options string
     * @return queryId unique id for query
     */
    function trusource_getLatest(string memory options) internal setOracle returns (bytes32) {
        bytes32 queryId = oracle.getLatest("", options);
    
        // add query to list of unfulfilled queries
        remainingQueries[queryId] = true;
    
        return queryId;
    }

    /**
     * @dev getLatest
     * @param optionalQueryParams encoded query parameters buffer
     * @return queryId unique id for query
     */
    function trusource_getLatest(Buffer.buffer memory optionalQueryParams) internal returns (bytes32) {
        return trusource_getLatest(optionalQueryParams, "");
    }

    /**
     * @dev getLatest
     * @param optionalQueryParams encoded query parameters buffer
     * @param options options string
     * @return queryId unique id for query
     */
    function trusource_getLatest(Buffer.buffer memory optionalQueryParams, string memory options) internal setOracle returns (bytes32) {
        bytes32 queryId = oracle.getLatest(optionalQueryParams.buf, options);
    
        // add query to list of unfulfilled queries
        remainingQueries[queryId] = true;
    
        return queryId;
    }


    /**
      * @dev trusource_callback abstract function
      * @param queryId unique id for query
      * @param operationId id for operation
      * @param statusCode HTTP response status code
      * @param result query result
      */
    function trusource_callback(
        bytes32 queryId,
        Oracle.Oracle.Operations operationId,
        uint256 statusCode,
        string calldata result
    ) external;

    /**
      * @dev initialises buffer
      * @return Buffer.buffer
      */
    function createBuffer() internal pure returns (Buffer.buffer memory) {
        Buffer.buffer memory buf;
        Buffer.init(buf, DEFAULT_BUFFER_SIZE);
        return buf;
    }
    
    /**
      * @dev Adds key value pair to buffer
      * @param params buffer that is added
      * @param key key value
      * @param value value
      */
    function addString(Buffer.buffer memory params, string memory key, string memory value) internal pure {
        params.encodeString(key);
        params.encodeString(value);
    }
    
    /**
      * @dev Adds key value pair to buffer
      * @param params buffer that is added
      * @param key key value
      * @param value value
      */
    function addUInt(Buffer.buffer memory params, string memory key, uint256 value) internal pure {
        params.encodeString(key);
        params.encodeUInt(value);
    }

    /**
      * @dev Parses string as a uint
      * @param str string representation of uint
      * @return parsedInt integer
      */
    function parseInt(string memory str) internal pure returns (uint256 parsedInt) {
        bytes memory bstr = bytes(str);
        uint256 mint = 0;
        bool decimals = false;
        for (uint256 i = 0; i < bstr.length; i++) {
            if (
                (uint256(uint8(bstr[i])) >= 48) &&
                (uint256(uint8(bstr[i])) <= 57)
            ) {
                if (decimals) {
                    break;
                }
                mint *= 10;
                mint += uint256(uint8(bstr[i])) - 48;
            } else if (uint256(uint8(bstr[i])) == 46) {
                decimals = true;
            }
        }
        return mint;
    }}

pragma solidity ^0.5.0;

import "./OracleAPI.sol";

/**
 * @title Example contract using exchangeratesapi oracle
 * @author TruSource
 * @notice Example contract using exchangeratesapi oracle
 * @dev Demonstrates usage of OracleAPI and building queryParams
 */
contract Example is OracleAPI {
    event LogResult(bytes32 queryId, Oracle.Oracle.Operations operationId, uint256 statusCode, string result);

    constructor(address resolverAddress) public OracleAPI(resolverAddress) {}

    /**
     * @notice Make getHistory query
     * @dev Make getHistory query, queryId is returned to be used to handle query result
     */
    function getHistory() external {
        Buffer.buffer memory optionalQueryParams = createBuffer();
    
        // Optional
        addString(optionalQueryParams, "end_at", "2018-09-01");
        addString(optionalQueryParams, "start_at", "2018-01-01");
        addString(optionalQueryParams, "symbols", "ILS,JPY");
    
        trusource_getHistory(optionalQueryParams);
    }

    /**
     * @notice Make getLatest query
     * @dev Make getLatest query, queryId is returned to be used to handle query result
     */
    function getLatest() external {
        Buffer.buffer memory optionalQueryParams = createBuffer();
    
        // Optional
        addString(optionalQueryParams, "symbols", "USD,GBP");
    
        trusource_getLatest(optionalQueryParams);
    }

    /**
     * @dev Handle query result using queryId, operationId and statusCode
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
    ) external checkAddress checkQueryId(queryId) {
        if (operationId == Oracle.Oracle.Operations.getHistory) {
            emit LogResult(queryId, operationId, statusCode, result);
            return;
        }

        if (operationId == Oracle.Oracle.Operations.getLatest) {
            emit LogResult(queryId, operationId, statusCode, result);
            return;
        }
    }
}

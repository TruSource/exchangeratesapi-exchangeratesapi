const Oracle = artifacts.require("Oracle");
const Example = artifacts.require("Example");
const cbor = require("cbor");
const truffleAssert = require("truffle-assertions");

const { decodeRawLog } = require("./utils/helpers.js");

// EACH TEST NEED TO BE GENERATED FOR EACH SOURCE
contract("Example (End to End tests)", async accounts => {
  // accounts[0] is the address that deployed the contracts (especially the oracle contract)
  let ownerAddress, otherAccountAddress;
  let serverResponse;
  let oracleInstance, exampleInstance;
  let OPERATIONS;
  let statusCode;
  let queryId;

  // before hook is run before all tests
  before(async () => {
    ownerAddress = accounts[0];
    otherAccountAddress = accounts[1];
    serverResponse = "placeholder response";

    oracleInstance = await Oracle.deployed();
    exampleInstance = await Example.deployed();

    OPERATIONS = {
      getHistory: 0,
      getLatest: 1
    };

    statusCode = 200;
  });

  describe("getHistory operation", () => {
    it("Query getHistory should succeed", async () => {
      await truffleAssert.passes(
        exampleInstance.getHistory({
          from: ownerAddress
        })
      );
    });

    it("Callback for getHistory should fail if not called by address that deployed the oracle contract", async () => {
      const result = await exampleInstance.getHistory();
      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      await truffleAssert.reverts(
        exampleInstance.trusource_callback.call(
          queryId,
          OPERATIONS.getHistory,
          statusCode,
          serverResponse,
          {
            from: otherAccountAddress
          }
        ),
        "Only address that deployed the oracle can call this contract back"
      );
    });

    it("Callback for getHistory should succeed if called by address that deployed the oracle contract", async () => {
      let result = await exampleInstance.getHistory();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      await truffleAssert.passes(
        exampleInstance.trusource_callback(
          queryId,
          OPERATIONS.getHistory,
          statusCode,
          serverResponse,
          {
            from: ownerAddress
          }
        )
      );
    });

    it("Callback for getHistory should fail if query is already fulfilled", async () => {
      await truffleAssert.reverts(
        exampleInstance.trusource_callback.call(
          queryId,
          OPERATIONS.getHistory,
          statusCode,
          serverResponse,
          {
            from: ownerAddress
          }
        ),
        "Id is not one of a remaining query (query never existed or already fulfilled)"
      );
    });

    // EVENTS
    it("(Event) Log event should be emitted when the getHistory function is called", async () => {
      const exampleTxObj = await exampleInstance.getHistory();
      // Example.sol makes a contract call to Oracle.sol where the event is emitted, oracle tx result needed
      const oracleTxObj = await truffleAssert.createTransactionResult(oracleInstance, exampleTxObj.tx);

      // check if Log event is emitted by Oracle.sol
      truffleAssert.eventEmitted(oracleTxObj, "Log");
    });

    it("(Event) Result event should be emitted when getHistory callback function is called", async () => {
      let result = await exampleInstance.getHistory();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      const tx = await exampleInstance.trusource_callback(
        queryId,
        OPERATIONS.getHistory,
        statusCode,
        serverResponse,
        {
          from: ownerAddress
        }
      );

      truffleAssert.eventEmitted(tx, "LogResult");
    });

    it("(Event) Event queryParams should be generated correctly for getHistory function", async () => {
      let result = await exampleInstance.getHistory();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      const encodedBuf = Buffer.from(
        decodedRawLogs.queryParams.slice(2),
        "hex"
      );

      const queryParams = await cbor.decodeAll(encodedBuf);
      assert.deepEqual(
        queryParams,
        ["end_at", "2018-09-01", "start_at", "2018-01-01", "symbols", "ILS,JPY"],
        "Event not emitted or incorrect queryParams"
      );
    });

  });

  describe("getLatest operation", () => {
    it("Query getLatest should succeed", async () => {
      await truffleAssert.passes(
        exampleInstance.getLatest({
          from: ownerAddress
        })
      );
    });

    it("Callback for getLatest should fail if not called by address that deployed the oracle contract", async () => {
      const result = await exampleInstance.getLatest();
      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      await truffleAssert.reverts(
        exampleInstance.trusource_callback.call(
          queryId,
          OPERATIONS.getLatest,
          statusCode,
          serverResponse,
          {
            from: otherAccountAddress
          }
        ),
        "Only address that deployed the oracle can call this contract back"
      );
    });

    it("Callback for getLatest should succeed if called by address that deployed the oracle contract", async () => {
      let result = await exampleInstance.getLatest();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      await truffleAssert.passes(
        exampleInstance.trusource_callback(
          queryId,
          OPERATIONS.getLatest,
          statusCode,
          serverResponse,
          {
            from: ownerAddress
          }
        )
      );
    });

    it("Callback for getLatest should fail if query is already fulfilled", async () => {
      await truffleAssert.reverts(
        exampleInstance.trusource_callback.call(
          queryId,
          OPERATIONS.getLatest,
          statusCode,
          serverResponse,
          {
            from: ownerAddress
          }
        ),
        "Id is not one of a remaining query (query never existed or already fulfilled)"
      );
    });

    // EVENTS
    it("(Event) Log event should be emitted when the getLatest function is called", async () => {
      const exampleTxObj = await exampleInstance.getLatest();
      // Example.sol makes a contract call to Oracle.sol where the event is emitted, oracle tx result needed
      const oracleTxObj = await truffleAssert.createTransactionResult(oracleInstance, exampleTxObj.tx);

      // check if Log event is emitted by Oracle.sol
      truffleAssert.eventEmitted(oracleTxObj, "Log");
    });

    it("(Event) Result event should be emitted when getLatest callback function is called", async () => {
      let result = await exampleInstance.getLatest();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      queryId = decodedRawLogs.queryId;

      const tx = await exampleInstance.trusource_callback(
        queryId,
        OPERATIONS.getLatest,
        statusCode,
        serverResponse,
        {
          from: ownerAddress
        }
      );

      truffleAssert.eventEmitted(tx, "LogResult");
    });

    it("(Event) Event queryParams should be generated correctly for getLatest function", async () => {
      let result = await exampleInstance.getLatest();

      const decodedRawLogs = decodeRawLog(oracleInstance, "Log", result);
      const encodedBuf = Buffer.from(
        decodedRawLogs.queryParams.slice(2),
        "hex"
      );

      const queryParams = await cbor.decodeAll(encodedBuf);
      assert.deepEqual(
        queryParams,
        ["symbols", "USD,GBP"],
        "Event not emitted or incorrect queryParams"
      );
    });

  });
});

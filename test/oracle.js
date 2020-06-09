const Oracle = artifacts.require("Oracle");
const cbor = require("cbor");
const truffleAssert = require("truffle-assertions");

contract("Oracle (Query) - getHistory", async accounts => {
  // Note: use .call() where not necessary to use a transaction
  let oracleInstance;
  let contractAddress;
  let encodedQueryParams;
  
  let options;

  // before hook is run before all tests
  before(async () => {
    oracleInstance = await Oracle.deployed();

    encodedQueryParams = cbor.encode(["end_at", "2018-09-01", "start_at", "2018-01-01", "symbols", "ILS,JPY"]);


    options = "";

    // Note: does not matter that its an account address - we just need an address to test with
    contractAddress = accounts[2];
  });

  it("Query should succeed and event should be emitted", async () => {
    const tx = await oracleInstance.getHistory(
      
      encodedQueryParams,
      options,
      {
        from: contractAddress
      }
    );

    truffleAssert.eventEmitted(tx, "Log");
  });
});

contract("Oracle (Query) - getLatest", async accounts => {
  // Note: use .call() where not necessary to use a transaction
  let oracleInstance;
  let contractAddress;
  let encodedQueryParams;
  
  let options;

  // before hook is run before all tests
  before(async () => {
    oracleInstance = await Oracle.deployed();

    encodedQueryParams = cbor.encode(["symbols", "USD,GBP"]);


    options = "";

    // Note: does not matter that its an account address - we just need an address to test with
    contractAddress = accounts[2];
  });

  it("Query should succeed and event should be emitted", async () => {
    const tx = await oracleInstance.getLatest(
      
      encodedQueryParams,
      options,
      {
        from: contractAddress
      }
    );

    truffleAssert.eventEmitted(tx, "Log");
  });
});

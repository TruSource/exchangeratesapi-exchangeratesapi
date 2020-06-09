const Resolver = artifacts.require("Resolver");
const Oracle = artifacts.require("Oracle");
const truffleAssert = require("truffle-assertions");

contract("Resolver", async accounts => {
  let resolverInstance;
  let oracleInstance;

  // before hook is run before all tests
  before(async () => {
    resolverInstance = await Resolver.deployed();
    oracleInstance = await Oracle.deployed();

    ownerAddress = accounts[0];
    otherAccountAddress = accounts[1];
    contractAddress = accounts[2];
  });

  it("Resolver should return correct oracle address (oracle address has been set in migrations)", async () => {
    let returnedAddress = await resolverInstance.getOracleAddress();
    assert.equal(
      returnedAddress,
      oracleInstance.address,
      "Address returned should match oracle address"
    );
  });

  it("Setting oracle address should fail if not owner", async () => {
    await truffleAssert.reverts(
      resolverInstance.setOracleAddress(contractAddress, {
        from: otherAccountAddress
      }),
      "Only owner can call this function."
    );
  });

  it("Setting oracle address should succeed if owner", async () => {
    await truffleAssert.passes(
      resolverInstance.setOracleAddress(contractAddress, {
        from: ownerAddress
      })
    );
  });
});

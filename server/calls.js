// In order for external scripts to be run correctly, Truffle expects them to export a function that takes a single parameter as a callback:
// You can do anything you'd like within this script, so long as the callback is called when the script finishes.

// See https://www.trufflesuite.com/docs/truffle/getting-started/writing-external-scripts for more details.

'use strict';

const Example = artifacts.require('Example');

const getNetwork = () => {
  const scriptArgs = process.argv;
  const networkFlagPosition = scriptArgs.findIndex((arg) => arg === '--network');

  // if no network provided, default to development
  const network = networkFlagPosition > 1 && scriptArgs[networkFlagPosition + 1] ? scriptArgs[networkFlagPosition + 1] : 'development';
  return network;
};

module.exports = async (callback) => {
  try {
    const network = getNetwork();
    const exampleInstance = await Example.deployed();

    console.log(`About to make calls to Example contract (address: ${exampleInstance.address})`);
    if (network === 'development') console.log('Make sure the local server is running (npm run server) to see result of calls.');
    if (network === 'ropsten') console.log(`Make sure you whitelist the Example contract address (${exampleInstance.address})`);
    let numEvents = 0;

    // array of test calls
    const methods = [
      "getHistory",
      "getLatest",
    ];

    // Call functions in example contract
    for (const method of methods) {
      console.log(`Calling: exampleInstance.${method}()`);
      const result = await exampleInstance[method]();
      console.log(`Success - Tx hash: ${result.tx}\n`);
    }

    // Subscribe to LogResult events - this requires Eth client with WebSockets enabled
    exampleInstance.LogResult((error, event) => {
      if (error) { callback(error); }

      const {
        queryId, operationId, statusCode, result,
      } = event.args;
      console.log(`
Got a result event!
queryId: ${queryId}
operationId: ${operationId}
Response - status: ${statusCode} | content: ${result}`);

      numEvents++;
      if (numEvents === methods.length) callback();
    });
  } catch (err) {
    callback(err);
  }
};

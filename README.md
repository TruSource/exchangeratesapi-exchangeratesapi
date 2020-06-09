# exchangeratesapi Oracle

Truffle Box for exchangeratesapi API generated using [TruSource](https://app.trusource.io). 

The project includes an example contract that implements the exchangeratesapi OracleAPI, demonstrating its use along with a local listening server. You are encouraged to replace `Example.sol` with you own contract that inherits `OracleAPI.sol`, uses its operations and implements the `trusource_callback`.

For more details, please see the [docs](https://docs.trusource.io/exchangeratesapi-exchangeratesapi).

## Requirements

* Node.js v8.9.4 (required) / v10.5.0+ (recommended)

## Installation

Ensure you are in a new and empty directory.

1. Run the `unbox` command via `npx`. This will install all necessary dependencies.

   ```javascript
   npx truffle unbox TruSource/exchangeratesapi-exchangeratesapi
   ```

2. Alternatively, you can install Truffle globally and run the `unbox` command.

   ```javascript
   npm i -g truffle
   truffle unbox TruSource/exchangeratesapi-exchangeratesapi
   ```

3. You could also download this repository and install the dependencies yourself.

   ```javascript
   git clone https://github.com/TruSource/exchangeratesapi-exchangeratesapi
   cd exchangeratesapi-exchangeratesapi
   npm i
   ```

## Development

### Local
1. Start an Ethereum client. We will use `ganache-cli`.

   ```javascript
   npx ganache-cli
   ```

   Note: the client needs to support WebSockets (do not use `truffle develop` for this reason).

   For other options, see [Truffle - Choosing an Ethereum client](https://www.trufflesuite.com/docs/truffle/reference/choosing-an-ethereum-client).

2. Migrate the smart contracts.

   ```javascript
   // in a 2nd terminal (i.e. not in the eth client terminal)
   truffle migrate
   ```

3. Start the TruSource local server. It will listen for events, fetch and return data to requesting contracts.

   ```javascript
   // in a 3rd terminal
   npm start
   ```

4. Using the provided Truffle script `./server/calls.js`, call functions in `Example.sol`. This will execute a set of contracts calls, testing each operation with provided example arguments.

   ```javascript
   // in another terminal (i.e. not in eth client or server terminals)
   truffle exec server/calls.js
   ```

### Remote
<!-- TODO: add list of supported networks somewhere? -->
Trusource currently supports the [Ropsten test network](https://ropsten.etherscan.io) (see list of supported networks here).

To deploy to a live network (e.g. Ropsten):

1. Uncomment line 4 to 12 in `truffle-config.js`.

2. Set the `SEED_PHRASE` (mnemonic) and `ETHEREUM_RPC_URL` environment variables in `.env`.

3. Migrate the contracts.

   ```javascript
   truffle migrate --network ropsten
   ```

<!-- TODO: in this case the Example.sol contract -->
4. Whitelist the contract that will call the exchangeratesapi API at [Trusource.io](https://app.trusource.io).

## Folder structure

The structure is similar to a standard [Truffle project](https://www.trufflesuite.com/docs/truffle/getting-started/creating-a-project). The difference is the additional server directory.

    ├── build                   # Compiled files
    ├── contracts               # Solidity contracts
    ├── migrations              # Deployment files
    ├── server                  # Local server test script
    ├── test                    # Test files for testing contracts
    ├── .env.template
    ├── .solhint.json
    ├── package.json
    ├── LICENSE
    ├── README.md
    ├── .truffle-box.json
    └── truffle.config.js       # Truffle configuration file

### contracts

`Example.sol` inherits the exchangeratesapi OracleAPI and demonstrates usage of its operations. `OracleAPI.sol`, `Oracle.sol`, and `Resolver.sol` make up the oracle architecture and must be unchanged.

See [here](https://github.com/TruSource/exchangeratesapi-exchangeratesapi/blob/master/contracts/README.md) for more details.

### server

`calls.js` runs a set of example calls on `Example.sol`, see [Local Development](#local-development) for instructions. 
`oas.json` is the OpenAPI specification of the exchangeratesapi API used by the local server, it must remain unchanged. If it is lost or changed, it can be found [here](https://docs.trusource.io/).  

See [here](https://github.com/TruSource/exchangeratesapi-exchangeratesapi/tree/master/server/README.md) for more details.

### test

Tests are written in JavaScript and ensure contract calls execute without failure, events are correctly emitted and the callback is implemented.

### .env.template

   ```javascript
   cp .env.template .env
   ```

## Testing

Truffle can run tests written in Solidity or JavaScript against your smart contracts.
Note that an Ethereum client must be running.

   ```javascript
   truffle test
   ```

### Linting

We use Solhint to lint the code - you can run it using ```npm run lint```.

## FAQ

* __What is a blockchain oracle?__

   > Blockchain oracles are third-party services that provide smart contracts with external information. They serve as bridges between blockchains and the outside world.
   > -- <cite>  [Binance](https://www.binance.vision/glossary/oracle) </cite>

* __What about truffle develop?__

   We do not recommend using `truffle develop` because the command spawns a development blockchain that lacks WebSockets support. You will be able to compile and migrate contracts just fine.

   `Error: The current provider doesn't support subscriptions: HttpProvider` will appear when running `npm run calls` or `npm test`. We subscribe to `LogResult` events in the `server/calls.js` Truffle script.

   More details about the differences between `truffle console` and `truffle develop` on [Truffle's website](https://www.trufflesuite.com/docs/truffle/getting-started/using-truffle-develop-and-the-console).

* __Changing ports__

   ganache-cli and @trusource/server both defaults to port 8545. Both can be changed by running with -p option. You will then need to update the port value in the development object in networks in `truffle-config.json`.

## License
MIT

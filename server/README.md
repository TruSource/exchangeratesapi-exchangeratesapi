## Local Server

### calls.js

This contains a set of test calls for functions in `Example.sol` with example arguments. For your own implementation, replace Example and the test calls with your own contract artifact and functions with arguments.

### oas.json

[OpenAPI specification ](https://www.openapis.org) used by the [`@trusource/server`](https://www.npmjs.com/package/@trusource/server) to locally listen for contract events, fetch data and make callbacks.

The specification may contain security schemes in the `components.securitySchemes`, if so, the api requires authentication.

Depending on the type of authentication, add the required field to the `securityName` object. See the example security scheme where the api key authentication type is demonstrated.

```JSON
"components": {
    "securitySchemes": {
      "schemeName": {
        "name": "authName",
        "type": "apiKey",
        "in": "query",
        "x-key": "yourCredential"
      },
    }
}
```

| Auth type | field                     |
| --------- | ------------------------- |
| Basic     | x-username and x-password |
| Bearer    | x-token                   |
| Api Key   | x-key                     |
| Header    | x-key                     |

Alternatively, the credential can be added to `.env.template` which needs to be renamed to `.env`.

It's important to not change any other fields in the `oas.json` unless api has been updated, oas files for each API can be found at [here](https://doc.trusource.io/).

### Local Development

<!-- TODO: duplicate logic here? same as first readme -->
1. Start an Ethereum client. Note the client needs to support WebSockets (do not use `truffle develop` for this reason).
   We will use `ganache-cli`, for more options please see the [truffle docs](https://www.trufflesuite.com/docs/truffle/reference/choosing-an-ethereum-client)

   ```javascript
   npx ganache-cli
   ```

2. Compile and migrate the smart contracts. Note `truffle migrate` also compiles the contracts. Smart contract changes must be manually recompiled and migrated.

   ```javascript
   truffle migrate
   ```

3. In another terminal, start the TruSource local server. It will listen for events, fetch and return data to requesting contracts. See [@trusource/server](https://www.npmjs.com/package/@trusource/server) for more details.

   ```javascript
   // in another terminal (i.e. not in the eth client terminal)
   npm start
   ```

4. In another terminal, call functions in `Example.sol` using the provided Truffle script `./server/calls.js`, which will execute a set of contracts calls, testing each operation with provided example arguments.

   ```javascript
   // in another terminal (i.e. not in eth client or server terminals)
   truffle exec server/calls.js
   ```

### @trusource/server

The server is a project dependency and can be run directly in the command line.

```shell
$ trusource-server --spec <path-to-oas.json>
```

`trusource-server` has a two option.

```shell
-d, --debug             output extra debugging
-p, --port [number]     port number to listen on
```

The port defaults to 8545. This port number must match what is set in the development object in networks in `truffle-config.json` and the port for `ganache-cli`.

# Ticket Links

A practice implementation of a blockchain-based ticket sales platform created with Solidity, React and web browser extension.

## Setup

1. Install Node.js with your system package manager, or by visiting the [website](https://nodejs.org/en/download).
2. Run `npm install` to install any required node modules.
3. Open your web browser and go to the page where you can register a development browser extension.
4. Add `extensions/wallet/manifest.json` as a browser extension and enable it.

## Run

1. Run the front-end application: `npm run start:app`
2. Run the blockchain: `npm run start:chain`
3. Deploy Solidity contracts to the chain: `npm run deploy`
4. Copy the addresses and private keys of any desired accounts from the output of step 2 and add them to the Wallet browser extension you registered in setup. Then connect one of the accounts.

## Tests

- Tests can be run with: `npm run test`, or `npm run test:gas` to report the Ethereum gas usage.

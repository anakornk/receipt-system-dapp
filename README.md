# Features
- Store receipts on the blockchain
- Receipt ID is global, no duplicate ids
- All receipts are encrypted, viewable only to the owners (business,customer,gov)
- Uses 3-Party Diffie–Hellman key exchange to get shared secret

# TODO
- Allows updaing key? Updating key consensus??? Race condition vulnerability?
- Client-Side (JS) needs error-handling
- UI

# USAGE
## Installation
1. Do Step 2 or Step 3
2. Install TestRPC: npm install -g ethereumjs-testrpc
3. Install MetaMask: https://metamask.io
4. git clone git@github.com:anakornk/receipt-system-dapp.git
5. npm install
6. To start TestRPC, type "testrpc" in terminal. (if DONE step 2)
7. Run Lite Server: npm run dev
8. Visit localhost site. (http://localhost:3000 - default port:3000)

## Config
1. Set contract address by updating 'contractAddress' variable in 'contract.js'
2. In TestRPC environment, set 'defaultAccountIndex' in 'contract.js' to choose default account
3. test/save.txt has pre-calculated pub/priv key pairs.

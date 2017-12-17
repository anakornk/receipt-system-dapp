if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];
web3.eth.defaultAccount = '0xf4f20eea6eb9dbdd49d20de3f8c2b429cdb3542d';
console.log(web3.eth.accounts[0]);

var ReceiptSystemContract = web3.eth.contract([
  {
    "constant": false,
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_keySign",
        "type": "bytes1"
      },
      {
        "name": "_publicKey",
        "type": "bytes32"
      },
      {
        "name": "_keySignGB",
        "type": "bytes1"
      },
      {
        "name": "_sharedKeyGB",
        "type": "bytes32"
      }
    ],
    "name": "addBusiness",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "frozenBusiness",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "invoiceId",
        "type": "uint256"
      }
    ],
    "name": "getInvoice",
    "outputs": [
      {
        "name": "keySign",
        "type": "bytes1"
      },
      {
        "name": "sharedKey",
        "type": "bytes32"
      },
      {
        "name": "data",
        "type": "bytes1[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "invoices",
    "outputs": [
      {
        "name": "keySignBC",
        "type": "bytes1"
      },
      {
        "name": "sharedKeyBC",
        "type": "bytes32"
      },
      {
        "name": "keySignCG",
        "type": "bytes1"
      },
      {
        "name": "sharedKeyCG",
        "type": "bytes32"
      },
      {
        "name": "keySignGB",
        "type": "bytes1"
      },
      {
        "name": "sharedKeyGB",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "govPublicKey",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "govKeySign",
    "outputs": [
      {
        "name": "",
        "type": "bytes1"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "businesses",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "keySign",
        "type": "bytes1"
      },
      {
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "name": "keySignGB",
        "type": "bytes1"
      },
      {
        "name": "sharedkeyGB",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_customerAddr",
        "type": "address"
      }
    ],
    "name": "getSharedKeyCGData",
    "outputs": [
      {
        "name": "keySignC",
        "type": "bytes1"
      },
      {
        "name": "publicKeyC",
        "type": "bytes32"
      },
      {
        "name": "keySignCG",
        "type": "bytes1"
      },
      {
        "name": "sharedKeyCG",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "customers",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "keySign",
        "type": "bytes1"
      },
      {
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "name": "keySignCG",
        "type": "bytes1"
      },
      {
        "name": "sharedKeyCG",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "businessIndex",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_customerAddr",
        "type": "address"
      },
      {
        "name": "_data",
        "type": "bytes1[]"
      },
      {
        "name": "_keySignBC",
        "type": "bytes1"
      },
      {
        "name": "_sharedKeyBC",
        "type": "bytes32"
      }
    ],
    "name": "newInvoice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "customerIndex",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_keySign",
        "type": "bytes1"
      },
      {
        "name": "_publicKey",
        "type": "bytes32"
      },
      {
        "name": "_keySignCG",
        "type": "bytes1"
      },
      {
        "name": "_sharedKeyCG",
        "type": "bytes32"
      }
    ],
    "name": "addCustomer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getRole",
    "outputs": [
      {
        "name": "role",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_govKeySign",
        "type": "bytes1"
      },
      {
        "name": "_govPublicKey",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "text",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "invoiceId",
        "type": "uint256"
      }
    ],
    "name": "InvoiceEvent",
    "type": "event"
  }
]);

var ReceiptSystem = ReceiptSystemContract.at('0x1d2fc129a0f42df906303fa74989514e05d53e64');

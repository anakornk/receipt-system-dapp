window.addEventListener('load', function() {
  window.isInjected = false;
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.isInjected = true;
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  // Now you can start your app & access web3 freely:
  window.ReceiptSystemContract = web3.eth.contract([
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
    "inputs": [],
    "name": "getGovPubKey",
    "outputs": [
      {
        "name": "keySign",
        "type": "bytes1"
      },
      {
        "name": "publicKey",
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
        "name": "isCustomer",
        "type": "bool"
      }
    ],
    "name": "getInvoicesId",
    "outputs": [
      {
        "name": "invoiceId",
        "type": "uint256[]"
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
    "name": "registerBusiness",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "constant": false,
    "inputs": [
      {
        "name": "busiAddr",
        "type": "address"
      },
      {
        "name": "freeze",
        "type": "bool"
      }
    ],
    "name": "freezeBusiness",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
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
    "name": "registerCustomer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
  // 0x4404fd836412271a503157d29e06c7ae10075b25 - testrpc
  // 0x13ee287f54a6aac4c0ebb5576879a860c04a0022 - rospen
  var contractAddress = '0x699e27e50d9e3ee217092e5a394f46203cdc9204';
  window.ReceiptSystem = ReceiptSystemContract.at(contractAddress);


  if(window.isInjected){
    startApp();
  } else {
    //synchronous method:
    //window.web3.eth.defaultAccount = web3.eth.accounts[3];

    // change index here to choose account
    var defaultAccountIndex = 0;
    web3.eth.getAccounts(function(error,accounts){
      if(error) return;
      window.web3.eth.defaultAccount = accounts[defaultAccountIndex];
      startApp();
    });
  }

})



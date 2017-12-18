pragma solidity ^0.4.19;

contract owned {
  address public owner;

  function owned() public {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
}

contract Business is owned {

  struct BusinessInfo {
    bytes32 name;
  }
  BusinessInfo public businessInfo;


  Cashier[] internal cashiers;
  mapping (address => uint) internal cashierIndex;

  Receipt[] public receipts;


  Item[] internal items;
  mapping (uint => uint) internal itemIndex;


  Invoice[] public invoices;

  mapping (address => bool) internal frozenCashier;

  struct Cashier {
    address addr;
    string name;
  }

  struct Receipt {
    uint cashierIndex;
    uint totalPaid;
    string buyerInfo;
  }

  struct Invoice {
    uint cashierIndex;
    TransactionItem[] transactionItems;
    uint subTotal;
    bytes32 buyerInfo;
  }

  modifier onlyCashiers {
    require(cashierIndex[msg.sender] != 0 && !frozenCashier[msg.sender]);
    _;
  }

  event InvoiceEvent(string text, uint invoiceId);

  function Business (bytes32 _name) public {
    businessInfo = BusinessInfo({name: _name});

    addCashier(0,"NULL");
    addCashier(msg.sender,"OWNER");

    addItem(0,"NULL",0);
    addItem(100,"Hot Dog",50);
    addItem(101,"Red Bull",20);

  }
  // add edit
  function addCashier(address cashierAddr, string cashierName) onlyOwner public {
    uint index = cashierIndex[cashierAddr];
    if (index == 0) {
      cashierIndex[cashierAddr] = cashiers.length;
      index = cashiers.length++;
    }
    cashiers[index] = Cashier({addr: cashierAddr, name: cashierName});
  }

  function getCashierByIndex(uint index) onlyOwner public constant returns (address addr, string name) {
    Cashier storage cashier = cashiers[index];
    return (cashier.addr, cashier.name);
  }

  function getCashierByAddress(address cashierAddr) onlyOwner public constant returns (address addr, string name) {
    Cashier storage cashier = cashiers[cashierIndex[cashierAddr]];
    return (cashier.addr, cashier.name);
  }

  // freeze cashier
  function freezeCashier(address cashierAddr, bool freeze) onlyOwner public {
    frozenCashier[cashierAddr] = freeze;
  }

  // pay to who
  function newInvoice(uint[] transaction, bytes32 _buyerInfo) onlyCashiers public{
    require(transaction.length % 2 == 0);
    uint id = invoices.length++;
    Invoice storage invoice = invoices[id];
    invoice.cashierIndex = cashierIndex[msg.sender];
    invoice.buyerInfo = _buyerInfo;
    invoice.subTotal = 0;

    InvoiceEvent("New Invoice", id);
  }

  function getInvoice(uint invoiceId) public constant returns (bytes32 businessName,bytes32[] nameArray,uint[] unitPriceArray,uint[] quantityArray,uint[] amountArray, uint subTotal, bytes32 buyerInfo) {
    Invoice storage invoice = invoices[invoiceId];
    uint len = invoice.transactionItems.length;
    bytes32[] memory _nameArray = new bytes32[](len);
    uint[] memory _unitPriceArray = new uint[](len);
    uint[] memory _quantityArray = new uint[](len);
    uint[] memory _amountArray = new uint[](len);
    for(uint256 i=0;i<invoice.transactionItems.length;i++){
      _nameArray[i] = invoice.transactionItems[i].name;
      _unitPriceArray[i] = invoice.transactionItems[i].unitPrice;
      _quantityArray[i] = invoice.transactionItems[i].quantity;
      _amountArray[i] = invoice.transactionItems[i].amount;
    }
    return (businessInfo.name,_nameArray,_unitPriceArray,_quantityArray,_amountArray, invoice.subTotal, invoice.buyerInfo);
    //return (invoice.cashierIndex,,invoice.subTotal);
  }

//item invoice
}

// event
// invoiceid to random
// approve invoice/result with ether or other payment? use token?
// government


//can share secret key with other ppl without giving out privatekey

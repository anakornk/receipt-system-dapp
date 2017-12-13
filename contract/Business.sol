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
  Cashier[] public cashiers;
  mapping (address => uint) public cashierId;
  Receipt[] public receipts;
  mapping (uint => Item) public items;
  Invoice[] public invoices;

  mapping (address => bool) public frozenCashier;

  struct Cashier {
    address addr;
    string name;
  }

  struct Receipt {
    uint cashierId;
    uint totalPaid;
    string buyerInfo;
  }

  struct Invoice {
    uint cashierId;
    TransactionItem[] transactionItems;
    uint subTotal;
  }

  struct Item {
    bytes32 name;
    uint price;

  }

  struct TransactionItem {
     bytes32 name;
     uint unitPrice;
     uint quantity;
     uint amount;
  }

  modifier onlyCashiers {
    require(cashierId[msg.sender] != 0 && !frozenCashier[msg.sender]);
    _;
  }

  event InvoiceEvent(string text, uint invoiceId);

  function Business () public {
    addCashier(0,"");
    addCashier(msg.sender,"OWNER");
    addItem(1,"Hot Dog",50);
    addItem(2,"Red Bull",20);
  }
  // add edit
  function addCashier(address cashierAddr, string cashierName) onlyOwner public {
    uint id = cashierId[cashierAddr];
    if (id == 0) {
      cashierId[cashierAddr] = cashiers.length;
      id = cashiers.length++;
    }
    cashiers[id] = Cashier({addr: cashierAddr, name: cashierName});
  }

  // freeze cashier
  function freezeCashier(address cashierAddr, bool freeze) onlyOwner public {
    frozenCashier[cashierAddr] = freeze;
  }

  function newReceipt(uint _totalPaid, string _buyerInfo) onlyCashiers public returns (uint receiptId){
    uint id = receipts.length++;
    Receipt storage r = receipts[id];
    r.totalPaid = _totalPaid;
    r.cashierId = cashierId[msg.sender];
    r.buyerInfo = _buyerInfo;
    return id;
  }

  function newInvoice(uint[] transaction) onlyCashiers public{
    require(transaction.length % 2 == 0);
    uint id = invoices.length++;
    Invoice storage invoice = invoices[id];
    invoice.cashierId = cashierId[msg.sender];
    invoice.subTotal = 0;
    for(uint256 i=0;i<transaction.length;i=i+2){
        Item memory item = items[transaction[i]];
        uint _amount = item.price* transaction[i+1];
        invoice.transactionItems.push(TransactionItem({
            name: item.name,
            unitPrice:item.price,
            quantity: transaction[i+1],
            amount: _amount
        }));
        invoice.subTotal += _amount;
    }
    InvoiceEvent("New Invoice", id);
  }

  function getInvoice(uint invoiceId) public constant returns (bytes32[] nameArray,uint[] unitPriceArray,uint[] quantityArray,uint[] amountArray) {
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
    return (_nameArray,_unitPriceArray,_quantityArray,_amountArray);
    //return (invoice.cashierId,,invoice.subTotal);
  }

  function addItem(uint _id, bytes32 _name, uint _price) onlyOwner public{
    items[_id] = Item({name: _name, price: _price});
  }


//item invoice
}

// event


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

contract ReceiptSystem is owned {


  Business[] public businesses;
  mapping (address => uint) internal businessIndex;
  mapping (address => bool) internal frozenBusiness;

  Customer[] public customers;
  mapping (address => uint) internal customerIndex;

  Invoice[] public invoices;

  byte public govKeySign;
  bytes32 public govPublicKey;

  struct Business {
    address addr;
    byte keySign;
    bytes32 publicKey;
    byte keySignGB;
    bytes32 sharedkeyGB;
    uint[] invoiceId;
  }

  struct Customer {
    address addr;
    byte keySign;
    bytes32 publicKey;
    byte keySignCG;
    bytes32 sharedKeyCG;
    uint[] invoiceId;
  }

  struct Invoice {
    // B for business
    // C for customer
    // G for government

    byte keySignBC;
    bytes32 sharedKeyBC;
    byte keySignCG;
    bytes32 sharedKeyCG;
    byte keySignGB;
    bytes32 sharedKeyGB;

    byte[] data;
    // store public and private key
  }

  modifier onlyBusinesses {
    require(businessIndex[msg.sender] != 0 && !frozenBusiness[msg.sender]);
    _;
  }

  event InvoiceEvent(string text, uint invoiceId);

  function ReceiptSystem(byte _govKeySign, bytes32 _govPublicKey) public {

    // Initialize government public key:
    govKeySign = _govKeySign;
    govPublicKey = _govPublicKey;

    // IMPORTANT: so that can check if exists by comparing with 0
    addBusiness(0,0,0,0,0);
    addCustomer(0,0,0,0,0);


  }

  // can be payable in the future
  // function registerBusiness(byte _keySign, bytes32 _publicKey) public {
  //   uint index = businessIndex[msg.sender];
  //   require(index == 0); // allows new registration only, no update
  //   businessIndex[msg.sender] = businesses.length;
  //   index = businesses.length++;
  //   businesses[index] = Business({addr: msg.sender, keySign: _keySign, publicKey: _publicKey});
  // }

  function addBusiness(address _addr, byte _keySign, bytes32 _publicKey, byte _keySignGB, bytes32 _sharedKeyGB) onlyOwner public {
    uint index = businessIndex[_addr];
    if(index == 0){
      businessIndex[_addr] = businesses.length;
      index = businesses.length++;
    }
    Business storage business = businesses[index];
    business.addr = _addr;
    business.keySign = _keySign;
    business.publicKey = _publicKey;
    business.keySignGB = _keySignGB;
    business.sharedkeyGB = _sharedKeyGB;
  }

  // function registerCustomer(byte _keySign, bytes32 _publicKey) public {
  //   uint index = customerIndex[msg.sender];
  //   require(index == 0); // allows new registration only, no update
  //   customerIndex[msg.sender] = customers.length;
  //   index = customers.length++;
  //   customers[index] = Customer({addr: msg.sender, keySign: _keySign, publicKey: _publicKey});
  // }

  // allows update
  function addCustomer(address _addr, byte _keySign, bytes32 _publicKey, byte _keySignCG, bytes32 _sharedKeyCG) onlyOwner public {
    uint index = customerIndex[_addr];
    if(index == 0){
      customerIndex[_addr] = customers.length;
      index = customers.length++;
    }
    Customer storage customer = customers[index];
    customer.addr = _addr;
    customer.keySign = _keySign;
    customer.publicKey = _publicKey;
    customer.keySignCG = _keySignCG;
    customer.sharedKeyCG = _sharedKeyCG;
  }



  // function getCashierByIndex(uint index) onlyOwner public constant returns (address addr, string name) {
  //   Cashier storage cashier = cashiers[index];
  //   return (cashier.addr, cashier.name);
  // }

  // function getCashierByAddress(address cashierAddr) onlyOwner public constant returns (address addr, string name) {
  //   Cashier storage cashier = cashiers[cashierIndex[cashierAddr]];
  //   return (cashier.addr, cashier.name);
  // }

  // // freeze cashier
  // function freezeCashier(address cashierAddr, bool freeze) onlyOwner public {
  //   frozenCashier[cashierAddr] = freeze;
  // }

  // get sharedKey of customer and government
  function getSharedKeyCGData(address _customerAddr) onlyBusinesses public constant returns (byte keySignC, bytes32 publicKeyC,byte keySignCG, bytes32 sharedKeyCG){
    uint index = customerIndex[_customerAddr];
    require(index != 0);
    return (customers[index].keySign,customers[index].publicKey, customers[index].keySignCG, customers[index].sharedKeyCG);
  }

  // // pay to who
  function newInvoice(address _customerAddr,byte[] _data, byte _keySignBC, bytes32 _sharedKeyBC) onlyBusinesses public{
    uint id = invoices.length++;
    Invoice storage invoice = invoices[id];
    Business storage business = businesses[businessIndex[msg.sender]];
    Customer storage customer = customers[customerIndex[_customerAddr]];

    invoice.keySignBC = _keySignBC;
    invoice.sharedKeyBC = _sharedKeyBC;
    invoice.keySignCG = customer.keySignCG;
    invoice.sharedKeyCG = customer.sharedKeyCG;
    invoice.keySignGB = business.keySignGB;
    invoice.sharedKeyGB = business.sharedkeyGB;
    invoice.data = _data;


    business.invoiceId.push(id);
    customer.invoiceId.push(id);

    InvoiceEvent("New Invoice", id);
  }

  function getInvoice(uint invoiceId) public constant returns(byte keySign, bytes32 sharedKey,byte[] data) {
    // additional check here?
    require(invoiceId >=0 && invoiceId < invoices.length);
    if(customerIndex[msg.sender] != 0){
      // customer
      return (invoices[invoiceId].keySignGB,invoices[invoiceId].sharedKeyGB,invoices[invoiceId].data);
    }else if(businessIndex[msg.sender] != 0){
      // business
      return (invoices[invoiceId].keySignCG,invoices[invoiceId].sharedKeyCG,invoices[invoiceId].data);
    }else if(msg.sender == owner){
      // government
      return (invoices[invoiceId].keySignBC,invoices[invoiceId].sharedKeyBC,invoices[invoiceId].data);
    }
  }

  // function getInvoice(uint invoiceId) public constant returns (bytes32 businessName,bytes32[] nameArray,uint[] unitPriceArray,uint[] quantityArray,uint[] amountArray, uint subTotal, bytes32 buyerInfo) {
  //   Invoice storage invoice = invoices[invoiceId];
  //   uint len = invoice.transactionItems.length;
  //   bytes32[] memory _nameArray = new bytes32[](len);
  //   uint[] memory _unitPriceArray = new uint[](len);
  //   uint[] memory _quantityArray = new uint[](len);
  //   uint[] memory _amountArray = new uint[](len);
  //   for(uint256 i=0;i<invoice.transactionItems.length;i++){
  //     _nameArray[i] = invoice.transactionItems[i].name;
  //     _unitPriceArray[i] = invoice.transactionItems[i].unitPrice;
  //     _quantityArray[i] = invoice.transactionItems[i].quantity;
  //     _amountArray[i] = invoice.transactionItems[i].amount;
  //   }
  //   return (businessInfo.name,_nameArray,_unitPriceArray,_quantityArray,_amountArray, invoice.subTotal, invoice.buyerInfo);
  //   //return (invoice.cashierIndex,,invoice.subTotal);
  // }

//item invoice
}

// event
// invoiceid to random
// approve invoice/result with ether or other payment? use token?
// government


//can share secret key with other ppl without giving out privatekey

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
  mapping (address => uint) public businessIndex;
  mapping (address => bool) public frozenBusiness;

  Customer[] public customers;
  mapping (address => uint) public customerIndex;

  Invoice[] public invoices;

  byte internal govKeySign;
  bytes32 internal govPublicKey;

  struct Business {
    address addr;
    byte keySign;
    bytes32 publicKey;
    byte keySignGB;
    bytes32 sharedKeyGB;
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
    // byte keySignCG;
    // bytes32 sharedKeyCG;
    // byte keySignGB;
    // bytes32 sharedKeyGB;
    address busiAddr;
    address custAddr;

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

  function getGovPubKey() public constant returns(byte keySign, bytes32 publicKey) {
    return (govKeySign, govPublicKey);
  }

  // can be payable in the future
  function registerBusiness(byte _keySign, bytes32 _publicKey, byte _keySignGB, bytes32 _sharedKeyGB) public {
    uint index = businessIndex[msg.sender];
    require(index == 0); // allows new registration only, no update
    businessIndex[msg.sender] = businesses.length;
    index = businesses.length++;
    Business storage business = businesses[index];
    business.addr = msg.sender;
    business.keySign = _keySign;
    business.publicKey = _publicKey;
    business.keySignGB = _keySignGB;
    business.sharedKeyGB = _sharedKeyGB;
    //
  }

  // because privatekey is locally stored must check
  // maybe a node running to approve?
  function addBusiness(address _addr, byte _keySign, bytes32 _publicKey, byte _keySignGB, bytes32 _sharedKeyGB) onlyOwner public {
    uint index = businessIndex[_addr];
    // if(index == 0){
    //   businessIndex[_addr] = businesses.length;
    //   index = businesses.length++;
    // }
    require(index == 0);
    businessIndex[_addr] = businesses.length;
    index = businesses.length++;
    Business storage business = businesses[index];
    business.addr = _addr;
    business.keySign = _keySign;
    business.publicKey = _publicKey;
    business.keySignGB = _keySignGB;
    business.sharedKeyGB = _sharedKeyGB;
  }

  function registerCustomer(byte _keySign, bytes32 _publicKey, byte _keySignCG, bytes32 _sharedKeyCG) public {
    uint index = customerIndex[msg.sender];
    require(index == 0); // allows new registration only, no update
    customerIndex[msg.sender] = customers.length;
    index = customers.length++;
    Customer storage customer = customers[index];
    customer.addr = msg.sender;
    customer.keySign = _keySign;
    customer.publicKey = _publicKey;
    customer.keySignCG = _keySignCG;
    customer.sharedKeyCG = _sharedKeyCG;
  }

  // allows update
  function addCustomer(address _addr, byte _keySign, bytes32 _publicKey, byte _keySignCG, bytes32 _sharedKeyCG) onlyOwner public {
    uint index = customerIndex[_addr];
    // if(index == 0){
    //   customerIndex[_addr] = customers.length;
    //   index = customers.length++;
    // }
    require(index == 0);
    customerIndex[_addr] = customers.length;
    index = customers.length++;
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

  // freeze business
  function freezeBusiness(address busiAddr, bool freeze) onlyOwner public {
    frozenBusiness[busiAddr] = freeze;
  }

  // get sharedKey of customer and government
  function getSharedKeyCGData(address _customerAddr) onlyBusinesses public constant returns (byte keySignC, bytes32 publicKeyC,byte keySignCG, bytes32 sharedKeyCG){
    uint index = customerIndex[_customerAddr];
    require(index != 0);
    return (customers[index].keySign,customers[index].publicKey, customers[index].keySignCG, customers[index].sharedKeyCG);
  }

  // // pay to who
  function newInvoice(address _customerAddr,byte[] _data, byte _keySignBC, bytes32 _sharedKeyBC) onlyBusinesses public{
    // business check already done in modifier
    require(customerIndex[_customerAddr] != 0);

    uint id = invoices.length++;
    Invoice storage invoice = invoices[id];

    Business storage business = businesses[businessIndex[msg.sender]];
    Customer storage customer = customers[customerIndex[_customerAddr]];

    // for government usage
    invoice.keySignBC = _keySignBC;
    invoice.sharedKeyBC = _sharedKeyBC;
    // invoice.keySignCG = customer.keySignCG;
    // invoice.sharedKeyCG = customer.sharedKeyCG;
    // invoice.keySignGB = business.keySignGB;
    // invoice.sharedKeyGB = business.sharedKeyGB;


    invoice.busiAddr = msg.sender;
    invoice.custAddr = _customerAddr;

    invoice.data = _data;

    business.invoiceId.push(id);
    customer.invoiceId.push(id);

    InvoiceEvent("New Invoice", id);
  }

  function getInvoice(uint invoiceId) public constant returns(byte keySign, bytes32 sharedKey,byte[] data) {
    // additional check here?
    require(invoiceId >=0 && invoiceId < invoices.length);
    address custAddr = invoices[invoiceId].custAddr;
    address busiAddr = invoices[invoiceId].busiAddr;
    uint index;

    if(customerIndex[msg.sender] != 0 && custAddr == msg.sender){
      // customer
      index = businessIndex[busiAddr];

      return (businesses[index].keySignGB,businesses[index].sharedKeyGB, invoices[invoiceId].data);

    } else if(businessIndex[msg.sender] != 0 && busiAddr == msg.sender){
      // business
      index = customerIndex[custAddr];
      return (customers[index].keySignCG,customers[index].sharedKeyCG,invoices[invoiceId].data);

    } else if(msg.sender == owner){
      // government
      return (invoices[invoiceId].keySignBC,invoices[invoiceId].sharedKeyBC,invoices[invoiceId].data);
    } else{
      revert();
    }
  }

  function getInvoicesId(bool isCustomer) public constant returns(uint[] invoiceId) {
    if(isCustomer && customerIndex[msg.sender] != 0){
      //is customer
      return customers[customerIndex[msg.sender]].invoiceId;
    }else if(businessIndex[msg.sender] != 0){
      //is business
      return businesses[businessIndex[msg.sender]].invoiceId;
    }
  }

  function getRole() public constant returns (uint role){
    // customer: 0
    // business: 1
    // business & customer: 2
    // government: 3
    // other: 4
    uint custIndex = customerIndex[msg.sender];
    uint busiIndex = businessIndex[msg.sender];
    if(custIndex != 0 && busiIndex == 0){
      // customer
      return 0;
    }else if(busiIndex != 0 && custIndex == 0){
      // business
      return 1;
    } else if(custIndex !=0 && busiIndex !=0){
      // both
      return 2;
    }else if(msg.sender == owner){
      // government
      return 3;
    }else {
      return 4;
    }
  }


}

// event
// invoiceid to random
// approve invoice/result with ether or other payment? use token?
// government


//can share secret key with other ppl without giving out privatekey




// cannot gengxin
// not store receipt in receipt
// customer request.
// freeze business
// because privatekey is lcoally stored must check
// maybe a node running to approve?
// add another property to store status
// g^bc
// add hash to receipt


// future work charge for receipt

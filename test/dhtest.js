var crypto = require('crypto');
var BigInteger = require('bigi')
var ecurve = require('ecurve')
var ecparams = ecurve.getCurveByName('secp256k1')

// Customer
// 50fb19c91acef37c29b49a486b5919558586e346a1217b61503a39959edfebbd
// 0276e4ef2cb3a825bb346d82ab41a012b218f8ba2306b0423b835400c2f9a20c43
// Business
// c044be2938cf69d0d4c80dce1a9d2e655587737ae08652eab1fcd2dce84bc699
// 028c053f8d3ef6b8061d6f51894273d7d33b11c8c1a0b1a1956ad463f60578bd05
// Gover
// ac143d7603c7bd9bd70dd5f69b9486542f95ca37a94aa7ce1941555e2c4be690
// 028844c5faede3f354d30a01579b3742bfc906565517d3b9f37077aaaef809ecf9
var custPrivKey = new Buffer('50fb19c91acef37c29b49a486b5919558586e346a1217b61503a39959edfebbd', 'hex');
var busiPrivKey = new Buffer('c044be2938cf69d0d4c80dce1a9d2e655587737ae08652eab1fcd2dce84bc699', 'hex');
var govPrivKey = new Buffer('ac143d7603c7bd9bd70dd5f69b9486542f95ca37a94aa7ce1941555e2c4be690', 'hex');

var custPubKey = ecparams.G.multiply(BigInteger.fromBuffer(custPrivKey)).getEncoded(true);
var busiPubKey = ecparams.G.multiply(BigInteger.fromBuffer(busiPrivKey)).getEncoded(true);
var govPubKey = ecparams.G.multiply(BigInteger.fromBuffer(govPrivKey)).getEncoded(true);

function multiply(PointHexBuf, k) {

  var curvePoint = ecurve.Point.decodeFrom(ecparams,PointHexBuf);
  var sharedKeyPoint = curvePoint.multiply(BigInteger.fromBuffer(k));
  return sharedKeyPoint.getEncoded(true);
}

var sharedKeyBC = multiply(custPubKey,busiPrivKey);
var sharedKeyCG = multiply(custPubKey,govPrivKey);
var sharedKeyGB = multiply(busiPubKey,govPrivKey);
console.log(sharedKeyBC.toString('hex'));
console.log(sharedKeyCG.toString('hex'));
console.log(sharedKeyGB.toString('hex'));


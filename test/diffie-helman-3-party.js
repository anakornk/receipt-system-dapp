var crypto = require('crypto');
var eccrypto = require('eccrypto');

// var privateKey = crypto.randomBytes(32);
// var publicKey = eccrypto.getPublic(privateKey);

// console.log(privateKey);
// console.log(publicKey);

var privateKeyA = crypto.randomBytes(32);
var publicKeyA = eccrypto.getPublic(privateKeyA);
var privateKeyB = crypto.randomBytes(32);
var publicKeyB = eccrypto.getPublic(privateKeyB);
var privateKeyC = crypto.randomBytes(32);
var publicKeyC = eccrypto.getPublic(privateKeyC);

//--------------


var BigInteger = require('bigi') //npm install --save bigi@1.1.0
var ecurve = require('ecurve') //npm install --save ecurve@1.0.0


var privateKey = new Buffer("1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd", 'hex')
var ecparams = ecurve.getCurveByName('secp256k1')
var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey));
var publicKey = curvePt.getEncoded(true) //false forces uncompressed public key
console.log(publicKey.toString('hex'));

console.log(ecurve.Point.decodeFrom(ecparams,publicKey).equals(curvePt));

/////
var publicKeyA2 = ecparams.G.multiply(BigInteger.fromBuffer(privateKeyA));
console.log(publicKeyA);
console.log(publicKeyA2.getEncoded(false))




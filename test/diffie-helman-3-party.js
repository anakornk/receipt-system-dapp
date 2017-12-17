var crypto = require('crypto');
var BigInteger = require('bigi')
var ecurve = require('ecurve')
var ecparams = ecurve.getCurveByName('secp256k1')

// var privateKey = crypto.randomBytes(32);
// var publicKey = eccrypto.getPublic(privateKey);

// console.log(privateKey);
// console.log(publicKey);

var privateKeyA = crypto.randomBytes(32);
// var publicKeyA = eccrypto.getPublic(privateKeyA);
var privateKeyB = crypto.randomBytes(32);
// var publicKeyB = eccrypto.getPublic(privateKeyB);
var privateKeyC = crypto.randomBytes(32);
// var publicKeyC = eccrypto.getPublic(privateKeyC);

//--------------
console.log(privateKeyA.toString('hex'));
console.log(ecparams.G.multiply(BigInteger.fromBuffer(privateKeyA)).getEncoded(true).toString('hex'));
console.log(privateKeyB.toString('hex'));
console.log(ecparams.G.multiply(BigInteger.fromBuffer(privateKeyB)).getEncoded(true).toString('hex'));
console.log(privateKeyC.toString('hex'));
console.log(ecparams.G.multiply(BigInteger.fromBuffer(privateKeyC)).getEncoded(true).toString('hex'));
return


var privateKey = new Buffer("1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd", 'hex')
var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey));
var publicKey = curvePt.getEncoded(true) //false forces uncompressed public key

var publicKeyBuf = new Buffer('03631f21c94bd32be79081bacc301ca36d38e12a6e594bf2ff8a15743b4ecec81c', 'hex')
var curvePoint = ecurve.Point.decodeFrom(ecparams,publicKeyBuf);
console.log(curvePoint);
var privateKeyGov = new Buffer('a45b575d76ddf16de0888e84470fc813be7ed370a6699f1f5cfffc004abd5803','hex');
console.log(curvePoint.multiply(BigInteger.fromBuffer(privateKeyGov)).getEncoded(true).length);
return

console.log(privateKeyA.toString('hex'));
console.log(ecparams.G.multiply(BigInteger.fromBuffer(privateKeyA)).getEncoded(true).toString('hex'));
console.log(privateKeyB.toString('hex'));
console.log(ecparams.G.multiply(BigInteger.fromBuffer(privateKeyB)).getEncoded(true).toString('hex'));


console.log("YOYO")

console.log(publicKey.toString('hex').length / 2);

console.log(ecurve.Point.decodeFrom(ecparams,publicKey).equals(curvePt));
console.log("YES");
console.log(curvePt.multiply(BigInteger.fromBuffer(privateKeyB)).getEncoded(true).length);
/////
var publicKeyA2 = ecparams.G.multiply(BigInteger.fromBuffer(privateKeyA));
// console.log(publicKeyA);




// // Key Derive

// var pbkdf2 = require('pbkdf2')
// var derivedKey = pbkdf2.pbkdf2Sync(publicKey, 'salt', 1, 256, 'sha512');

// //Encryption
// var CryptoJS = require("crypto-js");
// var derivedKey2 = CryptoJS.PBKDF2(publicKey, 'salt', { keySize: 128 / 32, iterations: 1000 });
// // var ciphertext = CryptoJS.AES.encrypt('my message', derivedKey);
// // console.log(ciphertext)


var derivedKey = crypto.pbkdf2Sync(publicKey, 'salt', 1, 256, 'sha512');
let cipher = crypto.createCipher('aes-256-cbc',derivedKey);
let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
console.log(encrypted);
encrypted += cipher.final('hex'); //append block leftovers
console.log(encrypted);

console.log('----');
const decipher = crypto.createDecipher('aes-256-cbc', derivedKey);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
console.log(decrypted);
decrypted += decipher.final('utf8');
console.log(decrypted);

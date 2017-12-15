var crypto = require('crypto');
var BigInteger = require('bigi')
var ecurve = require('ecurve')
var eccrypto = require('eccrypto'); // optional

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

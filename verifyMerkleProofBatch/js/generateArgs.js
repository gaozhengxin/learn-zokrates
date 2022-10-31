const keccak256 = require('keccak256');
const BigInteger = require('big-integer');

const zero = BigInteger(0);
const one = BigInteger(1);
const n256 = BigInteger(256);

function toLittleEndian(bigNumber) {
    let result = new Uint8Array(32);
    let i = 0;
    while (bigNumber.greater(zero)) {
        result[i] = bigNumber.mod(n256);
        bigNumber = bigNumber.divide(n256);
        i += 1;
    }
    return result;
}

function toBigEndian(bigNumber) {
    return toLittleEndian(bigNumber).reverse();
}

let leaf = keccak256(Buffer.from('aaaaa'));
// 5aff159202c5d82ecfd14de49cc2c8c1f74964a25d78c549137c4ce714030fe7

let path = [
    keccak256(Buffer.from('bbbbb')), // 6f7733fcdd9ad2d9518045f77e45436634cc4866bdf57c8362f6b1bec8871e0b
    //keccak256(Buffer.from('ccccc')),
    //keccak256(Buffer.from('ddddd')),
    //keccak256(Buffer.from('eeeee')),
    //keccak256(Buffer.from('fffff'))
];

let root = Array.prototype.slice.call(leaf);
for (var i = 0; i < path.length; i++) {
    let hash = Array.prototype.slice.call(path[i]);
    root = root.concat(hash);
    root = keccak256(root);
}
console.log("\n");
// 2f0aa8d5e0662a368b8ebc868fe104ae4f18a4c68e3e0f05f2f6a40d831e6757

let pathStr = [];
path.map((hash) => { pathStr.push('0x' + hash.toString('Hex')); })

let args = ['0x' + root.toString('Hex'), '0x' + leaf.toString('Hex'), pathStr];

console.log(JSON.stringify(args));

let rootNum = BigInteger(root.toString('Hex'), 16)
console.log(`rootNum ${rootNum}`);
let rootBytes = toBigEndian(rootNum);
console.log(`rootBytes ${rootBytes}`);


let leafNum = BigInteger(leaf.toString('Hex'), 16);
console.log(`leafNum ${leafNum}`);
let leafBytes = toBigEndian(leafNum);
console.log(`leafBytes ${leafBytes}`);

let pathBytes = [];
const emptyHashBytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (var i = 0; i < 10; i++) {
    if (i >= path.length) {
        pathBytes.push(emptyHashBytes)
        continue;
    }
    let hashNum = BigInteger(path[i].toString('Hex'), 16);
    let hashBytes = toBigEndian(hashNum);
    pathBytes.push(hashBytes);
}
pathBytes.concat();
console.log(`pathBytes ${pathBytes}`);

let argsBytes = [rootBytes, leafBytes, leafBytes, leafBytes, leafBytes, leafBytes, leafBytes, leafBytes, leafBytes, pathBytes, pathBytes, pathBytes, pathBytes, pathBytes, pathBytes, pathBytes, pathBytes].concat();
console.log(`input args ${argsBytes}`);
console.log(`args bytes length ${argsBytes.length}`)

console.log("\n\n")

let data = keccak256(Buffer.from('aaaaa'));
let dataNum = BigInteger(data.toString('Hex'), 16);
let dataBytes = toBigEndian(dataNum);
let commitment = keccak256(Buffer.from(data));
let commitmentNum = BigInteger(commitment.toString('Hex'), 16);
let commitmentBytes = toBigEndian(commitmentNum);
console.log(`data ${dataBytes}`);
console.log(`data ${dataBytes.length}`);
console.log(`commitment ${commitmentBytes}`);
console.log(`commitment ${commitmentBytes.length}`);
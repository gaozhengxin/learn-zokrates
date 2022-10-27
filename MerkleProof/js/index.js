const { initialize } = require('zokrates-js');
const fs = require('fs');
const keccak256 = require('keccak256');

initialize().then((defaultProvider) => {
    let zokratesProvider = defaultProvider.withOptions({
        backend: "ark",
        curve: "bn128",
        scheme: "gm17"
    });

    var source = fs.readFileSync('../src/Depth10.zok', 'utf8');
    source = source.replace(`"./`,`"../src/`);
    // could not resolve module

    // compilation
    const artifacts = zokratesProvider.compile(source);
    console.log(JSON.stringify(artifacts));
    //const outPath = './build/out';
    //const r1csPath = './build/out.r1cs';
    const abiPath = './build/abi.json';
    fs.writeFile(abiPath, JSON.stringify(artifacts.abi), { flag: 'w+' }, err => { });
    console.log('abi: ' + abiPath);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);
    const vkPath = './build/verification.key';
    fs.writeFile(vkPath, JSON.stringify(keypair.vk), { flag: 'w+' }, err => { });
    console.log('verification key generated: ' + vkPath);

    const pkPath = './build/proving.key';
    const data = new Uint8Array(keypair.pk);
    fs.writeFile(pkPath, data, { flag: 'w+' }, err => { });
    console.log('proof key generated: ' + pkPath);

    // computation
    let args = [228, 12, 210, 203, 181, 36, 229, 228, 131, 232, 118, 3, 91, 150, 228, 46, 114, 89, 214, 233, 139, 95, 197, 106, 39, 112, 39, 229, 200, 227, 58, 99, 90, 255, 21, 146, 2, 197, 216, 46, 207, 209, 77, 228, 156, 194, 200, 193, 247, 73, 100, 162, 93, 120, 197, 73, 19, 124, 76, 231, 20, 3, 15, 231, 111, 119, 51, 252, 221, 154, 210, 217, 81, 128, 69, 247, 126, 69, 67, 102, 52, 204, 72, 102, 189, 245, 124, 131, 98, 246, 177, 190, 200, 135, 30, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    const { witness, output } = zokratesProvider.computeWitness(artifacts, args);

    const witnessPath = './run/witness';
    fs.writeFile(witnessPath, witness, { flag: 'w+' }, err => { });
    console.log('witness file: ' + witnessPath);

    const outputPath = './run/out.wtns';
    fs.writeFile(outputPath, output, { flag: 'w+' }, err => { });
    console.log('output file: ' + outputPath);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
    const proofPath = './run/proof.json';
    fs.writeFile(proofPath, JSON.stringify(proof), { flag: 'w+' }, err => { });
    console.log('proof is generated: ' + proofPath);

    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);
    const verifierPath = './build/verifier.sol';
    fs.writeFile(verifierPath, verifier, { flag: 'w+' }, err => { });
    console.log('solidity verifier is generated: ' + verifierPath);

    // or verify off-chain
    const isVerified = zokratesProvider.verify(keypair.vk, proof);
    console.log("verified = " + isVerified);
});

initialize();
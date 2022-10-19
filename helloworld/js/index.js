const { initialize } = require('zokrates-js');
const fs = require('fs');

initialize().then((defaultProvider) => {
    let zokratesProvider = defaultProvider.withOptions({
        backend: "ark",
        curve: "bn128",
        scheme: "gm17"
    });

    const source = fs.readFileSync('../src/root.zok', 'utf8');

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
    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["337", "113569"]);

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
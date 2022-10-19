const { initialize } = require('zokrates-js');
const fs = require('fs');

initialize().then((defaultProvider) => {
    let zokratesProvider = defaultProvider.withOptions({
        backend: "ark",
        curve: "bn128",
        scheme: "gm17"
    });

    const source = fs.readFileSync('../src/verifyEddsa.zok', 'utf8');

    // compilation
    const artifacts = zokratesProvider.compile(source);
    //console.log(JSON.stringify(artifacts));
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
    let R = ["2479187879965162928103390671492978232330796941733233823393975137495535563378", "20870489108582963708607938980655383515840031862561261829463336614444995981883"];
    let S = "9242676974012512186501849485768384742867178577371554337209533344847110693163";
    let A = ["14897476871502190904409029696666322856887678969656209656241038339251270171395", "16668832459046858928951622951481252834155254151733002984053501254009901876174"];
    // M0 = 7572cad4fee4b69695fc512f1b827ce3
    // M1 = f390c687acf166e7e1bbb583e01848df
    let M0 = ["0x7572", "0xcad4", "0xfee4", "0xb696", "0x95fc", "0x512f", "0x1b82", "0x7ce3"];
    let M1 = ["0xf390", "0xc687", "0xacf1", "0x66e7", "0xe1bb", "0xb583", "0xe018", "0x48df"];
    const { witness, output } = zokratesProvider.computeWitness(artifacts, [R, S, A, M0, M1]);

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
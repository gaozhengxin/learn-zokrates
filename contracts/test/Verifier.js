const { expect } = require("chai");
const fs = require('fs');

describe("Verifier", function () {
  it("Helloworld", async function () {
    const [owner] = await ethers.getSigners();

    console.log("owner " + owner.address);

    let BN256G2 = await ethers.getContractFactory("BN256G2");
    let bn256g2 = await BN256G2.deploy();
    console.log("bn256g2 " + bn256g2.address);

    let Verifier = await ethers.getContractFactory("Verifier", {
      libraries: {
        BN256G2: bn256g2.address,
      }
    });
    let verifier = await Verifier.deploy();
    console.log("verifier " + verifier.address);

    let proofdata = `{"scheme":"gm17","curve":"bn128","proof":{"a":["0x27635a45ea5ae43df7304f9e2511be965f13d455063c254e44c69e0a1b8b8168","0x121bb40c3f37575522ff86ed4e2d2b89bac6df84b8e1ac4c82c773ad7933900c"],"b":[["0x2a17d93a614cc79454d6bbbb8c116f089e78b6ad38b728cce9d06448fa1f0400","0x2bf620e286a1140cfbdbfe347aac490210353c4181ed81ac67da6772d7341729"],["0x23e3d51d59eee52349ba3cfb70a346864a17c72d5e39587ea2fdbbf9cfb1672a","0x18c04d0168732176d5870fd37b5db036bb30761866a73656d5cb7ea4c536c1c8"]],"c":["0x198c06a0fda8c317ef63e9690975cb0b8e14b24cb26cd0cbf35e7838ede8a8e4","0x0263639f3f609929df18adf3da4b130cf0b4cab273c1515adff5a17963682678"]},"inputs":["0x000000000000000000000000000000000000000000000000000000000001bba1"]}`;
    let proof = JSON.parse(proofdata);
    console.log(proof.proof);
    let tx = await verifier.verifyTx({ a: proof.proof.a, b: proof.proof.b, c: proof.proof.c }, [113569]);
    let rc = await tx.wait();
    console.log(rc);
  })
});

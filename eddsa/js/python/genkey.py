from zokrates_pycrypto.field import FQ
from zokrates_pycrypto.eddsa import PublicKey, PrivateKey
from zokrates_pycrypto.utils import to_bytes
import hashlib

class TestEdDSA():
    def test_signverify(self):
        key = FQ(1997011358982923168928344992199991480689546837621580239342656433234255379025)
        
        sk = PrivateKey(key)
        print(sk)
        
        msg = b'123'
        print(msg)

        p = b"".join(to_bytes(_) for _ in msg)
        digest = hashlib.sha256(p).digest()
        print("hash hex ", digest.hex())
        print("hash dec", int(digest.hex(), 16))
        # M0 7572cad4fee4b69695fc512f1b827ce3 = 156115711270704207970875988518746881251
        # M1 f390c687acf166e7e1bbb583e01848df = 323754120389790293521206429043387812063
        
        sig = sk.sign(msg)
        print("signature ", sig)
        
        pk = PublicKey.from_private(sk)
        print(pk)
        
        print(pk.verify(sig, msg))

TestEdDSA().test_signverify()
zokrates compile -i ../src/verifyEddsa.zok
zokrates setup -s gm17
#zokrates compute-witness -a [TODO]
#//zokrates generate-proof -s gm17
zokrates export-verifier
#zokrates verify
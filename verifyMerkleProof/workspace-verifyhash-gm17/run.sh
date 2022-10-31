zokrates compile -i ../src/VerifyHash.zok
zokrates setup -s gm17
zokrates compute-witness --stdin < data.input
zokrates generate-proof -s gm17
zokrates export-verifier
zokrates verify
zokrates compile -i ../src/verifyCount.zok
zokrates setup -s gm17
zokrates compute-witness --stdin < data.input
zokrates generate-proof -s gm17 # 10s
zokrates export-verifier
zokrates verify # < 1s
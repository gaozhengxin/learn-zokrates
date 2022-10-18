zokrates compile -i ../src/root.zok
zokrates setup
zokrates compute-witness -a 337 113569
zokrates generate-proof
zokrates export-verifier
zokrates verify
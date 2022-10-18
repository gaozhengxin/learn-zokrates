zokrates compile -i ../src/root.zok
zokrates setup -s gm17
zokrates compute-witness -a 337 113569
zokrates generate-proof -s gm17
zokrates export-verifier
zokrates verify
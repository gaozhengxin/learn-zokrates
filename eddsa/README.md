### 参数
签名是 private
公钥和 message 默认是 public

签名是 `(R,S)`
`R` 是一个曲线点，用两个 field elements
`S` 是一个 field element

公钥是 `A`
`A` 是一个曲线点，用两个 filed elements 表示

message 是 `(M0, M1)`
`M0` 是前 256 bit，用 `field[256]` 表示
`M1` 是后 256 bit

没有指定 hash 算法，但 hash 要 512 位

`context` 是曲线参数
[context 定义](https://github.com/Zokrates/ZoKrates/blob/develop/zokrates_stdlib/stdlib/ecc/babyjubjubParams.zok#L6)
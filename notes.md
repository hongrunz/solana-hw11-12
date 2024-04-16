## Notes

1. `metadata.address` not generated with `anchor test`
Fix: Do not include async in top level typescript test

2. idl generated with wrong program name
Solution: Do not include `-` characters in program name. Make sure `Cargo.toml` has correct library name.
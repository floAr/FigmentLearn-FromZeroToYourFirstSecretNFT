node .\contract\create-account.js

--------------------------------------------------------------------------------------------

node .\contract\deploy-nft.js

--------------------------------------------------------------------------------------------

npm init svelte@next frontend

cd .\frontend\
npm install

--------------------------------------------------------------------------------------------

cargo generate --git https://github.com/baedrik/snip721-reference-impl --name my-snip721

cd my-snip721

cargo wasm

docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer

gunzip contract.wasm.gz

--------------------------------------------------------------------------------------------

npm init svelte@next frontend
cd my-app
npm install
npm run dev

--------------------------------------------------------------------------------------------

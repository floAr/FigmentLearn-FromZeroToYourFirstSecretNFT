const {
  Wallet,
  SecretNetworkClient
} = require("secretjs");
const path = require('path');
const fs = require("fs");
const { program } = require('commander');

// Load environment variables
require("dotenv").config({ path: '../.env'});


const main = async ({ name = '', symbol = '', entropy ='', label = "sSCRT" } = {}) => {

  const mnemonic = process.env.VITE_MNEMONIC;
  const grpcWebUrl = process.env.VITE_SECRET_GRPC_URL;
  const chainId = process.env.VITE_SECRET_CHAIN_ID;
  const wallet = new Wallet(mnemonic);

  console.log(`Wallet address=${wallet.address}`);
  console.log("Uploading contract");

  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl,
    chainId,
    wallet: wallet,
    walletAddress: wallet.address,
  });

  const wasmByteCode = fs.readFileSync(
    path.join(__dirname, '/../my-snip721/contract.wasm.gz')
  );
  const tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasmByteCode,
      source: "",
      builder: "",
    },
    {
      gasLimit: 5_000_000,
    },
  );
  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value,
  );
  console.log(`codeId: ${codeId}`);

  const codeHash = await secretjs.query.compute.codeHash(codeId);
  console.log(`codeHash: ${codeHash}`)

  // Get the code ID from the receipt
  const initMsg = {
    /// name of token contract
    name,
    /// token contract symbol
    symbol,
    /// entropy used for prng seed
    entropy,
    /// optional privacy configuration for the contract
    config: {
      public_owner: true,
      enable_burn: true
    },
  };
  console.log('instantiating contract');
  const instantiateResponse = await secretjs.tx.compute.instantiateContract(
    {
      sender: wallet.address,
      codeId: codeId,
      codeHash, // optional but way faster
      initMsg,
      label,
      initFunds: [], // optional
    },
    {
      gasLimit: 100_000,
    },
  );
  
  if (instantiateResponse?.arrayLog) {
    const contractAddress = instantiateResponse.arrayLog.find(
      (log) => log.type === "message" && log.key === "contract_address",
    ).value;
    console.log(`contractAddress: ${contractAddress}`);  
    console.log('Created contract succesfully!');
  } else if (instantiateResponse?.rawLog) {
    console.log(instantiateResponse.rawLog);
  }
}


program
  .option('-n, --name <string>', 'Contract Name', '')
  .option('-s, --symbol <string>', 'Contract Symbol', '')
  .option('-e, --entropy <string>', 'Entroy', '')
  .option('-l, --label <string>', 'Contract Label', 'sSCRT');

program.parse();
const options = program.opts();

main(options).catch((err) => {
  console.error(err);
});

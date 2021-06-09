const {
  EnigmaUtils,
  Secp256k1Pen,
  SigningCosmWasmClient,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} = require("secretjs");

// Requiring the dotenv package in this way
// lets us use environment variables defined in .env
require("dotenv").config();

const customFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
};

const main = async () => {
  const httpUrl = process.env.VITE_SECRET_REST_URL;
  // Use key created in tutorial #2
  const mnemonic = process.env.VITE_MNEMONIC;

  // A pen is the most basic tool you can think of for signing.
  // This wraps a single keypair and allows for signing.
  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic).catch((err) => {
    throw new Error(`Could not get signing pen: ${err}`);
  });

  // Get the public key
  const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);

  // get the wallet address
  const accAddress = pubkeyToAddress(pubkey, "secret");

  // initialize client
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

  const client = new SigningCosmWasmClient(
    httpUrl,
    accAddress,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed,
    customFees
  );
  console.log(`Wallet address=${accAddress}`);

  // 1. Define your metadata
  const publicMetadata = {
    name: "my first nft",
    description: "it is so cool to have this",
    image: "hello friend",
  };
  const privateMetadata = {
    name: "s my first nft",
    description: "s it is so cool to have this",
    image: "s hello friend",
  };
  // 2. Mint a new token to yourself
  const handleMsg = {
    mint_nft: {
      owner: accAddress,
      public_metadata: publicMetadata,
      private_metadata: privateMetadata,
    },
  };

  console.log("Minting yourself a nft");
  const response = await client
    .execute(process.env.VITE_SECRET_NFT_CONTRACT, handleMsg)
    .catch((err) => {
      throw new Error(`Could not execute contract: ${err}`);
    });
  console.log("response: ", response);
};

main().catch((err) => {
  console.error(err);
});

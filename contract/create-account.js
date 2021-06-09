const {
    CosmWasmClient, Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey,
  } = require('secretjs');
  
  const { Bip39, Random } = require('@iov/crypto');
  
  require('dotenv').config();
  
  const main = async () => {
    // Create random address and mnemonic
    const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  
    // This wraps a single keypair and allows for signing.
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic)
      .catch((err) => { throw new Error(`Could not get signing pen: ${err}`); });
  
    // Get the public key
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
  
    // Get the wallet address
    const accAddress = pubkeyToAddress(pubkey, 'secret');
  
    // Query the account
    const client = new CosmWasmClient(process.env.VITE_SECRET_REST_URL);
    const account = await client.getAccount(accAddress)
      .catch((err) => { throw new Error(`Could not get account: ${err}`); });
  
    console.log('mnemonic: ', mnemonic);
    console.log('address: ', accAddress);
    console.log('account: ', account);
  };
  
  main().catch((err) => {
    console.error(err);
  });
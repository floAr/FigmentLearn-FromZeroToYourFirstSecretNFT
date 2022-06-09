const {
    Wallet
  } = require('secretjs');
  
  
  require('dotenv').config({ path: '../.env' });
  
  const main = async () => {
    // Create random address and mnemonic
  
    const wallet = new Wallet();

    const myAddress = wallet.address;


    console.log('mnemonic: ', wallet.mnemonic);
    console.log('address: ', wallet.address);
  };
  
  main().catch((err) => {
    console.error(err);
  });
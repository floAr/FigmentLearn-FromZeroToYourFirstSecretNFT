const {
    Wallet,
    SecretNetworkClient,
    MsgExecuteContract,
  } = require("secretjs");
  const { program } = require('commander');
  // Load environment variables
  require("dotenv").config({ path: '../.env' });
  
  
  const main = async () => {
    
    const contractAddress = process.env.VITE_SECRET_NFT_CONTRACT;
    const contractHash = process.env.VITE_SECRET_CONTRACT_HASH;
    const viewingKey = process.env.VITE_SECRET_VIEWING_KEY
    const grpcWebUrl = process.env.VITE_SECRET_GRPC_URL;
    const chainId = process.env.VITE_SECRET_CHAIN_ID;
    const mnemonic = process.env.VITE_MNEMONIC;
    
    const wallet = new Wallet(mnemonic);
    const secretjs = await SecretNetworkClient.create({
      grpcWebUrl,
      chainId,
      wallet: wallet,
      walletAddress: wallet.address,
    });
   
   
    const msg = {
        set_viewing_key: {
            key: viewingKey,
        },
    };

    console.log('Set viewing key');
    const setViewingKey = new MsgExecuteContract({
        sender: wallet.address,
        contractAddress: contractAddress,
        codeHash: contractHash, // optional but way faster
        msg,
        sentFunds: [], // optional
      });

    const response = await secretjs.tx.broadcast([setViewingKey], {
        gasLimit: 200_000,
    });

    console.log('set viewing key succesful!');
  };
  

  main().catch((err) => {
    console.error(err);
  });
  
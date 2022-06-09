const {
  Wallet,
  SecretNetworkClient,
} = require("secretjs");

// Load environment variables
require("dotenv").config({ path: '../.env'});


const main = async () => {
  
  const contractAddress = process.env.VITE_SECRET_NFT_CONTRACT;
  const contractHash = process.env.VITE_SECRET_CONTRACT_HASH;
  const grpcWebUrl = process.env.VITE_SECRET_GRPC_URL;
  const chainId = process.env.VITE_SECRET_CHAIN_ID;
  const mnemonic = process.env.VITE_MNEMONIC;
  console.log(contractAddress)
  
  const wallet = new Wallet(mnemonic);
  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl,
    chainId,
    wallet: wallet,
    walletAddress: wallet.address,
  });
 
  console.log(`Wallet address=${wallet.address}`);

  // 1. Get a list of all tokens
  let queryMsg = {
    tokens: {
      owner: wallet.address,
    },
  };

  console.log("Reading all tokens");
  const response = await secretjs.query.compute.queryContract({
    contractAddress: contractAddress,
    codeHash: contractHash, // optional but way faster
    query: queryMsg,
  });

  console.log("response: ", response);
  if (response.token_list.tokens.length == 0)
    console.log(
      "No token was found for you account, make sure that the minting step completed successfully"
    );


  if (response.token_list?.tokens?.length) {
    const token_id = response.token_list.tokens[0];

    // 2. Query the public metadata
  
    // 3. Query the token dossier
    queryMsg = {
      nft_dossier: {
        token_id,
      },
    };
  
    console.log(`Query dossier of token #${token_id}`);
    try {
      const dosserierResponse = await secretjs.query.compute.queryContract({
        contractAddress: contractAddress,
        codeHash: contractHash, // optional but way faster
        query: queryMsg,
      })
      console.log("response: ", response);
    } catch(ex) {
      console.log(ex);
    }

  }

  // 4. Set our viewing key

  // 5. Query the dossier again
};

main().catch((err) => {
  console.error(err);
});

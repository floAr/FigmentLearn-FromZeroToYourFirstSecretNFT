/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const { SecretNetworkClient, Wallet, MsgExecuteContract } = require('secretjs')
const { program } = require('commander');

require("dotenv").config({ path: '../.env'});



const main = async ({ id }) => {

    const contractAddress = process.env.VITE_SECRET_NFT_CONTRACT;
    const codeHash = process.env.VITE_SECRET_CONTRACT_HASH;
    const grpcWebUrl = process.env.VITE_SECRET_GRPC_URL;
    const chainId = process.env.VITE_SECRET_CHAIN_ID;
    const mnemonic = process.env.VITE_MNEMONIC;


    const wallet = new Wallet(mnemonic);


    const secretjs = await SecretNetworkClient.create({
        grpcWebUrl: grpcWebUrl,
        chainId: chainId,
        wallet: wallet,
        walletAddress: wallet.address,
    });  

    const msg = {
        "burn_nft": {
            "token_id": id,
        }
    };
  
    const burnNFT = new MsgExecuteContract({
        sender: wallet.address,
        contractAddress,
        codeHash, // optional but way faster
        msg,
        sentFunds: [], // optional
      });

      console.log('burning nft!')
    const response = await secretjs.tx.broadcast([burnNFT], {
        gasLimit: 200_000,
    });
    if (response.jsonLog?.generic_err) {
        throw new Error(response.jsonLog?.generic_err.msg);
    }
    console.log('NFT Burned!');
};

program
  .requiredOption('-i, --id <string>', 'ID to burn');

program.parse();
const options = program.opts();

main(options).catch(err => {
    console.log(err);
})



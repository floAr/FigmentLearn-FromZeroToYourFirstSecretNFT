/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const { program } = require('commander');
const { SecretNetworkClient, Wallet, MsgExecuteContract } = require('secretjs')

require("dotenv").config({ path: '../.env'});



const backgrounds = [
    'bafkreie5xlaih4ctxwg4bt3txapwm52x567vyx37zpfjg5tpdjohrhiyg4', // black
    'bafkreifvf3qqwxfuqqqy22qjwixwda4xv5rreejpbxwixw5i3w36bhu62a', // topo
    'bafkreid7hhirnijgwgke4mmmgo2r3b3jivhu3mzzmjso3ue5j53xgadoqm', // swirl
    'bafybeihvkye5ymhzolurmhzpezl3hpgvqvxjpmverdims54xn4gkf3q37q'  // gif
];

const clothes = [
    'bafkreiclrgcak47hup5wxshnvmcrt4ebobqmite7ufyzm2gft35sbttlmi', // blue
    'bafkreieaghxtcppw5bwjmfkpncnqtesrir5vmup2djdijhntdx4pmsva7q', // green
    'bafkreibxhw6qptragdk7ohqfvpni4ky2pdvsks7xffgkzdwxr6n3p7ttbu', // orange
    'bafkreifs2m2nwacl2fkxu6bihdw3tkme4zm2bizqfpxfkcviu6pkyzfw34', // red
    'bafkreie7znfh4uyoq2d365kkkdsk2ek24xhhlrnacjirdk6f6maykyzeqq', // yellow
    'bafkreigdxic444ilxzm5y46dihaqcifsh4rwhjqetnpmkt5e2xrboh47l4'  // rainbow
];

const eyes = [
    'bafkreibhzdul264ir2nfcut6vhgafilmcrbcxkz563utdhstvogccupqvu', // none
    'bafkreibafucd2hpba4rrwba4h4saco62rwrjurommh3barctllxcc7ryk4', // happy
    'bafkreiaqyqavdgctb4rvju73phbjduzz74oqylzl3rlgl6ij3ion5ebxri', // angry
    'bafkreifqze3zepyfo6f4eve5xteafvmacefmx3szgjltnky32lhterzmxq', // bushy
    'bafkreihi65qusf73igwhrzjqcwxmme7wo5jvzayl3k73mz2zagg5mi7hsy'  // xx
];


const main = async ({ name } = {}) => {

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

    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const cloth = clothes[Math.floor(Math.random() * clothes.length)];
    const eye = eyes[Math.floor(Math.random() * eyes.length)];

    const msg = {
        mint_nft: {
            owner: wallet.address,
            public_metadata: {
                extension: {
                    name: name,
                }
            },
            private_metadata: {
                extension: {
                    name: background,
                    description: cloth,
                    image: eye
                }

            },
        },

    };
    const mintNftMsg = new MsgExecuteContract({
        sender: wallet.address,
        contractAddress,
        codeHash, // optional but way faster
        msg,
        sentFunds: [], // optional
    });
    console.log("Minting yourself a nft");
    const {tx} = await secretjs.tx.broadcast([mintNftMsg], {
        gasLimit: 200_000,
    });
    console.log(JSON.stringify(tx.body.messages[0].value.msg, null, 2));
};

program
  .option('-n, --name <string>', 'NFT Name', 'My NFT Name')

program.parse();
const options = program.opts();

main(options).catch(err => {
    console.log(err);
})



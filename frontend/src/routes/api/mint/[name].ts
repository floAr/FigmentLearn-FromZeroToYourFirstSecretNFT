/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// Load SecretJS components
import { encodeSecp256k1Pubkey, EnigmaUtils, pubkeyToAddress, Secp256k1Pen, SigningCosmWasmClient } from 'secretjs'

const customFees = {
    upload: {
        amount: [{ amount: '2000000', denom: 'uscrt' }],
        gas: '2000000',
    },
    init: {
        amount: [{ amount: '500000', denom: 'uscrt' }],
        gas: '500000',
    },
    exec: {
        amount: [{ amount: '500000', denom: 'uscrt' }],
        gas: '500000',
    },
    send: {
        amount: [{ amount: '80000', denom: 'uscrt' }],
        gas: '80000',
    },
};


const httpUrl = import.meta.env.VITE_SECRET_REST_URL as string;
const mnemonic = import.meta.env.VITE_MNEMONIC as string;
const contract = import.meta.env.VITE_SECRET_NFT_CONTRACT as string;



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

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
    const { name } = params

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

    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const cloth = clothes[Math.floor(Math.random() * clothes.length)];
    const eye = eyes[Math.floor(Math.random() * eyes.length)];

    const handleMsg = {
        mint_nft: {
            owner: accAddress,
            public_metadata: {
                name: name,
            },
            private_metadata: {
                name: background,
                description: cloth,
                image: eye
            },
        },
    };

    console.log("Minting yourself a nft");
    const response = await client
        .execute(contract, handleMsg)
        .catch((err) => {
            throw new Error(`Could not execute contract: ${err}`);
        });
    return {
        body: response
    }
};

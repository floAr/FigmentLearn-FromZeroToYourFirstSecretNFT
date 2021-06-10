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
const viewing_key = import.meta.env.VITE_SECRET_VIEWING_KEY as string;
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
    const { id } = params

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

    const queryMsg = {
        nft_dossier: {
            token_id: id,
            viewer: {
                address: accAddress,
                viewing_key: viewing_key,
            },
        },
    };
    const response = await client
        .queryContractSmart(contract, queryMsg)
        .catch((err) => {
            throw new Error(`Could not execute contract: ${err}`);
        });
    console.log("response: ", response);
    if (response == null)
        console.log(
            "No token was found for you account, make sure that the minting step completed successfully"
        );
    return {
        body: {
            public_metadata: response.nft_dossier.public_metadata,
            private_metadata: response.nft_dossier.private_metadata
        }
    }
};

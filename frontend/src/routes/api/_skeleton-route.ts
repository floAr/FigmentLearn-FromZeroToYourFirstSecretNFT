/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// Load SecretJS components
import { encodeSecp256k1Pubkey, EnigmaUtils, pubkeyToAddress, Secp256k1Pen, SigningCosmWasmClient } from 'secretjs'
import type { HandleMsg, QueryMsg } from 'src/snip721';

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

    // const msg:QueryMsg = {}
    // const msg:HandleMsg = {}

    const response = await client
        .queryContractSmart(contract, msg)
        // .execute(contract, msg)
        .catch((err) => {
            throw new Error(`Could not execute contract: ${err}`);
        });
    console.log("response: ", response);
    if (response == null)
        console.log(
            "Error executing / querying contract"
        );
    return {
        body: {
            //data
        }
    }
};

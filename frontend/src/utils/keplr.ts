import { SecretNetworkClient } from 'secretjs';

const chainId = import.meta.env.VITE_SECRET_CHAIN_ID as string;
const chainName = import.meta.env.VITE_SECRET_CHAIN_NAME as string;
const grpcWebUrl = import.meta.env.VITE_SECRET_GRPC_URL as string;
const rpc = import.meta.env.VITE_SECRET_KEPLR_RPC_URL;
const rest = import.meta.env.VITE_SECRET_KEPLR_REST_URL;

let secretClient: SecretNetworkClient;

export const login = async (): Promise<SecretNetworkClient> => {
    if (secretClient) {
        return secretClient;
    }
    await window.keplr.experimentalSuggestChain({
        chainId,
        chainName,
        rpc,
        rest,
        bip44: {
            coinType: 529,
        },
        bech32Config: {
            bech32PrefixAccAddr: "secret",
            bech32PrefixAccPub: "secretpub",
            bech32PrefixValAddr: "secretvaloper",
            bech32PrefixValPub: "secretvaloperpub",
            bech32PrefixConsAddr: "secretvalcons",
            bech32PrefixConsPub: "secretvalconspub",
        },
        currencies: [
            {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
            coinGeckoId: "secret",
            },
        ],
        feeCurrencies: [
            {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
            coinGeckoId: "secret",
            },
        ],
        stakeCurrency: {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
            coinGeckoId: "secret",
        },
        coinType: 529,
        gasPriceStep: {
            low: 0.1,
            average: 0.25,
            high: 1,
        },
        features: ["secretwasm", "stargate", "ibc-transfer", "ibc-go"],
    });
    await window.keplr.enable(chainId);

    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(chainId);

    const [{ address }] = await keplrOfflineSigner.getAccounts();
    secretClient = await SecretNetworkClient.create({
        grpcWebUrl,
        chainId,
        wallet: keplrOfflineSigner,
        walletAddress: address,
        encryptionUtils: window.getEnigmaUtils(chainId),
    });

    return secretClient;
    
}


export const getClient = (): SecretNetworkClient => {
    return secretClient;
}
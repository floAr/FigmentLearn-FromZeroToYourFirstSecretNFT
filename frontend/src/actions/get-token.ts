import { getClient  } from "../utils/keplr";


type TokenResponse = {
    nft_dossier: {
        private_metadata: {
            extension: {
                description: string,
                name: string,
                image: string
            }
        },
        public_metadata: {
			extension: {
				name: string;
				description: string;
				image: string;
			}
		};
    }
}

type GetTokenProps = {
    contractAddress: string,
    codeHash: string,
    id: number,
    viewingKey: string,
};

export const getToken = async ({ contractAddress, codeHash, id, viewingKey }: GetTokenProps): Promise<TokenResponse> => {
    const client = getClient();
    
    const queryMsg = {
        nft_dossier: {
            token_id: id,
            viewer: {
                address: client.address,
                viewing_key: viewingKey,
            },
        },
    };

    console.log("Reading all tokens");
    const response: TokenResponse = await client.query.compute.queryContract({
        contractAddress,
        codeHash, // optional but way faster
        query: queryMsg,
    });
    return response;
}
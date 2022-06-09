import { getClient  } from "../utils/keplr";


type TokensResponse = {
    token_list: {
        tokens: string[]
    }
}

type GetTokensProps = {
    contractAddress: string,
    codeHash: string
};

export const getTokens = async ({ contractAddress, codeHash }: GetTokensProps): Promise<TokensResponse> => {
    const client = getClient();
    
    const queryMsg = {
        tokens: {
            owner: client.address,
        },
    };

    console.log("Reading all tokens");
    const response: TokensResponse = await client.query.compute.queryContract({
        contractAddress,
        codeHash, // optional but way faster
        query: queryMsg,
    });

    return response;
}
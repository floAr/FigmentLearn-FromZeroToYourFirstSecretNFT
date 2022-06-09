import { getClient } from "../utils/keplr";


type InstantiateProps = {
    name?: string,
    symbol?: string,
    entropy?: string,
    codeId: number,
    codeHash: string,
    label: string
}

export const instantiate = async (props: InstantiateProps): Promise<string> => {
    const {
        name = '',
        symbol = '',
        entropy = '',
        codeId,
        codeHash,
        label,
    } = props
    const client = await getClient();

    const initMsg = {
        /// name of token contract
        name,
        /// token contract symbol
        symbol,
        /// entropy used for prng seed
        entropy,
        /// optional privacy configuration for the contract
        config: {
            public_owner: true,
            enable_burn: true
        },
    };
    const instantiateResponse = await client.tx.compute.instantiateContract({
        sender: client.address,
        codeId: codeId,
        codeHash, // optional but way faster
        initMsg,
        label,
        initFunds: [], // optional
    }, {
        gasLimit: 100_000,
    });
  
      if (instantiateResponse?.arrayLog) {
        const contractAddress = instantiateResponse.arrayLog.find(
          (log) => log.type === "message" && log.key === "contract_address",
        ).value;
        if (contractAddress) {
            console.log(`contractAddress: ${contractAddress}`);  
            console.log('Created contract succesfully!');
            return contractAddress;
        }
      }

    console.log(instantiateResponse);
    throw new Error('could not instatiate contract');
}
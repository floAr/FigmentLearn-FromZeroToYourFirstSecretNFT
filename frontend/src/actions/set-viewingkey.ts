import { MsgExecuteContract } from 'secretjs';
import { getClient } from "../utils/keplr";


type SetViewingKeyProps = {
    contractAddress: string,
    codeHash: string,
    viewingKey: string,
}
export const setViewingKey = async ({ contractAddress, codeHash, viewingKey }: SetViewingKeyProps): Promise<void> => {
    const secretjs = await getClient();
    
    const msg = {
        set_viewing_key: {
            key: viewingKey,
        },
    };

    const mintNftMsg = new MsgExecuteContract({
        sender: secretjs.address,
        contractAddress,
        codeHash, // optional but way faster
        msg,
        sentFunds: [], // optional
    });
    console.log("Minting yourself a nft");
    await secretjs.tx.broadcast([mintNftMsg], {
        gasLimit: 200_000,
    });
}
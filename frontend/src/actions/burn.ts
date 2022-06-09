import { MsgExecuteContract } from 'secretjs';
import { getClient } from "../utils/keplr";

type BurnProps = {
    id: number,
    contractAddress: string,
    codeHash: string,
}

export const burn = async ({ id, contractAddress, codeHash }: BurnProps): Promise<void> => {
    const secretjs = await getClient();

    const msg = {
        "burn_nft": {
            "token_id": id,
        }
    };

    const mintNftMsg = new MsgExecuteContract({
        sender: secretjs.address,
        contractAddress,
        codeHash, // optional but way faster
        msg,
        sentFunds: [], // optional
    });
    console.log("Burning nft");
    const resp = await secretjs.tx.broadcast([mintNftMsg], {
        gasLimit: 200_000,
    });
    console.log('minted', resp);
}
import { fromNano, internal, TonClient, Address, WalletContractV4, TonClient4 } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { KeyPair, mnemonicToPrivateKey } from "ton-crypto";
import * as dotenv from "dotenv";
dotenv.config();

// const string = `data:application/json,{"p":"ton-20","op":"mint","tick":"tongochi","amt":"1000000000000"}`;
const string = `data:application/json,{"p":"ton-20","op":"mint","tick":"bolt20","amt":"1000000000"}`;
// const string = `data:application/json,{"p":"ton-20","op":"mint","tick":"ton","amt":"10000000000"}`;
// const string = `data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}`;

async function sendTransaction(wallet: WalletContractV4, keyPair: KeyPair) {
    const client = new TonClient4({
        endpoint: "https://mainnet-v4.tonhubapi.com",
        // endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    let wallet_contract = client.open(wallet);
    let secretKey = keyPair.secretKey;
    let seqno: number = await wallet_contract.getSeqno();
    let balance: bigint = await wallet_contract.getBalance();
    console.log("Current deployment wallet balance: ", fromNano(balance).toString(), "💎TON");
    console.log("Deploying contract: ", wallet.address.toString());

    // Check if wallet has createTransfer method
    if (typeof wallet.createTransfer !== "function") {
        throw new Error("Invalid wallet contract object");
    }

    let tx = wallet.createTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: wallet.address,
                value: 0n,
                body: string,
            }),
            internal({
                to: wallet.address,
                value: 0n,
                body: string,
            }),
            internal({
                to: wallet.address,
                value: 0n,
                body: string,
            }),
            internal({
                to: wallet.address,
                value: 0n,
                body: string,
            }),
        ],
    });

    await wallet_contract.send(tx);
}

(async () => {
    let mnemonics = (process.env.mnemonics_2 || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let workchain = 0;
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    setInterval(async () => {
        try {
            await sendTransaction(wallet, keyPair);
            console.log("Transaction sent at", new Date().toLocaleTimeString());
            console.log("Minting: ", string, "\n");
        } catch (error) {
            console.error("Error in transaction:", error, "\n");
        }
    }, 12000); // Send transaction every 5 seconds
})();

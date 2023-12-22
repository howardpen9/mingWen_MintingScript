const fs = require('fs');
const TonWeb = require("tonweb");
const TonWebMnemonic = require("tonweb-mnemonic");

const tonweb = new TonWeb(new TonWeb.HttpProvider("https://mainnet.tonhubapi.com/jsonRPC"));
const WalletClass = tonweb.wallet.all.v4R2;


async function createWalletsFromFile(filePath) {
    const wallets = [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const mnemonics = fileContent.split('\n');

    for (let mnemonic of mnemonics) {
        if (mnemonic) {
            const seed = await TonWebMnemonic.mnemonicToSeed(mnemonic.split(" "));
            const keyPair = TonWeb.utils.keyPairFromSeed(seed);
            const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });
            const address = await wallet.getAddress();
            wallets.push({ wallet, keyPair, address });
        }
    }

    return wallets;
}

// 发送交易
async function sendTransaction(wallet, keyPair) {
    const seqno = await wallet.methods.seqno().call();
    const transfer = wallet.methods.transfers({
        seqno: seqno,
        secretKey: keyPair.secretKey,
        messages: [
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload:
                    'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload:
                    'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload:
                    'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload:
                    'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
        ],
    });

    try {
        const result = await transfer.send();
        console.log('\x1b[32m%s\x1b[0m', '铭文铸造成功 Transaction sent:', result);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

function sendAllTransactions(wallets) {
    wallets.forEach(wallet => {
        sendTransaction(wallet.wallet, wallet.keyPair);
    });
}


// 主函数
async function main() {
    const wallets = await createWalletsFromFile('mnemonics.txt');
    sendAllTransactions(wallets);

    setInterval(() => {
        sendAllTransactions(wallets);
    }, 60000); // 每60秒发送一次交易
}

main().catch(console.error);
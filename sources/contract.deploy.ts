import { beginCell, contractAddress, toNano, Address, WalletContractV4 } from "ton";
import { mnemonicToPrivateKey } from "ton-crypto";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
// ================================================================= //
import { MingWen } from "./output/SampleJetton_MingWen";
// ================================================================= //

let op_code = "deploy";
let tick_name = "nano";
let max_supply = "2100000000000000000";
let limit = "100000000000";
let amt = "100000000000";
const string_first = `data:application/json,{"p":"ton-20","op":"${op_code}","tick":"${tick_name}","max":"${max_supply}","amt":"${amt}"}`; // Change to the content URL you prepared

(async () => {
    let mnemonics = (process.env.main_net || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let workchain = 0;
    let wallet = WalletContractV4.create({
        workchain,
        publicKey: keyPair.publicKey,
    });

    let Content = beginCell().storeStringRefTail(string_first).endCell();

    // The Transaction body we want to pass to the smart contract
    let body = beginCell().storeUint(0, 32).storeStringTail("Mint").endCell();

    // Replace owner with your address
    // let owner = Address.parse(wallet.address.toString());
    let owner = Address.parse("EQCqMkJZltVvbeNbYDlnwxdZ3Dw8vJ-vhRk9qcbYQTteU0sE");

    // Prepare the initial code and data for the contract
    let init = await MingWen.init(Content, owner);

    let address = contractAddress(0, init);
    let deployAmount = toNano("0.25");
    let testnet = false;

    // Do deploy
    await deploy(init, deployAmount, body, testnet);
    printHeader("ton-20 Mint Contract Deployed");
    printAddress(address);
})();

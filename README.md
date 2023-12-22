# 🚚 MingWen(銘文) Contract Example

![Alt text](image.png)

> [!WARNING]
> Use by your own risk!

So there has 2 ways to call & send the txs: 1) Deploy a smart contract and by calling the contract, you can maximum mint 4-times per transaction. 2) By calling the wallet by setting the .`env` file, you can mint through the RPC by your wallet. (I prefer the first one)

_NOTICE: Be sure what content you want to pop to the blockchain, and be sure what you are doing. I am not responsible for any loss or damage caused by this repo._

## First Method - Through the .env file to call the wallet contract

change the `mnemonics` in `.env` file, and run `yarn mint` to mint the token through the RPC by your wallet.

## Second Method - Through the smart contract to call the wallet contract

> [!WARNING]
> Remember to change your address here in `contract.deploy.ts` file, so only the owner can mint the token through the contract.

change the `owner` parameter than run `yarn deploy` to deploy the contract. The contract will be deployed to the blockchain, and you can call the contract by the `mint` function to mint the token.(only owner can mint the token)

![Alt text](image-1.png)

### Usage

```bash
yarn build # To build & compile the contract
yarn deploy # To deploy contract
---
yarn mint # To mint the ton-20 one by one throught the RPC by your wallet
```

-   Tact-lang Group Chat: https://t.me/tactlang
-   Ton Dev[EN]: https://t.me/tondev_eng
-   Ton Dev[中文]: https://t.me/tondev_zh

## Licence

MIT

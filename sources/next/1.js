const { TonClient, toNano, Address, beginCell, MultisigWallet, MultisigOrder, MultisigOrderBuilder, WalletContractV4, SendMode, Dictionary, internal,Sender } = require('ton');
const { mnemonicToPrivateKey, sign } = require('ton-crypto');
const { getHttpEndpoint } = require('@orbs-network/ton-access');

const Opcodes = {
    op_transfer_notification:  0x7362d09c,
    op_internal_transfer: 0x178d4519,

    query_id_create_redenvelope: 0x186a1,
    query_id_withdraw_remain_token: 0x186a2,
    query_id_grab_with_sig: 0x186a3,
    query_id_grab_by_owner: 0x186a4,
}

const red_envelope_token_v2 = 'EQA4b0BYUoWrIYvLj_QhFsM24A4CzEs3ra2dt_WM7e7s1jGY';
const red_envelope_v2 = 'EQAadhZXM0AeikM-zM-wRiSgK-ZvwAt6bvnKRaihQOAeyLRC';

async function createTonRedpacket(){
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    let mnemonic = [
        'recycle',  'evidence', 'tube',
        'two', 'lab', 'cram',
        'secret', 'afraid', 'draft',
        'brown',  'jump',  'exchange',
        'only', 'write',  'pole',
        'drink', 'vacuum',  'brisk',
        'nephew',  'orchard', 'steel',
        'antique', 'pattern', 'night'
    ];
    const kpr = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: kpr.publicKey });

    let creator01 = Address.parse('UQCno6ub3zODCROMd5EXJLkaLcA-Ziz9hA959SNhchtL9DA_');
    const provider = client.provider(creator01);
    const sender = wallet.sender(provider,kpr.secretKey);
    const redpacketId = 19;
    const amount = '0.15';

    await provider.internal(sender, {
        value: toNano(amount),
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: (0, beginCell)()
            .storeUint(Opcodes.op_internal_transfer, 32)
            .storeUint(Opcodes.query_id_create_redenvelope, 64)
            .storeAddress(creator01)
            .storeUint(redpacketId, 32)
            .endCell()
    });

    console.log('Create Redenvelope successfully!');
}

//不使用私钥 服务端上链
async function createTonRedpacketBySign(){
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    let mnemonic = [
        'recycle',  'evidence', 'tube',
        'two', 'lab', 'cram',
        'secret', 'afraid', 'draft',
        'brown',  'jump',  'exchange',
        'only', 'write',  'pole',
        'drink', 'vacuum',  'brisk',
        'nephew',  'orchard', 'steel',
        'antique', 'pattern', 'night'
    ];
    const kpr = await mnemonicToPrivateKey(mnemonic);
    let mw = new MultisigWallet(
                [kpr.publicKey],
                0,
                0,
                1,
                { client }
            );
    const creator01 = Address.parse('UQCno6ub3zODCROMd5EXJLkaLcA-Ziz9hA959SNhchtL9DA_');
    const redContrctAddr = Address.parse(red_envelope_v2);

    const provider = client.provider(creator01);
    const redpacketId = 32;
    const amount = '0.15';
    const forwardPayloadToRedenv = beginCell()
            .storeUint(Opcodes.op_internal_transfer, 32)
            .storeUint(Opcodes.query_id_create_redenvelope, 64)
            .storeAddress(creator01)
            .storeUint(redpacketId, 32)
        .endCell();
    const mulOrderBuilder = new MultisigOrderBuilder(0);
    const messageRelaxed1 = {
        body: forwardPayloadToRedenv,
        info: {
            bounce: true,
            bounced: false,
            createdAt: 0,
            createdLt: 0n,
            dest: redContrctAddr,
            forwardFee: 0n,
            ihrDisabled: true,
            ihrFee: 0n,
            type: 'internal',
            value: { coins: toNano(amount) },
        },
    };
    mulOrderBuilder.addMessage(messageRelaxed1, 3);
    const mulOrder = mulOrderBuilder.build();
    
    const signature = mulOrder.sign(0, kpr.secretKey);
    // mulOrder.addSignature(0,signature,mw); //TODO: delete?
    await mw.sendOrderWithoutSecretKey(mulOrder, signature, 0, provider);
    console.log('Create Redenvelope successfully!');
}

setTimeout(createTonRedpacketBySign, 100);



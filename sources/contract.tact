contract MingWen {
    owner: Address;
    content: Cell;
    target: Address;

    init(content: Cell, owner: Address) {
        self.content = content;
        self.owner = owner;
        self.target = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"); 
    }

    receive("Mint") {
        require(sender() == self.owner || sender() == myAddress(), "Not owner");
        self.sendTx();
        self.sendTx();
        // self.sendTx();
        send(SendParameters{
            to: myAddress(),
            value: 0,
            bounce: false,
            mode: SendIgnoreErrors + SendRemainingBalance,
            body: "Mint".asComment()
        });
    }

    fun sendTx() {
        send(SendParameters{
                to: self.target,
                value: 0, 
                bounce: false,
                mode: SendIgnoreErrors + SendPayGasSeparately,
                body: self.content.asSlice().asString().asComment()
            });    
    }


    receive(msg: String) {
        
    }

    // receive("Withdraw") {
    //     send(SendParameters{
    //         to: self.owner,
    //         value: 1, 
    //         bounce: false,
    //         mode: SendIgnoreErrors + SendRemainingBalance
    //     });    
    // }
}
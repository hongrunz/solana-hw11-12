import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { hw } from "../target/types/hw";

describe("hw", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.hw as Program<hw>;

  it("Account has balance 100 when initialized", async () => {
    const balanceAccount = anchor.web3.Keypair.generate();
    console.log('creating balanceAccount: ', balanceAccount.publicKey.toString());
    
    let latestBlockhash = await provider.connection.getLatestBlockhash('finalized');
    
    const tx = await program.methods
      .initializeBalance()
      .accounts({balance: balanceAccount.publicKey})
      .signers([balanceAccount])
      .rpc();
    
    await provider.connection.confirmTransaction({
      signature: tx,         
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`); 


    const balance = await program.account.balance.fetch(balanceAccount.publicKey);
    expect(balance.amount.toNumber()).to.equal(100);
  });
});

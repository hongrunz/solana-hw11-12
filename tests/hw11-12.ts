import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";

import { hw } from "../target/types/hw";

describe("hw", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.hw as Program<hw>;

  const balanceAccount = anchor.web3.Keypair.generate();
  console.log('creating balanceAccount: ', balanceAccount.publicKey.toString());

  it("Account has balance 100 when initialized", async () => {
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

  it("Account balance increments until 1000", async () => {
    // the first 9 increments should succeed
    for (let i = 0; i < 9; i++) {
      let latestBlockhash = await provider.connection.getLatestBlockhash('finalized');
      
      const tx = await program.methods
        .incrementBalance()
        .accounts({balance: balanceAccount.publicKey})
        .rpc();
      
      await provider.connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });

      const balance = await program.account.balance.fetch(balanceAccount.publicKey);
      expect(balance.amount.toNumber()).to.equal((i+2) * 100);
      console.log('account balance is now: ', balance.amount.toNumber());
    }
    // the 9th increment should fail with an exception
    try {
      let latestBlockhash = await provider.connection.getLatestBlockhash('finalized');
  
      const tx = await program.methods
        .incrementBalance()
        .accounts({balance: balanceAccount.publicKey})
        .rpc();
      
      await provider.connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      })
    } catch(error) {
      assert.fail('The 10th increment should have failed');
    }
  })
});

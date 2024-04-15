use anchor_lang::prelude::*;

declare_id!("6UtsrVdAgsoydvmMo1kUXMDfa9aCNn7uSkG9GTaNazDv");

#[program]
pub mod hw {
    use super::*;
    pub fn initialize_balance(ctx: Context<Initialize>) -> Result<()> {
        let balance = &mut ctx.accounts.balance;
        balance.amount = 100;
        msg!("Initialized new count. Current value: {}!", balance.amount);
        Ok(())
    }
}

// Contexts
////////////////////////////////////////////////////////////////
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub balance: Account<'info, Balance>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Accounts
////////////////////////////////////////////////////////////////
#[account]
pub struct Balance {
    amount: u64
}
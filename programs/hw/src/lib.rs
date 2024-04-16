use anchor_lang::prelude::*;

declare_id!("6UtsrVdAgsoydvmMo1kUXMDfa9aCNn7uSkG9GTaNazDv");

#[program]
pub mod hw {
    use super::*;

    pub fn initialize_balance(ctx: Context<Initialize>) -> Result<()> {
        let balance = &mut ctx.accounts.balance;
        balance.amount = 100;
        msg!("Initialized new balance. Current value: {}!", balance.amount);
        Ok(())
    }
    pub fn increment_balance(ctx: Context<IncrementBalance>) -> Result<()> {
        let balance = &mut ctx.accounts.balance;
        balance.amount += 100;
        msg!("Incremented balance by 100. Current value: {}!", balance.amount);
        Ok(())
    }
}

// Contexts
////////////////////////////////////////////////////////////////
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 200)]
    pub balance: Account<'info, Balance>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncrementBalance<'info> {
    #[account(mut, constraint = balance.amount <= 1000)]
    pub balance: Account<'info, Balance>,
}

// Accounts
////////////////////////////////////////////////////////////////
#[account]
pub struct Balance {
    amount: u64
}
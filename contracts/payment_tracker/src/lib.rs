#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[contract]
pub struct PaymentTracker;

#[contracttype]
pub enum DataKey {
    TotalPayments,
    UserPayment(Address),
}

#[contractimpl]
impl PaymentTracker {

    // Record a payment for a user
    pub fn record_payment(env: Env, user: Address, amount: i128) {
        user.require_auth();

        // Update total payments
        let total: i128 = env.storage().instance()
            .get(&DataKey::TotalPayments)
            .unwrap_or(0);

        env.storage().instance()
            .set(&DataKey::TotalPayments, &(total + amount));

        // Update user's total
        let user_total: i128 = env.storage().instance()
            .get(&DataKey::UserPayment(user.clone()))
            .unwrap_or(0);

        env.storage().instance()
            .set(&DataKey::UserPayment(user.clone()), &(user_total + amount));

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "payment_recorded"), user),
            amount
        );
    }

    // Get total payments recorded
    pub fn get_total(env: Env) -> i128 {
        env.storage().instance()
            .get(&DataKey::TotalPayments)
            .unwrap_or(0)
    }

    // Get payment total for specific user
    pub fn get_user_total(env: Env, user: Address) -> i128 {
        env.storage().instance()
            .get(&DataKey::UserPayment(user))
            .unwrap_or(0)
    }
}

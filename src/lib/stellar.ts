//=====================================================
// File: src/lib/stellar.ts
// Purpose: Contains functions for interacting with the Stellar network, such as fetching account balances.
// This file serves as an abstraction layer between the UI components and the underlying Stellar SDK and Horizon API calls,
// allowing us to keep our components clean and focused on presentation while centralizing all Stellar-related logic in one place.
//=====================================================

// Import the Stellar SDK and Freighter API functions

export const getXlmBalance = async (publicKey: string) => {
  try {
    // Fetch the account details from Horizon to get the list of balances for the account. This includes all assets held by the account, including native XLM and any custom assets.
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${publicKey}`
    );
    // If the account doesn't exist or there's an error fetching the account details, throw an error to be caught below.
    if (!response.ok) {
      throw new Error("Failed to load account");
    }

    const data = await response.json();

    const nativeBalance = data.balances.find(
      (bal: any) => bal.asset_type === "native"
    );

    return nativeBalance?.balance || "0";
  } catch (error) {
    console.error("Error fetching XLM balance:", error);
    throw error;
  }
};

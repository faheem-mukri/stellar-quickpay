import { requestAccess, getAddress } from "@stellar/freighter-api";

// =====================================================
// Function: connectWallet
// Purpose: Connects to the user's Freighter wallet and retrieves their public key
// Flow:
// 1. Request access to the wallet (this will trigger the Freighter extension to open and ask the user to approve access)
// 2. If the user approves, get their public key (Stellar address) and return it to the caller
// =====================================================

export const connectWallet = async () => {
  try {
    // Always request access first to ensure we have permission to interact with the wallet and get the user's public key.
    await requestAccess({ network: "TESTNET" });

    const address = await getAddress();
    return address.address;
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

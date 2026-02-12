import { requestAccess, getAddress } from "@stellar/freighter-api";

export const connectWallet = async () => {
  try {
    // Always request access first
    await requestAccess({ network: "TESTNET" });

    const address = await getAddress();
    return address.address;
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

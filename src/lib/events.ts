import * as StellarSdk from "@stellar/stellar-sdk";

const rpcServer = new StellarSdk.rpc.Server(
  "https://soroban-testnet.stellar.org"
);

const CONTRACT_ID =
  "CD3LLLCF2HT3WTUI552JWWZCBCRSQJNWB4HUHGK3W3DRAW4GYD4AB5T7";

export const fetchContractEvents = async () => {
  try {
    // 1️⃣ Get latest ledger info
    const latestLedgerResponse = await rpcServer.getLatestLedger();
    const latestLedger = latestLedgerResponse.sequence;

    // 2️⃣ Query last 100 ledgers (safe range)
    const startLedger = latestLedger - 100;

    const response = await rpcServer.getEvents({
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [CONTRACT_ID],
        },
      ],
    });

    return response.events;
  } catch (error) {
    console.error("Error fetching contract events:", error);
    return [];
  }
};

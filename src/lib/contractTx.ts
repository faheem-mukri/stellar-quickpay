import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const rpcServer = new StellarSdk.rpc.Server(
  "https://soroban-testnet.stellar.org"
);


const CONTRACT_ID = "CD3LLLCF2HT3WTUI552JWWZCBCRSQJNWB4HUHGK3W3DRAW4GYD4AB5T7";

export const recordPayment = async (
  publicKey: string,
  amount: number
) => {
  try {
    // 1️⃣ Load account from Horizon (NOT RPC)
    const horizonRes = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${publicKey}`
    );

    if (!horizonRes.ok) {
      throw new Error("Failed to load account");
    }

    const horizonData = await horizonRes.json();

    const account = new StellarSdk.Account(
      horizonData.account_id,
      horizonData.sequence
    );

    const contract = new StellarSdk.Contract(CONTRACT_ID);

    // 2️⃣ Build transaction
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          "record_payment",
          StellarSdk.Address.fromString(publicKey).toScVal(),
          StellarSdk.nativeToScVal(BigInt(amount), { type: "i128" })
        )
      )
      .setTimeout(120)
      .build();

    // 3️⃣ Prepare transaction (adds footprint)
    const prepared = await rpcServer.prepareTransaction(tx);

    // Some SDK versions return object, some return transaction directly
    const preparedTx =
      "transaction" in prepared ? prepared.transaction : prepared;

    // 4️⃣ Sign with Freighter
    const signed = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    if (!signed?.signedTxXdr) {
      throw new Error("User rejected transaction");
    }

    // 5️⃣ Convert back to Transaction
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signed.signedTxXdr,
      StellarSdk.Networks.TESTNET
    );

    // 6️⃣ Send to Soroban RPC
    const result = await rpcServer.sendTransaction(signedTx);

    return {
      success: true,
      hash: result.hash,
    };
  } catch (error: any) {
    if (error.message?.includes("User rejected")) {
      return { success: false, error: "User rejected contract transaction" };
    }

    if (error.message?.includes("insufficient")) {
      return { success: false, error: "Insufficient balance for contract fee" };
    }

    return {
      success: false,
      error: error.message || "Contract execution failed",
    };
  }
};

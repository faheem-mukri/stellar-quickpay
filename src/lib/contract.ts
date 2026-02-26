import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Address,
  scValToNative,
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID!;
const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC!;
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!;

const server = new Server(RPC_URL, {allowHttp: true});

// ── record_payment ──────────────────────────────────
// Calls the contract to record a payment on-chain.
// amount is in stroops (1 XLM = 10_000_000 stroops)
export async function recordPayment(
  userAddress: string,
  amountXlm: number,
  signTransaction: (xdr: string) => Promise<string>
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const account = await server.getAccount(userAddress);
    const contract = new Contract(CONTRACT_ID);

    const amountStroops = BigInt(Math.round(amountXlm * 10_000_000));

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "record_payment",
          new Address(userAddress).toScVal(),
          nativeToScVal(amountStroops, { type: "i128" })
        )
      )
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    const signedXdr = await signTransaction(preparedTx.toXDR());

    const result = await server.sendTransaction(
      TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    );

    if (result.status === "ERROR") {
      throw new Error("Transaction failed on network");
    }

    // Poll for completion
    let attempts = 0;
    while (attempts < 10) {
      await new Promise((r) => setTimeout(r, 2000));
      const status = await server.getTransaction(result.hash);
      if (status.status === "SUCCESS") {
        return { success: true, txHash: result.hash };
      }
      if (status.status === "FAILED") {
        throw new Error("Transaction failed");
      }
      attempts++;
    }

    return { success: true, txHash: result.hash };
  } catch (err: any) {
    return { success: false, error: err.message || "Contract call failed" };
  }
}

// ── get_total ───────────────────────────────────────
export async function getTotal(): Promise<bigint> {
  try {
    const contract = new Contract(CONTRACT_ID);
    const account = await server.getAccount(
      "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN" // read-only account
    );

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_total"))
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    if ("result" in result && result.result) {
      return BigInt(scValToNative(result.result.retval));
    }
    return 0n;
  } catch {
    return 0n;
  }
}

// ── get_user_total ──────────────────────────────────
export async function getUserTotal(userAddress: string): Promise<bigint> {
  try {
    const contract = new Contract(CONTRACT_ID);
    const account = await server.getAccount(userAddress);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "get_user_total",
          new Address(userAddress).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    if ("result" in result && result.result) {
      return BigInt(scValToNative(result.result.retval));
    }
    return 0n;
  } catch {
    return 0n;
  }
}
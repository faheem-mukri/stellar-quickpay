import {
  Contract,
  rpc,
  TransactionBuilder,
  Account,
  BASE_FEE,
  Networks,
  xdr,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID!;

export const SOROBAN_RPC =
  process.env.NEXT_PUBLIC_SOROBAN_RPC!;

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!;


const server = new rpc.Server(SOROBAN_RPC);

const contract = new Contract(CONTRACT_ID);

/* ---------------------------------------------------- */
/* GET TOTAL (i128) */
/* ---------------------------------------------------- */

export const getTotal = async (): Promise<bigint> => {
  const account = new Account(
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    "0"
  );

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("get_total"))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error("Simulation failed");
  }

  const result = sim.result?.retval;

  return scValToNative(result!) as bigint;
};

/* ---------------------------------------------------- */
/* GET USER TOTAL (i128) */
/* ---------------------------------------------------- */

export const getUserTotal = async (
  publicKey: string
): Promise<bigint> => {
  const account = new Account(
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    "0"
  );

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "get_user_total",
        nativeToScVal(publicKey, { type: "address" })
      )
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error("Simulation failed");
  }

  const result = sim.result?.retval;

  return scValToNative(result!) as bigint;
};

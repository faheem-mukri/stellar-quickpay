import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

// =====================================================
// Function: sendXlm
// Purpose: Builds, signs, and submits an XLM payment
// Flow:
// 1. Load sender account (to get sequence number)
// 2. Build payment transaction
// 3. Ask Freighter to sign
// 4. Submit signed XDR to Horizon
// =====================================================

export const sendXlm = async (
  senderPublicKey: string,
  destination: string,
  amount: string
) => {

  try {
    //fetch sender account details to get the latest sequence number from horizon
    const accountResponse = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${senderPublicKey}`
    );

    //if the account doesn't exist or there's an error, throw an exception to be caught below and return a failure response to the UI
    if (!accountResponse.ok) {
      throw new Error("Failed to load account");
    }

    //parse the account details from horizon response and create a StellarSdk.Account object which is needed to build the transaction with the correct sequence number.
    const accountData = await accountResponse.json()

    // Load sender account details.
    const account = new StellarSdk.Account(
      accountData.account_id,
      accountData.sequence
    );

    // Build the transaction with a payment operation to the destination address and the specified amount of XLM. The transaction is built for the testnet and includes a timeout of 120 seconds.
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: TESTNET_PASSPHRASE,
    })
      // Add a payment operation to the transaction, specifying the destination address, the asset (native XLM), and the amount to send. This is the core of the transaction - it defines what we want to do on the Stellar network.
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(120)
      .build();

    // Sign the transaction using Freighter. This will trigger the Freighter extension to open and ask the user to approve the transaction.
    // If the user approves, Freighter will return the signed transaction XDR. 
    const signed = await signTransaction(transaction.toXDR(), {
      networkPassphrase: TESTNET_PASSPHRASE,
    });

    //If the user rejects or if there's an error during signing, an exception will be thrown and caught below, returning a failure response to the UI.
    if (!signed || !signed.signedTxXdr) {
      throw new Error("Signing failed");
    }

    // Submit the signed transaction XDR to Horizon. This will attempt to execute the transaction on the Stellar network. If the transaction is successful, Horizon will return a success response with the transaction hash.
    const submitResponse = await fetch(
      "https://horizon-testnet.stellar.org/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          tx: signed.signedTxXdr,
        }),
      }
    );

    // Parse the response from Horizon. If the transaction was successful, we return a success response with the transaction hash.
    const result = await submitResponse.json();

    // If there's an error (e.g. insufficient balance, bad destination address, etc.), Horizon will return an error response which we catch and return as a failure response to the UI.
    if (!submitResponse.ok) {
      console.log("Full Horizon error:", result);
      throw new Error(
        result.extras?.result_codes
          ? JSON.stringify(result.extras.result_codes)
          : "Submission failed"
      );
    }

    // If we reach this point, the transaction was successful. We return a success response with the transaction hash to the UI, which can be used to link to a block explorer.
    return {
      success: true,
      hash: result.hash,
    };
  } 
    // Catch any errors that occur during the process (account loading, transaction building, signing, or submission) and return a failure response with the error message to the UI.
    catch (error: any) {
      console.error("Transaction failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
};

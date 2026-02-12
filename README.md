# Stellar QuickPay – White Belt Submission

Stellar QuickPay is a simple Stellar Testnet dApp that demonstrates wallet integration, balance retrieval, and native XLM transactions using the Freighter wallet.

This project was built as part of the Stellar Journey to Mastery – White Belt level.

---

## 🚀 Features

- Connect Freighter Wallet (Testnet)
- Display real-time XLM balance
- Send native XLM payments
- Freighter-based secure transaction signing
- Horizon API transaction submission
- Automatic balance refresh after successful payment
- Transaction hash with Explorer link

---

## 🧠 How It Works

1. The app connects to the Freighter wallet on Stellar Testnet.
2. The sender account is fetched from Horizon to retrieve the latest sequence number.
3. A payment transaction is built using Stellar SDK.
4. The unsigned transaction is passed to Freighter for signing.
5. The signed XDR is submitted to Horizon.
6. On success, the transaction hash is displayed and the balance is refreshed.

This ensures:
- Correct sequence number handling
- Proper network passphrase usage
- Secure key management (handled by Freighter)
- Real network interaction on Stellar Testnet

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- @stellar/stellar-sdk
- @stellar/freighter-api
- Horizon REST API

---

## 🧪 Network

This project runs on:

**Stellar Testnet**  
Network Passphrase: `Test SDF Network ; September 2015`

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd stellar-quickpay
npm install
npm run dev

Requirements
Install Freighter Wallet
Switch network to Testnet
Fund your account via Stellar Testnet Faucet


### 🔗 Wallet Connected

Freighter wallet connected successfully and XLM balance fetched from Horizon Testnet.
![Wallet Connected](screenshots/wallet-connected.png)


### 💸 Payment Form

User enters destination address and XLM amount before signing.
![Transaction Form](screenshots/transaction-form.png)

### ✅ Successful Testnet Transaction

Transaction signed via Freighter and submitted to Horizon. Transaction hash displayed for verification.
![Transaction Success](screenshots/transaction-success.png)

### ✅ Explorer Verification
https://stellar.expert/explorer/testnet/tx/YOUR_HASH
![Explorer Verification](screenshots/explorer-proof.png)
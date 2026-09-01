# RentShare Hub

build for me a simple and applig fronemd usimg react be creative of this project make only the frontend please 
📋 Prototype Summary

You now have a complete technical blueprint for a Micro-Rent Yield Hub. This system bridges everyday mobile money (M-Pesa) payments with an Layer 2 (L2) blockchain to make real estate investing accessible to anyone in Kenya.

The architecture consists of three interconnected layers:

┌────────────────────────┐      HTTP POST      ┌────────────────────────┐
│  Next.js Frontend      │────────────────────>│   Node.js Backend      │
│  (User Dashboard)      │                     │   (M-Pesa Webhook)     │
└────────────────────────┘                     └────────────────────────┘
            ▲                                               │
            │ Read Balance                                  │ Write (issueTokens)
            │ & Yield                                       ▼
            │─────────────────────────────────── ┌────────────────────────┐
                                                 │  Solidity Contract     │
                                                 │  (L2 Blockchain)       │
                                                 └────────────────────────┘


1. The Smart Contract (PropertyRentToken.sol)

What it does: Represents a rental property split into 10,000 fractional shares (KHY tokens).

The Business Logic: When a landlord collects rent, they deposit stablecoins into this contract. The contract automatically calculates how much rent money is owed to each token holder based on their share balance.

The Entry Hook: Includes a protected administrative function (issueTokensToInvestor) used to distribute shares whenever cash is received off-chain.

2. The Bridge Backend Engine (server.js)

What it does: Acts as the middleware connecting the Web2 financial ecosystem (Safaricom) with the Web3 blockchain network (Lisk/Base).

The Automation Loop: It accepts payment notifications from Safaricom’s Daraja API callback webhook. The instant a user enters their M-Pesa PIN and pays, this script automates a blockchain transaction to send the correct number of property tokens straight to that user.

3. The Interactive Interface (page.tsx)

What it does: A clean, scannable Next.js dashboard built with Tailwind CSS for retail investors.

The User Experience: Users can view properties, type in their Safaricom Phone Number and investment amount, and tap a button to trigger an M-Pesa payment prompt. It also updates in real-time, showing how many shares they own and letting them withdraw their dollar-denominated rental earnings directly to their connected digital wallet.

Now that the structural prototype pieces are built, how would you like to proceed?

Add a Landlord Portal view to simulate depositing a new month's rent payoutSet up the Safaricom Daraja API configurations to connect real M-Pesa sandbox accountsDraft the pitch slide deck structure to present this prototype to Kenyan investors or hackathon judges

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d79481e5-c99d-4387-97b4-a6ea922458a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

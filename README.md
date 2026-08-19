eVault — Blockchain-Based eVault for Legal Records

SIH 2026 · Problem Statement SIH1284 

A hash-anchoring system for legal document integrity. Documents are stored normally, while a cryptographic fingerprint (SHA-256 hash) of each one is registered separately — so anyone can later verify a document hasn't been altered, without needing to trust whoever's holding it.

Current build status: MVP. The hash registry runs on MongoDB behind a swappable architectural seam, designed to be replaced with an on-chain smart contract (Solidity, Ethereum Sepolia for prototype / Hyperledger Fabric for production) without changing any other part of the app.

How It Works

Registration

Upload a document.
Its SHA-256 hash is computed server-side.
A unique docId is generated and the hash is registered via the chain adapter.
Document metadata (filename, hash, timestamp) is stored.

Verification

Select a registered document and a file to check.
The file is freshly re-hashed.
The new hash is compared against the one stored at registration.
Result: Authentic (match), Tampered (mismatch), or Not Found (invalid docId).
Tech Stack
Layer	Tech
Framework	Next.js (App Router)
Frontend	React, Tailwind CSS
Backend	Next.js API routes (Node.js)
Database	MongoDB (Atlas)
Hashing	SHA-256 — Node crypto module
Deployment	Vercel

Target production blockchain layer (designed, not yet integrated): Solidity · Hardhat · OpenZeppelin · Ethereum Sepolia (prototype) · Hyperledger Fabric (production) · MetaMask · ethers.js · Alchemy

Project Structure
evault/
├── app/
│   ├── page.js                 # Landing page
│   ├── upload/page.js          # Register a document
│   ├── verify/page.js          # Verify a document
│   ├── documents/page.js       # Registered documents list
│   └── api/
│       ├── documents/route.js  # POST register, GET list
│       ├── verify/route.js     # POST verify
│       └── samples/route.js    # Sample original/tampered files for demo
├── lib/
│   ├── db.js                   # MongoDB connection
│   ├── seed.js                 # Sample data seeding
│   └── chain/
│       ├── index.js            # Swappable seam — registerHash() / verifyHash()
│       └── mongoAdapter.js     # Current implementation (MongoDB-backed)
├── contracts/
│   └── EVault.sol              # Target smart contract (not yet integrated)
└── tailwind.config.js

Architectural rule: no page or API route talks to MongoDB directly for hash storage. Everything routes through lib/chain/index.js, which currently delegates to mongoAdapter.js. Swapping in a real blockchain adapter later means writing a new file with the same two function signatures — nothing else in the app changes.

registerHash(docId, hash) -> Promise<{ docId, hash, registeredAt }>
verifyHash(docId, hash)   -> Promise<{ match: boolean, storedHash: string }>
Getting Started

Prerequisites: Node.js 18+, a MongoDB connection string (Atlas free tier works).

bash
git clone https://github.com/Dhruv1737/Blockchain-eVault.git
cd Blockchain-eVault
npm install

Create a .env.local file in the project root:

MONGODB_URI=your_mongodb_connection_string

Run the dev server:

bash
npm run dev

Open http://localhost:3000.

If MONGODB_URI isn't set, the app falls back to an in-memory store with pre-seeded sample data — useful for quick local testing, but data won't persist across restarts.

Why Blockchain, Not Just a Database

A database-only audit trail is still controlled by whoever administers that database — they could edit the record and the log together. Anchoring the hash on a blockchain instead means no single party, including the system's own operators, can quietly alter it: the hash is independently held across a decentralized (or permissioned, in production) network, verifiable by anyone.

The current MVP proves the hashing and comparison logic is correct. It does not yet demonstrate protection against a dishonest system administrator — that guarantee is what the (not-yet-integrated) blockchain layer specifically adds.

Known Limitations (MVP)
No authentication — anyone can register or view any document in this build.
Hash registry is MongoDB-backed, not yet on-chain.
No encryption at rest for stored files.
No production-scale storage (sharding, replication) or transaction-batching considerations.
Roadmap
 Swap mongoAdapter.js for a Solidity contract deployed on Sepolia
 Wallet-based identity via MetaMask, replacing the no-auth MVP model
 Access control (grantAccess()) for document sharing between parties
 Migrate to Hyperledger Fabric for a permissioned production network
 Client-side encryption before storage
 Merkle-batched on-chain writes for scale

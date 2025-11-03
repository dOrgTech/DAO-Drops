# DAO Drops

A full-stack decentralized retroactive funding platform for the Ethereum ecosystem, enabling communities to nominate, vote, and distribute funding to deserving projects and contributors through a transparent multi-phase process.

> **🎉 This is an upgraded and updated version of DAO Drops, rebuilt to be fully forkable and customizable for any community or DAO to run their own retroactive funding rounds.**

## 📦 Project Structure

This monorepo contains three main applications:

### 🎨 [Client](./client)

Next.js-based frontend application with Web3 wallet integration for the DAO Drops platform.

**Key Features:**

- Three-phase workflow: Nomination → Allocation → Results
- Web3 wallet integration via Reown AppKit
- Responsive design with TailwindCSS
- Real-time countdown timers and vote tracking

[**→ View Client Documentation**](./client/README.md)

### ⚙️ [Server](./server)

Express/TypeScript backend API for managing submissions, curated picks, and point allocations.

**Key Features:**

- RESTful API with MongoDB/Mongoose
- Web3 wallet authentication
- Google reCAPTCHA spam protection
- Database seeding utilities

[**→ View Server Documentation**](./server/README.md)

### 📊 [Scripts](./scripts)

Account scoring system that analyzes on-chain and off-chain data to determine allocation power.

**Key Features:**

- POAP attendance tracking
- DeepDAO participation scoring
- Smart contract deployment analysis
- Configurable scoring algorithms

[**→ View Scripts Documentation**](./scripts/README.md)

## 🚀 Quick Start

Each application can be run independently. Refer to their respective README files for detailed setup instructions:

1. **Client**: `cd client && npm install && npm run dev`
2. **Server**: `cd server && npm install && npm run dev`
3. **Scripts**: `cd scripts && npm install && npm run build`

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Express, MongoDB, Mongoose, TypeScript
- **Blockchain**: Reown AppKit (WalletConnect), Web3 Authentication
- **Deployment**: Netlify (Client), Heroku (Server), MongoDB Atlas (Database)

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

**Built with ❤️ for the Ethereum ecosystem**

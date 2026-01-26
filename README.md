# RAG Portfolio

A Next.js portfolio website with a RAG-powered "Ask Me Anything" (AMA) chat feature. Built with LangChain, supporting multiple LLM providers and streaming responses.

## Features

- **Portfolio Sections**: Home, Tech Stack, and Journey
- **AMA Chat**: Interactive Q&A powered by RAG (Retrieval-Augmented Generation)
- **Streaming Responses**: Real-time streaming chat interface
- **Multiple LLM Providers**: Support for Gemini, OpenRouter, and Ollama
- **Vector Store**: Embeddings-based retrieval system
- **PWA**: Installable app (manifest, service worker). Add `icon-192.png` and `icon-512.png` in `public/` for better install icons (optional; `favicon.ico` is used otherwise).
- **Admin page** (optional): Secure `/admin` view of all AMA chat threads from MongoDB when `ADMIN_PAGE_SECRET` is set.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend & AI**:
  - LangChain for agent orchestration and tool management
  - Hugging Face Inference API for embeddings
  - Upstash Vector Store for document storage and retrieval
- **LLM Providers**: Google Gemini, OpenRouter, Ollama
- **Database**: MongoDB for conversation persistence and checkpoints
- **Infrastructure**: TypeScript, Zod for configuration validation

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for Redis)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rag-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Required for all providers
HF_EMBEDDINGS_API_KEY=your_huggingface_api_key
HF_EMBEDDINGS_MODEL=sentence-transformers/all-MiniLM-L6-v2  # optional

# Vector Store (Upstash)
UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token

# MongoDB
MONGODB_URI=mongodb://localhost:27017  # or your MongoDB connection string
MONGODB_DBNAME=rag_portfolio  # or your preferred database name

# Choose one LLM provider:

# Option 1: Gemini
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite  # optional
GEMINI_TEMPERATURE=0.1  # optional

# Option 2: OpenRouter
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free  # optional
OPENROUTER_TEMPERATURE=0.1  # optional

# Option 3: Ollama (local)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b-instruct-q4_K_M  # optional
OLLAMA_BASE_URL=http://localhost:11434  # optional
OLLAMA_TEMPERATURE=0.1  # optional

# Optional: Telegram Integration (for monitoring/debugging)
ENABLE_TG_SENDER=false  # Set to 'true' to enable
TG_BOT_TOKEN=your_telegram_bot_token  # Required if ENABLE_TG_SENDER=true
TG_U_BOT_TOKEN=your_user_bot_token    # Required if ENABLE_TG_SENDER=true
TG_CHAT_ID=your_telegram_chat_id      # Required if ENABLE_TG_SENDER=true

# Optional: Server Configuration
PORT=3000  # optional, defaults to 3000
NODE_ENV=development  # optional, defaults to 'development'
LOG_LEVEL=info  # optional, defaults to 'info'
TIMEOUT=60000  # optional, defaults to 60000ms

# Optional: Admin page (only you can access /admin)
# Set to a long random string; then visit /admin?token=YOUR_SECRET to unlock.
# The admin page lists chat threads persisted in MongoDB from the AMA.
# Omit to leave /admin disabled (visits redirect to home).
ADMIN_PAGE_SECRET=  # optional
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/              # Next.js app directory
│   ├── ama/         # AMA chat page
│   └── api/         # API routes
├── backend/          # LangChain agent and tools
│   ├── agent/       # Agent configuration and middlewares
│   │   ├── index.ts              # Main agent setup with LLM providers
│   │   ├── schemas.ts            # Agent state schema definitions
│   │   └── middlewares/          # Custom agent middlewares
│   │       ├── MongoDBCoversationSaver.ts  # Persists conversations to MongoDB
│   │       └── TGSenderMiddleware.ts       # Optional Telegram integration
│   ├── data-chunks/ # Vector store document chunks
│   │   ├── resume.ts             # Resume information chunks
│   │   ├── portfolio.ts          # Portfolio project chunks
│   │   └── interview-QnA.ts      # Interview Q&A chunks
│   ├── vector-store.ts  # Upstash vector store configuration
│   ├── tools.ts        # RAG retrieval tools (getInfoTool)
│   ├── config.ts       # Environment configuration with Zod validation
│   ├── mongodb.ts      # MongoDB client and conversation persistence
│   └── enums.ts        # Topic enum for information categorization
├── common/           # Shared components and hooks
└── public/           # Static assets
```

## Backend Architecture

### Agent System (`backend/agent/`)

The core of the RAG system is a LangChain agent that orchestrates conversations:

- **Multi-Provider LLM Support**: Supports Gemini, OpenRouter, and Ollama with automatic provider selection based on environment configuration
- **State Management**: Uses MongoDB checkpointer for conversation state persistence
- **Middleware Pipeline**:
  - **Summarization Middleware**: Keeps conversation context manageable by summarizing older messages
  - **MongoDB Conversation Saver**: Persists user and assistant messages to MongoDB for history
  - **Telegram Sender Middleware** (optional): Sends conversations to Telegram for monitoring/debugging

### Vector Store (`backend/vector-store.ts`)

- Uses **Upstash Vector Store** for document storage and retrieval
- Employs **Hugging Face Inference API** for embeddings (configurable model)
- Supports semantic search with metadata filtering

### Tools (`backend/tools.ts`)

- **`getInfoTool`**: Retrieves relevant information from the vector store using:
  - Semantic similarity search
  - Topic-based filtering (using `Topic` enum)
  - Configurable result count (default: 4 chunks)

### Data Chunks (`backend/data-chunks/`)

Structured document chunks with metadata tags for precise retrieval:

- **`resume.ts`**: Professional information including work experience, skills, education, and achievements
- **`portfolio.ts`**: Information about this portfolio project itself
- **`interview-QnA.ts`**: Common interview questions and detailed answers

Each chunk is tagged with `Topic` enum values for filtering:
- `GeneralInfo`, `Contact`, `WorkExperience`, `Skills`, `Education`, `Projects`, `Achievements`

### Configuration (`backend/config.ts`)

Comprehensive environment variable validation using Zod:

- **Base Configuration**: MongoDB, Upstash Vector Store, Hugging Face embeddings, logging
- **LLM Provider Configuration**: Discriminated union supporting Gemini, OpenRouter, or Ollama
- **Optional Features**: Telegram integration (disabled by default)

### MongoDB (`backend/mongodb.ts`)

- Manages conversation threads and checkpoints
- Provides functions for:
  - Persisting messages to threads
  - Retrieving message history
  - Resetting conversations
  - Creating new thread IDs

## License

Private project

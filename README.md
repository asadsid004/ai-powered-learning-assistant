# Quest AI

### AI-Powered Personalized Learning Assistant

Quest AI is an intelligent learning companion that helps learners create **structured learning roadmaps**, interact with study material using **AI-powered document chat**, and reinforce knowledge through **quizzes and flashcards**.

It is designed for **students, self-learners, and professionals** who want a personalized, guided, and interactive learning experience.

---

## 🎥 Demo Video

▶️ Watch the full demo here:  
https://drive.google.com/file/d/1DVlQgDX3kqAEEaWCHdars7WKMlM_Y22j/view

> ⚠️ **Note**  
> The demo video is hosted externally to keep the repository lightweight and GitHub-friendly.

---

## 🚀 Overview

Traditional learning platforms are static and fail to adapt to individual learning goals, pace, and learning styles. Quest AI addresses this gap by leveraging **Generative AI and Retrieval-Augmented Generation (RAG)** to provide:

- Personalized learning paths
- Context-aware AI assistance
- Interactive knowledge assessment
- Document-based learning using PDFs

The platform focuses on **self-paced, adaptive learning** with structured guidance.

---

## 🧠 Key Features

### 🎯 Personalized Learning Roadmaps

- AI-generated learning plans based on user goals
- Structured milestones and recommended resources
- Adaptive roadmap generation for different skill levels

### 📄 Chat with PDF (RAG)

- Upload PDFs and interact with them using AI
- Context-aware answers powered by vector embeddings
- Accurate semantic retrieval using RAG pipelines

### 🧪 Quizzes & Flashcards

- Automatically generated quizzes from study material
- Flashcards for active recall and better retention
- Score tracking to evaluate learning progress

### 🤖 AI Learning Assistant

- Conversational AI for explanations and guidance
- Instant doubt resolution
- Contextual responses across learning sessions

---

## 🖼️ Screenshots

### Dashboard Overview

![Dashboard Overview](/public/screenshots/dashboard.png)

### Learning Roadmap

![Learning Roadmap](/public/screenshots/roadmap.png)

### Chat with PDF

![Chat with PDF](/public/screenshots/chat-with-pdf.png)

### Quiz Generation

![Quiz Generation](/public/screenshots/quiz.png)

### Flashcards

![Flashcards](/public/screenshots/flashcards.png)

### AI Assistant

![AI Assistant](/public/screenshots/ai-assistant.png)

---

## 🏗️ Architecture Overview

Quest AI follows a **full-stack, AI-first architecture**:

- **Frontend & Backend**: Next.js (App Router)
- **AI Engine**: Gemini API
- **AI Streaming**: Vercel AI SDK
- **Vector Database**: Pinecone / Vector DB for RAG
- **Database**: PostgreSQL with Prisma ORM
- **Document Processing**: LangChain
- **UI**: Tailwind CSS + ShadCN UI

---

## 🧩 Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **AI Models**: Gemini API
- **RAG**: LangChain + Vector Database
- **Database**: PostgreSQL + Prisma
- **Styling**: Tailwind CSS, ShadCN UI

---

## 🔐 Data Flow (High Level)

1. User uploads study material (PDF)
2. Documents are chunked and embedded
3. Embeddings are stored in a vector database
4. User queries retrieve relevant context
5. AI generates grounded, structured responses

---

## 🛠️ Local Development

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or cloud)
- **Google Generative AI** API key
- **Kinde** authentication credentials (for user auth)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/asadsid004/ai-powered-learning-assistant.git
   cd ai-powered-learning-assistant
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the environment template:

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables in `.env`:

   ```env
   # Database (PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost/database?sslmode=require"

   # Kinde (Auth)
   KINDE_CLIENT_ID=YOUR_KINDE_CLIENT_ID
   KINDE_CLIENT_SECRET=YOUR_KINDE_CLIENT_SECRET
   KINDE_ISSUER_URL=YOUR_KINDE_ISSUER_URL
   KINDE_SITE_URL=http://localhost:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

   # Google Generative AI (AI)
   GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_API_KEY
   ```

4. **Set up the database**

   - Create a PostgreSQL database
   - Update `DATABASE_URL` in your `.env` file with your database credentials
   - Run database migrations:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Get required API keys**

   - **Google Generative AI**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/api-keys)
   - **Kinde**: Create a free account at [Kinde](https://kinde.com) and set up an application to get your auth credentials

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

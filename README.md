# CityPulse — Smart City Complaint & Resource Tracking System

A modern AI-powered smart city platform that enables citizens to report civic issues, track complaint resolution in real time, and interact with an intelligent AI assistant powered by Retrieval-Augmented Generation (RAG).

---

## Features

- 🧠 **AI-powered chatbot** using Gemini + Pinecone RAG
- 📍 **Geolocation-based** complaint reporting
- 📊 **Interactive dashboards** for citizens & admins
- 🗺️ **Complaint heatmaps** and analytics
- 🔄 **Real-time complaint status** tracking
- 🔐 **Secure authentication** with role-based access
- 📝 **Complaint history** & audit logging
- ⚡ **Semantic search** across complaint records

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **AI** | Google Gemini API |
| **Vector DB** | Pinecone |
| **Maps** | Leaflet.js |
| **Authentication** | NextAuth / JWT |

---

## 📁 Folder Structure

```
CityPulse/
│── frontend/               # Frontend-related modules
│── prisma/                 # Prisma schema & database configuration
│── public/                 # Static assets
│── scratch/                # Experimental/testing files
│── scripts/                # Utility & automation scripts
│── src/                    # Main source code
│
│── .gitignore
│── README.md
│── components.json         # shadcn/ui configuration
│── eslint.config.mjs       # ESLint configuration
│── next.config.ts          # Next.js configuration
│── package.json
│── postcss.config.mjs      # PostCSS configuration
│── prisma.config.ts        # Prisma setup
│
│── sync_output.log         # Vector sync logs
│── sync_output_2.log
│── sync_output_3.log
│── models_list.log
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dhruvil-shah28/CityPulse.git
cd CityPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GEMINI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=
```

### 4. Setup database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

---

## 🧩 Core Modules

### 👤 Citizen Dashboard
- Submit and manage complaints
- Track complaint progress
- View location-based issues
- Interact with AI assistant

### 🛠️ Admin Dashboard
- Manage complaint lifecycle
- Update complaint statuses
- Monitor analytics & KPIs
- View hotspot areas on maps

### 🤖 AI Assistant
- Semantic complaint search
- Context-aware responses
- Real-time city issue insights
- RAG pipeline using Pinecone + Gemini

---

Developed as part of the DBMS Course Project at Vishwakarma Institute of Technology, 2025–26

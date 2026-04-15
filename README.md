# 🤖 AI Content Generator

A production-grade, AI-powered content generation platform built with **React.js**, **Google Gemini 2.0 Flash**, **Clerk Authentication**, and **Supabase (PostgreSQL)**. The platform provides 18+ pre-built content templates for blogs, YouTube, Instagram, coding, and marketing — all powered by Google's latest free Gemini model.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Data Flow](#-data-flow)
- [Component Hierarchy](#-component-hierarchy)
- [Technical Design Decisions](#-technical-design-decisions)
- [Why Supabase? (Database Decision)](#-why-supabase-database-decision)
- [Why Gemini 2.0 Flash?](#-why-gemini-20-flash)
- [Database Schema](#-database-schema)
- [Template Engine](#-template-engine)
- [AI Integration](#-ai-integration)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React.js 18 (CRA) | Component-based UI with hooks |
| **Routing** | React Router DOM v6 | Client-side SPA routing |
| **Authentication** | Clerk React SDK | User sign-up/sign-in, session management |
| **AI Engine** | Google Gemini 2.0 Flash | Content generation (latest free model) |
| **Database** | Supabase (PostgreSQL) | Managed DB with REST API + real-time |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **UI Components** | Radix UI + Custom CVA components | Accessible, composable primitives |
| **Rich Text Editor** | Toast UI Editor | WYSIWYG markdown editing for AI output |
| **Icons** | Lucide React | Consistent icon library |
| **Date Handling** | Moment.js | Date formatting for records |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  HomePage    │  │  Dashboard  │  │  ContentGenerator   │  │
│  │  (Landing)   │  │  (Templates)│  │  (AI Generation)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│              ┌───────────▼───────────┐                       │
│              │    React Router v6    │                       │
│              │   (Client-side SPA)   │                       │
│              └───────────┬───────────┘                       │
│                          │                                   │
│              ┌───────────▼───────────┐                       │
│              │   ClerkProvider       │                       │
│              │   (Auth Context)      │                       │
│              └───────────────────────┘                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼                         ▼
┌──────────────────┐    ┌─────────────────────┐
│  Google Gemini   │    │    Supabase          │
│  2.0 Flash API   │    │    (PostgreSQL +     │
│  (Free model,    │    │     REST API +       │
│   8192 tokens)   │    │     Row Level Sec.)  │
└──────────────────┘    └─────────────────────┘
          │                         │
          ▼                         ▼
   AI-generated             Persistent storage
   content text             of all generations
```

### Architecture Principles

1. **Zero Backend**: All logic runs in the browser. Both Gemini AI and Supabase provide client-side SDKs — no Express/Node server needed.
2. **Serverless Database**: Supabase provides a managed PostgreSQL instance with a REST API, accessible directly from the browser via `@supabase/supabase-js`.
3. **Client-side AI**: The Gemini API is called directly from the browser using the `@google/generative-ai` SDK.

---

## 🔄 Data Flow

### Content Generation Flow

```
 User selects        User fills         AI prompt is        Gemini API         Result saved
 a template    →     form fields   →    constructed    →    responds      →    to Supabase
     │                    │                  │                  │                  │
     ▼                    ▼                  ▼                  ▼                  ▼
┌──────────┐      ┌────────────┐     ┌────────────┐    ┌────────────┐    ┌────────────┐
│Dashboard │      │FormSection │     │ AiModal.jsx│    │ Gemini 2.0 │    │ supabase   │
│  click   │      │  onSubmit  │     │ chatSession│    │   Flash    │    │.from()     │
│ template │      │  gather    │     │ .sendMsg() │    │  response  │    │.insert()   │
│  card    │      │  formData  │     │            │    │  .text()   │    │ ai_output  │
└──────────┘      └────────────┘     └────────────┘    └────────────┘    └────────────┘
```

### Detailed Step-by-Step

1. **Template Selection**: User browses dashboard → clicks a `TemplateCard` → navigates to `/content/:templateSlug`
2. **Template Resolution**: `ContentGenerator` reads `templateSlug` from URL params → finds matching template from `Templates.jsx` data array
3. **Form Rendering**: `FormSection` dynamically renders input fields based on the template's `form[]` configuration
4. **Prompt Construction**: On submit, form data is serialized to JSON and concatenated with the template's `aiPrompt` string
5. **AI Call**: The combined prompt is sent to Gemini 2.0 Flash via `chatSession.sendMessage()`
6. **Response Display**: AI response text is set in state → passed to `OutputSection` → rendered in Toast UI Editor (WYSIWYG)
7. **Database Persistence**: The response, form data, template slug, user email, and timestamp are inserted into the `ai_output` Supabase table via `supabase.from('ai_output').insert()`

### Authentication Flow

```
App.js (ClerkProvider)
  │
  ├── Public Route: / (HomePage)
  │     └── No auth required, landing page
  │
  ├── Route: /dashboard
  │     └── Dashboard with template grid
  │
  └── Route: /content/:templateSlug
        └── AI content generation page
        └── useUser() hook provides user identity for DB writes
```

---

## 🧩 Component Hierarchy

```
App.js
├── ClerkProvider (Authentication wrapper)
│   └── BrowserRouter
│       └── Routes
│           ├── "/" → HomePage
│           │        ├── Header (logo + nav)
│           │        ├── Hero Section (CTA)
│           │        └── Features Grid (4 cards)
│           │
│           ├── "/dashboard" → Dashboard
│           │        ├── SearchSection (search bar + gradient header)
│           │        └── TemplateListSection
│           │             └── TemplateCard[] (18+ cards, filterable)
│           │
│           └── "/content/:templateSlug" → ContentGenerator
│                    ├── Back Button
│                    ├── FormSection (dynamic form from template config)
│                    │    ├── Image (template icon)
│                    │    ├── Input / Textarea (per form field)
│                    │    └── Submit Button (with loading spinner)
│                    └── OutputSection
│                         ├── Copy Button
│                         └── Toast UI Editor (WYSIWYG markdown)
```

---

## 🧠 Technical Design Decisions

### 1. Template-Driven Architecture

**Decision**: All 18+ content types are defined as data objects in a single `Templates.jsx` file, not as separate components.

**Rationale**: Adding a new AI tool requires zero component code — just add an entry to the `Templates` array with `name`, `desc`, `icon`, `slug`, `aiPrompt`, and `form[]`.

**Trade-off**: Less per-template customization, but dramatically faster iteration and zero component duplication.

### 2. Client-Side AI Calls (No Backend)

**Decision**: Gemini API is called directly from the browser.

**Rationale**:
- Eliminates the need for a Node.js/Express backend
- Reduces deployment complexity (static site hosting)
- API key is exposed in browser bundle

**Mitigation**: Clerk authentication ensures only authenticated users generate content. For production, proxy through a serverless function.

### 3. Rich Text Editor for Output

**Decision**: Toast UI Editor renders AI output as editable WYSIWYG markdown.

**Rationale**: Users can edit AI-generated content before copying. Supports markdown formatting natively and provides a professional editing experience.

### 4. Chat Session Pattern for AI

**Decision**: A single `chatSession` object is created at module load time and reused.

**Rationale**: Gemini's `startChat()` maintains conversation history, enabling potential multi-turn interactions. Generation config (temperature=1, topP=0.95, topK=40) is tuned for creative output.

### 5. Shadcn-Style UI Components

**Decision**: Custom `Button`, `Input`, `Textarea` components use `class-variance-authority` (CVA) + `clsx` + `tailwind-merge`.

**Rationale**: Provides consistent, accessible UI primitives with variant-based styling (`default`, `destructive`, `outline`, etc.).

---

## 🗃 Why Supabase? (Database Decision)

We migrated from **NeonDB + Drizzle ORM** to **Supabase** for the following reasons:

### Problems with the Previous Stack (NeonDB + Drizzle ORM)

| Problem | Impact |
|---------|--------|
| **ORM overhead** | Drizzle ORM added complexity for simple INSERT/SELECT operations |
| **3 extra dependencies** | `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless` increased bundle size |
| **Schema file required** | Needed `schema.jsx` + `drizzle.config.js` + `db:push` migration step |
| **Build-time tooling** | Required `drizzle-kit` CLI for schema migrations |
| **No visual dashboard** | Drizzle Studio required a separate CLI command to inspect data |

### Why Supabase Wins

| Factor | Supabase ✅ | NeonDB + Drizzle ❌ |
|--------|------------|-------------------|
| **Dependencies** | 1 (`@supabase/supabase-js`) | 3 (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`) |
| **ORM needed?** | No — `.from().insert()` / `.select()` built-in | Yes — Drizzle ORM required |
| **Schema management** | Create tables in Supabase Dashboard (GUI) | Schema file + CLI migration (`db:push`) |
| **Dashboard** | Supabase Studio (Table Editor, SQL Editor, built-in) | Drizzle Studio (CLI-only) |
| **Security** | Row Level Security (RLS) built-in | Manual security configuration |
| **Real-time** | Built-in real-time subscriptions | Not available |
| **Free tier** | 500MB DB, 50K MAU, unlimited API | Limited free tier |
| **Browser SDK** | First-class browser support | HTTP driver works but less ergonomic |

### Why Not MongoDB Atlas?

| Factor | Supabase ✅ | MongoDB Atlas ❌ |
|--------|------------|-----------------|
| **Browser SDK** | `@supabase/supabase-js` — works directly in browser | Requires Atlas Data API or Realm SDK (complex setup) |
| **Migration effort** | Minimal — both PostgreSQL, same data model | Requires data model redesign (SQL → NoSQL) |
| **Schema** | Structured tables match our fixed schema | Document-based — overkill for our simple structure |
| **Auth** | Built-in auth (optional, we keep Clerk) | No built-in auth |

---

## ⚡ Why Gemini 2.0 Flash?

We upgraded from **Gemini 1.5 Flash** to **Gemini 2.0 Flash**:

| Factor | Gemini 2.0 Flash ✅ | Gemini 1.5 Flash |
|--------|---------------------|------------------|
| **Cost** | Free tier available | Free tier available |
| **Speed** | Faster inference | Slower |
| **Quality** | Improved reasoning and content quality | Good but older |
| **Context window** | 1M tokens | 1M tokens |
| **Output tokens** | 8192 | 8192 |
| **Status** | Latest stable free model | Legacy |

---

## 🗄 Database Schema

### Supabase Table: `ai_output`

Create this table in Supabase SQL Editor:

```sql
CREATE TABLE ai_output (
  id BIGSERIAL PRIMARY KEY,
  form_data TEXT NOT NULL,
  ai_response TEXT,
  template_slug TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT
);

-- Enable Row Level Security
ALTER TABLE ai_output ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and selects (for client-side access with anon key)
CREATE POLICY "Allow anonymous insert" ON ai_output FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON ai_output FOR SELECT USING (true);
```

### Schema Design Notes

- **`form_data`** — JSON string of user form inputs (varies by template)
- **`ai_response`** — Full AI-generated content text
- **`template_slug`** — Links back to the template definition for analytics
- **`created_by`** — Clerk user's email address
- **`created_at`** — Date string formatted as DD/MM/YYYY via Moment.js

---

## 🔧 Template Engine

Each template in `src/data/Templates.jsx` follows this schema:

```javascript
{
  name: 'Blog Title',                    // Display name
  desc: 'An AI tool that...',            // Description shown on card
  category: 'Blog',                      // Category for filtering
  icon: 'https://cdn-icons-png...',      // Icon URL from Flaticon
  slug: 'generate-blog-title',           // URL-safe identifier
  aiPrompt: 'Give me 5 blog topic...',   // Instruction sent to Gemini
  form: [                                // Dynamic form field definitions
    {
      label: 'Enter your blog niche',
      field: 'input',                    // 'input' or 'textarea'
      name: 'niche',
      required: true
    }
  ]
}
```

### Available Templates (18+)

| Category | Templates |
|----------|-----------|
| **Blog** | Blog Title, Blog Content, Blog Topic Ideas, Add Emojis to Text |
| **YouTube** | SEO Title, Description, Tags |
| **Instagram** | Post Generator, Hash Tag Generator, Post/Reel Ideas |
| **Writing** | Rewrite Article (Plagiarism Free), Text Improver |
| **Coding** | Write Code, Explain Code, Code Bug Detector |
| **Marketing** | Tagline Generator, Product Description |
| **Language** | English Grammar Check |

---

## 🤖 AI Integration

### Gemini 2.0 Flash Configuration

```javascript
// src/utils/AiModal.jsx
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",       // Latest free model
});

const generationConfig = {
  temperature: 1,                  // Maximum creativity
  topP: 0.95,                     // Nucleus sampling threshold
  topK: 40,                       // Top-K sampling
  maxOutputTokens: 8192,          // ~6000 words max output
  responseMimeType: "text/plain",
};
```

### Prompt Engineering

The final prompt sent to Gemini is:
```
JSON.stringify(formData) + ',' + template.aiPrompt
```

Example for Blog Title:
```
{"niche":"technology","outline":"AI trends"},Give me 5 blog topic idea in bullet wise only based on give niche & outline and give me result in Rich text editor format
```

---

## 📁 Folder Structure

```
ai-content-generator/
├── public/
│   ├── index.html              # HTML entry point
│   ├── logo.svg                # App logo
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico             # Browser favicon
│
├── src/
│   ├── index.js                # ReactDOM render entry
│   ├── index.css               # Global styles + Tailwind + CSS variables
│   ├── App.js                  # Root component (Router + ClerkProvider)
│   │
│   ├── components/
│   │   ├── HomePage.js         # Landing page with hero + features
│   │   ├── Dashboard.js        # Template browsing page
│   │   ├── ContentGenerator.js # AI content generation page
│   │   ├── SearchSection.jsx   # Gradient search header
│   │   ├── TemplateListSection.jsx  # Filterable template grid
│   │   ├── TemplateCard.jsx    # Individual template card
│   │   ├── FormSection.jsx     # Dynamic form from template config
│   │   ├── OutputSection.jsx   # Toast UI Editor for AI output
│   │   ├── Image.js            # Simple img wrapper component
│   │   └── ui/
│   │       ├── button.jsx      # CVA-styled button variants
│   │       ├── input.jsx       # Styled input primitive
│   │       └── textarea.jsx    # Styled textarea primitive
│   │
│   ├── data/
│   │   └── Templates.jsx       # 18+ template definitions (data-driven)
│   │
│   └── utils/
│       ├── AiModal.jsx         # Gemini 2.0 Flash client + chat session
│       ├── db.jsx              # Supabase client initialization
│       └── utils.js            # Tailwind class merge utility (cn)
│
├── .env                        # Environment variables (not committed)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS plugins
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** 9+ installed
- A **Google Gemini API key** ([Get one here](https://aistudio.google.com/apikey))
- A **Clerk account** ([clerk.com](https://clerk.com))
- A **Supabase account** ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-content-generator.git
cd ai-content-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE ai_output (
  id BIGSERIAL PRIMARY KEY,
  form_data TEXT NOT NULL,
  ai_response TEXT,
  template_slug TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT
);

ALTER TABLE ai_output ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON ai_output FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON ai_output FOR SELECT USING (true);
```

3. Go to **Settings → API** and copy your **Project URL** and **Anon Key**

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_GOOGLE_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 5. Start Development Server

```bash
npm start
```

The app opens at `http://localhost:3000`.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GOOGLE_GEMINI_API_KEY` | Google Gemini AI API key | ✅ Yes |
| `REACT_APP_SUPABASE_URL` | Supabase project URL (e.g., `https://xxx.supabase.co`) | ✅ Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ Yes |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | Clerk authentication publishable key | ✅ Yes |

> **Note**: All variables must be prefixed with `REACT_APP_` for Create React App to inject them into the build.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm run build` | Create production build in `/build` |
| `npm test` | Run test suite |

---

## 🌐 Deployment

This is a static React app deployable to:

- **Vercel**: `npx vercel --prod`
- **Netlify**: Build command `npm run build`, publish dir `build`
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3 + CloudFront**: Upload `/build` contents

> **Important**: Set all `REACT_APP_*` environment variables in your hosting platform's settings.

---

## 📄 License

This project is licensed under the MIT License.

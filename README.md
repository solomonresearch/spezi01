# Spezi01 - AI-Powered Legal Education Platform

An interactive legal case study platform for Romanian law students, featuring AI-assisted learning and verified professional cases.

🌐 **Live App:** [www.spezi.space](https://www.spezi.space)

## Features

### 🎓 **Legal Case Studies**
- ✅ **16+ Verified Cases** - Professionally verified by legal experts
- ✅ **Case Codes** - Unique identifiers (e.g., CIV1AAA) for easy reference
- ✅ **Difficulty Levels** - Ușor (Easy), Mediu (Medium), Dificil (Hard)
- ✅ **Verification Badges** - Visual indicators for professional review
- ✅ **Interactive Case Display** - Collapsible sections for problem, description, questions
- ✅ **Analysis Steps** - Expected analytical approaches for each case
- ✅ **Hints System** - Progressive guidance with toggle visibility

### 👥 **User Profiles & Authentication**
- ✅ **Full Profile System** - Name, username, university affiliation
- ✅ **30 Romanian Universities** - Complete dropdown with public/private categorization
- ✅ **Username Uniqueness** - Real-time availability checking
- ✅ **Leaderboard Ready** - Usernames displayed for rankings and interactions
- ✅ **Email Validation** - Secure signup with email confirmation
- ✅ **Protected Routes** - Authentication-gated content

### 🤖 **AI Assistant**
- ✅ **Claude Sonnet 4.5** - Advanced AI tutoring integration
- ✅ **Context-Aware Chat** - Understands current case details
- ✅ **Socratic Method** - Guides learning without giving direct answers
- ✅ **Romanian Language** - Native language support

### 📚 **Legal Code Reference**
- ✅ **Romanian Civil Code** - Full text searchable reference
- ✅ **Resizable Viewer** - Drag-to-resize with localStorage persistence
- ✅ **Independent Scrolling** - Code viewer and chat scroll separately
- ✅ **Coming Soon** - Constitution and Criminal Code support

### 🗂️ **Organization**
- ✅ **Category System** - Civil, Constitutional, Roman Law
- ✅ **Subcategories** - Detailed topic organization
- ✅ **Week-Based** - Curriculum-aligned case progression
- ✅ **Collapsible Sidebar** - Toggle navigation for more space

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with user profiles
- **AI**: Anthropic Claude Sonnet 4.5 API
- **Styling**: CSS3 with modern gradients
- **Data Processing**: xlsx for Excel parsing
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Project Structure

```
spezi01/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Login.tsx        # Login form
│   │   │   ├── SignUp.tsx       # Signup with profile fields
│   │   │   ├── Dashboard.tsx    # Main case study interface
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx  # Auth + profile management
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useCases.ts      # Case data fetching
│   │   │   └── useChat.ts       # AI chat integration
│   │   ├── data/                # Static data
│   │   │   └── universities.ts  # Romanian universities list
│   │   ├── types/               # TypeScript types
│   │   │   ├── case.ts          # Case interfaces
│   │   │   └── chat.ts          # Chat interfaces
│   │   ├── lib/                 # Utilities
│   │   │   └── supabase.ts      # Supabase client
│   │   └── App.tsx
│   ├── .env                     # Environment variables (not committed)
│   └── .env.example
├── supabase/                    # Database migrations
│   └── migrations/              # SQL migration files
│       ├── 20251025_create_cases_tables.sql
│       ├── 20251026_add_verified_and_case_code.sql
│       ├── 20251026_add_user_profile_fields.sql
│       └── 20251026_mark_cases_verified.sql
├── cases/                       # Case data
│   ├── cazuri_drept_civil_extinse.xlsx  # Verified cases Excel
│   └── parsed_cases.json        # Parsed case data
├── scripts/                     # Utility scripts
│   ├── parse-verified-cases.js  # Excel parser
│   ├── generate-verified-cases-sql.js
│   └── show-migration.js        # Migration helper
├── Developer/                   # Development documentation
│   ├── bestpractices01.md       # Project constitution
│   ├── SIMPLE-MIGRATION-WORKFLOW.md
│   └── QUICK-START-LOCAL-SUPABASE.md
├── Laws/                        # Legal code texts
└── Prompts/                     # AI system prompts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/solomonresearch/spezi01.git
   cd spezi01
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   The `.env` file is already configured with your Supabase credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## Usage

### Sign Up
1. Click "Sign up" on the login page
2. Fill in all required fields:
   - **Full Name** - Your display name
   - **Username** - Unique identifier for leaderboards (real-time availability check)
   - **University** - Select from dropdown (30 Romanian universities)
   - **Email** - Your email address
   - **Password** - Minimum 6 characters
   - **Confirm Password**
3. Click "Sign Up"
4. Check your email for confirmation link

### Login
1. Enter your registered email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### Using the Platform

**Navigating Cases:**
1. Expand a law category in the left sidebar (e.g., "Drept Civil")
2. Select a subcategory (e.g., "Capacitatea de exercițiu")
3. Click on a case to view it (cases with ✓ are verified by professionals)

**Working with Cases:**
- Read the legal problem, description, and question
- View relevant articles by clicking "Arată Articole relevante"
- Toggle "Arată Pași de analiză" to see expected analytical steps
- Toggle "Arată Indicii" to reveal progressive hints
- Case codes (e.g., CIV1AAA) help identify and reference specific cases

**Using the Code Viewer:**
- View the Romanian Civil Code in the right panel
- Drag the resize handle to adjust viewer size
- Scroll independently from the chat area
- Your size preference is saved automatically

**AI Assistant:**
- Chat appears below the code viewer
- Ask questions about the current case
- AI has context of the case you're viewing
- Uses Socratic method to guide (won't give direct answers)

## Supabase Setup

The project is already linked to Supabase project `pgprhlzpzegwfwcbsrww`.

To view your Supabase dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project: "solomonresearch's Project"
3. Navigate to Authentication > Users to see registered users

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Type check without building

**Database:**
- `node scripts/show-migration.js <file>` - Show migration and open SQL Editor
- `node scripts/parse-verified-cases.js` - Parse Excel cases
- `node scripts/generate-verified-cases-sql.js` - Generate verification SQL

### Database Migrations

**Creating Migrations:**
```bash
# Create new migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_feature_name.sql
```

**Applying Migrations:**
```bash
# Show migration and copy to clipboard
node scripts/show-migration.js supabase/migrations/[filename].sql

# Then paste in Supabase SQL Editor
# https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new
```

See `Developer/SIMPLE-MIGRATION-WORKFLOW.md` for detailed workflow.

### Key Architecture

**Authentication & Profiles:**
- `AuthContext.tsx` - Manages auth state and profile creation
- `user_profiles` table - Stores name, username, university
- Username uniqueness enforced at database and UI level

**Case Management:**
- `useCases.ts` hook - Fetches cases by subcategory
- `useCase.ts` hook - Fetches single case with articles/steps/hints
- Cases stored across multiple tables (cases, case_articles, case_analysis_steps, case_hints)
- Verification flag and case codes for organization

**AI Integration:**
- `useChat.ts` hook - Manages chat state and API calls
- Context-aware: sends case details to AI
- Anthropic Claude Sonnet 4.5 via API

## Database Schema

**Tables:**
- `cases` - Legal case studies with verification flag and case codes
- `case_articles` - Relevant civil code articles for each case
- `case_analysis_steps` - Expected analytical approaches
- `case_hints` - Progressive guidance hints
- `user_profiles` - Extended user information (name, username, university)
- `public_profiles` - View for leaderboard data (limited fields)

**Key Features:**
- Row Level Security (RLS) on all tables
- Username uniqueness constraint
- Case code uniqueness constraint (format: CIV1AAA)
- Foreign key relationships for data integrity
- Indexes on frequently queried fields

## Security Features

- ✅ **Row Level Security** - Database-level access control
- ✅ **User Profile Privacy** - Users can only view/edit own profiles
- ✅ **Username Validation** - Alphanumeric + underscore, 3+ characters
- ✅ **Real-time Uniqueness Check** - Prevents duplicate usernames
- ✅ **Environment Variables** - Sensitive data never committed
- ✅ **Password Requirements** - Minimum 6 characters
- ✅ **Email Validation** - Format checking and confirmation
- ✅ **Protected Routes** - Authentication-gated content
- ✅ **Secure Token Management** - Handled by Supabase Auth

## Deployment

### Production Deployment

**Live at:** [www.spezi.space](https://www.spezi.space)

The app is deployed on **Vercel** with automatic deployments from the `master` branch.

### Build for production

```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

### Vercel Configuration

**Important:** See `Developer/vercel-deployment-guide.md` for complete setup instructions.

**Quick Setup:**
1. Root Directory: `client`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_SUPABASE_URL=https://pgprhlzpzegwfwcbsrww.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=[your-key]`

### Email Confirmation URLs

To ensure email confirmations redirect to the production site:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/url-configuration)
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to: `https://www.spezi.space`
4. Add **Redirect URLs**: `https://www.spezi.space/**`
5. Click **Save**

See `Developer/supabase-url-configuration.md` for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using React, TypeScript, and Supabase

# Spezi01 - React Authentication with Supabase

A modern authentication system built with React, TypeScript, Vite, and Supabase.

🌐 **Live App:** [www.spezi.space](https://www.spezi.space)

## Features

- ✅ User registration with email validation
- ✅ Secure login/logout functionality
- ✅ Protected routes (authenticated users only)
- ✅ Modern, responsive UI with gradient design
- ✅ Form validation for all inputs
- ✅ TypeScript for type safety
- ✅ Supabase backend integration

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Styling**: CSS3 with modern gradients

## Project Structure

```
spezi01/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/           # Utilities
│   │   │   └── supabase.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env               # Environment variables (not committed)
│   └── .env.example       # Environment template
├── Developer/             # Development docs
├── Laws/                  # Legal documents
├── Prompts/              # AI prompts
└── supabase/             # Supabase config
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
2. Enter your email and password (minimum 6 characters)
3. Confirm your password
4. Check your email for confirmation (if email confirmations are enabled)

### Login
1. Enter your registered email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### Dashboard
- View your user information
- Sign out when done

## Supabase Setup

The project is already linked to Supabase project `pgprhlzpzegwfwcbsrww`.

To view your Supabase dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project: "solomonresearch's Project"
3. Navigate to Authentication > Users to see registered users

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Authentication Flow

1. **AuthContext** (`src/contexts/AuthContext.tsx`) manages authentication state
2. **useAuth** hook provides access to auth methods and user state
3. **ProtectedRoute** component guards authenticated routes
4. **Supabase** handles all backend authentication logic

## Security Features

- ✅ Environment variables for sensitive data
- ✅ Password minimum length validation
- ✅ Email format validation
- ✅ Protected routes with automatic redirect
- ✅ Secure token management via Supabase

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

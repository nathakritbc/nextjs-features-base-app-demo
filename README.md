# Next.js Features Base App Demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) demonstrating various features and best practices.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── products/         # Product pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout component
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── ui/               # UI components
│   │   └── Header.tsx        # Header component
│   ├── features/             # Feature-specific modules
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Library code, utilities
│   │   ├── __tests__/        # Tests for library code
│   │   ├── axios.ts          # Axios configuration
│   │   └── providers.tsx     # React context providers
│   ├── middleware.ts         # Next.js middleware
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── .next/                    # Next.js build output (generated)
├── .env.local                # Local environment variables
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Vitest configuration
```

## Key Features

- **App Router**: Using Next.js App Router for file-based routing
- **Authentication**: Implementation using NextAuth.js
- **API Routes**: Server-side API endpoints
- **Testing**: Set up with Vitest for unit and integration testing
- **Typescript**: Full type safety throughout the codebase
- **Form Handling**: Using React Hook Form with Zod validation
- **State Management**: Utilizing Zustand for state management
- **HTTP Client**: Axios configured for API requests
- **Styling**: TailwindCSS for styling

## Technology Stack

- **Framework**: Next.js 15.3.0
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Form Management**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js
- **Testing**: Vitest, Testing Library

## Development

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Run linting
npm run lint
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

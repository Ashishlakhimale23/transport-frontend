# LoadTrust Dispatch Flow

A modern transportation and contract management service platform built with React, TypeScript, and Vite.

## Overview

LoadTrust Dispatch Flow is a web application that enables users to post transportation contracts, browse available opportunities, manage contract details, and track their profiles and ratings. The platform supports both regular users and admin dashboards for comprehensive contract and logistics management.

## Features

- **Contract Management**: Create and post new transportation contracts
- **Opportunity Browsing**: Discover and filter available contract opportunities
- **Contract Details**: View detailed information about specific contracts
- **User Profiles**: Manage user information and view profile details
- **Admin Dashboard**: Administrative interface for managing contracts and users
- **Authentication**: User sign-in and authentication system
- **Payment Processing**: Integrated payment modal for transactions
- **Delivery Confirmation**: Track and confirm delivery status
- **Rating System**: Rate and review completed contracts
- **Responsive Design**: Mobile-friendly UI with modern styling

## Tech Stack

### Frontend Framework
- **React** 18.3.1 - UI library
- **TypeScript** 5.8.3 - Type safety
- **Vite** 5.4.19 - Fast build tool and dev server

### UI & Styling
- **shadcn/ui** - High-quality React components
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** 2.15.4 - Chart library for data visualization

### State Management & Data Fetching
- **React Query** 5.83.0 - Server state management
- **React Router** 6.30.1 - Client-side routing

### Forms & Validation
- **React Hook Form** 7.61.1 - Efficient form handling
- **Zod** 3.25.76 - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### HTTP Client
- **Axios** 1.13.4 - Promise-based HTTP client

### UI Components & Utilities
- **Sonner** - Toast notifications
- **Vaul** - Drawer component
- **Embla Carousel** - Carousel component
- **Date-fns** 3.6.0 - Date utilities
- **class-variance-authority** - CSS-in-JS utility
- **clsx** - Conditional classnames

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager

## Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd loadtrust-dispatch-flow
```

2. **Install dependencies**:
```bash
npm install
# or
bun install
```

## Running the Project

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build

Build the project for production:

```bash
npm run build
# or
bun run build
```

Build with development mode settings:
```bash
npm run build:dev
# or
bun run build:dev
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
# or
bun run preview
```

### Linting

Check code quality with ESLint:

```bash
npm run lint
# or
bun run lint
```

## Project Structure

```
src/
├── pages/              # Route pages
│   ├── Index.tsx
│   ├── PostContract.tsx
│   ├── BrowseOpportunities.tsx
│   ├── ContractDetails.tsx
│   ├── Profile.tsx
│   ├── AdminProfile.tsx
│   ├── SignIn.tsx
│   ├── GetStarted.tsx
│   └── NotFound.tsx
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── Navbar.tsx
│   ├── PaymentModal.tsx
│   ├── DeliveryConfirmationModal.tsx
│   ├── RatingDialog.tsx
│   └── ...
├── lib/               # Utilities and helpers
│   └── axioapi.ts     # Axios API configuration
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## Available Routes

- `/` - Home page
- `/get-started` - Get started guide
- `/sign-in` - User authentication
- `/post-contract` - Create new contract
- `/browse-opportunities` - View available opportunities
- `/contract-details/:id` - View specific contract details
- `/profile` - User profile page
- `/admin/dashboard` - Admin dashboard
- `*` - 404 Not Found page

## API Integration

The project uses Axios for API requests. API configuration is centralized in `src/lib/axioapi.ts`.

### Example Usage:
```typescript
import { api } from '@/lib/axioapi';

// GET request
const { data } = await api.get('/endpoint');

// POST request
const { data } = await api.post('/endpoint', { /* data */ });
```

## Styling

The project uses **Tailwind CSS** for styling. Configuration files:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration


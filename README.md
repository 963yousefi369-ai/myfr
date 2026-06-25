# AFI Next - E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS, and PocketBase. Features include product browsing, shopping cart, user authentication, blog, and payment processing.

## ✨ Features

- **Product Catalog**: Browse and search products with filtering
- **Shopping Cart**: Add/remove items, update quantities, persistent cart
- **User Authentication**: Phone-based OTP login, profile management
- **Blog System**: Read and interact with blog posts
- **Checkout Process**: Multi-step checkout with shipping calculation
- **Payment Integration**: Secure payment processing
- **Admin Panel**: Product and order management (if applicable)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme switching based on system preference
- **Internationalization**: RTL support for Persian/Arabic languages

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- PocketBase instance running (default: http://localhost:8090)
- Django API backend (default: http://localhost:8000)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd afi-next
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PB_URL=http://localhost:8090
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### 6. Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Django API backend URL | `http://localhost:8000` |
| `NEXT_PUBLIC_PB_URL` | PocketBase backend URL | `http://localhost:8090` |

> **Note**: These variables must be prefixed with `NEXT_PUBLIC_` to be exposed to the browser.

## 📁 Folder Structure

```
afi-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Authentication routes (layout group)
│   │   │   ├── forgot-password/
│   │   │   └── login/
│   │   ├── (main)/          # Main application routes (layout group)
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   ├── products/
│   │   │   ├── profile/
│   │   │   └── payment/
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # Reusable components
│   │   ├── auth/            # Auth-related components
│   │   ├── blog/            # Blog components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── product/         # Product components
│   │   ├── profile/         # Profile components
│   │   ├── shared/          # Shared components
│   │   └── ui/              # shadcn/ui components
│   ├── lib/                 # Library code
│   │   ├── api/             # API service layers
│   │   │   ├── django.ts    # Django API services
│   │   │   └── pocketbase.ts # PocketBase services
│   │   ├── store/           # Zustand stores
│   │   │   ├── auth.ts      # Auth state management
│   │   │   └── cart.ts      # Cart state management
│   │   └── utils.ts         # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
├── .env.local               # Environment variables (gitignored)
├── .env.local.example       # Example environment variables
├── middleware.ts            # Next.js middleware for auth protection
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## ⚙️ Key Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmndrs.com/) with persistence
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Notifications**: [Sonner](https://sonner.emilgoabel.se/) toast notifications
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: 
  - [PocketBase](https://pocketbase.io/) (primary)
  - [Django REST Framework](https://www.django-rest-framework.org/) (secondary)

## 🔒 Authentication & Authorization

The app implements a two-tier authentication system:

1. **Regular Users**: 
   - Phone-based OTP authentication
   - Token stored in cookies (`afi_token`)
   - Protected routes: `/cart`, `/checkout`, `/profile`, `/payment`

2. **Admin Users** (if applicable):
   - Separate admin token (`afi_admin_token`)
   - Protected routes: `/admin/*`

Middleware (`middleware.ts`) handles route protection by checking for authentication tokens and redirecting unauthenticated users to login pages.

## 📦 State Management

### Auth Store (`src/lib/store/auth.ts`)
- Manages user authentication state
- Persists user data and token in localStorage via `zustand/middleware/persist`
- Handles login/logout flows
- Sets HTTP-only cookie for token persistence

### Cart Store (`src/lib/store/cart.ts`)
- Manages shopping cart items
- Persists cart data in localStorage
- Provides methods for adding, removing, updating items
- Calculates total count and price

## 🔄 Data Fetching

The application uses [TanStack React Query](https://tanstack.com/query/latest) for efficient data fetching:

- **Automatic caching** and background updates
- **Stale-while-revalidate** caching strategy (60 seconds stale time)
- **Request deduplication** to prevent duplicate API calls
- **Pagination support** for blog listings
- **Error handling** and retry mechanisms

Data is fetched from two primary sources:
1. **PocketBase** - For products, banners, partners, blogs, site config, pages
2. **Django API** - For authentication, orders, addresses, settings, shipping

## 🖼️ Image Optimization

Images are served via:
- **PocketBase** file API for user-uploaded content
- **Next.js Image** component for optimized delivery
- Remote patterns configured in `next.config.ts` to allow images from localhost and external sources

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_PB_URL`
4. Vercel will automatically detect Next.js and configure build settings

### Docker

Create a `Dockerfile`:

```dockerfile
# Use Node.js 18-alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t afi-next .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-api-url -e NEXT_PUBLIC_PB_URL=http://your-pb-url afi-next
```

### Manual Deployment (Node Server)

```bash
# Build the application
npm run build

# Start the server
npm start
```

## ⚠️ Gotchas & Known Issues

1. **PocketBase Dependency**: The application requires a running PocketBase instance with specific collections:
   - `banners`, `partners`, `products_ui`, `blogs`, `site_config`, `pages`

2. **Django API Dependency**: Certain features depend on the Django backend:
   - Authentication (OTP, login, profile)
   - Order management
   - Address management
   - Shipping calculations
   - Payment processing

3. **Cookie-based Auth**: Authentication tokens are stored in cookies, which means:
   - Tokens are sent with every request (including asset requests)
   - Consider implementing refresh token rotation for security

4. **Image Loading**: PocketBase image URLs must be constructed using helper functions:
   - Use `pbImageUrl(record, filename)` when you have a record object
   - Use `pbDirectUrl(collectionName, recordId, filename)` when you have ids separately

5. **RTL Support**: The application uses RTL (Right-to-Left) layout for Persian/Arabic languages:
   - Ensure proper direction is set on HTML container
   - Some UI components may need RTL-specific adjustments

## 🔧 Configuration

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}
export default nextConfig
```

### Tailwind CSS Configuration (`tailwind.config.ts`)

Configured with:
- Custom colors
- Radius utilities
- Animation support
- RTL support via plugins

### Components Configuration (`components.json`)

Configured for shadcn/ui with:
- Default styling
- RTL support
- Custom component aliases

## 🧪 Testing

Currently, the project doesn't have automated tests configured. Consider adding:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress or Playwright
- **E2E Tests**: Playwright for critical user flows

## 📝 License

This project is proprietary and confidential.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure linting passes
5. Submit a pull request

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [PocketBase](https://pocketbase.io/) for the open-source backend
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- All open-source contributors whose packages make this project possible

---

**Last Updated**: June 2026  
**Next.js Version**: 15.1.0  
**Node Version**: >=18.x
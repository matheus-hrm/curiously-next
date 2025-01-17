# Curiously - Social Q&A Platform

A modern social Q&A platform built with Next.js 15, where users can ask and answer questions in an engaging way.

## 🏗️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication:** [NextAuth v5](https://authjs.dev/) with Google & Discord OAuth
- **Database:** [Prisma](https://prisma.io) with Neon Serverless Postgres
- **Styling:** [Tailwind CSS](https://tailwindcss.com) & [shadcn/ui](https://ui.shadcn.com/)
- **Image Hosting:** [Cloudinary](https://cloudinary.com)
- **Deployment:** [Vercel](https://vercel.com)

## 📁 Project Structure
├── app/
│   ├── (home)/                 # Home routes
│   ├── (user)/                 # User profile routes
│   ├── api/                    # API endpoints
│   │   ├── [username]/
│   │   │   ├── follow/        # Follow/unfollow actions
│   │   │   ├── followers/     # Get user followers
│   │   │   ├── following/     # Get user following
│   │   │   ├── update/        # Profile updates
│   │   ├── auth/              # Auth endpoints
│   │   ├── questions/         # Question management
│   │   └── og/                # OpenGraph image generation
├── components/                 # Reusable components
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
└── prisma/                    # Database configuration

## 🚀 Key Features

### Authentication
- OAuth sign-in with Google and Discord
- Protected API routes and middleware
- Session management with NextAuth v5

### User Profiles
- Custom usernames and profile pictures
- Bio and social links
- Follow/unfollow system
- Activity feed of questions and answers

### Q&A System
- Ask and answer questions
- Rich text formatting
- Question visibility controls
- Real-time updates

### Social Features
- Follow other users
- View follower/following lists
- Activity feed
- Social sharing

### API Routes
```typescript
// User Management
GET    /api/[username]              # Get user profile
PUT    /api/[username]/update       # Update profile
POST   /api/[username]/follow       # Follow user
GET    /api/[username]/followers    # Get followers
GET    /api/[username]/following    # Get following

// Questions
GET    /api/questions               # Get questions
POST   /api/questions               # Create question
PUT    /api/questions/[id]          # Update question
DELETE /api/questions/[id]          # Delete question

// Authentication
POST   /api/auth/[...nextauth]      # Auth endpoints
```

## 💡 Technical Insights

- **Dynamic OG Images**: Custom OpenGraph images generated on-the-fly using [@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)
- **Edge Runtime**: API routes utilizing Edge Runtime for optimal performance
- **Prisma Integration**: Type-safe database queries with Prisma ORM
- **File Upload**: Cloudinary integration for avatar uploads
- **Type Safety**: Full TypeScript support across the codebase
- **Middleware**: Protected routes and API endpoints using Next.js middleware
- **SEO Optimization**: Dynamic metadata and sitemap generation

## 🏃‍♂️ Running Locally

1. Clone the repository
```bash
git clone https://github.com/matheus-hrm/curiously-next.git
```

2. Install dependencies
```bash
pnpm install
```

3. Create a 

.env

 file with required environment variables
```
AUTH_GOOGLE_ID
AUTH_DISCORD_ID
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

4. Start the development server
```bash
pnpm dev
```
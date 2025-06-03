# 🚀 Setup Guide

Get your tRPC + Firebase auth system running in under 10 minutes.

## 📋 Prerequisites

- Node.js 18+ and npm
- A Firebase project (free tier works fine)
- Basic knowledge of Next.js and TypeScript

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it something like "my-auth-app"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

### 3. Get Your Web Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app (name it anything)
5. Copy the config object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other fields
};
```

### 4. Create a Service Account

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Keep it safe! You'll need the `private_key`, `client_email`, and `project_id`

## 💻 Local Setup

### 1. Clone and Install

```bash
git clone https://github.com/monkeybarrels/trpc-firebase-auth-starter.git
cd trpc-firebase-auth-starter
npm install
```

### 2. Environment Variables

Create `.env.local` in your project root:

```env
# Firebase Web Config (from step 3 above)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Firebase Admin Config (from step 4 above)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

⚠️ **Important:** The private key must include the literal `\n` characters and be wrapped in quotes.

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the auth starter!

## ✅ Test Your Setup

### 1. Register a User

1. Go to the signup page
2. Enter an email and password
3. Click "Sign Up"
4. Check Firebase Console → Authentication → Users

### 2. Test Login

1. Go to the login page
2. Use the credentials you just created
3. You should be redirected to a protected dashboard

### 3. Test Middleware

Open your browser's Network tab and watch the requests. You should see:
- HTTP-only cookies being set on login
- Authorization headers on protected requests
- Server-side token verification

## 🔧 Customization

### Add New Roles

Edit `src/trpc/middlewares/isAdmin.ts`:

```typescript
export const isEditor = middleware(({ ctx, next }) => {
  if (!['admin', 'editor'].includes(ctx.user?.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next()
})
```

### Add User Metadata

Extend your context in `src/trpc/context.ts`:

```typescript
return {
  req,
  user: {
    id: decoded.uid,
    email: userData.email,
    role: userData.role || 'user',
    organizationId: userData.organizationId, // Add custom fields
  },
}
```

### Add Protected Routes

Use the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '@/components/protected-route'

function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Secret Dashboard!</h1>
    </ProtectedRoute>
  )
}
```

## 🚨 Common Issues

### "Invalid private key" error

Your `FIREBASE_ADMIN_PRIVATE_KEY` formatting is wrong. Make sure:
- It includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Newlines are literal `\n` characters
- The whole thing is wrapped in double quotes

### "No authentication token provided"

Check that:
- Cookies are being set (check browser dev tools)
- Your middleware is receiving the Authorization header
- You're using the `protectedProcedure` for protected routes

### Firebase rules errors

Make sure you've enabled Email/Password authentication in Firebase Console.
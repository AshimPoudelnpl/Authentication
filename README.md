# Mystery Message

This README is written for understanding the codebase, not just running the app.

## Project Idea

`Mystery Message` looks like the start of an anonymous messaging app where:

- a user signs up
- the user gets a verification code by email
- the account is verified
- the user can choose whether to accept anonymous messages
- messages are stored inside the user document

Right now, the backend foundation is partially built. The sign-up flow, user model, email helper, and validation schemas exist, but the UI and some API routes are still unfinished.

## Tech Stack

- `Next.js 16` with App Router
- `React 19`
- `TypeScript`
- `MongoDB + Mongoose`
- `Resend` for email sending
- `React Email` for the email template
- `Zod` for validation schemas

## Current Project State

What is already present:

- user schema with embedded messages
- database connection helper
- sign-up API route
- OTP email sending helper
- email template for verification
- Zod schemas for sign-up, sign-in, verify code, messages, and accept-message toggle

What is still incomplete:

- homepage is still the default Next.js starter page
- `app/api/test-db/route.ts` is empty
- verify/sign-in/message routes are not implemented yet
- some validation schemas are created but not used in routes yet

## Folder Guide

### `app/api`

- `app/api/sign-up/route.ts`
  Handles user registration.
- `app/api/test-db/route.ts`
  Exists, but currently has no code.

### `app/model`

- `app/model/User.ts`
  Contains the Mongoose schema for both `User` and embedded `Message`.

### `app/lib`

- `app/lib/dbConnect.ts`
  Connects to MongoDB and tries to reuse an existing connection.
- `app/lib/resend.ts`
  Creates the Resend client using `RESEND_API_KEY`.

### `app/helpers`

- `app/helpers/sendVerificationEmail.ts`
  Sends the OTP email after sign-up.

### `app/schemas`

- `signUpSchema.ts`
  Validation for username, email, and password.
- `signInSchema.ts`
  Validation for login.
- `verifySchhema.ts`
  Validation for the 6-digit verification code.
- `messageSchema.ts`
  Validation for anonymous message content.
- `acceptMessageSchema.ts`
  Validation for turning message acceptance on or off.

### `emails`

- `emails/VerificationEmail.tsx`
  React Email template used for the OTP message.

## Main Flow: Sign-Up API

The most important working backend flow right now is:

`POST /api/sign-up`

File:

- `app/api/sign-up/route.ts`

### What happens step by step

1. `dbConnect()` runs first.
   This opens the MongoDB connection if it is not already open.

2. The route reads `username`, `email`, and `password` from `request.json()`.

3. It checks if a verified user already exists with the same `username`.
   If yes, it returns:

```json
{
  "success": false,
  "message": "Username already taken"
}
```

4. It checks if a user already exists with the same `email`.

5. It creates a 6-digit verification code.

6. It hashes the password using `bcryptjs`.

7. If the email already exists but the account is not verified:
   the code updates that existing user with a new hashed password, new verification code, and new expiry time.

8. If the email does not exist:
   it creates a new user document with:

- `isVerified: false`
- `isAcceptingMessages: true`
- `messages: []`

9. After saving the user, it sends the verification email.

10. If the email sends successfully, it returns:

```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email."
}
```

## Data Model

File:

- `app/model/User.ts`

### `Message`

Each message contains:

- `content`
- `createdAt`

These messages are embedded directly inside the user document.

### `User`

Each user contains:

- `username`
- `email`
- `password`
- `verifyCode`
- `verifyCodeExpiry`
- `isVerified`
- `isAcceptingMessages`
- `messages`

### Why embedded messages are used

Instead of storing messages in a separate collection, this code stores them inside the user document. That makes it simple to fetch one user's inbox, but it can become harder to scale if a user receives a very large number of messages.

## Validation Schemas

The project already has Zod schemas prepared for future APIs and forms.

### `signUpSchema.ts`

Rules:

- username must be 2 to 20 characters
- username must contain only letters and numbers
- email must be valid
- password must be 8 to 100 characters
- password must contain:
  one uppercase letter, one lowercase letter, one number, and one special character

### Other schemas

- `signInSchema`
  expects `identifier` and `password`
- `verifySchema`
  expects a 6-character code
- `messageSchema`
  expects message content between 1 and 500 characters
- `acceptMessageSchema`
  expects a boolean `acceptMessages`

## Email Flow

Two files work together here:

- `app/helpers/sendVerificationEmail.ts`
- `emails/VerificationEmail.tsx`

### How it works

1. `sendVerificationEmail()` receives `email`, `username`, and `verifyCode`
2. it uses the Resend client
3. it renders the `VerificationEmail` React component
4. the email shows the OTP code to the user

This is a nice pattern because the email UI is separated from the business logic.

## Database Connection Logic

File:

- `app/lib/dbConnect.ts`

This file uses a small `connection` object with `isConnected` so the app does not reconnect to MongoDB on every request.

Main idea:

- if already connected, return early
- otherwise connect using `mongoose.connect(process.env.MONGODB_URI || "")`

This is a common pattern in Next.js projects that use Mongoose.

## Environment Variables

To run this project properly, these environment variables are expected:

```env
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
```

## Important Notes About The Current Code

These are useful to know while reading the project:

- `app/page.tsx` is still the starter page, so the UI does not yet reflect the app idea.
- `app/api/test-db/route.ts` is empty, so there is no test database endpoint yet.
- `sendVerificationEmail.ts` currently looks incomplete and is missing its final closing brace.
- `sendVerificationEmail.ts` imports `@/lib/resend`, but the current file is located at `app/lib/resend.ts`. That import path likely needs review.
- `bcryptjs` is used in the sign-up route, but `package.json` currently lists only `@types/bcryptjs`, not the main `bcryptjs` package.
- the sign-up route does not yet use `signUpSchema`, so request validation is not enforced there.
- the route always returns `Response.json(...)` without custom HTTP status codes for failures.

## How To Read This Codebase

If you want to understand the project quickly, this is a good order:

1. read `app/model/User.ts`
2. read `app/lib/dbConnect.ts`
3. read `app/api/sign-up/route.ts`
4. read `app/helpers/sendVerificationEmail.ts`
5. read `emails/VerificationEmail.tsx`
6. read the files inside `app/schemas`

That order helps because it moves from data model -> database -> API logic -> helper logic -> email UI -> validation rules.

## Short Summary

This project is an early-stage anonymous messaging app backend built with Next.js, MongoDB, Resend, and Zod. The core sign-up flow is mostly there, and the README now maps how the pieces connect so the code is easier to study and extend.

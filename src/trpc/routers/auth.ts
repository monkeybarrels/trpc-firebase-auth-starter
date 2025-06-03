import { z } from "zod";
import { router, procedure, publicProcedure } from "../index";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { isAuthed } from "../middlewares";
import { cookies } from 'next/headers';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ 
      email: z.string().email(), 
      password: z.string().min(6) 
    }))
    .mutation(async ({ input }) => {
      const { email, password } = input;
      
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed")
      }

      const user = await adminAuth.getUserByEmail(email);
      const token = data.idToken;

      const cookieStore = await cookies();

      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      cookieStore.set('x-user-id', user.uid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      return { 
        success: true,
        user: {
          id: user.uid,
          email: user.email,
        }
      };
    }),

  me: procedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      return {
        id: ctx.user!.id,
        email: ctx.user!.email,
      };
    }),

  logout: publicProcedure
    .mutation(async () => {
      const cookieStore = await cookies();
      cookieStore.delete("token")
      cookieStore.delete("x-user-id")
      return { success: true }
    }),

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      displayName: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: input.email,
            password: input.password,
            displayName: input.displayName,
            returnSecureToken: true,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Registration failed")
      }

      return { 
        success: true,
        user: {
          id: data.localId,
          email: data.email,
        }
      };
    })
});
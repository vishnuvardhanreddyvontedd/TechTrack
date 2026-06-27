// lib/definitions.ts
// Central location for Zod validation schemas and shared TypeScript types
// used by Server Actions and API route handlers.

import { z } from 'zod'

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must be at most 50 characters.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
})

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: 'Password is required.' }),
})

// ─── Roadmap Schemas ──────────────────────────────────────────────────────────

export const CreateRoadmapSchema = z.object({
  templateSlug: z.string().min(1, { message: 'Please select a career path.' }),
})

// ─── Shared Form State Type ───────────────────────────────────────────────────
// Used as the state type for `useActionState` in Client Components.

export type ActionState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined

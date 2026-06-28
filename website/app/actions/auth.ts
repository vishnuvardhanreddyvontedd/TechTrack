// app/actions/auth.ts
// Server Actions for authentication.
// These run exclusively on the server — never shipped to the client bundle.
// They use `useActionState` on the client to deliver typed form feedback.

'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

import { prisma } from '@/app/lib/prisma'
import { createSession, deleteSession } from '@/app/lib/session'
import { SignupSchema, LoginSchema, type ActionState } from '@/app/lib/definitions'

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Validate input
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = SignupSchema.safeParse(raw)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { name, email, password } = validated.data

  // 2. Check for existing email
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return {
      errors: { email: ['An account with this email already exists.'] },
    }
  }

  // 3. Hash password — cost factor 12 is the production-safe baseline
  const passwordHash = await bcrypt.hash(password, 12)

  // 4. Create user
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  })

  // 5. Create JWT session cookie
  await createSession({ userId: user.id, name: user.name, email: user.email })

  // 6. Redirect to onboarding (new users must pick a career path)
  redirect('/onboarding')
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Validate input
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = LoginSchema.safeParse(raw)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password } = validated.data

  // 2. Look up user
  const user = await prisma.user.findUnique({ where: { email } })

  // Deliberately vague error — don't reveal which field is wrong
  const invalidCredentials: ActionState = {
    errors: { email: ['Invalid email or password.'] },
  }

  if (!user) return invalidCredentials

  // 3. Verify password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) return invalidCredentials

  // 4. Create session
  await createSession({ userId: user.id, name: user.name, email: user.email })

  // 5. Redirect — check if user has any roadmaps, otherwise send to onboarding
  const roadmapCount = await prisma.roadmap.count({ where: { userId: user.id } })
  redirect(roadmapCount > 0 ? '/dashboard' : '/onboarding')
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}

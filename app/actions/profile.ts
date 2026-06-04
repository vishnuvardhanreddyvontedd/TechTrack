// app/actions/profile.ts
// Server Actions for profile management (uploading avatars, etc.)

'use server'

import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/app/lib/prisma'
import { getSession } from '@/app/lib/session'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use private service role key on server if available to bypass storage RLS policies securely.
// Fallback to the public anon key if the service role key is not defined.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadAvatar(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate that file is an image
  if (!file.type.startsWith('image/')) {
    return { error: 'Only images are allowed' }
  }

  // Limit file size to 2MB
  if (file.size > 2 * 1024 * 1024) {
    return { error: 'File size must be under 2MB' }
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Convert file object to ArrayBuffer for uploading in Node.js environment
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase 'profiles' storage bucket
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return { error: `Upload failed: ${uploadError.message}` }
    }

    // Retrieve public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // Save the public URL to the User model in Prisma
    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl: publicUrl },
    })

    // Revalidate profile path to update UI cache
    revalidatePath('/profile')
    return { success: true, avatarUrl: publicUrl }
  } catch (err: any) {
    console.error('Upload avatar exception:', err)
    return { error: err.message || 'An unexpected error occurred' }
  }
}

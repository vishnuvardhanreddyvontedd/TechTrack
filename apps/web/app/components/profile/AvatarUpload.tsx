// components/profile/AvatarUpload.tsx
// Client Component — renders the profile picture with an edit overlay and manages the file upload flow

'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadAvatar } from '@/app/actions/profile'

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  userName: string
}

export default function AvatarUpload({ currentAvatarUrl, userName }: AvatarUploadProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function triggerFileSelect() {
    if (isUploading) return
    setError(null)
    fileInputRef.current?.click()
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadAvatar(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Force refresh the router to update session state and database values in Server Components
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred during upload.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const initial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        onClick={triggerFileSelect}
        className="group relative w-20 h-20 rounded-2xl cursor-pointer overflow-hidden shadow-lg select-none transition-all duration-200 hover:scale-105 active:scale-95 border border-[--border-default]"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Current Avatar or Name Initial */}
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={`${userName}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full gradient-brand flex items-center justify-center text-white text-3xl font-bold">
            {initial}
          </div>
        )}

        {/* Hover / Uploading Overlays */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            {/* Spinner */}
            <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-400 font-medium text-center max-w-[200px] mt-1">
          {error}
        </span>
      )}
    </div>
  )
}

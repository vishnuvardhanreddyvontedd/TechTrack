// components/ui/Input.tsx
// Accessible form input with label, error, and helper text support.

'use client'

import { forwardRef, type InputHTMLAttributes, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', id: idProp, ...props }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[--text-secondary]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] pointer-events-none flex-shrink-0">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`
              input-base
              ${leftIcon ? 'pl-14' : ''}
              ${error ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1z" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-[--text-muted]">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// components/ui/Button.tsx
// Polymorphic button component with multiple variants and a loading state.

'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:   'gradient-brand text-white shadow-lg hover:opacity-90 disabled:opacity-50',
  secondary: 'bg-[--bg-muted] border border-[--border-default] text-[--text-primary] hover:border-[--border-strong] disabled:opacity-50',
  ghost:     'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-muted] disabled:opacity-50',
  danger:    'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-50',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-8  px-3  text-xs  gap-1.5 rounded-md',
  md: 'h-10 px-4  text-sm  gap-2   rounded-lg',
  lg: 'h-11 px-5  text-sm  gap-2   rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.12 }}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-150 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[--brand-500] focus-visible:ring-offset-2
          focus-visible:ring-offset-[--bg-base]
          disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading ? (
          <>
            <Spinner size={size === 'sm' ? 12 : 14} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

// ─── Inline Spinner ───────────────────────────────────────────────────────────
function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="60" strokeDashoffset="20"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor" strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

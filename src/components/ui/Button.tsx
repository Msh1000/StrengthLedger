import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
}

export function Button({ children, className = '', variant = 'primary', ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button className={`btn btn-${variant} ${className}`} type="button" {...props}>
      {children}
    </button>
  )
}

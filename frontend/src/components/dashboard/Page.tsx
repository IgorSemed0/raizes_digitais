import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export function DashboardBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-linear-to-b from-emerald-600/10 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.13) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.13) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>
      {children}
    </div>
  )
}

export function DashboardContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('max-w-7xl mx-auto p-6', className)}>{children}</div>
}

export function DashboardHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-8 flex items-center justify-between', className)}>
      <div>
        <h1 className="text-(--text-primary) mb-1">{title}</h1>
        {subtitle && <p className="text-(--text-secondary)">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function DashboardSection({
  children,
  title,
  description,
  className,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Card className={cn('p-6', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-(--text-primary)">{title}</h3>}
          {description && <p className="text-(--text-secondary) text-sm">{description}</p>}
        </div>
      )}
      {children}
    </Card>
  )
}



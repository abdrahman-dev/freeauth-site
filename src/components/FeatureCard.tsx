import type { ReactElement, ReactNode } from 'react'

export interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps): ReactElement {
  return (
    <article className="rounded-[16px] border border-[rgba(221,217,240,0.05)] bg-bg-card p-7 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(221,217,240,0.12)] hover:bg-bg-modal hover:shadow-[0_8px_40px_rgba(13,11,26,0.6)]">
      <div
        aria-hidden="true"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(221,217,240,0.08)] bg-[rgba(221,217,240,0.04)] text-text-dim"
      >
        {icon}
      </div>
      <h3 className="mt-5 text-sm font-normal text-silver-primary">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
        {description}
      </p>
    </article>
  )
}

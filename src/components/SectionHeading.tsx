import type { ReactElement } from 'react'

interface SectionHeadingProps {
  title: string
  headingId: string
}

export default function SectionHeading({
  title,
  headingId,
}: SectionHeadingProps): ReactElement {
  return (
    <div>
      <h2
        id={headingId}
        className="text-[22px] font-light tracking-[-0.01em] text-silver-primary"
      >
        {title}
      </h2>
      <div aria-hidden="true" className="mt-5 h-px w-full bg-border" />
    </div>
  )
}
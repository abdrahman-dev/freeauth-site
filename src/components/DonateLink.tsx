import type { ReactElement } from "react"
import { HeartIcon } from "./icons.tsx"

export const KOFI_USERNAME = "openauth" as const
export const KOFI_URL = `https://ko-fi.com/${KOFI_USERNAME}` as const

type DonateLinkVariant = "subtle" | "prominent"

interface DonateLinkProps {
  variant?: DonateLinkVariant
  className?: string
}

export default function DonateLink({
  variant = "subtle",
  className = "",
}: DonateLinkProps): ReactElement {
  if (variant === "prominent") {
    return (
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support OpenAuth on Ko-fi"
        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-silver-primary px-[22px] py-[9px] text-[13px] tracking-[0.06em] text-bg-base transition-colors duration-200 hover:bg-silver-bright ${className}`}
      >
        <HeartIcon />
        Support on Ko-fi
      </a>
    )
  }

  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Support OpenAuth on Ko-fi"
      className={`inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-light text-text-subtle transition-colors duration-200 hover:text-silver-primary ${className}`}
    >
      <HeartIcon />
      Donate
    </a>
  )
}

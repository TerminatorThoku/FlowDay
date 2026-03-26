import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[#c8a44e]/20 bg-[#c8a44e]/10 text-[#c8a44e]",
        secondary:
          "border-[#2a2a2a] bg-[#222222] text-[#a8a29e]",
        destructive:
          "border-[#b85c5c]/20 bg-[#b85c5c]/10 text-[#b85c5c]",
        outline: "text-[#a8a29e] border-[#2a2a2a]",
        success:
          "border-[#5b9a6f]/20 bg-[#5b9a6f]/10 text-[#5b9a6f]",
        warning:
          "border-[#c8944e]/20 bg-[#c8944e]/10 text-[#c8944e]",
        focus:
          "border-[#8b7ab8]/20 bg-[#8b7ab8]/10 text-[#8b7ab8]",
        info:
          "border-[#6b8aad]/20 bg-[#6b8aad]/10 text-[#6b8aad]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

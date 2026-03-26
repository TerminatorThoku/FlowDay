import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-orange-500/10 text-orange-400 border-orange-500/20",
        secondary:
          "border-transparent bg-white/[0.06] text-white/70 border-white/[0.08]",
        destructive:
          "border-transparent bg-red-500/10 text-red-400 border-red-500/20",
        outline: "text-white/70 border-white/[0.12]",
        success:
          "border-transparent bg-green-500/10 text-green-400 border-green-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-400 border-amber-500/20",
        focus:
          "border-transparent bg-purple-500/10 text-purple-400 border-purple-500/20",
        info:
          "border-transparent bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
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

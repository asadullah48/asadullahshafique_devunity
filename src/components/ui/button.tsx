import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variants carry MEANING, not just looks. Pick by role:
 *
 *   neon      → the single most important action on a screen (hero CTA).
 *               Cyan fill + bloom. At most one per viewport.
 *   default   → standard primary action. Cyan fill, no bloom.
 *   soft      → tinted cyan on a translucent surface. Emphasis without
 *               competing with a `neon`/`default` nearby.
 *   outline   → secondary action. Hairline border, cyan on hover.
 *   secondary → neutral action on a raised surface.
 *   ghost     → tertiary / toolbar / icon actions.
 *   link      → inline navigation inside prose.
 *
 * Call sites should NOT pass color classes. If a button needs a different
 * color, it needs a different variant — that is the whole point of moving
 * off the per-call-site hardcoded color overrides.
 *
 * Focus is deliberately NOT styled here: globals.css defines one
 * `:focus-visible` outline for every interactive element so the whole site
 * has a single, consistent keyboard affordance.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium",
    // Spring easing + press feedback make clicks feel physical.
    "transition-all duration-200 ease-spring",
    "active:scale-[0.97] active:duration-75",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "[&_svg]:transition-transform [&_svg]:duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        neon:
          "bg-brand text-primary-foreground font-semibold shadow-neon hover:shadow-neon-lg hover:bg-brand/90",
        default:
          "bg-primary text-primary-foreground shadow-elevated hover:bg-primary/90",
        soft:
          "bg-brand/10 text-brand border border-brand/25 hover:bg-brand/15 hover:border-brand/50",
        outline:
          "border border-border bg-transparent text-foreground hover:border-brand/50 hover:text-brand hover:bg-brand/5",
        secondary:
          "bg-surface-2 text-secondary-foreground border border-border hover:bg-surface-3",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        link:
          "text-brand underline-offset-4 hover:underline active:scale-100",
        destructive:
          "bg-destructive text-destructive-foreground shadow-elevated hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 rounded-sm px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-11 rounded-md px-6 text-[0.9375rem]",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

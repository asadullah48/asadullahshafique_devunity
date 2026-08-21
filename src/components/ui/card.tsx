import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Cards should exist only when elevation communicates hierarchy.
 * Reach for the lightest variant that still reads as a group:
 *
 *   flat      → grouping by background alone. No border, no shadow.
 *   outline   → hairline border only. The default for content grids.
 *   elevated  → border + tinted shadow. Use when the card floats above
 *               sibling content (popovers, pinned panels).
 *   glass     → translucent + blurred. Only over an animated backdrop,
 *               otherwise the blur has nothing to refract.
 *
 * `interactive` adds hover lift + spotlight-border support. Pair it with
 * the `--spot-x`/`--spot-y` mouse handler to get the cursor-tracking glow.
 */
const cardVariants = cva(
  "text-card-foreground transition-all duration-300 ease-spring",
  {
    variants: {
      variant: {
        flat: "rounded-panel bg-surface-1",
        outline: "rounded-panel border border-border bg-surface-1",
        elevated: "rounded-panel border border-border bg-card shadow-elevated",
        glass: "rounded-panel glass-panel",
      },
      interactive: {
        true: "relative overflow-hidden spotlight-border hover:-translate-y-1 hover:border-brand/30 hover:shadow-panel",
        false: "",
      },
    },
    defaultVariants: {
      variant: "elevated",
      interactive: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-display font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    // ~65ch keeps body copy in the comfortable reading range.
    className={cn("text-sm leading-relaxed text-muted-foreground max-w-[65ch]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // mt-auto lets CTAs pin to the bottom so they line up across a card row
  // even when the content above differs in length.
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}

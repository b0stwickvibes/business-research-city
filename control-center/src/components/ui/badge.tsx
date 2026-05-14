import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors [&>svg]:size-3",
  {
    variants: {
      status: {
        diligence: "border-sky-200/80 bg-sky-50 text-sky-950",
        "rejected-policy": "border-rose-200/80 bg-rose-50 text-rose-950",
        appendix: "border-amber-200/80 bg-amber-50 text-amber-950",
        reference: "border-border bg-muted/80 text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "reference",
    },
  },
);

export type DealStatusBadge = NonNullable<
  VariantProps<typeof badgeVariants>["status"]
>;

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, status, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ status }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

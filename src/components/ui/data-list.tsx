import * as React from "react";
import { cn } from "@/lib/utils";

function DataList({
  className,
  children,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl className={cn("space-y-0.5", className)} {...props}>
      {children}
    </dl>
  );
}

function DataListItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function DataListItemLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"dt">) {
  return (
    <dt
      className={cn(
        "text-start text-muted-foreground tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </dt>
  );
}

function DataListItemValue({
  className,
  children,
  ...props
}: React.ComponentProps<"dd">) {
  return (
    <dd
      className={cn("text-start text-sm", className)}
      {...props}
    >
      {children}
    </dd>
  );
}

export { DataList, DataListItem, DataListItemLabel, DataListItemValue };

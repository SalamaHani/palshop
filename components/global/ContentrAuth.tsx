import { cn } from "@/lib/utils";
import React from "react";

export default function ContentrAuth({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl xl:max-w-7xl px-20", className)}>
      {children}
    </div>
  );
}

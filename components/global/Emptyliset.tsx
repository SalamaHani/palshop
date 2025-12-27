import React from "react";
import { cn } from "@/lib/utils";
function Emptyliset({
  className,
  hdiene = "No items found",
}: {
  className?: string;
  hdiene?: string;
}) {
  return <h2 className={cn("text-xl", className)}>{hdiene}</h2>;
}

export default Emptyliset;

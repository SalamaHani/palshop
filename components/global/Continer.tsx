import { cn } from "@/lib/utils";
import React from "react";

export default function Continer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (
    <div className={cn("mx-auto max-w-6xl  relative lg:p-space-8 col-start-2 row-start-1  lg:pl-0 xl:max-w-[94rem]", className)}>
      <div className="pointer-events-none fixed rounded-2xl left-4 right-4 top-18 z-99  mb-[calc(-100dvh+16px)] shadow-[0_20px_50px_rgb(0,0,0,0.2)]  border border-[#EBEBEB] shadow-[20px_20px_20px_20px_rgba(0,0,0,0.06),0px_-1px_30px_0px_#F2F4F5,0_0_0_40px_#FCFCFC]  grid h-[88vh]   max-lg:hidden"></div>
      {children}
    </div>

  );
}

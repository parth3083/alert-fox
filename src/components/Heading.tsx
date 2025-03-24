"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Badge } from "./ui/badge";

interface IHeading {
  className?: string;
  children: ReactNode;
  badgeText?: string;
}

function Heading({ className, badgeText, children, ...props }: IHeading) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <Badge className="shadow-xl bg-white rounded-full text-black">{badgeText}</Badge>
      <h1
        className={cn(
          "text-2xl md:text-5xl w-full text-orange-500 font-semibold mt-2 tracking-tight  ",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    </div>
  );
}

export default Heading;

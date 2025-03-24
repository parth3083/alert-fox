import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const spinnerVariants = cva(
  "border-4 rounded-full border-orange-200 border-t-orange-500 animate-spin duration-700",
  {
    variants: {
      size: {
        sm: "size-4 border-2 ",
        md: "size-6 border-4",
        lg: "size-8 border-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

function LoadingSpinner({ size, className }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerVariants({ size, className })}> </div>
    </div>
  );
}

export default LoadingSpinner;

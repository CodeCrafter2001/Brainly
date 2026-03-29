import React, { type ElementType } from "react";

interface ButtonProp {
  title: string;
  size: "sm" | "md" | "lg";
  startIcon?: ElementType;
  endIcon?: ElementType;
  variant: "primary" | "secondary";
}

const SizeStyles = {
  lg: "px-8 py-4 text-xl rounded-xl",
  md: "px-4 py-2 text-md rounded-md",
  sm: "px-2 py-1 text-sm rounded-sm",
};

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-400 text-purple-600",
};

function Button(props: ButtonProp) {
  const StartIcon = props.startIcon;
  const EndIcon = props.endIcon;

  return (
    <button className={SizeStyles[props.size] + " " + variantStyles[props.variant]}>
      <div className="flex items-center">
        {Start Icon && (
          <span className="text-xs">
            <StartIcon />
          </span>
        )}

        <div className="pl-2 pr-2">{props.title}</div>

        {EndIcon && (
          <span className="text-xs">
            <EndIcon />
          </span>
        )}
      </div>
    </button>
  );
}

export default Button;
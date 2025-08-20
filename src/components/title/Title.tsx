import React, { ReactNode, ElementType } from "react";
import clsx from "clsx"; 

// Définition des styles
const types = {
  h1: "text-4xl font-bold leading-tight md:text-5xl",
  h2: "text-3xl font-bold leading-tight md:text-4xl",
  h3: "text-2xl font-semibold leading-snug md:text-3xl",
  h4: "text-xl font-semibold leading-snug md:text-2xl",
  h5: "text-lg font-medium leading-normal md:text-xl",
  h6: "text-base font-medium leading-normal md:text-lg",
} as const;

const variants = {
  primary: "text-gray-900",
  secondary: "text-gray-700",
  light: "text-gray-500",
  white: "text-white",
  accent: "text-[#7367f0]",
} as const;

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

// Définition des props avec TypeScript
interface TitleProps {
  type?: keyof typeof types;
  variant?: keyof typeof variants;
  align?: keyof typeof alignments;
  truncate?: boolean;
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

// Composant Title
const Title: React.FC<TitleProps> = ({
  type = "h1",
  variant = "primary",
  align = "left",
  truncate = false,
  className = "",
  children,
  as: Component = "h1", // Par défaut, on utilise "h1"
}) => {
  return (
    <Component
      className={clsx(
        types[type],
        variants[variant],
        alignments[align],
        truncate && "truncate",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Title;
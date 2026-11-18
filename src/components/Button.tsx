import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variante = "primary" | "secondary" | "ghost" | "danger";
type Tamanho = "md" | "sm";

interface ButtonProps {
  children: ReactNode;
  variante?: Variante;
  tamanho?: Tamanho;
  block?: boolean;
  className?: string;
  to?: string; 
  href?: string; 
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string; 
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-200 no-underline disabled:opacity-60 disabled:pointer-events-none";

// classes de cada variante
const VARIANTES = {
  primary: "bg-brand text-white shadow-soft-sm hover:bg-brand-dark",
  secondary: "border border-borderc bg-white text-ink hover:border-brand hover:text-brand",
  ghost: "text-brand hover:bg-brand-soft",
  danger: "border border-danger/30 bg-white text-danger hover:bg-danger-soft",
};

const TAMANHOS = {
  md: "px-5 py-2.5 text-[0.95rem]",
  sm: "px-3.5 py-2 text-sm",
};

export default function Button(props: ButtonProps) {
  const variante = props.variante || "primary";
  const tamanho = props.tamanho || "md";
  const classes = `${BASE} ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${props.block ? "w-full" : ""} ${props.className || ""}`;

  if (props.href) {
    return (
      <a href={props.href} target="_blank" rel="noreferrer" className={classes} aria-label={props["aria-label"]}>
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link to={props.to} className={classes} aria-label={props["aria-label"]}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      className={classes}
    >
      {props.children}
    </button>
  );
}

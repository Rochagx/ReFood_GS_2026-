import type { ReactNode } from "react";

type Tom = "brand" | "laranja" | "neutro" | "perigo" | "aviso";

// classes do Tailwind de cada cor
const TONS = {
  brand: "bg-brand-soft text-brand-dark",
  laranja: "bg-laranja-soft text-laranja",
  neutro: "bg-bg text-muted border border-borderc",
  perigo: "bg-danger-soft text-danger",
  aviso: "bg-aviso-soft text-aviso",
};

interface BadgeProps {
  tom?: Tom;
  children: ReactNode;
  className?: string;
}

export default function Badge({ tom = "brand", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONS[tom]} ${className}`}
    >
      {children}
    </span>
  );
}

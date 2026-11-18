import type { ReactNode } from "react";
import { ROTULO } from "../lib/estilos";

interface CampoProps {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  erro?: string;
  ajuda?: string;
  children: ReactNode;
  className?: string;
}

export default function Campo({ id, rotulo, obrigatorio, erro, ajuda, children, className = "" }: CampoProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={ROTULO}>
        {rotulo} {obrigatorio && <span className="text-danger" aria-hidden="true">*</span>}
      </label>
      {children}
      {erro ? (
        <p id={id + "-erro"} className="mt-1 text-[0.8rem] font-medium text-danger">
          {erro}
        </p>
      ) : (
        ajuda && <p className="mt-1 text-[0.8rem] text-muted">{ajuda}</p>
      )}
    </div>
  );
}

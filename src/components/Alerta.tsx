import type { ReactNode } from "react";
import Icon from "./Icon";

type TipoAlerta = "sucesso" | "erro" | "info" | "aviso";

// tipos de alerta
const CLASSES = {
  sucesso: "border-brand/30 bg-brand-soft text-brand-dark",
  erro: "border-danger/30 bg-danger-soft text-danger",
  info: "border-borderc bg-info-soft text-ink",
  aviso: "border-aviso/30 bg-aviso-soft text-aviso",
};

interface AlertaProps {
  tipo: TipoAlerta;
  children: ReactNode;
  className?: string;
}

export default function Alerta({ tipo, children, className = "" }: AlertaProps) {
  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-sm border px-4 py-3 text-sm ${CLASSES[tipo]} ${className}`}
    >
      {tipo === "sucesso" && <Icon name="check" size={18} className="mt-0.5 shrink-0" />}
      {tipo === "info" && <Icon name="info" size={18} className="mt-0.5 shrink-0" />}
      {(tipo === "erro" || tipo === "aviso") && <Icon name="alert" size={18} className="mt-0.5 shrink-0" />}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

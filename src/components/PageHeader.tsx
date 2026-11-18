import type { ReactNode } from "react";
import Container from "./Container";

interface PageHeaderProps {
  etiqueta?: string;
  titulo: string;
  descricao?: string;
  children?: ReactNode; 
}

export default function PageHeader({ etiqueta, titulo, descricao, children }: PageHeaderProps) {
  return (
    <section className="border-b border-borderc bg-white">
      <Container className="flex flex-col gap-5 py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <div className="max-w-2xl">
          {etiqueta && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">{etiqueta}</p>
          )}
          <h1>{titulo}</h1>
          {descricao && <p className="mt-3 text-base md:text-lg">{descricao}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

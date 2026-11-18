import { Link } from "react-router-dom";
import type { Estabelecimento } from "../types/api";
import Icon from "./Icon";

interface EstabelecimentoCardProps {
  estabelecimento: Estabelecimento;
  totalOfertas?: number;
}

// Card de parceiro 
export default function EstabelecimentoCard({ estabelecimento, totalOfertas }: EstabelecimentoCardProps) {
  const inicial = estabelecimento.nome.trim().charAt(0).toUpperCase() || "R";

  return (
    <article className="flex h-full flex-col gap-4 rounded-md border border-borderc bg-white p-5 shadow-soft-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-md">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-brand-soft font-display text-xl font-extrabold text-brand">
          {inicial}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base">{estabelecimento.nome}</h3>
          {totalOfertas !== undefined && (
            <p className="text-sm">
              {totalOfertas} {totalOfertas === 1 ? "oferta ativa" : "ofertas ativas"}
            </p>
          )}
        </div>
      </div>

      <p className="flex items-start gap-2 text-sm">
        <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-brand" />
        <span className="min-w-0 break-words">{estabelecimento.endereco || "Endereço não informado"}</span>
      </p>

      <Link
        to={"/parceiros/" + estabelecimento.id}
        className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Ver parceiro <Icon name="arrowRight" size={15} />
        <span className="sr-only">{estabelecimento.nome}</span>
      </Link>
    </article>
  );
}

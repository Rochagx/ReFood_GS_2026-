import { Link } from "react-router-dom";
import type { Estabelecimento } from "../types/api";
import Icon from "./Icon";
import { apenasNumeros } from "../lib/validar";

interface EnderecoContatoProps {
  estabelecimento: Estabelecimento;
}

export default function EnderecoContato({ estabelecimento }: EnderecoContatoProps) {
  const { endereco, cep, telefone } = estabelecimento;

  return (
    <div className="rounded-2xl border border-borderc bg-white p-5 shadow-soft-sm">
      <h3 className="text-base">Endereço e contato</h3>
      <ul className="mt-3 space-y-2.5 text-sm text-ink">
        {endereco && (
          <li className="flex items-start gap-2.5">
            <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-brand" />
            <span>{endereco}</span>
          </li>
        )}
        {cep && (
          <li className="flex items-start gap-2.5">
            <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-brand" />
            <span>CEP {cep}</span>
          </li>
        )}
        {telefone && (
          <li className="flex items-start gap-2.5">
            <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-brand" />
            <a href={"tel:" + apenasNumeros(telefone)} className="hover:text-brand">
              {telefone}
            </a>
          </li>
        )}
      </ul>
      <Link
        to={"/parceiros/" + estabelecimento.id}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Ver todas as ofertas do parceiro <Icon name="arrowRight" size={15} />
      </Link>
    </div>
  );
}

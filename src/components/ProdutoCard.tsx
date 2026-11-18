import { Link } from "react-router-dom";
import type { Produto } from "../types/api";
import Icon from "./Icon";
import ProdutoImagem from "./ProdutoImagem";
import { diasParaVencer, formatarMoeda, percentualDesconto, textoValidade } from "../lib/formatar";

interface ProdutoCardProps {
  produto: Produto;
  nomeEstabelecimento?: string;
}

// vermelho se vence hoje/vencido amarelo até 2 dias verde no resto
function corValidade(dias: number): string {
  if (dias <= 0) return "bg-danger text-white";
  if (dias <= 2) return "bg-aviso-soft text-aviso";
  return "bg-white/90 text-brand-dark";
}

export default function ProdutoCard({ produto, nomeEstabelecimento }: ProdutoCardProps) {
  const desconto = percentualDesconto(produto.precoOriginal, produto.precoPromocional);
  const economia = produto.precoOriginal - produto.precoPromocional;
  const dias = diasParaVencer(produto.dataValidade);
  const esgotado = produto.quantidadeEstoque <= 0;
  const ultimas = !esgotado && produto.quantidadeEstoque <= 5;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-borderc bg-white shadow-soft-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg">
      {/* foto com selos por cima */}
      <div className="relative aspect-4/3 overflow-hidden bg-bg">
        <ProdutoImagem
          imagem={produto.imagem}
          nome={produto.nome}
          categoria={produto.categoria}
          className={`transition-transform duration-500 group-hover:scale-105 ${esgotado ? "grayscale" : ""}`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

        {desconto > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-laranja px-3 py-1 font-display text-sm font-extrabold text-white shadow-soft-md">
            -{desconto}%
          </span>
        )}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-soft-sm ${corValidade(dias)}`}
        >
          <Icon name="clock" size={13} /> {textoValidade(produto.dataValidade)}
        </span>

        {nomeEstabelecimento && (
          <p className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 truncate text-sm font-semibold text-white">
            <Icon name="store" size={15} className="shrink-0" />
            <span className="truncate">{nomeEstabelecimento}</span>
          </p>
        )}

        {esgotado && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/50 font-display text-lg font-extrabold uppercase tracking-wider text-ink">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{produto.categoria}</p>
          <h3 className="mt-1 line-clamp-2 text-base leading-snug">
            <Link
              to={"/ofertas/" + produto.id}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {produto.nome}
            </Link>
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {desconto > 0 && <s className="block text-sm text-muted">{formatarMoeda(produto.precoOriginal)}</s>}
            <strong className="font-display text-2xl font-extrabold text-ink">{formatarMoeda(produto.precoPromocional)}</strong>
          </div>
          {economia > 0 && (
            <span className="rounded-sm bg-brand-soft px-2 py-1 text-right text-xs font-semibold text-brand-dark">
              Economize
              <br />
              {formatarMoeda(economia)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-borderc pt-3 text-xs">
          <span className={`inline-flex items-center gap-1 font-semibold ${esgotado ? "text-danger" : ultimas ? "text-laranja" : "text-muted"}`}>
            <Icon name={esgotado ? "x" : "box"} size={14} />
            {esgotado ? "Sem estoque" : ultimas ? "Últimas " + produto.quantidadeEstoque + " unidades" : produto.quantidadeEstoque + " disponíveis"}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand transition-transform group-hover:translate-x-0.5">
            Ver oferta <Icon name="arrowRight" size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

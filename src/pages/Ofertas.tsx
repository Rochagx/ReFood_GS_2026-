import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import ProdutoCard from "../components/ProdutoCard";
import Button from "../components/Button";
import Icon, { type NomeIcone } from "../components/Icon";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { listarEstabelecimentos, listarProdutos } from "../services/api";
import { diasParaVencer, formatarMoeda, percentualDesconto } from "../lib/formatar";
import { CAMPO, ROTULO } from "../lib/estilos";
import type { Produto } from "../types/api";

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        ativo ? "border-brand bg-brand text-white shadow-soft-sm" : "border-borderc bg-white text-ink hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function Resumo({ icone, valor, rotulo }: { icone: NomeIcone; valor: string; rotulo: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-borderc bg-white p-4 shadow-soft-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon name={icone} size={20} />
      </span>
      <div className="min-w-0">
        <strong className="block font-display text-xl text-ink">{valor}</strong>
        <span className="text-sm text-muted">{rotulo}</span>
      </div>
    </div>
  );
}

export default function Ofertas() {
  useDocumentMeta("Ofertas — ReFood");

  const [params, setParams] = useSearchParams();
  const busca = params.get("busca") || "";
  const categoria = params.get("categoria") || "";
  const parceiro = params.get("parceiro") || "";
  const ordem = params.get("ordem") || "desconto"; 
  const mostrarVencidos = params.get("vencidos") === "1";

  const produtos = useApi(listarProdutos);
  const estabelecimentos = useApi(listarEstabelecimentos);

  function alterarFiltro(nome: string, valor: string) {
    const novos = new URLSearchParams(params);
    if (valor) novos.set(nome, valor);
    else novos.delete(nome);
    setParams(novos, { replace: true });
  }

  function limparFiltros() {
    setParams({}, { replace: true });
  }

  const lista: Produto[] = produtos.dados || [];
  const ativos = lista.filter((p) => diasParaVencer(p.dataValidade) >= 0);

  const categorias: string[] = [];
  for (const p of lista) {
    if (!categorias.includes(p.categoria)) {
      categorias.push(p.categoria);
    }
  }
  categorias.sort();

  const parceiros = (estabelecimentos.dados || []).filter((e) => lista.some((p) => p.estabelecimentoId === e.id));

  const filtrados = lista
    .filter((p) => p.nome.toLowerCase().includes(busca.trim().toLowerCase()))
    .filter((p) => !categoria || p.categoria === categoria)
    .filter((p) => !parceiro || p.estabelecimentoId === Number(parceiro))
    .filter((p) => mostrarVencidos || diasParaVencer(p.dataValidade) >= 0)
    .sort((a, b) => {
      if (ordem === "validade") return diasParaVencer(a.dataValidade) - diasParaVencer(b.dataValidade);
      if (ordem === "preco") return a.precoPromocional - b.precoPromocional;
      return percentualDesconto(b.precoOriginal, b.precoPromocional) - percentualDesconto(a.precoOriginal, a.precoPromocional);
    });

  const venceLogo = ativos.filter((p) => diasParaVencer(p.dataValidade) <= 1).length;
  let economiaTotal = 0;
  const idsParceiros: number[] = []; 
  for (const p of ativos) {
    economiaTotal += p.precoOriginal - p.precoPromocional;
    if (!idsParceiros.includes(p.estabelecimentoId)) {
      idsParceiros.push(p.estabelecimentoId);
    }
  }
  const totalParceiros = idsParceiros.length;

  function nomeDoEstabelecimento(id: number) {
    if (!estabelecimentos.dados) return undefined;
    const encontrado = estabelecimentos.dados.find((e) => e.id === id);
    return encontrado ? encontrado.nome : undefined;
  }

  const temFiltro = busca || categoria || parceiro || mostrarVencidos || ordem !== "desconto";

  return (
    <>
      <PageHeader
        etiqueta="Ofertas"
        titulo="Alimentos com desconto"
        descricao="Produtos excedentes ou próximos do vencimento publicados por padarias, mercados e restaurantes parceiros. Reserve, pague e retire com QR Code."
      />

      <section className="py-10 md:py-12">
        <Container>
          {/* resumo */}
          {!produtos.carregando && !produtos.erro && ativos.length > 0 && (
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <Resumo icone="tag" valor={String(ativos.length)} rotulo="ofertas ativas agora" />
              <Resumo icone="store" valor={String(totalParceiros)} rotulo="parceiros com produtos" />
              <Resumo icone="leaf" valor={formatarMoeda(economiaTotal)} rotulo="de economia somando tudo" />
            </div>
          )}

          {/* filtros */}
          <form
            onSubmit={(e) => e.preventDefault()}
            role="search"
            className="mb-6 grid gap-4 rounded-lg border border-borderc bg-white p-4 shadow-soft-sm sm:grid-cols-2 md:p-5 lg:grid-cols-[2fr_1.3fr_1fr_auto] lg:items-end"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="busca" className={ROTULO}>
                Buscar
              </label>
              <div className="relative">
                <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="busca"
                  type="search"
                  value={busca}
                  onChange={(e) => alterarFiltro("busca", e.target.value)}
                  placeholder="Pão, banana, marmita..."
                  className={CAMPO + " pl-10"}
                />
              </div>
            </div>
            <div>
              <label htmlFor="parceiro" className={ROTULO}>
                Parceiro
              </label>
              <select id="parceiro" value={parceiro} onChange={(e) => alterarFiltro("parceiro", e.target.value)} className={CAMPO}>
                <option value="">Todos</option>
                {parceiros.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ordem" className={ROTULO}>
                Ordenar por
              </label>
              <select id="ordem" value={ordem} onChange={(e) => alterarFiltro("ordem", e.target.value)} className={CAMPO}>
                <option value="desconto">Maior desconto</option>
                <option value="validade">Vence primeiro</option>
                <option value="preco">Menor preço</option>
              </select>
            </div>
            <label className="flex items-center gap-2 py-2.5 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={mostrarVencidos}
                onChange={(e) => alterarFiltro("vencidos", e.target.checked ? "1" : "")}
                className="h-4 w-4 accent-brand"
              />
              Mostrar vencidos
            </label>
          </form>

          {categorias.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
              <Chip ativo={!categoria} onClick={() => alterarFiltro("categoria", "")}>
                Todas
              </Chip>
              {categorias.map((c) => (
                <Chip key={c} ativo={categoria === c} onClick={() => alterarFiltro("categoria", categoria === c ? "" : c)}>
                  {c}
                </Chip>
              ))}
            </div>
          )}

          {venceLogo > 0 && ordem !== "validade" && (
            <button
              type="button"
              onClick={() => alterarFiltro("ordem", "validade")}
              className="mb-6 flex w-full items-center gap-3 rounded-md border border-laranja/30 bg-laranja-soft px-4 py-3 text-left text-sm text-ink transition-colors hover:border-laranja"
            >
              <Icon name="clock" size={18} className="shrink-0 text-laranja" />
              <span>
                <strong className="text-laranja">{venceLogo} {venceLogo === 1 ? "oferta vence" : "ofertas vencem"} até amanhã.</strong>{" "}
                Clique para ver primeiro o que precisa ser salvo hoje.
              </span>
            </button>
          )}

          {produtos.carregando && <Carregando texto="Buscando ofertas..." />}
          {produtos.erro && <ErroCarregar mensagem={produtos.erro} aoTentarDeNovo={produtos.recarregar} />}

          {!produtos.carregando && !produtos.erro && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm" aria-live="polite">
                  <strong className="text-ink">{filtrados.length}</strong>{" "}
                  {filtrados.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
                </p>
                {temFiltro && (
                  <button type="button" onClick={limparFiltros} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
                    <Icon name="x" size={14} /> Limpar filtros
                  </button>
                )}
              </div>

              {filtrados.length === 0 ? (
                <Vazio titulo="Nenhuma oferta encontrada" descricao="Tente outro termo de busca ou limpe os filtros.">
                  {temFiltro && (
                    <Button variante="secondary" tamanho="sm" onClick={limparFiltros}>
                      Limpar filtros
                    </Button>
                  )}
                </Vazio>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtrados.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} nomeEstabelecimento={nomeDoEstabelecimento(produto.estabelecimentoId)} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

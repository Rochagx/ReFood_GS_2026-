import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import Icon, { type NomeIcone } from "../components/Icon";
import HeroIlustracao from "../components/HeroIlustracao";
import ProdutoCard from "../components/ProdutoCard";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { listarEstabelecimentos, listarProdutos } from "../services/api";
import { diasParaVencer, percentualDesconto } from "../lib/formatar";
import { CAMPO } from "../lib/estilos";

interface Passo {
  icone: NomeIcone;
  titulo: string;
  texto: string;
}

const PASSOS: Passo[] = [
  { icone: "store", titulo: "O parceiro cadastra", texto: "Mercados, padarias, restaurantes e feiras publicam excedentes com validade e preço." },
  { icone: "search", titulo: "Você encontra", texto: "Busque ofertas por nome ou categoria e veja onde retirar." },
  { icone: "card", titulo: "Reserva e paga", texto: "Escolha a quantidade e pague com Pix ou cartão, direto pelo site." },
  { icone: "qr", titulo: "Retira com QR Code", texto: "Apresente o código na máquina ReFood ou no balcão do parceiro." },
];

export default function Home() {
  useDocumentMeta("ReFood — Alimentação consciente, desperdício reduzido");

  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // GET na API
  const produtos = useApi(listarProdutos);
  const estabelecimentos = useApi(listarEstabelecimentos);

  function aoBuscar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const termo = busca.trim();
    navigate(termo ? "/ofertas?busca=" + encodeURIComponent(termo) : "/ofertas");
  }

  const destaques = (produtos.dados || [])
    .filter((p) => diasParaVencer(p.dataValidade) >= 0 && p.quantidadeEstoque > 0)
    .sort(
      (a, b) =>
        percentualDesconto(b.precoOriginal, b.precoPromocional) - percentualDesconto(a.precoOriginal, a.precoPromocional),
    )
    .slice(0, 6);

  function nomeDoEstabelecimento(id: number) {
    if (!estabelecimentos.dados) return undefined;
    const encontrado = estabelecimentos.dados.find((e) => e.id === id);
    return encontrado ? encontrado.nome : undefined;
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-white">
        <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div className="animate-fadeUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-brand">Plataforma cidadã contra o desperdício</p>
            <h1>
              Comida boa, preço justo e <span className="text-brand">zero desperdício</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg">
              Encontre alimentos excedentes ou próximos do vencimento de mercados, padarias, restaurantes e feiras
              com desconto — e retire com QR Code em uma máquina ReFood perto de você.
            </p>

            <form onSubmit={aoBuscar} className="mt-8 max-w-xl" role="search">
              <label htmlFor="busca-home" className="mb-2 block text-sm font-semibold text-ink">
                Buscar alimentos
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="busca-home"
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Ex.: pão, frutas, bolo..."
                    className={CAMPO + " pl-10"}
                  />
                </div>
                <Button type="submit">Explorar ofertas</Button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button to="/entrar" variante="secondary" tamanho="sm">
                <Icon name="store" size={16} /> Sou estabelecimento
              </Button>
              <Button to="/sobre" variante="ghost" tamanho="sm">
                Como funciona <Icon name="arrowRight" size={16} />
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[460px] lg:max-w-none">
            <HeroIlustracao className="h-auto w-full" />
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2>Ofertas em destaque</h2>
              <p className="mt-1">Maiores descontos disponíveis agora, direto da API ReFood.</p>
            </div>
            <Button to="/ofertas" variante="ghost" tamanho="sm">
              Ver todas <Icon name="arrowRight" size={16} />
            </Button>
          </div>

          {produtos.carregando && <Carregando texto="Buscando ofertas..." />}
          {produtos.erro && <ErroCarregar mensagem={produtos.erro} aoTentarDeNovo={produtos.recarregar} />}
          {!produtos.carregando && !produtos.erro && destaques.length === 0 && (
            <Vazio titulo="Nenhuma oferta disponível no momento" descricao="Volte mais tarde ou cadastre seu estabelecimento.">
              <Button to="/entrar" tamanho="sm">
                Quero anunciar
              </Button>
            </Vazio>
          )}
          {destaques.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destaques.map((produto) => (
                <ProdutoCard key={produto.id} produto={produto} nomeEstabelecimento={nomeDoEstabelecimento(produto.estabelecimentoId)} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-borderc bg-white py-14 md:py-16">
        <Container>
          <div className="mb-10 max-w-2xl">
            <h2>Como funciona</h2>
            <p className="mt-2">Do excedente na prateleira até a sua mesa em quatro passos.</p>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((passo, i) => (
              <li key={passo.titulo} className="rounded-md border border-borderc bg-bg p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white">
                    <Icon name={passo.icone} />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-borderc">0{i + 1}</span>
                </div>
                <h3>{passo.titulo}</h3>
                <p className="mt-1.5 text-sm">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CHAMADA PARA PARCEIROS */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-brand-soft p-6 md:flex-row md:items-center md:p-10">
            <div className="max-w-2xl">
              <h2>Tem alimento sobrando no seu estabelecimento?</h2>
              <p className="mt-2">
                Cadastre seus excedentes, recupere parte do valor e ajude a reduzir o desperdício no seu bairro.
              </p>
            </div>
            <Button to="/entrar" className="shrink-0">
              Cadastrar estabelecimento
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

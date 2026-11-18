import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Alerta from "../components/Alerta";
import Campo from "../components/Campo";
import Icon from "../components/Icon";
import ProdutoImagem from "../components/ProdutoImagem";
import MapaRetirada from "../components/MapaRetirada";
import ComoRetirar from "../components/ComoRetirar";
import JanelaRetirada from "../components/JanelaRetirada";
import EnderecoContato from "../components/EnderecoContato";
import { Carregando, ErroCarregar } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { useSessao } from "../context/SessaoContext";
import { buscarEstabelecimento, buscarProduto, criarPedido } from "../services/api";
import { diasParaVencer, formatarData, formatarMoeda, percentualDesconto, textoValidade } from "../lib/formatar";
import { CAMPO, CAMPO_ERRO } from "../lib/estilos";

export default function ProdutoDetalhe() {
  // rota com parâmetro: /ofertas/:id
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useSessao();

  const produto = useApi(() => buscarProduto(Number(id)), [id]);
  // a loja só pode ser buscada depois que o produto chegar 
  const lojaId = produto.dados ? produto.dados.estabelecimentoId : null;
  const estabelecimento = useApi(async () => {
    if (lojaId === null) return null;
    return await buscarEstabelecimento(lojaId);
  }, [lojaId]);

  const [quantidade, setQuantidade] = useState("1");
  const [erroQtd, setErroQtd] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState("");

  useDocumentMeta((produto.dados ? produto.dados.nome : "Oferta") + " — ReFood");

  if (produto.carregando) {
    return <Carregando texto="Carregando oferta..." />;
  }

  if (produto.erro || !produto.dados) {
    return (
      <Container className="py-10">
        <ErroCarregar mensagem={produto.erro || "Oferta não encontrada."} aoTentarDeNovo={produto.recarregar} />
        <div className="text-center">
          <Button to="/ofertas" variante="ghost">
            <Icon name="arrowLeft" size={16} /> Voltar para ofertas
          </Button>
        </div>
      </Container>
    );
  }

  const p = produto.dados;
  const loja = estabelecimento.dados;
  const desconto = percentualDesconto(p.precoOriginal, p.precoPromocional);
  const dias = diasParaVencer(p.dataValidade);
  const vencido = dias < 0;
  const esgotado = p.quantidadeEstoque <= 0;
  const qtdNumero = Number(quantidade);

  async function aoReservar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroApi("");

    if (!Number.isInteger(qtdNumero) || qtdNumero < 1) {
      setErroQtd("Informe uma quantidade inteira a partir de 1.");
      return;
    }
    if (qtdNumero > p.quantidadeEstoque) {
      setErroQtd("Só temos " + p.quantidadeEstoque + " unidade(s) em estoque.");
      return;
    }
    if (!usuario) return;

    setEnviando(true);
    try {
      // POST /pedido
      const pedido = await criarPedido({
        usuarioId: usuario.id,
        estabelecimentoId: p.estabelecimentoId,
        itens: [{ produtoId: p.id, quantidade: qtdNumero }],
      });
      navigate("/pedidos/" + pedido.id + "?novo=1");
    } catch (erro) {
      setErroApi((erro as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="py-8 md:py-10">
      <Container>
        <Link to="/ofertas" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
          <Icon name="arrowLeft" size={16} /> Voltar para ofertas
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(1.6rem,2vw+1rem,2.4rem)]">{p.nome}</h1>
          <Badge tom="neutro">{p.categoria}</Badge>
        </div>
        {loja && (
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="store" size={15} /> {loja.nome}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" size={15} /> {loja.endereco}
            </span>
          </p>
        )}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_400px] lg:grid-rows-[auto_auto_1fr] lg:gap-8">
          <div className="order-2 aspect-video overflow-hidden rounded-lg border border-borderc bg-white md:aspect-21/8 lg:order-none lg:col-span-2 lg:row-start-1">
            <ProdutoImagem imagem={p.imagem} nome={p.nome} categoria={p.categoria} />
          </div>

          <div className="order-3 min-w-0 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Onde retirar</p>
            <h2 className="mt-1 text-2xl">Retire no balcão do mercado</h2>
            <div className="mt-5 space-y-5">
              {estabelecimento.carregando && <div className="h-[300px] animate-pulse rounded-2xl bg-gray-100 md:h-[420px]" />}
              {estabelecimento.erro && <Alerta tipo="erro">Não foi possível carregar o local de retirada: {estabelecimento.erro}</Alerta>}
              {loja && <MapaRetirada estabelecimento={loja} />}
              <ComoRetirar />
            </div>

            <h2 className="mt-10 text-xl">Sobre a oferta</h2>
            <p className="mt-2">
              Produto publicado por {loja ? loja.nome : "um parceiro ReFood"} para evitar desperdício. O preço promocional vale
              enquanto houver estoque e o produto estiver dentro da validade.
            </p>

            <h2 className="mt-8 text-xl">Informações do produto</h2>
            <ul className="mt-4 divide-y divide-borderc rounded-md border border-borderc bg-white">
              {[
                { titulo: "Preço", valor: formatarMoeda(p.precoPromocional) + (desconto > 0 ? " (antes " + formatarMoeda(p.precoOriginal) + ", -" + desconto + "%)" : ""), ok: true },
                { titulo: "Validade", valor: formatarData(p.dataValidade) + " · " + textoValidade(p.dataValidade), ok: !vencido },
                { titulo: "Estoque", valor: esgotado ? "Esgotado" : p.quantidadeEstoque + " unidade(s) disponíveis", ok: !esgotado },
                { titulo: "Retirada", valor: "QR Code na máquina ReFood ou no balcão do parceiro", ok: true },
              ].map((info) => (
                <li key={info.titulo} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      info.ok ? "bg-brand-soft text-brand" : "bg-danger-soft text-danger"
                    }`}
                  >
                    <Icon name={info.ok ? "check" : "x"} size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{info.titulo}</p>
                    <p className="text-sm">{info.valor}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="order-1 lg:order-none lg:col-start-2 lg:row-start-2">
            <form noValidate onSubmit={aoReservar} className="rounded-2xl border border-borderc bg-white p-5 shadow-soft-sm">
              <p className="text-sm">Preço por unidade</p>
              <p className="font-display text-3xl font-extrabold text-ink">{formatarMoeda(p.precoPromocional)}</p>

              {vencido || esgotado ? (
                <Alerta tipo="aviso" className="mt-4">
                  {vencido ? "Este produto venceu e não pode mais ser reservado." : "Produto esgotado no momento."}
                </Alerta>
              ) : !usuario ? (
                <div className="mt-4 space-y-3">
                  <Alerta tipo="info">Entre como consumidor para reservar esta oferta.</Alerta>
                  <Button to="/entrar" block>
                    Entrar ou criar conta
                  </Button>
                </div>
              ) : usuario.tipoUsuario !== "CONSUMIDOR" ? (
                <Alerta tipo="info" className="mt-4">
                  Você está com um perfil de comerciante. Troque para um perfil de consumidor para comprar.
                </Alerta>
              ) : (
                <>
                  <Campo id="quantidade" rotulo="Quantidade" obrigatorio erro={erroQtd} ajuda={"Máximo: " + p.quantidadeEstoque} className="mt-4">
                    <input
                      id="quantidade"
                      type="number"
                      min={1}
                      max={p.quantidadeEstoque}
                      value={quantidade}
                      onChange={(e) => {
                        setQuantidade(e.target.value);
                        setErroQtd("");
                      }}
                      aria-invalid={!!erroQtd}
                      className={`${CAMPO} ${erroQtd ? CAMPO_ERRO : ""}`}
                    />
                  </Campo>
                  {qtdNumero >= 1 && (
                    <p className="mt-3 flex justify-between text-sm">
                      <span>Total</span>
                      <strong className="text-ink">{formatarMoeda(qtdNumero * p.precoPromocional)}</strong>
                    </p>
                  )}
                  {erroApi && (
                    <Alerta tipo="erro" className="mt-4">
                      {erroApi}
                    </Alerta>
                  )}
                  <Button type="submit" block className="mt-4" disabled={enviando}>
                    <Icon name="bag" size={18} /> {enviando ? "Reservando..." : "Reservar agora"}
                  </Button>
                </>
              )}
            </form>
          </aside>

          <div className="order-4 space-y-5 lg:order-none lg:col-start-2 lg:row-start-3">
            <JanelaRetirada dataValidade={p.dataValidade} />
            {loja && <EnderecoContato estabelecimento={loja} />}
          </div>
        </div>
      </Container>
    </section>
  );
}

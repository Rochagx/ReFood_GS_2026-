import { Link } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import ExigePerfil from "../components/ExigePerfil";
import StatusPedido from "../components/StatusPedido";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { useSessao } from "../context/SessaoContext";
import { listarPagamentos, listarPedidosDoUsuario } from "../services/api";
import { codigoRetirada, formatarDataHora, formatarMoeda } from "../lib/formatar";
import type { Pedido } from "../types/api";

// id maior = mais novo
async function pedidosDoUsuario(id: number): Promise<Pedido[]> {
  const lista = await listarPedidosDoUsuario(id);
  return lista.sort((a, b) => b.id - a.id);
}

function ListaPedidos({ usuarioId }: { usuarioId: number }) {
  const pedidos = useApi(() => pedidosDoUsuario(usuarioId), [usuarioId]);
  const pagamentos = useApi(listarPagamentos);

  function estaPago(pedidoId: number) {
    if (!pagamentos.dados) return false;
    return pagamentos.dados.some((pg) => pg.pedidoId === pedidoId);
  }

  if (pedidos.carregando) return <Carregando texto="Buscando seus pedidos..." />;
  if (pedidos.erro) return <ErroCarregar mensagem={pedidos.erro} aoTentarDeNovo={pedidos.recarregar} />;
  if (!pedidos.dados || pedidos.dados.length === 0) {
    return (
      <Vazio titulo="Você ainda não fez pedidos" descricao="Encontre uma oferta e reserve em poucos cliques.">
        <Button to="/ofertas" tamanho="sm">
          Ver ofertas
        </Button>
      </Vazio>
    );
  }

  return (
    <ul className="space-y-4">
      {pedidos.dados.map((pedido) => (
        <li key={pedido.id}>
          <Link
            to={"/pedidos/" + pedido.id}
            className="flex flex-col gap-4 rounded-md border border-borderc bg-white p-5 shadow-soft-sm transition-all hover:border-brand/40 hover:shadow-soft-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="font-display text-ink">{codigoRetirada(pedido.id)}</strong>
                <StatusPedido status={pedido.status} pago={estaPago(pedido.id)} />
              </div>
              <p className="mt-1 text-sm">{formatarDataHora(pedido.dataPedido)}</p>
              <p className="mt-1 truncate text-sm text-ink">
                {pedido.itens.map((item) => item.quantidade + "x " + item.nomeProduto).join(", ")}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <strong className="font-display text-lg text-ink">{formatarMoeda(pedido.valorTotal)}</strong>
              <Icon name="arrowRight" className="text-brand" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MeusPedidos() {
  useDocumentMeta("Meus pedidos — ReFood");
  const { usuario } = useSessao();

  return (
    <ExigePerfil tipo="CONSUMIDOR">
      <PageHeader etiqueta="Minha conta" titulo="Meus pedidos" descricao="Pague, acompanhe e retire suas reservas com o QR Code.">
        <Button to="/ofertas" variante="secondary">
          <Icon name="plus" size={16} /> Nova reserva
        </Button>
      </PageHeader>
      <section className="py-10 md:py-12">
        <Container className="max-w-4xl">{usuario && <ListaPedidos usuarioId={usuario.id} />}</Container>
      </section>
    </ExigePerfil>
  );
}

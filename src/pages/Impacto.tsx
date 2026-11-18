import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Icon, { type NomeIcone } from "../components/Icon";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { listarEstabelecimentos, listarPedidos, listarProdutos } from "../services/api";
import { diasParaVencer, formatarMoeda } from "../lib/formatar";
import type { Estabelecimento, Pedido, Produto } from "../types/api";

interface DadosImpacto {
  pedidos: Pedido[];
  produtos: Produto[];
  estabelecimentos: Estabelecimento[];
}

async function buscarDados(): Promise<DadosImpacto> {
  const pedidos = await listarPedidos();
  const produtos = await listarProdutos();
  const estabelecimentos = await listarEstabelecimentos();
  return { pedidos, produtos, estabelecimentos };
}

const KG_POR_ITEM = 0.5;

interface TotalCategoria {
  nome: string;
  quantidade: number;
}

interface Indicador {
  icone: NomeIcone;
  rotulo: string;
  valor: string;
  detalhe: string;
}

export default function Impacto() {
  useDocumentMeta("Impacto — ReFood");

  const { dados, carregando, erro, recarregar } = useApi(buscarDados);

  if (carregando) {
    return (
      <>
        <PageHeader etiqueta="Impacto" titulo="Desperdício evitado" />
        <Carregando texto="Calculando indicadores..." />
      </>
    );
  }

  if (erro || !dados) {
    return (
      <>
        <PageHeader etiqueta="Impacto" titulo="Desperdício evitado" />
        <ErroCarregar mensagem={erro || "Sem dados."} aoTentarDeNovo={recarregar} />
      </>
    );
  }

  const { pedidos, produtos, estabelecimentos } = dados;

  let itensResgatados = 0;
  let economia = 0;
  let movimentado = 0;
  const categorias: TotalCategoria[] = [];

  for (const pedido of pedidos) {
    movimentado += pedido.valorTotal;

    for (const item of pedido.itens) {
      itensResgatados += item.quantidade;
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (produto) {
        economia += (produto.precoOriginal - item.valorUnitario) * item.quantidade;

        const categoria = categorias.find((c) => c.nome === produto.categoria);
        if (categoria) {
          categoria.quantidade += item.quantidade;
        } else {
          categorias.push({ nome: produto.categoria, quantidade: item.quantidade });
        }
      }
    }
  }

  const concluidos = pedidos.filter((p) => p.status === "CONCLUIDO").length;
  const ofertasAtivas = produtos.filter((p) => p.quantidadeEstoque > 0 && diasParaVencer(p.dataValidade) >= 0);
  const vencendo = ofertasAtivas.filter((p) => diasParaVencer(p.dataValidade) <= 3).length;

  const indicadores: Indicador[] = [
    { icone: "bag", rotulo: "Itens resgatados", valor: String(itensResgatados), detalhe: "unidades que não foram para o lixo" },
    { icone: "leaf", rotulo: "Desperdício evitado", valor: (itensResgatados * KG_POR_ITEM).toLocaleString("pt-BR") + " kg", detalhe: "estimativa de 0,5 kg por item" },
    { icone: "tag", rotulo: "Economia dos consumidores", valor: formatarMoeda(economia), detalhe: "diferença para o preço original" },
    { icone: "card", rotulo: "Receita recuperada", valor: formatarMoeda(movimentado), detalhe: "valor que voltou para os parceiros" },
    { icone: "check", rotulo: "Pedidos retirados", valor: concluidos + " de " + pedidos.length, detalhe: "pedidos concluídos" },
    { icone: "store", rotulo: "Parceiros ativos", valor: String(estabelecimentos.length), detalhe: ofertasAtivas.length + " ofertas disponíveis agora" },
  ];

  categorias.sort((a, b) => b.quantidade - a.quantidade);
  const maior = categorias.length > 0 ? categorias[0].quantidade : 1;

  return (
    <>
      <PageHeader
        etiqueta="Impacto"
        titulo="Desperdício evitado"
        descricao="Indicadores calculados em tempo real com os pedidos e produtos cadastrados na API ReFood."
      />

      <section className="py-10 md:py-12">
        <Container>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indicadores.map((ind) => (
              <li key={ind.rotulo} className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-soft text-brand">
                    <Icon name={ind.icone} size={20} />
                  </span>
                  <p className="text-sm font-semibold text-ink">{ind.rotulo}</p>
                </div>
                <p className="mt-4 font-display text-3xl font-extrabold text-ink">{ind.valor}</p>
                <p className="mt-1 text-sm">{ind.detalhe}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm">
              <h2 className="text-lg">Itens resgatados por categoria</h2>
              {categorias.length === 0 ? (
                <Vazio titulo="Ainda não há pedidos" descricao="Os números aparecem assim que o primeiro pedido for feito." />
              ) : (
                <ul className="mt-5 space-y-4">
                  {categorias.map((categoria) => (
                    <li key={categoria.nome}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-ink">{categoria.nome}</span>
                        <span>{categoria.quantidade} un.</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-bg" role="presentation">
                        <div className="h-full rounded-full bg-brand" style={{ width: (categoria.quantidade / maior) * 100 + "%" }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-md bg-rodape p-6 text-white">
              <h2 className="text-lg text-white">Atenção à validade</h2>
              <p className="mt-2 text-sm text-white/70">Ofertas que vencem em até 3 dias e precisam de atenção.</p>
              <p className="mt-6 font-display text-5xl font-extrabold text-green-300">{vencendo}</p>
              <p className="mt-1 text-sm text-white/70">de {ofertasAtivas.length} ofertas ativas</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

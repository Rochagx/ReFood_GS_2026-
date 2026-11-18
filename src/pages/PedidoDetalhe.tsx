import { useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import Alerta from "../components/Alerta";
import Icon from "../components/Icon";
import QrRetirada from "../components/QrRetirada";
import StatusPedido from "../components/StatusPedido";
import { Carregando, ErroCarregar } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import {
  buscarEstabelecimento,
  buscarPagamentoDoPedido,
  buscarPedido,
  concluirPedido,
  pagarPedido,
} from "../services/api";
import { NOME_PAGAMENTO, codigoRetirada, formatarDataHora, formatarMoeda } from "../lib/formatar";
import type { Pagamento, Pedido, TipoPagamento } from "../types/api";

const FORMAS: TipoPagamento[] = ["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"];

export default function PedidoDetalhe() {
  // rota com parâmetro: /pedidos/:id
  const { id } = useParams();
  const [params] = useSearchParams();
  const acabouDeCriar = params.get("novo") === "1";

  const pedidoApi = useApi(() => buscarPedido(Number(id)), [id]);
  const pagamentoApi = useApi(() => buscarPagamentoDoPedido(Number(id)), [id]);
  // a loja só pode ser buscada depois que o pedido chegar 
  const lojaId = pedidoApi.dados ? pedidoApi.dados.estabelecimentoId : null;    
  const lojaApi = useApi(async () => {
    if (lojaId === null) return null;
    return await buscarEstabelecimento(lojaId);
  }, [lojaId]);

  // depois de pagar/concluir guarda a resposta da API para atualizar a tela na hora
  const [pedidoAtualizado, setPedidoAtualizado] = useState<Pedido | null>(null);
  const [pagamentoNovo, setPagamentoNovo] = useState<Pagamento | null>(null);
  const [forma, setForma] = useState<TipoPagamento | "">("");
  const [erroForma, setErroForma] = useState("");
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useDocumentMeta("Pedido " + codigoRetirada(Number(id)) + " — ReFood");

  if (pedidoApi.carregando || pagamentoApi.carregando) return <Carregando texto="Carregando pedido..." />;
  if (pedidoApi.erro || !pedidoApi.dados) {
    return (
      <Container className="py-10 text-center">
        <ErroCarregar mensagem={pedidoApi.erro || "Pedido não encontrado."} aoTentarDeNovo={pedidoApi.recarregar} />
        <Button to="/pedidos" variante="ghost">
          <Icon name="arrowLeft" size={16} /> Voltar para meus pedidos
        </Button>
      </Container>
    );
  }

  const pedido = pedidoAtualizado || pedidoApi.dados;
  const pagamento = pagamentoNovo || pagamentoApi.dados;
  const codigo = codigoRetirada(pedido.id);
  const concluido = pedido.status === "CONCLUIDO";

  // POST /pagamento
  async function aoPagar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);
    if (!forma) {
      setErroForma("Escolha uma forma de pagamento.");
      return;
    }
    setProcessando(true);
    try {
      const novo = await pagarPedido(pedido.id, forma);
      setPagamentoNovo(novo);
      setMensagem({ tipo: "sucesso", texto: "Pagamento confirmado! Use o QR Code abaixo para retirar." });
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: "Falha no pagamento: " + (erro as Error).message });
    } finally {
      setProcessando(false);
    }
  }

  async function aoConfirmarRetirada() {
    setMensagem(null);
    setProcessando(true);
    try {
      const atualizado = await concluirPedido(pedido.id);
      setPedidoAtualizado(atualizado);
      setMensagem({ tipo: "sucesso", texto: "Retirada confirmada. Bom apetite e obrigado por evitar o desperdício!" });
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: "Não foi possível confirmar a retirada: " + (erro as Error).message });
    } finally {
      setProcessando(false);
    }
  }

  return (
    <section className="py-8 md:py-10">
      <Container className="max-w-5xl">
        <Link to="/pedidos" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
          <Icon name="arrowLeft" size={16} /> Meus pedidos
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(1.6rem,2vw+1rem,2.4rem)]">Pedido {codigo}</h1>
          <StatusPedido status={pedido.status} pago={!!pagamento} />
        </div>
        <p className="mt-1 text-sm">Feito em {formatarDataHora(pedido.dataPedido)}</p>

        {acabouDeCriar && !pagamento && !mensagem && (
          <Alerta tipo="sucesso" className="mt-5">
            Reserva criada! Agora finalize o pagamento para liberar o QR Code de retirada.
          </Alerta>
        )}
        {mensagem && (
          <Alerta tipo={mensagem.tipo} className="mt-5">
            {mensagem.texto}
          </Alerta>
        )}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* itens */}
          <div className="rounded-md border border-borderc bg-white shadow-soft-sm">
            <h2 className="border-b border-borderc px-5 py-4 text-base">Itens do pedido</h2>
            <ul className="divide-y divide-borderc">
              {pedido.itens.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{item.nomeProduto}</p>
                    <p>
                      {item.quantidade} x {formatarMoeda(item.valorUnitario)}
                    </p>
                  </div>
                  <strong className="text-ink">{formatarMoeda(item.valorSubtotal)}</strong>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-borderc px-5 py-4">
              <span className="font-semibold text-ink">Total</span>
              <strong className="font-display text-xl text-ink">{formatarMoeda(pedido.valorTotal)}</strong>
            </div>
            {lojaApi.dados && (
              <div className="border-t border-borderc bg-bg px-5 py-4 text-sm">
                <p className="font-semibold text-ink">Retirada</p>
                <p>
                  {lojaApi.dados.nome} · {lojaApi.dados.endereco}
                </p>
              </div>
            )}
          </div>

          {/* pagamento ou QR Code */}
          <div className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm">
            {!pagamento ? (
              <form noValidate onSubmit={aoPagar}>
                <h2 className="text-base">Pagamento</h2>
                <fieldset className="mt-4">
                  <legend className="mb-2 text-sm font-semibold text-ink">Forma de pagamento *</legend>
                  <div className="space-y-2">
                    {FORMAS.map((f) => (
                      <label
                        key={f}
                        className={`flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 text-sm transition-colors ${
                          forma === f ? "border-brand bg-brand-soft" : "border-borderc hover:border-brand/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="forma"
                          value={f}
                          checked={forma === f}
                          onChange={() => {
                            setForma(f);
                            setErroForma("");
                          }}
                          className="accent-brand"
                        />
                        <Icon name={f === "PIX" ? "qr" : "card"} size={18} className="text-brand" />
                        <span className="font-medium text-ink">{NOME_PAGAMENTO[f]}</span>
                      </label>
                    ))}
                  </div>
                  {erroForma && <p className="mt-2 text-[0.8rem] font-medium text-danger">{erroForma}</p>}
                </fieldset>
                <Button type="submit" block className="mt-5" disabled={processando}>
                  {processando ? "Processando..." : "Pagar " + formatarMoeda(pedido.valorTotal)}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <h2 className="text-base">{concluido ? "Pedido retirado" : "QR Code de retirada"}</h2>
                <div className={`mx-auto mt-4 w-fit rounded-md border border-borderc p-3 ${concluido ? "opacity-40" : ""}`}>
                  <QrRetirada codigo={codigo} />
                </div>
                <p className="mt-3 font-display text-xl font-extrabold tracking-wider text-ink">{codigo}</p>
                <p className="mt-1 text-sm">
                  Pago com {NOME_PAGAMENTO[pagamento.tipoPagamento]} · {formatarMoeda(pagamento.valorPagamento)}
                </p>

                {concluido ? (
                  <Alerta tipo="sucesso" className="mt-4 text-left">
                    Este pedido já foi retirado. Obrigado por evitar o desperdício!
                  </Alerta>
                ) : (
                  <>
                    <p className="mt-4 text-sm">
                      Mostre este código na máquina ReFood ou no balcão do parceiro. Ao ler o QR Code, a retirada é confirmada.
                    </p>
                    <Button variante="secondary" block className="mt-4" onClick={aoConfirmarRetirada} disabled={processando}>
                      <Icon name="check" size={18} /> {processando ? "Confirmando..." : "Confirmar retirada"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

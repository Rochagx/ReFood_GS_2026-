import { useState } from "react";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import ExigePerfil from "../components/ExigePerfil";
import EstabelecimentoForm from "../components/EstabelecimentoForm";
import ProdutoForm from "../components/ProdutoForm";
import ProdutoImagem from "../components/ProdutoImagem";
import StatusPedido from "../components/StatusPedido";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Alerta from "../components/Alerta";
import Icon from "../components/Icon";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { useSessao } from "../context/SessaoContext";
import {
  concluirPedido,
  excluirProduto,
  listarEstabelecimentos,
  listarPedidosDoEstabelecimento,
  listarProdutosDoEstabelecimento,
} from "../services/api";
import { codigoRetirada, formatarData, formatarDataHora, formatarMoeda, textoValidade, diasParaVencer } from "../lib/formatar";
import { CAMPO, ROTULO } from "../lib/estilos";
import type { Estabelecimento, Produto, Usuario } from "../types/api";

interface Mensagem {
  tipo: "sucesso" | "erro";
  texto: string;
}

// ---------- produtos do estabelecimento
function GestaoProdutos({ loja }: { loja: Estabelecimento }) {
  const produtos = useApi(() => listarProdutosDoEstabelecimento(loja.id), [loja.id]);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Produto | undefined>(undefined);
  const [confirmarId, setConfirmarId] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  function abrirNovo() {
    setEditando(undefined);
    setFormAberto(true);
    setMensagem(null);
  }

  function abrirEdicao(produto: Produto) {
    setEditando(produto);
    setFormAberto(true);
    setMensagem(null);
  }

  function aoSalvar(produto: Produto) {
    setMensagem({ tipo: "sucesso", texto: (editando ? "Produto atualizado: " : "Produto cadastrado: ") + produto.nome });
    setFormAberto(false);
    setEditando(undefined);
    produtos.recarregar();
  }

  // DELETE /produto/{id}
  async function aoExcluir(produto: Produto) {
    setExcluindo(true);
    setMensagem(null);
    try {
      await excluirProduto(produto.id);
      setMensagem({ tipo: "sucesso", texto: "Produto excluído: " + produto.nome });
      produtos.recarregar();
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: (erro as Error).message });
    } finally {
      setExcluindo(false);
      setConfirmarId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl">Produtos</h2>
        {!formAberto && (
          <Button tamanho="sm" onClick={abrirNovo}>
            <Icon name="plus" size={16} /> Novo produto
          </Button>
        )}
      </div>

      {mensagem && (
        <Alerta tipo={mensagem.tipo} className="mb-5">
          {mensagem.texto}
        </Alerta>
      )}

      {formAberto && (
        <div className="mb-6">
          <ProdutoForm
            key={editando ? editando.id : "novo"}
            estabelecimentoId={loja.id}
            produto={editando}
            aoSalvar={aoSalvar}
            aoCancelar={() => {
              setFormAberto(false);
              setEditando(undefined);
            }}
          />
        </div>
      )}

      {produtos.carregando && <Carregando texto="Buscando produtos..." />}
      {produtos.erro && <ErroCarregar mensagem={produtos.erro} aoTentarDeNovo={produtos.recarregar} />}
      {produtos.dados && produtos.dados.length === 0 && !formAberto && (
        <Vazio titulo="Nenhum produto cadastrado" descricao="Publique seu primeiro excedente para aparecer nas ofertas.">
          <Button tamanho="sm" onClick={abrirNovo}>
            Cadastrar produto
          </Button>
        </Vazio>
      )}

      {produtos.dados && produtos.dados.length > 0 && (
        <ul className="space-y-3">
          {produtos.dados.map((p) => (
            <li key={p.id} className="flex flex-col gap-4 rounded-md border border-borderc bg-white p-4 sm:flex-row sm:items-center">
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-sm sm:w-28">
                <ProdutoImagem imagem={p.imagem} nome={p.nome} categoria={p.categoria} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="truncate text-ink">{p.nome}</strong>
                  <Badge tom="neutro">{p.categoria}</Badge>
                </div>
                <p className="mt-1 text-sm">
                  {formatarMoeda(p.precoPromocional)} <s>{formatarMoeda(p.precoOriginal)}</s> · {p.quantidadeEstoque} em estoque
                </p>
                <p className={`text-sm ${diasParaVencer(p.dataValidade) < 0 ? "text-danger" : ""}`}>
                  Validade {formatarData(p.dataValidade)} · {textoValidade(p.dataValidade)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {confirmarId === p.id ? (
                  <>
                    <span className="self-center text-sm font-medium text-ink">Excluir?</span>
                    <Button variante="danger" tamanho="sm" onClick={() => aoExcluir(p)} disabled={excluindo}>
                      {excluindo ? "Excluindo..." : "Sim, excluir"}
                    </Button>
                    <Button variante="secondary" tamanho="sm" onClick={() => setConfirmarId(null)} disabled={excluindo}>
                      Não
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variante="secondary" tamanho="sm" onClick={() => abrirEdicao(p)}>
                      <Icon name="edit" size={15} /> Editar
                    </Button>
                    <Button variante="danger" tamanho="sm" onClick={() => setConfirmarId(p.id)} aria-label={"Excluir " + p.nome}>
                      <Icon name="trash" size={15} />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- pedidos recebidos ---
function PedidosRecebidos({ loja }: { loja: Estabelecimento }) {
  const pedidos = useApi(() => listarPedidosDoEstabelecimento(loja.id), [loja.id]);
  const [erro, setErro] = useState("");

  async function concluir(id: number) {
    setErro("");
    try {
      await concluirPedido(id);
      pedidos.recarregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <div className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm">
      <h2 className="text-lg">Pedidos recebidos</h2>
      {erro && (
        <Alerta tipo="erro" className="mt-3">
          {erro}
        </Alerta>
      )}
      {pedidos.carregando && <Carregando texto="Buscando pedidos..." />}
      {pedidos.erro && <ErroCarregar mensagem={pedidos.erro} aoTentarDeNovo={pedidos.recarregar} />}
      {pedidos.dados && pedidos.dados.length === 0 && <p className="mt-3 text-sm">Nenhum pedido ainda.</p>}
      {pedidos.dados && pedidos.dados.length > 0 && (
        <ul className="mt-3 divide-y divide-borderc">
          {pedidos.dados.map((pedido) => {
            return (
              <li key={pedido.id} className="py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-ink">{codigoRetirada(pedido.id)}</strong>
                  <StatusPedido status={pedido.status} pago={pedido.status === "PENDENTE" ? undefined : true} />
                </div>
                <p className="mt-1">
                  {formatarDataHora(pedido.dataPedido)} · {formatarMoeda(pedido.valorTotal)}
                </p>
                {pedido.status === "PENDENTE" && (
                  <Button variante="ghost" tamanho="sm" className="mt-1 -ml-3" onClick={() => concluir(pedido.id)}>
                    <Icon name="check" size={15} /> Marcar como retirado
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------- painel ----------
function ConteudoPainel({ usuario }: { usuario: Usuario }) {
  const estabelecimentos = useApi(listarEstabelecimentos);
  const [lojaId, setLojaId] = useState<number | null>(null);
  const [editandoLoja, setEditandoLoja] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  if (estabelecimentos.carregando) return <Carregando texto="Carregando seu painel..." />;
  if (estabelecimentos.erro) return <ErroCarregar mensagem={estabelecimentos.erro} aoTentarDeNovo={estabelecimentos.recarregar} />;

  const minhas = (estabelecimentos.dados || []).filter((e) => e.usuarioId === usuario.id);

  if (minhas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <Alerta tipo="info" className="mb-5">
          Para publicar ofertas, primeiro cadastre o seu estabelecimento.
        </Alerta>
        <EstabelecimentoForm
          usuarioId={usuario.id}
          aoSalvar={(nova) => {
            setLojaId(nova.id);
            setMensagem({ tipo: "sucesso", texto: "Estabelecimento cadastrado! Agora publique seus produtos." });
            estabelecimentos.recarregar();
          }}
        />
      </div>
    );
  }

  const loja = minhas.find((e) => e.id === lojaId) || minhas[0];

  return (
    <>
      {mensagem && (
        <Alerta tipo={mensagem.tipo} className="mb-6">
          {mensagem.texto}
        </Alerta>
      )}

      {minhas.length > 1 && (
        <div className="mb-6 max-w-sm">
          <label htmlFor="loja" className={ROTULO}>
            Estabelecimento
          </label>
          <select id="loja" value={loja.id} onChange={(e) => setLojaId(Number(e.target.value))} className={CAMPO}>
            {minhas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
        <GestaoProdutos key={loja.id} loja={loja} />

        <div className="space-y-6">
          {editandoLoja ? (
            <EstabelecimentoForm
              usuarioId={usuario.id}
              estabelecimento={loja}
              aoSalvar={() => {
                setEditandoLoja(false);
                setMensagem({ tipo: "sucesso", texto: "Dados do estabelecimento atualizados." });
                estabelecimentos.recarregar();
              }}
              aoCancelar={() => setEditandoLoja(false)}
            />
          ) : (
            <div className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg">{loja.nome}</h2>
                  <p className="text-sm">CNPJ {loja.cnpj}</p>
                </div>
                <Button variante="secondary" tamanho="sm" onClick={() => setEditandoLoja(true)} aria-label="Editar estabelecimento">
                  <Icon name="edit" size={15} />
                </Button>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm">
                <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0 break-words">{loja.endereco}</span>
              </p>
              <Button to={"/parceiros/" + loja.id} variante="ghost" tamanho="sm" className="mt-2 -ml-3">
                Ver página pública <Icon name="arrowRight" size={15} />
              </Button>
            </div>
          )}

          <PedidosRecebidos key={loja.id} loja={loja} />
        </div>
      </div>
    </>
  );
}

export default function Painel() {
  useDocumentMeta("Painel do parceiro — ReFood");
  const { usuario } = useSessao();

  return (
    <ExigePerfil tipo="COMERCIANTE">
      <PageHeader etiqueta="Painel do parceiro" titulo={"Olá, " + (usuario ? usuario.nome : "") + "!"} descricao="Gerencie seus excedentes e acompanhe os pedidos." />
      <section className="py-10 md:py-12">
        <Container>{usuario && <ConteudoPainel usuario={usuario} />}</Container>
      </section>
    </ExigePerfil>
  );
}

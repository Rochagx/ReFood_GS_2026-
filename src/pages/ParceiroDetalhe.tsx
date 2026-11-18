import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import ProdutoCard from "../components/ProdutoCard";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { buscarEstabelecimento, listarProdutosDoEstabelecimento } from "../services/api";

export default function ParceiroDetalhe() {
  // rota com parâmetro: /parceiros/:id
  const { id } = useParams();
  const estabelecimento = useApi(() => buscarEstabelecimento(Number(id)), [id]);
  const produtos = useApi(() => listarProdutosDoEstabelecimento(Number(id)), [id]);

  useDocumentMeta((estabelecimento.dados ? estabelecimento.dados.nome : "Parceiro") + " — ReFood");

  if (estabelecimento.carregando) return <Carregando texto="Carregando parceiro..." />;

  if (estabelecimento.erro || !estabelecimento.dados) {
    return (
      <Container className="py-10 text-center">
        <ErroCarregar mensagem={estabelecimento.erro || "Parceiro não encontrado."} aoTentarDeNovo={estabelecimento.recarregar} />
        <Button to="/parceiros" variante="ghost">
          <Icon name="arrowLeft" size={16} /> Voltar para parceiros
        </Button>
      </Container>
    );
  }

  const loja = estabelecimento.dados;

  return (
    <>
      <section className="border-b border-borderc bg-white">
        <Container className="py-8 md:py-10">
          <Link to="/parceiros" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
            <Icon name="arrowLeft" size={16} /> Voltar para parceiros
          </Link>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="flex items-start gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-brand-soft font-display text-2xl font-extrabold text-brand">
                {loja.nome.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="text-[clamp(1.6rem,2vw+1rem,2.4rem)]">{loja.nome}</h1>
                <p className="mt-2">{loja.descricao || "Parceiro ReFood contra o desperdício de alimentos."}</p>
              </div>
            </div>

            <div className="rounded-md border border-borderc bg-bg p-5 text-sm">
              <h2 className="text-base">Endereço e contato</h2>
              <p className="mt-2 flex items-start gap-2">
                <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0 break-words">
                  {loja.endereco}
                  {loja.cep && " · CEP " + loja.cep}
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Icon name="phone" size={16} className="shrink-0 text-brand" />
                {loja.telefone || "Contato não informado"}
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Icon name="store" size={16} className="shrink-0 text-brand" /> CNPJ {loja.cnpj}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-12">
        <Container>
          <h2 className="mb-6">Ofertas deste parceiro</h2>
          {produtos.carregando && <Carregando texto="Buscando ofertas..." />}
          {produtos.erro && <ErroCarregar mensagem={produtos.erro} aoTentarDeNovo={produtos.recarregar} />}
          {produtos.dados && produtos.dados.length === 0 && (
            <Vazio titulo="Este parceiro ainda não publicou ofertas" descricao="Volte em breve para conferir novidades." />
          )}
          {produtos.dados && produtos.dados.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.dados.map((p) => (
                <ProdutoCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

import { useState } from "react";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import EstabelecimentoCard from "../components/EstabelecimentoCard";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { Carregando, ErroCarregar, Vazio } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { listarEstabelecimentos, listarProdutos } from "../services/api";
import { diasParaVencer } from "../lib/formatar";
import { CAMPO } from "../lib/estilos";

export default function Parceiros() {
  useDocumentMeta("Parceiros — ReFood");

  const [busca, setBusca] = useState("");
  const estabelecimentos = useApi(listarEstabelecimentos);
  const produtos = useApi(listarProdutos);

  // ofertas válidas de cada parceiro
  function totalOfertas(estabelecimentoId: number) {
    return (produtos.dados || []).filter(
      (p) => p.estabelecimentoId === estabelecimentoId && p.quantidadeEstoque > 0 && diasParaVencer(p.dataValidade) >= 0,
    ).length;
  }

  const filtrados = (estabelecimentos.dados || []).filter((e) =>
    (e.nome + " " + e.endereco).toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <>
      <PageHeader
        etiqueta="Parceiros"
        titulo="Onde comprar e retirar"
        descricao="Estabelecimentos cadastrados na API ReFood que publicam alimentos excedentes."
      >
        <Button to="/entrar" variante="secondary">
          <Icon name="plus" size={16} /> Quero ser parceiro
        </Button>
      </PageHeader>

      <section className="py-10 md:py-12">
        <Container>
          <div className="relative mb-8 max-w-md">
            <label htmlFor="busca-parceiro" className="sr-only">
              Buscar parceiro
            </label>
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="busca-parceiro"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou endereço"
              className={CAMPO + " pl-10"}
            />
          </div>

          {estabelecimentos.carregando && <Carregando texto="Buscando parceiros..." />}
          {estabelecimentos.erro && <ErroCarregar mensagem={estabelecimentos.erro} aoTentarDeNovo={estabelecimentos.recarregar} />}
          {!estabelecimentos.carregando && !estabelecimentos.erro && filtrados.length === 0 && (
            <Vazio titulo="Nenhum parceiro encontrado" descricao="Tente outro termo de busca." />
          )}
          {filtrados.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtrados.map((e) => (
                <EstabelecimentoCard key={e.id} estabelecimento={e} totalOfertas={produtos.dados ? totalOfertas(e.id) : undefined} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

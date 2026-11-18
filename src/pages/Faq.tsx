import { useState } from "react";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";
import useDocumentMeta from "../hooks/useDocumentMeta";

interface Pergunta {
  pergunta: string;
  resposta: string;
}

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Os alimentos próximos do vencimento são seguros?",
    resposta:
      "Sim. Só aceitamos produtos dentro da validade. A própria API recusa pedidos de itens vencidos, e cada parceiro é responsável pelo armazenamento correto.",
  },
  {
    pergunta: "Como faço para comprar?",
    resposta:
      "Escolha uma oferta, informe a quantidade e confirme o pedido. Depois é só pagar com Pix ou cartão e usar o QR Code para retirar.",
  },
  {
    pergunta: "Onde eu retiro o pedido?",
    resposta:
      "Nas máquinas inteligentes ReFood instaladas em pontos estratégicos da cidade ou no balcão do próprio estabelecimento parceiro.",
  },
  {
    pergunta: "Quais formas de pagamento são aceitas?",
    resposta: "Pix, cartão de crédito e cartão de débito, todos pagos de forma digital.",
  },
  {
    pergunta: "Meu estabelecimento pode participar?",
    resposta:
      "Pode! Mercados, padarias, restaurantes e feiras criam um perfil de comerciante, cadastram o estabelecimento e começam a publicar ofertas no painel.",
  },
  {
    pergunta: "O que acontece se o produto acabar antes da minha compra?",
    resposta:
      "O estoque é controlado em tempo real pela API. Se não houver quantidade suficiente, o pedido não é criado e você vê uma mensagem explicando.",
  },
];

export default function Faq() {
  useDocumentMeta("FAQ — ReFood");

  const [aberta, setAberta] = useState<number | null>(0);

  function alternar(indice: number) {
    setAberta(aberta === indice ? null : indice);
  }

  return (
    <>
      <PageHeader etiqueta="Ajuda" titulo="Perguntas frequentes" descricao="Tudo o que você precisa saber para comprar ou anunciar no ReFood." />

      <section className="py-14">
        <Container className="max-w-3xl">
          <ul className="space-y-3">
            {PERGUNTAS.map((item, i) => {
              const estaAberta = aberta === i;
              return (
                <li key={item.pergunta} className="overflow-hidden rounded-md border border-borderc bg-white">
                  <h2 className="text-base">
                    <button
                      onClick={() => alternar(i)}
                      aria-expanded={estaAberta}
                      aria-controls={"resposta-" + i}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink hover:text-brand"
                    >
                      {item.pergunta}
                      <Icon
                        name="plus"
                        size={18}
                        className={`shrink-0 text-brand transition-transform duration-200 ${estaAberta ? "rotate-45" : ""}`}
                      />
                    </button>
                  </h2>
                  <div id={"resposta-" + i} hidden={!estaAberta} className="px-5 pb-5">
                    <p className="text-sm">{item.resposta}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-md bg-brand-soft p-6 text-center">
            <p className="font-semibold text-ink">Não encontrou sua resposta?</p>
            <Button to="/contato" tamanho="sm" className="mt-3">
              Fale com a equipe
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

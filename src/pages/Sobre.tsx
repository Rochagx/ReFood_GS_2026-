import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Icon, { type NomeIcone } from "../components/Icon";
import Button from "../components/Button";
import useDocumentMeta from "../hooks/useDocumentMeta";

interface Bloco {
  icone: NomeIcone;
  titulo: string;
  texto: string;
}

const RECURSOS: Bloco[] = [
  { icone: "store", titulo: "Cadastro pelos estabelecimentos", texto: "Cada parceiro publica alimentos com quantidade, validade, preço original e preço promocional." },
  { icone: "tag", titulo: "Descontos promocionais", texto: "Produtos próximos do vencimento ganham preço reduzido e continuam seguros para consumo." },
  { icone: "box", titulo: "Máquinas inteligentes", texto: "Vending machines refrigeradas em pontos estratégicos da cidade guardam os pedidos para retirada." },
  { icone: "qr", titulo: "Pagamento digital e QR Code", texto: "O cliente paga pelo site e recebe um código para abrir a gaveta da máquina." },
  { icone: "clock", titulo: "Controle de estoque e validade", texto: "A API bloqueia pedidos de produtos vencidos ou sem estoque suficiente." },
  { icone: "chart", titulo: "Indicadores de impacto", texto: "Acompanhamos quantos alimentos foram aproveitados e quanto o consumidor economizou." },
];

export default function Sobre() {
  useDocumentMeta("Sobre — ReFood");

  return (
    <>
      <PageHeader
        etiqueta="Sobre o projeto"
        titulo="Tecnologia com o cidadão no centro"
        descricao="O ReFood nasceu no desafio CitizenTech da Global Solution FIAP para reduzir o desperdício de alimentos nas cidades."
      />

      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2>O problema</h2>
            <p className="mt-3">
              Todos os dias, mercados, padarias, restaurantes e feiras descartam alimentos que ainda estão bons para
              consumo, só porque estão perto do vencimento ou sobraram no fim do expediente. Ao mesmo tempo, muitas
              famílias têm dificuldade para pagar por comida de qualidade.
            </p>
            <p className="mt-3">
              Reduzir pela metade o desperdício de alimentos até 2030 é uma das metas da ONU no Objetivo de
              Desenvolvimento Sustentável 12 (consumo e produção responsáveis).
            </p>
          </div>
          <div className="rounded-md border border-borderc bg-white p-6 shadow-soft-sm md:p-8">
            <h2>Nossa solução</h2>
            <p className="mt-3">
              Uma plataforma que conecta quem tem alimento sobrando a quem quer comprar mais barato. O estabelecimento
              recupera parte do valor, o consumidor economiza e o alimento não vai para o lixo.
            </p>
            <ul className="mt-5 space-y-3">
              {["Menos desperdício e menos lixo orgânico", "Comida de qualidade a preço acessível", "Receita extra para o comércio local"].map(
                (item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                      <Icon name="check" size={14} />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-borderc bg-white py-14">
        <Container>
          <h2>Principais recursos</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECURSOS.map((recurso) => (
              <article key={recurso.titulo} className="rounded-md border border-borderc bg-bg p-5">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
                  <Icon name={recurso.icone} />
                </span>
                <h3>{recurso.titulo}</h3>
                <p className="mt-1.5 text-sm">{recurso.texto}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/ofertas">Ver ofertas</Button>
            <Button to="/impacto" variante="secondary">
              Ver indicadores
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

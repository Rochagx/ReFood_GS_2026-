import Container from "../components/Container";
import Button from "../components/Button";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function NaoEncontrado() {
  useDocumentMeta("Página não encontrada — ReFood");

  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="font-display text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md">O endereço pode ter mudado ou não existe mais.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Voltar ao início</Button>
          <Button to="/ofertas" variante="secondary">
            Ver ofertas
          </Button>
        </div>
      </Container>
    </section>
  );
}

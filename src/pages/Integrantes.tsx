import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import useDocumentMeta from "../hooks/useDocumentMeta";
import foto1 from "../assets/integrante-1.jpg";
import foto2 from "../assets/integrante-2.jpg";
import foto4 from "../assets/integrante-4.jpg";
import foto5 from "../assets/integrante-5.jpeg";

interface Integrante {
  nome: string;
  foto: string;
  rm: string;
  funcao: string;
  github: string;
  linkedin: string;
}

const INTEGRANTES: Integrante[] = [
  {
    nome: "Guilherme dos Santos Rocha",
    foto: foto1,
    rm: "RM 570005",
    funcao: "Front-end",
    github: "https://github.com/Rochagx",
    linkedin: "https://www.linkedin.com/in/guilherme-rocha-tech/",
  },
  {
    nome: "César Anastácio dos Anjos Ledres",
    foto: foto2,
    rm: "RM 573833",
    funcao: "Desenvolvimento",
    github: "https://github.com/cesarledres",
    linkedin: "https://www.linkedin.com/in/césar-ledres-679240318/",
  },
  {
    nome: "Caio Gonçalves Feixas",
    foto: foto4,
    rm: "RM 569956",
    funcao: "Desenvolvimento",
    github: "https://github.com/Caiofeixas",
    linkedin: "https://www.linkedin.com/in/caio-gonçalves-450008322/",
  },
  {
    nome: "Théo Caria Gonçalves",
    foto: foto5,
    rm: "RM 572914",
    funcao: "Desenvolvimento",
    github: "https://github.com/theo4321",
    linkedin: "https://www.linkedin.com/in/theo-caria-801834395/",
  },
];

export default function Integrantes() {
  useDocumentMeta("Integrantes — ReFood");

  return (
    <>
      <PageHeader
        etiqueta="Equipe"
        titulo="Quem faz o ReFood"
        descricao="Estudantes de Análise e Desenvolvimento de Sistemas da FIAP, turma 1TDSPO."
      />

      <section className="py-14">
        <Container>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {INTEGRANTES.map((pessoa) => (
              <li
                key={pessoa.rm}
                className="flex flex-col items-center rounded-md border border-borderc bg-white p-6 text-center shadow-soft-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-md"
              >
                <img
                  src={pessoa.foto}
                  alt={"Foto de " + pessoa.nome}
                  className="h-28 w-28 rounded-full border-4 border-brand-soft object-cover"
                />
                <h2 className="mt-4 text-base">{pessoa.nome}</h2>
                <p className="mt-1 text-sm">{pessoa.rm} · 1TDSPO</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">{pessoa.funcao}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={pessoa.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={"GitHub de " + pessoa.nome}
                    className="grid h-9 w-9 place-items-center rounded-full bg-bg text-ink transition-colors hover:bg-brand hover:text-white"
                  >
                    <Icon name="github" size={17} />
                  </a>
                  <a
                    href={pessoa.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={"LinkedIn de " + pessoa.nome}
                    className="grid h-9 w-9 place-items-center rounded-full bg-bg text-ink transition-colors hover:bg-brand hover:text-white"
                  >
                    <Icon name="linkedin" size={17} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

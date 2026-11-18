import Icon, { type NomeIcone } from "./Icon";

interface Passo {
  icone: NomeIcone;
  titulo: string;
  texto: string;
}

const PASSOS: Passo[] = [
  { icone: "card", titulo: "Reserve e pague", texto: "Pix ou cartão, aqui no site" },
  { icone: "store", titulo: "Vá ao balcão", texto: "Peça a retirada ReFood" },
  { icone: "qr", titulo: "Mostre o QR Code", texto: "O atendente confirma e entrega" },
];

export default function ComoRetirar() {
  return (
    <div className="rounded-2xl border border-borderc bg-white p-5 shadow-soft-sm md:p-6">
      <h3 className="text-base">Como retirar</h3>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {PASSOS.map((passo, i) => (
          <li key={passo.titulo} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
              <Icon name={passo.icone} size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">
                {i + 1}. {passo.titulo}
              </p>
              <p className="text-sm">{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}


export type NomeIcone =
  | "leaf"
  | "search"
  | "pin"
  | "clock"
  | "arrowRight"
  | "arrowLeft"
  | "check"
  | "x"
  | "alert"
  | "info"
  | "store"
  | "bag"
  | "qr"
  | "chart"
  | "user"
  | "mail"
  | "phone"
  | "trash"
  | "edit"
  | "plus"
  | "menu"
  | "refresh"
  | "github"
  | "linkedin"
  | "box"
  | "logout"
  | "tag"
  | "card"
  | "navegar"
  | "externo"
  | "copiar";

const CAMINHOS = {
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2",
  arrowRight: "M5 12h14 M12 5l7 7-7 7",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18 M6 6l12 12",
  alert: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v4 M12 16h.01",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01",
  store: "M3 9l1.5-5h15L21 9 M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0V9Z M5 13v8h14v-8 M10 21v-5h4v5",
  bag: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0",
  qr: "M3 3h7v7H3Z M14 3h7v7h-7Z M3 14h7v7H3Z M14 14h3v3h-3Z M20 14v.01 M14 20h.01 M17 17h4v4h-4",
  chart: "M3 3v18h18 M7 16v-5 M12 16V8 M17 16v-9",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  edit: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  plus: "M12 5v14 M5 12h14",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  refresh: "M21 12a9 9 0 1 1-2.6-6.4L21 8 M21 3v5h-5",
  github: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a11 11 0 0 0-6 0C7 2 6 2 6 2c-.3 1.1-.3 2.3 0 3.5a5.4 5.4 0 0 0-1 3.5c0 3.5 3 5.5 6 5.5-.4.5-.7 1-.8 1.7-.2.6-.2 1.2-.2 1.8v4 M9 18c-4.5 2-5-2-7-2",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z M2 9h4v12H2Z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  box: "M21 8 12 3 3 8v8l9 5 9-5Z M3 8l9 5 9-5 M12 13v8",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  tag: "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z M7 7h.01",
  card: "M2 5h20v14H2Z M2 10h20",
  navegar: "M3 11 22 2l-9 19-2-8Z",
  externo: "M15 3h6v6 M10 14 21 3 M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  copiar: "M9 9h11v11H9Z M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
};

interface IconProps {
  name: NomeIcone;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 20, className }: IconProps) {
  const trechos = CAMINHOS[name].split(" M");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {trechos.map((trecho, i) => (
        <path key={i} d={i === 0 ? trecho : "M" + trecho} />
      ))}
    </svg>
  );
}

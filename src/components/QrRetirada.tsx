import qrcode from "../assets/qrcode.svg";

interface QrRetiradaProps {
  codigo: string;
  tamanho?: number;
}

export default function QrRetirada({ codigo, tamanho = 168 }: QrRetiradaProps) {
  return (
    <img
      src={qrcode}
      alt={"QR Code de retirada do pedido " + codigo}
      width={tamanho}
      height={tamanho}
      className="rounded-sm bg-white"
    />
  );
}

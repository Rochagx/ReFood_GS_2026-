import { useEffect } from "react";

export default function useDocumentMeta(titulo: string) {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}

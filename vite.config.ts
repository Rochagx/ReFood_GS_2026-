import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// O proxy evita erro de CORS ao chamar a API Java durante o desenvolvimento.
// Tudo que começa com /api vai para a API publicada no Render.
const proxy: Record<string, ProxyOptions> = {
  "/api": {
    target: "https://refood-cdeg.onrender.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
    // O navegador envia o cabeçalho Origin em POST/PUT/PATCH/DELETE e o Spring
    // recusa com 403 quando a origem não está liberada no CORS. Como o proxy é
    // uma chamada servidor-a-servidor, removemos esse cabeçalho aqui.
    configure: (servidorProxy) => {
      servidorProxy.on("proxyReq", (proxyReq) => proxyReq.removeHeader("origin"));
    },
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
});

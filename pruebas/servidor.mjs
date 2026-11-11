import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as esperar } from "node:timers/promises";

const ip = "127.0.0.1";

async function puertoLibre() {
  const reserva = createServer().listen(0, ip);
  await once(reserva, "listening");
  const { port } = reserva.address();
  await new Promise((aceptar) => reserva.close(aceptar));
  return port;
}

export async function conPages(directorio, comprobar) {
  const port = await puertoLibre();
  const url = `http://${ip}:${port}`;
  const servidor = spawn(process.execPath, [
    resolve("node_modules/wrangler/wrangler-dist/cli.js"), "pages", "dev", resolve(directorio),
    "--ip", ip, "--port", String(port),
  ], {
    env: { ...process.env, CI: "1", WRANGLER_SEND_METRICS: "false" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  const fin = once(servidor, "exit");
  let salida = "";
  for (const stream of [servidor.stdout, servidor.stderr]) stream.on("data", (datos) => { salida += datos; });

  try {
    for (let intento = 0; intento < 120 && servidor.exitCode === null; intento += 1) {
      const respuesta = await fetch(url, { signal: AbortSignal.timeout(1000) }).catch(() => null);
      if (respuesta?.ok) {
        await respuesta.body.cancel();
        return await comprobar(url);
      }
      await esperar(250);
    }
    throw new Error(`Wrangler no respondió en ${url}\n${salida}`);
  } finally {
    servidor.kill();
    await fin;
  }
}

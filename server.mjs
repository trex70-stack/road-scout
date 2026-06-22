import { createServer } from "httpolyglot";
import { readFileSync, existsSync } from "node:fs";
import { parse } from "node:url";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.PORT ?? 3100);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const certPath = "certs/192.168.2.178+3.pem";
const keyPath = "certs/192.168.2.178+3-key.pem";

if (!existsSync(certPath) || !existsSync(keyPath)) {
  console.error(
    `\n[HTTPS] Zertifikat fehlt. Bitte einmalig ausfuehren:\n  mkdir -p certs && cd certs && mkcert 192.168.2.178 localhost 127.0.0.1 ::1\n`
  );
  process.exit(1);
}

const cert = readFileSync(certPath);
const key = readFileSync(keyPath);

app.prepare().then(() => {
  createServer({ cert, key }, (req, res) => {
    if (!req.socket.encrypted) {
      const host = req.headers.host || `192.168.2.178:${port}`;
      const target = `https://${host}${req.url}`;
      res.writeHead(308, { Location: target });
      res.end();
      return;
    }
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Request error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, () => {
    console.log(`\n  ▸ Ready on https://localhost:${port}`);
    console.log(`  ▸ Ready on https://192.168.2.178:${port}  (im lokalen Netz)`);
    console.log(`  ▸ HTTP wird automatisch auf HTTPS weitergeleitet\n`);
  });
});

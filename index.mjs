import Server from './bare/Server.mjs';
import { readFileSync } from 'fs';
import http from 'http';
import nodeStatic from 'node-static';
import os from 'os';

const bare = new Server('/bare/', '');
const serve = new nodeStatic.Server('public/');

const server = http.createServer();

server.on('request', (request, response) => {
  if (bare.route_request(request, response)) return true;
  serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
  if (bare.route_upgrade(req, socket, head)) return;
  socket.end();
});

server.listen(process.env.PORT || 80);

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${os.hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});
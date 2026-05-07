const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const host = process.env.HOST || '0.0.0.0';
const port = Number(getArgValue('--port') || process.env.PORT || 3000);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return '';
  return process.argv[index + 1] || '';
}

function send(response, status, body, headers = {}) {
  response.writeHead(status, headers);
  response.end(body);
}

function resolveRequestPath(url) {
  const parsedUrl = new URL(url, `http://${host}:${port}`);
  const decodedPath = decodeURIComponent(parsedUrl.pathname);
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    return '';
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || '/');

  if (!filePath) {
    send(response, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(response, 404, 'Not found');
      return;
    }

    const extension = path.extname(filePath);
    send(response, 200, data, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream'
    });
  });
});

server.listen(port, host, () => {
  const localUrl = `http://localhost:${port}/`;
  const loopbackUrl = `http://127.0.0.1:${port}/`;

  console.log('擬愛 NIAI Prompt Atelier is running.');
  console.log(`Local:   ${localUrl}`);
  console.log(`Loopback: ${loopbackUrl}`);
  console.log(`Network: http://${host}:${port}/`);
  console.log('If this is a hosted workspace, open/forward the printed port in the platform Preview or Ports panel.');
});

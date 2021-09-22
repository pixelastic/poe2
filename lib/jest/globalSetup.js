const path = require('path');
const http = require('http');
const { exists, read } = require('firost');
const serverPort = require('./serverPort.js');

const servePath = path.resolve('./fixtures/server');
/**
 * Starts a server when tests are started, accessible through ${serverUrl}
 * Note that changes to this files are only take into account when restarting
 * the tests, they won't update with jest --watch
 * @returns {any} Resolves when the server is started
 **/
module.exports = async function () {
  const onRequest = async function (request, response) {
    const requestedUrl = request.url;
    const filepath = path.join(servePath, requestedUrl);

    // If file does not exist, we return a 404
    if (!(await exists(filepath))) {
      response.writeHead(404);
      response.end();
      return;
    }

    // We return the file content
    const content = await read(filepath);
    response.end(content, 'utf-8');
  };
  const server = http.createServer(onRequest);

  // We wait until the server is ready to receive connections on the port, or
  // stop if it errors
  return await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(serverPort, () => {
      global.server = server;
      resolve();
    });
  });
};

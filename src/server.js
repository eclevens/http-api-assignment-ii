const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { respondJSON, respondHead, respondNotFound } = require('./responses');
const { users, addUser } = require('./users');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Paths to static files
const clientPath = path.resolve(__dirname, '../client/client.html');
const cssPath = path.resolve(__dirname, '../client/style.css');
const jsPath = path.resolve(__dirname, '../client/client.js');

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  switch (parsedUrl.pathname) {
    case '/':
    case '/client.html':
      // Serve HTML page
      fs.readFile(clientPath, (err, data) => {
        if (err) {
          respondJSON(request, response, 500, 'Internal Server Error');
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
      });
      break;

    case '/style.css':
      // Serve CSS
      fs.readFile(cssPath, (err, data) => {
        if (err) {
          respondJSON(request, response, 500, 'Internal Server Error');
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/css' });
        response.end(data);
      });
      break;

    case '/client.js':
      // Serve client JS
      fs.readFile(jsPath, (err, data) => {
        if (err) {
          respondJSON(request, response, 500, 'Internal Server Error');
          return;
        }
        response.writeHead(200, { 'Content-Type': 'application/javascript' });
        response.end(data);
      });
      break;

    case '/getUsers':
      if (request.method === 'HEAD') {
        respondHead(response, 200);
      } else if (request.method === 'GET') {
        respondJSON(request, response, 200, users);
      } else {
        respondJSON(request, response, 405, 'Method Not Allowed', 'methodNotAllowed');
      }
      break;

    case '/addUser':
      if (request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk;
        });
        request.on('end', () => {
          const params = new URLSearchParams(body);
          const name = params.get('name');
          const age = params.get('age');

          const result = addUser(name, age);

          if (result.status === 204) {
            respondHead(response, 204);
          } else {
            respondJSON(request, response, result.status, result.message, result.id);
          }
        });
      } else {
        respondJSON(request, response, 405, 'Method Not Allowed', 'methodNotAllowed');
      }
      break;

    case '/notReal':
      if (request.method === 'HEAD') {
        respondHead(response, 404);
      } else {
        respondNotFound(request, response);
      }
      break;

    default:
      respondNotFound(request, response);
      break;
  }
};

// Create server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
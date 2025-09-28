const respondJSON = (request, response, status, message, id = null) => {
  // JSON object
  const responseJSON = id ? { message, id } : { message };
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const respondHead = (response, status) => {
  // HEAD response has no body
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// 404 Accept header
const respondNotFound = (request, response) => {
  const acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : [];
  const wantsJSON = acceptedTypes.includes('application/json') || acceptedTypes.includes('*/*');

  if (wantsJSON) {
    respondJSON(request, response, 404, '404 Not Found', 'notFound');
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }
};

module.exports = { respondJSON, respondHead, respondNotFound };

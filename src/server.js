const query = require('querystring');
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
// const styleHandler = require('./cssResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  // CCheck for errors
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Get the chunks of data that come in
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Once the request has finished, make something human-readable
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // Callback
    handler(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url.split('?')[0]) {
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/addUser':
      parseBody(request, response, responseHandler.addUser);
      break;
    case '/getUsers':
      responseHandler.getUser(request, response);
      break;
    case '/':
      htmlHandler.getHome(request, response);
      break;
    case '/favicon.ico':
      break;
    default:
      responseHandler.getNotFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});

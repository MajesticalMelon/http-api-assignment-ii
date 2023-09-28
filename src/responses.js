const users = {};

const getUser = (request, response) => {
  const { method } = request;

  response.writeHead(200, { 'Content-type': 'application/json' });
  if (method.toLowerCase() === 'get') {
    response.write(JSON.stringify(users));
  }
  response.end();
};

const getNotFound = (request, response) => {
  response.writeHead(404, { 'Content-type': 'application/json' });
  response.write(JSON.stringify({ id: 'notFound', message: 'The page you are looking for was not found' }));
  response.end();
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    response.writeHead(400, { 'Content-type': 'application/json' });
    response.write(JSON.stringify(responseJSON));
    response.end();
    return;
  }

  let responseCode = 204;

  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    response.writeHead(responseCode, { 'Content-type': 'application/json' });
    response.write(JSON.stringify(responseJSON));
    response.end();
    return;
  }

  response.writeHead(responseCode, { 'Content-type': 'application/json' });
  response.end();
};

module.exports = { getUser, getNotFound, addUser };

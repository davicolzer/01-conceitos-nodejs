const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {  // Feito
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user){
    return response.status(404).json({"error":"User not found"})
  }

  request.user = user;

  return next();
}  // Concluido

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;  // Pegando informações enviadas pelo cliente

  const userAlreadExist = users.find(
    user => user.username == username
  );  // Verifica se o usuário existem dentro do array

  if (userAlreadExist){  // Envia mensagem de erro caso o usuário já exista
    return response.status(400).json({"error": "Username alread exist"})
  }

    const user = {  // Objeto com informações do novo usuário
    id: uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(user); // Inserindo informações no Array/Banco 
  return response.status(201).json(user);  // Enviando mensagem ao cliente que a conta foi criada com sucesso.
});  // Concluido

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user }  = request;

  return response.json(user.todos);
});  // Concluido

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;
  const { title, deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).send(todo);

});  // Concluido

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({"error":"Todo not found"})
  }

  todo.title = title;
  todo.deadline = new Date(deadline)

  return response.status(200).json(todo);
});  // Concluido

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({"error": "Todo not found"})
  }

  todo.done = true;

  return response.status(200).json(todo);

});  // Concluido

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex == -1){
    return response.status(404).json({"error":"Todo not found"})
  }

  user.todos.splice(todoIndex,1);

  return response.status(204).json()
});

module.exports = app;
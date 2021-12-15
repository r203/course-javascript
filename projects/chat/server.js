
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const server = new WebSocket.Server({port: 3000});

server.on('connection', onConnect);
const connections = new Map();


function onConnect(socket) {
  connections.set(socket, {});
  console.log('new user connect');
  
  socket.on('message', function(stringMessage) {
    const message = JSON.parse(stringMessage);
    message.messageTime = new Date().toLocaleTimeString().slice(0,-3);

    if(message.type === 'hello') {
      connections.get(socket).userName = message.user;
      connections.get(socket).id = uuidv4();
      sendCountUsers(socket);
    }
     else if (message.type === 'changePhoto') {
      connections.get(socket).userPhoto = message.userPhoto;
    }
    sendMessageFrom(message, socket);
  });

  socket.on('close', function () {
    sendMessageFrom({type: 'close'}, socket)
    connections.delete(socket);
    sendCountUsers(socket);
    console.log('user is closed');
})
};

function sendMessageFrom(message, client) {
  const socketData = connections.get(client);
  message.name = socketData.userName;
  message.id = socketData.id;
  message.userPhoto = socketData.userPhoto;
  // console.log(message.userPhoto);

  for(const connection of connections.keys()) {
    message.IsOwnMessage = false;
    if (connection === client) {
      message.IsOwnMessage = true;
  }
    connection.send(JSON.stringify(message))
    // console.log(message.userPhoto);
  }
}

function sendCountUsers(client) {
  const countUser = {
    type: 'numberUser',
    count: connections.size,
    usersNameList: [],
  }

  for(const connection of connections.keys()) {
    let userNameList = {};
    userNameList.id = connections.get(connection).id;
    userNameList.userName = connections.get(connection).userName;
    userNameList.userPhoto = connections.get(connection).userPhoto;
    countUser.usersNameList.push(userNameList);
  }
  for(const connection of connections.keys()) {
    connection.send(JSON.stringify(countUser))
  }

  // console.log(countUser);
}

console.log('The server is running on port 3000');


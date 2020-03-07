var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.get('/', (req, res) => {
	res.status(200).send('hola mundo');
})

//Establecemos el puerto a utilizar
var port = process.env.PORT || 3000;

//Escuchamos por el puerto establecido
server.listen(port, function(){
    console.log('Servidor Escuchando en http://localhost:' + port);
});

/*
    El socket escuchara los mensajes de conexión entrantes a través de io.on('connection', callback(objeto socket de conexión))
*/

io.on('connection', (socket) => {
    // El socket escucha un mensaje de disconnect con socket.on('mensaje', (data del mensaje)) entonces emitimos un mensaje a los usuarios con socket.emit('mensaje', data)
    console.log('un cliente se ha conectado')
    socket.on('disconnect', () => {
        console.log('un cliente se ha desconectado');
        io.emit('users-changed', {user: socket.username, event: 'left'});
    });

    //Enviamos el nombre si un usuario establece su nombre
    socket.on('set-name', (name) => {
        console.log('el cliente ha establecido su nombre en: ' + name);
        socket.username = name;
        io.emit('user-changed', {user: name, event: 'joined'});
    });

    // Cuando se enviá un mensaje se emite un objeto a todos los usuarios conectados
    socket.on('send-message', (message) => {
        console.log('enviando mensaje a los usuarios conectados');
        io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});
    });
});
'use strict'

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinNotifications', (params, cb) => {
            socket.join(params.sender)
            cb()
        })

        socket.on('sendNotifications', (request) => {
            io.to(request.reciever).emit('recieveNotifications', request)
        })
        socket.on('message', (data) => {
            socket.broadcast.to(data.room).emit('message', data);
        });
        socket.on('login', (room, cb) => {
            socket.join(room);
            console.log("Joined Room: " + room)
        });
    })
}
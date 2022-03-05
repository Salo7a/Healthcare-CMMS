$(function () {
    socket = io();
    socket.emit('login', pos);

    socket.on('info', function (data) {
        toastr.info(data.text);
    });

    socket.on('alert', function (data) {
        toastr.error(data.text);
    });

});

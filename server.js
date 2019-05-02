let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let server = app.listen(3001);
let sio = require('socket.io').listen(server);
let db = require('./db.js');
// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


sio.on('connect', (socket)=> {
    socket.on("dataRequest", function () {
        console.log("successful request recieved");
        db.getTable(function (data) {
            if(data){
                socket.emit("dataResponse", data);
            }
        })
    })


});

module.exports = app;
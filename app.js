// var http = require('http');
var fs = require('fs');
const express = require('express')
const app = express()
// var index = fs.readFileSync( 'index.html');

var SerialPort = require('serialport');
var serverPort = 3000
var resultData = []
// const parsers = SerialPort.parsers;

// const parser = new parsers.Readline({
//     delimiter: '\r\n'
// });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods','*')
    res.header('Access-Control-Allow-Headers','*')
    next()
  })

var port = new SerialPort('COM4',{ 
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

app.get('/', (req, res) => {
    res.send(resultData)
})

app.get('/config', (req, res) => {
    res.send('config')
})
  
app.listen(serverPort, () => {
    console.log(`Example app listening at http://localhost:${serverPort}`)
})

// var app = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(index);
// });

// var io = require('socket.io').listen(app);

// io.on('connection', function(socket) {

//     console.log('Node is listening to port');

// });

port.on('open', function() {
    console.log('Open Port');
});
const ByteLength = SerialPort.parsers.ByteLength;

const parser = port.pipe(new ByteLength({length: 14}));
// port.pipe(parser);

parser.on('data', function(data) {
    var string = "" ; 
    // let arr = [0b101 , 0b01 , 0b10 , 0b11 , 0b100 , 0b101 , 0b110 , 0b111 , 0b1000 , 0b1001 , 0b1010 , 0b1011 , 0b1100 , 0b1101]
    let size = data.length
    // console.log("size of array : ",size); 
    let odd , even , evennew ,n = 1; 
    let  result = []; 
    for( i = 0 ; i<size/2 ; i++){
        even = data[i*2] ; odd = data[i+n] ; n++;
        // console.log(even , odd , '=',even|odd);
        evennew = even << 8;
        var  answer  = (((evennew | odd)*360)/16384).toFixed(2);
        result.push(answer);
    }
    // console.log(result);
    // for( j = 0 ; j<result = []result.length ; j++){console.log(result[j]); string += String(result[j]) +' ' ; }
    // console.log(string);
    // console.log('Received data from port: ', data);
    
    // io.emit('data', string);
    resultData = result
});

// app.listen(3000);
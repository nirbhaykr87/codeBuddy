// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const compiler = require('compilex');
const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const option = { stats: true };
compiler.init(option);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {

compiler.flush(function(){
    console.log("temporary executed file deleted")
})

  res.sendFile(__dirname + "/index.html");
});

app.post('/compile', function (req, res) {
  var code = req.body.code;
  var input = req.body.input;
  var lang = req.body.lang;

  try {
    if (lang == 'C++') {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

      if (!input) {
        compiler.compileCPP(envData, code, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: 'error' });
          }
        });
      } else {
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: 'error' });
          }
        });
      }
    } else if (lang == 'java') {
      // Similar logic for Java compilation...


      if(!input){
            
        var envData = { OS : "windows"}; 
        //else
        var envData = { OS : "linux" }; // (Support for Linux in Next version)
        compiler.compileJava( envData , code , function(data){
              if(data.output){
            res.send(data);
    
        }
        else{
            res.send({output:'error'})
        }
    
        });  
            }else
            {
                 
        var envData = { OS : "windows"}; 
       
        
        compiler.compileJavaWithInput( envData , code , input ,  function(data){
              if(data.output){
            res.send(data);
    
        }
        else{
            res.send({output:'error'})
        }
    
        });
            
    
            }
    
        


    } else if (lang == 'python') {
      // Similar logic for Python compilation...


      if(!input){
              
        var envData = { OS : "windows"}; 
        
         
        compiler.compilePython( envData , code , function(data){
              if(data.output){
            res.send(data);
    
        }
        else{
            res.send({output:'error'})
        }
    
        });    
            }
            else
            {
                   
        var envData = { OS : "windows"}; 
        
       
        compiler.compilePythonWithInput( envData , code , input ,  function(data){
              if(data.output){
            res.send(data);
    
        }
        else{
            res.send({output:'error'})
        }
            
        });
            }


    }
  } catch (e) {
    console.log(e);
  }
});

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('user_send_message', ({ roomId, username, message }) => {
    socket.to(roomId).emit('user_message',({message,username}))

})

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });





  

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

server.listen(5000, () => console.log('Server is listening on port 5000'));

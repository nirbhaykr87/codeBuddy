var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var compiler = require('compilex');
var option = { stats: true };
compiler.init(option);


var app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/compile', function (req, res) {
  var code = req.body.code;
  var input = req.body.input;
  var lang = req.body.lang;
try{
    
  
    if(lang=='C++'){
        if(!input){
          
    var envData = { OS : "windows" , cmd : "g++",options:{timeout:10000}}; 
  

    compiler.compileCPP(envData , code , function (data) {
          if(data.output){
        res.send(data);

    }
    else{
        res.send({output:'error'})
    }

       
    });
    
     }
     else{
         
    var envData = { OS : "windows" , cmd : "g++" ,options:{timeout:10000}}; 
   
    compiler.compileCPPWithInput(envData , code , input , function (data) {
          if(data.output){
        res.send(data);

    }
    else{
        res.send({output:'error'})
    }

    });
     }
    }
    else if(lang=='java'){
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

    }
    else if(lang=='python'){
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


}catch(e){
    console.log(e);
}
 

});

var port = 8000;

app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});

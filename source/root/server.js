var express = require("express"),
    server  = express(),
    port    = process.env.PORT || 1337;
    
server.use(express.logger("dev"));
server.use(express.static(__dirname));
server.use(express.compress());

// 404 Error Handling
server.use(function(req, res, next){
  res.status(404).sendfile(__dirname + '/404.html');
});

server.listen(port, function(){
  console.log("web server started on port " + port);
});

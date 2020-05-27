const http = require("http");

const server = http.createServer((_, res) => {
  console.log("request received");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(
    `<Html maaa='a'>
  	<head>
  		<style>
         #container { display: flex; background-color: rgb(255,255,255); width: 800px; height: 600px; }
         #container #myid { width: 500px; height: 200px; background-color: rgb(255,255,0) }
         #container .c1 { flex:1; background-color: rgb(255,0,255) }
  		</style>
  	</head>
  	<body>
  		<div id='container'>
        <div id="myid"></div>
        <div class='c1'></div>
  		</div>
  	</body>
  </Html>`
  );
});

server.listen(8088);

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
         #container { display: flex; background-color: rgb(255,255,255) }
         #container #myid { width: 500px; height: 200px; background-color: rgb(255,255,0) }
         #container .c1 { flex:1; background-color: rgb(255,0,255) }
  		</style>
  	</head>
  	<body>
  		<Div id='container'>
  			<div id="myid"/>
  			<div class='c1'/>
  		</Div>
  	</body>
  </Html>`
  );
});

server.listen(8088);

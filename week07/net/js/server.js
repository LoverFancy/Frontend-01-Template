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
         #container { display: flex; background-color: rgb(255,255,255); flex-wrap: wrap; width: 800px; height: 600px; }
         #container #myid { width: 500px; height: 300px; background-color: rgb(255,255,0); display: flex; }
         #id1 { flex: 1; height: 200px; background-color: rgb(255,123,0) }
         #id2 { flex: 1; height: 200px; background-color: rgb(255,0,0) }
         #container .c1 { flex:1; background-color: rgb(255,0,255) }
         #container .c2 { width: 400px; background-color: rgb(123,0,123) }
  		</style>
  	</head>
  	<body>
  		<div id='container'>
        <div id="myid">
          <div id='id1'>
          </div>
          <div id='id2'>
          </div>
        </div>
        <div class='c1'></div>
        <div class='c2'></div>
  		</div>
  	</body>
  </Html>`
  );
});

server.listen(8088);

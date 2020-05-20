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
  			body div #myid{
  				width:100px;
  				background-color: #ff5000;
  			}
  			body div img{
  				width:30px;
  				background-color: #ff1111;
				}
  			.abc {
  				width:60px;
  				background-color: #red;
  			}
  		</style>
  	</head>
  	<body>
  		<Div>
  			<img id="myid"/>
  			<img class='abc'/>
  			321
  		</Div>
  	</body>
  </Html>`
  );
});

server.listen(8088);

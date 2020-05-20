/**
 * @Author: qiancheng
 * @Date:   2020-05-16T18:46:51+08:00
 * @Last modified by:   qiancheng
 * @Last modified time: 2020-05-19T14:55:01+08:00
 */

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
  		</style>
  	</head>
  	<body>
  		<Div>
  			<img id="myid"/>
  			<img />
  			321
  		</Div>
  	</body>
  </Html>`
  );
});

server.listen(8088);

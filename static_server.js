// Designed by rjf

var os = require( 'os' ),
    http = require("http"),
    url = require("url"),
    qs = require("querystring"),
    path = require("path"),
    fs = require("fs"),
    ct = 0,
    wp = process.argv[2] || process.cwd(), // 指定目录 dir
    port = process.argv[3] || 8888, // 启动端口 port
    tp = process.argv[4] || 'ftp'; // 输出类型 type

var contentType = {
  ftp: 'application/octet-stream',
  html: {
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    def: 'application/octet-stream'
  }
};

http.createServer(function(request, response) {

  request.setEncoding('utf8');//请求编码  

  var uri = qs.unescape( url.parse(request.url).pathname ),
      filename = path.join(wp, uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    fs.stat(filename, function(err,stats) {
        if (err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;

        } else {
          if (stats.isDirectory()) {
            var files = fs.readdirSync(filename);
            if (files) {
              if ( uri.lastIndexOf('/') == uri.length -1 ) {
                uri = uri.substring(0, uri.length-1);
              }
              var dir = '/';
              if ( uri.lastIndexOf('/') > 0  ) {
                dir = uri.substring(0, uri.lastIndexOf('/'));
              }
              var all = '';
              if ( uri.length > 0) {
                all = '<a href="' + dir + '">../' + '</a></br>';
              }
              uri += '/';
              for (var i in files) {
                all += '<a href="' + uri + qs.escape(files[i]) + '">' + files[i] + '</a></br>';
              }
              all += '</br></br>power by nodejs downloads(' + ct + ')';
              response.writeHead(202, {"Content-Type": "text/html; charset=UTF-8"});
              response.write( all );
              response.end();
            }
          } else {
            ct++;
            var contType = contentType[tp] ? contentType[tp][filename.replace(/.*\.(\w+)/,'$1')] : false;
            var hd = {
              'Content-Type' : contType ? contType : contentType['ftp'],
              'Content-Length': stats.size
            };
            response.writeHead(200, hd);

            fs.createReadStream(filename).pipe(response);
          }

        }
    });

  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + " workspace (" + wp + ")/\nCTRL + C to shutdown");

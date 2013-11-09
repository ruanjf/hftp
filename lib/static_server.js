// Designed by rjf

var os = require( 'os' ),
    http = require("http"),
    url = require("url"),
    qs = require("querystring"),
    path = require("path"),
    fs = require("fs"),
    mime = require('mime'),
    ct = 0,
    port = parseInt(process.argv[2], 10) || 8888, // 启动端口 port
    tp = process.argv[3] || 'ftp', // 输出类型 type
    wp = process.argv[4] || process.cwd(); // 指定目录 dir

if ("-v" == process.argv[2] || "--version" == process.argv[2]) {
    console.log("v0.0.6");
    return;
}

// var contentType = {
//   ftp: 'application/octet-stream',
//   http: {
//     html: 'text/html',
//     xml: 'text/xml',
//     js: 'text/javascript',
//     css: 'text/css',
//     gif: 'image/gif',
//     jpg: 'image/jpg',
//     jpeg: 'image/jpeg',
//     svg: 'image/svg+xml',
//     png: 'image/png'
//   }
// };
// var contType = contentType[tp] ? contentType[tp] : false;

var hftp = function(request, response) {

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
              all += '</br></br>power by nodejs downloads(' + ct + '). project: <a href="https://npmjs.org/package/hftp" target="_blank">hftp</a> author: <a href="http://www.runjf.com" target="_blank">ruanjiefeng</a>';
              response.writeHead(202, {"Content-Type": "text/html; charset=UTF-8"});
              response.write( all );
              response.end();
            }
          } else {
            ct++;
            // var t = contType ? contType[filename.replace(/.*\.(\w+)/,'$1').toLowerCase()] : false;
            var hd = {
              'Content-Type' : tp==='http' ? mime.lookup(filename) : 'application/octet-stream',
              'Content-Length': stats.size
            };
            response.writeHead(200, hd);

            fs.createReadStream(filename).pipe(response);
          }

        }
    });

  });
};

var server = http.createServer(hftp);
server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Port has been used. 端口已被使用 :' + port);
    server.close();
  } else {
    throw e;
  }
});
server.listen(port);

console.log("Static file server running at\n  => http://localhost:" + port + " type=" + tp + ", workspace=" + wp + "/\nCTRL + C to shutdown");
